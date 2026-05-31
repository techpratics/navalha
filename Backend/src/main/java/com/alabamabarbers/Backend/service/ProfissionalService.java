package com.alabamabarbers.Backend.service;

import com.alabamabarbers.Backend.model.Profissional;
import com.alabamabarbers.Backend.repository.ProfissionalRepository;
import com.alabamabarbers.Backend.validator.ProfissionalValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfissionalService {

    private final ProfissionalRepository profissionalRepository;
    private final ProfissionalValidator profissionalValidator;

    public Profissional create(Profissional profissional) {
        profissionalValidator.validate(profissional);
        return profissionalRepository.save(profissional);
    }
}
