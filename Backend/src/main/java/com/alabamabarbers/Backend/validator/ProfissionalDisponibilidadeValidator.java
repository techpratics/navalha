package com.alabamabarbers.Backend.validator;

import com.alabamabarbers.Backend.exceptions.DuplicateRecordException;
import com.alabamabarbers.Backend.model.ProfissionalDisponibilidade;
import com.alabamabarbers.Backend.repository.ProfissionalDisponibilidadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ProfissionalDisponibilidadeValidator {

    private final ProfissionalDisponibilidadeRepository repository;

    public void validate(ProfissionalDisponibilidade disponibilidade) {
        List<ProfissionalDisponibilidade> existing = repository.findByProfissionalIdAndDiaSemana(
                disponibilidade.getProfissional().getId(),
                disponibilidade.getDiaSemana()
        );

        for (ProfissionalDisponibilidade block : existing) {
            if (disponibilidade.getId() != null && disponibilidade.getId().equals(block.getId())) {
                continue;
            }
            boolean overlaps = block.getHoraInicio().isBefore(disponibilidade.getHoraFim())
                    && block.getHoraFim().isAfter(disponibilidade.getHoraInicio());
            if (overlaps) {
                throw new DuplicateRecordException("Bloco de horário conflita com outro já cadastrado para esse dia");
            }
        }
    }
}
