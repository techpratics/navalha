package com.alabamabarbers.Backend.service;

import com.alabamabarbers.Backend.dto.AgendamentoRequestDTO;
import com.alabamabarbers.Backend.exceptions.HorarioOcupadoException;
import com.alabamabarbers.Backend.mapper.AgendamentoMapper;
import com.alabamabarbers.Backend.model.Agendamento;
import com.alabamabarbers.Backend.model.Cliente;
import com.alabamabarbers.Backend.model.Profissional;
import com.alabamabarbers.Backend.model.Servicos;
import com.alabamabarbers.Backend.repository.*;
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

    public List<Agendamento> findAll() {
        return agendamentoRepository.findAll();
    }

    public Agendamento findById(UUID id) {
        return agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));
    }

    public void alterarStatus(UUID id, String novoStatus) {
        Agendamento agendamento = findById(id);
        agendamento.setStatus(novoStatus);
        agendamentoRepository.save(agendamento);
    }
}
