package com.alabamabarbers.Backend.service;

import com.alabamabarbers.Backend.model.Agendamento;
import com.alabamabarbers.Backend.model.Profissional;
import com.alabamabarbers.Backend.model.ProfissionalDisponibilidade;
import com.alabamabarbers.Backend.model.Servicos;
import com.alabamabarbers.Backend.repository.AgendamentoRepository;
import com.alabamabarbers.Backend.repository.ProfissionalDisponibilidadeRepository;
import com.alabamabarbers.Backend.repository.ProfissionalRepository;
import com.alabamabarbers.Backend.repository.ServicosRepository;
import com.alabamabarbers.Backend.validator.ProfissionalValidator;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfissionalService {

    private final ProfissionalRepository profissionalRepository;
    private final ProfissionalValidator profissionalValidator;
    private final ServicosRepository servicosRepository;
    private final ProfissionalDisponibilidadeRepository  disponibilidadeRepository;
    private final AgendamentoRepository  agendamentoRepository;

    public Profissional create(Profissional profissional) {
        profissionalValidator.validate(profissional);
        return profissionalRepository.save(profissional);
    }

    public Profissional findById(UUID id) {
        return profissionalRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(id.toString()));
    }

    public List<Profissional> findAll() {
        return profissionalRepository.findByAtivoTrue();
    }

    public List<LocalTime> getSlots(UUID id, LocalDate data, UUID servicoId) {

        Servicos servicos = servicosRepository.findById(servicoId)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        int duracao = servicos.getDuracaoMinutos();

        int diaSemana = data.getDayOfWeek().getValue();
        ProfissionalDisponibilidade disp = disponibilidadeRepository
                .findByProfissionalIdAndDiaSemana(id, diaSemana)
                .orElseThrow(() -> new RuntimeException("Profissional não atende nesse dia"));

        List<LocalTime> slots = new ArrayList<>();
        LocalTime slot = disp.getHoraInicio();
        while (!slot.plusMinutes(duracao).isAfter(disp.getHoraFim())) {
            slots.add(slot);
            slot = slot.plusMinutes(duracao);
        }

        List<Agendamento> agendamentos = agendamentoRepository
                .findByProfissionalIdAndDataAndStatusNot(id, data, "cancelado");

        return slots.stream()
                .filter(s -> agendamentos.stream().noneMatch(a ->
                        s.isBefore(a.getHorarioFim()) && s.plusMinutes(duracao).isAfter(a.getHorarioInicio())
                ))
                .toList();
    }

    @Transactional
    public Profissional update(UUID id, Profissional profissional) {
        Profissional profissionalToUpdate = findById(id);
        profissionalToUpdate.setNome(profissional.getNome());
        profissionalToUpdate.setCpf(profissional.getCpf());
        profissionalToUpdate.setEmail(profissional.getEmail());
        profissionalToUpdate.setTelefone(profissional.getTelefone());

        return profissionalRepository.save(profissionalToUpdate);
    }

    @Transactional
    public void inverterStatus(@PathVariable UUID id) {
        Profissional profissional = profissionalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Profissional não encontrado com o ID: " + id));

        profissional.setAtivo(!profissional.isAtivo());

        profissionalRepository.save(profissional);
    }
}
