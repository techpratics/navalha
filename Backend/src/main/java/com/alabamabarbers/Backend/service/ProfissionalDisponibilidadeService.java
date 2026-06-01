package com.alabamabarbers.Backend.service;

import com.alabamabarbers.Backend.model.Profissional;
import com.alabamabarbers.Backend.model.ProfissionalDisponibilidade;
import com.alabamabarbers.Backend.repository.ProfissionalDisponibilidadeRepository;
import com.alabamabarbers.Backend.repository.ProfissionalRepository;
import com.alabamabarbers.Backend.validator.ProfissionalDisponibilidadeValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfissionalDisponibilidadeService {

    private final ProfissionalDisponibilidadeRepository repository;
    private final ProfissionalRepository  profissionalRepository;
    private final ProfissionalDisponibilidadeValidator validator;

    public ProfissionalDisponibilidade create(UUID id, ProfissionalDisponibilidade profissionalDisponibilidade) {
        Profissional profissional = profissionalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));
        profissionalDisponibilidade.setProfissional(profissional);
        validator.validate(profissionalDisponibilidade);
        return repository.save(profissionalDisponibilidade);
    }

    public List<ProfissionalDisponibilidade> findByProfissional(UUID id) {
        return repository.findByProfissionalId(id);
    }

    @Transactional
    public ProfissionalDisponibilidade update(UUID dispId, ProfissionalDisponibilidade profissionalDisponibilidade) {
        ProfissionalDisponibilidade existing = repository.findById(dispId)
                .orElseThrow(() -> new RuntimeException("Disponibilidade não encontrada"));
        existing.setDiaSemana(profissionalDisponibilidade.getDiaSemana());
        existing.setHoraInicio(profissionalDisponibilidade.getHoraInicio());
        existing.setHoraFim(profissionalDisponibilidade.getHoraFim());
        return repository.save(existing);
    }

    @Transactional
    public void delete(UUID dispId) {
        if (!repository.existsById(dispId)) {
            throw new RuntimeException("Disponibilidade não encontrada");
        }

        repository.deleteById(dispId);
    }

    public ProfissionalDisponibilidade copiar(UUID id, int diaOrigem, int diaDestino) {

        ProfissionalDisponibilidade origem = repository
                .findByProfissionalIdAndDiaSemana(id, diaOrigem)
                .orElseThrow(() -> new RuntimeException("Dia de origem não encontrado"));

        ProfissionalDisponibilidade destino = repository
                .findByProfissionalIdAndDiaSemana(id, diaDestino)
                .orElse(new ProfissionalDisponibilidade());

        destino.setProfissional(origem.getProfissional());
        destino.setDiaSemana(diaDestino);
        destino.setHoraInicio(origem.getHoraInicio());
        destino.setHoraFim(origem.getHoraFim());

        return repository.save(destino);
    }
}
