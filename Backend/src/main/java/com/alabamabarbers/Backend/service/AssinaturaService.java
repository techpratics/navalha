package com.alabamabarbers.Backend.service;

import com.alabamabarbers.Backend.dto.AssinaturaClienteResponseDTO;
import com.alabamabarbers.Backend.dto.AtribuirAssinaturaRequestDTO;
import com.alabamabarbers.Backend.dto.PlanoAssinaturaRequestDTO;
import com.alabamabarbers.Backend.dto.PlanoAssinaturaResponseDTO;
import com.alabamabarbers.Backend.dto.PlanoDistribuicaoResponseDTO;
import com.alabamabarbers.Backend.exceptions.ResourceNotFoundException;
import com.alabamabarbers.Backend.model.AssinaturaCliente;
import com.alabamabarbers.Backend.model.Cliente;
import com.alabamabarbers.Backend.model.PlanoAssinatura;
import com.alabamabarbers.Backend.model.StatusAgendamento;
import com.alabamabarbers.Backend.repository.AgendamentoRepository;
import com.alabamabarbers.Backend.repository.AssinaturaClienteRepository;
import com.alabamabarbers.Backend.repository.ClienteRepository;
import com.alabamabarbers.Backend.repository.PlanoAssinaturaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssinaturaService {

    private final PlanoAssinaturaRepository planoRepository;
    private final AssinaturaClienteRepository assinaturaRepository;
    private final ClienteRepository clienteRepository;
    private final AgendamentoRepository agendamentoRepository;

    public PlanoAssinatura criarPlano(PlanoAssinaturaRequestDTO dto) {
        PlanoAssinatura plano = new PlanoAssinatura();
        plano.setNome(dto.nome());
        plano.setDescricao(dto.descricao());
        plano.setPrecoMensal(dto.precoMensal());
        plano.setUsosPorSemana(dto.usosPorSemana());
        return planoRepository.save(plano);
    }

    public List<PlanoAssinatura> listarPlanos() {
        return planoRepository.findAll();
    }

    public PlanoAssinatura buscarPlano(UUID id) {
        return planoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plano não encontrado"));
    }

    @Transactional
    public AssinaturaCliente atribuirPlano(UUID clienteId, AtribuirAssinaturaRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
        PlanoAssinatura plano = buscarPlano(dto.planoId());

        assinaturaRepository.findByClienteIdAndAtivaTrue(clienteId)
                .ifPresent(atual -> {
                    atual.setAtiva(false);
                    assinaturaRepository.save(atual);
                });

        AssinaturaCliente nova = new AssinaturaCliente();
        nova.setCliente(cliente);
        nova.setPlano(plano);
        nova.setDataInicio(dto.dataInicio());
        nova.setDataFim(dto.dataFim());
        return assinaturaRepository.save(nova);
    }

    public List<PlanoDistribuicaoResponseDTO> distribuicaoPorPlano() {
        return planoRepository.findAll().stream()
                .map(plano -> new PlanoDistribuicaoResponseDTO(
                        plano.getId(),
                        plano.getNome(),
                        plano.getPrecoMensal(),
                        plano.getUsosPorSemana(),
                        plano.isAtivo(),
                        assinaturaRepository.countByPlanoIdAndAtivaTrue(plano.getId())
                ))
                .toList();
    }

    public AssinaturaClienteResponseDTO consultarAssinatura(UUID clienteId) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        AssinaturaCliente assinatura = assinaturaRepository.findByClienteIdAndAtivaTrue(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não possui assinatura ativa"));

        LocalDate inicioDaSemana = LocalDate.now().with(DayOfWeek.MONDAY);
        LocalDate fimDaSemana = inicioDaSemana.plusDays(6);

        int usosSemana = agendamentoRepository.countByClienteIdAndDataBetweenAndStatusNot(
                clienteId, inicioDaSemana, fimDaSemana, StatusAgendamento.CANCELADO
        );

        int limite = assinatura.getPlano().getUsosPorSemana();
        int restantes = Math.max(0, limite - usosSemana);

        PlanoAssinatura plano = assinatura.getPlano();
        PlanoAssinaturaResponseDTO planoDTO = new PlanoAssinaturaResponseDTO(
                plano.getId(), plano.getNome(), plano.getDescricao(),
                plano.getPrecoMensal(), plano.getUsosPorSemana(), plano.isAtivo()
        );

        return new AssinaturaClienteResponseDTO(
                assinatura.getId(),
                cliente.getId(),
                cliente.getNome(),
                planoDTO,
                assinatura.getDataInicio(),
                assinatura.getDataFim(),
                assinatura.isAtiva(),
                usosSemana,
                limite,
                restantes
        );
    }
}
