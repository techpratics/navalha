package com.alabamabarbers.Backend.validator;

import com.alabamabarbers.Backend.exceptions.DuplicateRecordException;
import com.alabamabarbers.Backend.model.ProfissionalDisponibilidade;
import com.alabamabarbers.Backend.repository.ProfissionalDisponibilidadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ProfissionalDisponibilidadeValidator {

    private final ProfissionalDisponibilidadeRepository repository;

    public void validate(ProfissionalDisponibilidade disponibilidade) {
        if (existsDisponibilidade(disponibilidade)) {
            throw new DuplicateRecordException("Disponibilidade já cadastrada para esse dia");
        }
    }

    private boolean existsDisponibilidade(ProfissionalDisponibilidade disponibilidade) {
        Optional<ProfissionalDisponibilidade> found = repository
                .findByProfissionalIdAndDiaSemana(
                        disponibilidade.getProfissional().getId(),
                        disponibilidade.getDiaSemana()
                );

        if (disponibilidade.getId() == null) {
            return found.isPresent();
        }

        return found.isPresent() && !disponibilidade.getId().equals(found.get().getId());
    }
}
