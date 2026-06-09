package com.alabamabarbers.Backend.service;

import com.alabamabarbers.Backend.dto.AgendamentoRequestDTO;
import com.alabamabarbers.Backend.exceptions.HorarioOcupadoException;
import com.alabamabarbers.Backend.mapper.AgendamentoMapper;
import com.alabamabarbers.Backend.model.*;
import com.alabamabarbers.Backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final ProfissionalRepository profissionalRepository;
    private final ClienteRepository clienteRepository;
    private final ServicosRepository servicosRepository;
    private final ProfissionalDisponibilidadeRepository disponibilidadeRepository;
    private final AgendamentoMapper mapper;
    private final ClienteService clienteService;
    private final ProfissionalService profissionalService;

    public Agendamento create(AgendamentoRequestDTO dto) {

        Profissional profissional = profissionalRepository.findById(dto.profissionalId())
                .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));
        Cliente cliente = clienteRepository.findById(dto.clienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        Servicos servico = servicosRepository.findById(dto.servicoId())
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

        LocalTime horarioFim = dto.horarioInicio().plusMinutes(servico.getDuracaoMinutos());

        int diaSemana = dto.data().getDayOfWeek().getValue();
        boolean dentroDisponibilidade = disponibilidadeRepository
                .existsByProfissionalIdAndDiaSemanaAndHoraInicioLessThanEqualAndHoraFimGreaterThanEqual(
                        dto.profissionalId(), diaSemana, dto.horarioInicio(), horarioFim
                );
        if (!dentroDisponibilidade) {
            throw new RuntimeException("Profissional não atende nesse horário");
        }

        boolean conflito = agendamentoRepository.existsConflito(
                dto.profissionalId(), dto.data(), dto.horarioInicio(), horarioFim
        );
        if (conflito) {
            throw new HorarioOcupadoException("Horário já ocupado");
        }

        Agendamento agendamento = mapper.toEntity(dto);
        agendamento.setProfissional(profissional);
        agendamento.setCliente(cliente);
        agendamento.setServicos(servico);
        agendamento.setHorarioFim(horarioFim);
        agendamento.setStatus("confirmado");

        return agendamentoRepository.save(agendamento);
    }

    @Transactional
    public Agendamento createParaClienteLogado(AgendamentoRequestDTO dto, UUID usuarioLogadoId) {
        Cliente cliente = clienteService.findByUsuarioId(usuarioLogadoId);

        AgendamentoRequestDTO dtoSeguro = new AgendamentoRequestDTO(
                dto.profissionalId(),
                cliente.getId(),
                dto.servicoId(),
                dto.data(),
                dto.horarioInicio()
        );

        return this.create(dtoSeguro);
    }

    @Transactional
    public Agendamento createEncaixeProfissionalLogado(AgendamentoRequestDTO dto, UUID usuarioLogadoId) {
        Profissional profissional = profissionalService.findByUsuarioId(usuarioLogadoId);

        AgendamentoRequestDTO dtoSeguro = new AgendamentoRequestDTO(
                profissional.getId(),
                dto.clienteId(),
                dto.servicoId(),
                dto.data(),
                dto.horarioInicio()
        );

        return this.create(dtoSeguro);
    }

    public List<Agendamento> findAll() {
        return agendamentoRepository.findAll();
    }

    public Agendamento findById(UUID id) {
        return agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));
    }

    public List<Agendamento> findByUsuarioLogado(Usuario usuarioLogado) {
        if (usuarioLogado.getRole() == Role.CLIENTE) {
            Cliente cliente = clienteService.findByUsuarioId(usuarioLogado.getId());
            return agendamentoRepository.findByClienteId(cliente.getId());
        }

        if (usuarioLogado.getRole() == Role.PROFISSIONAL) {
            Profissional profissional = profissionalService.findByUsuarioId(usuarioLogado.getId());
            return agendamentoRepository.findByProfissionalId(profissional.getId());
        }

        throw new org.springframework.security.access.AccessDeniedException("Usuário não tem permissão para ver essa agenda");
    }

    public void alterarStatus(UUID id, String novoStatus) {
        Agendamento agendamento = findById(id);
        agendamento.setStatus(novoStatus);
        agendamentoRepository.save(agendamento);
    }

    @Transactional
    public void alterarStatusSeguro(UUID id, String novoStatus, Usuario usuarioLogado) {
        Agendamento agendamento = findById(id);

        if (usuarioLogado.getRole() == Role.CLIENTE) {
            Cliente cliente = clienteService.findByUsuarioId(usuarioLogado.getId());
            if (!agendamento.getCliente().getId().equals(cliente.getId())) {
                throw new org.springframework.security.access.AccessDeniedException(
                        "Você não tem permissão para alterar este agendamento."
                );
            }
        }

        if (usuarioLogado.getRole() == Role.PROFISSIONAL) {
            Profissional profissional = profissionalService.findByUsuarioId(usuarioLogado.getId());
            if (!agendamento.getProfissional().getId().equals(profissional.getId())) {
                throw new org.springframework.security.access.AccessDeniedException(
                        "Este agendamento pertence a outro profissional."
                );
            }
        }

        this.alterarStatus(id, novoStatus);
    }
}
