package com.alabamabarbers.Backend.validator;

import com.alabamabarbers.Backend.exceptions.DuplicateRecordException;
import com.alabamabarbers.Backend.model.Profissional;
import com.alabamabarbers.Backend.repository.ProfissionalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ProfissionalValidator {

    private final ProfissionalRepository repository;

    public void validate(Profissional profissional){
        if(existsProfissional(profissional)){
            throw new DuplicateRecordException("Profissional já cadastrado");
        }
    }

    private boolean existsProfissional(Profissional profissional){
        Optional<Profissional> profissionalFound = repository.findByEmail(profissional.getEmail());

        if(profissional.getId() == null){
            return profissionalFound.isPresent();
        }

        return profissionalFound.isPresent() && !profissional.getId().equals(profissionalFound.get().getId());
    }

}
