package com.alabamabarbers.Backend.controller;

import com.alabamabarbers.Backend.controller.common.GenericController;
import com.alabamabarbers.Backend.dto.ProfissionalRequestDTO;
import com.alabamabarbers.Backend.dto.ProfissionalResponseDTO;
import com.alabamabarbers.Backend.mapper.ProfissionalMapper;
import com.alabamabarbers.Backend.model.Profissional;
import com.alabamabarbers.Backend.service.ProfissionalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("profissionais")
@RequiredArgsConstructor
public class ProfissionalController implements GenericController {

    private final ProfissionalService profissionalService;
    private final ProfissionalMapper profissionalMapper;

    @PostMapping
    public ResponseEntity<ProfissionalResponseDTO> create(@RequestBody @Valid ProfissionalRequestDTO dto) {
        Profissional profissional = profissionalMapper.toEntity(dto);
        Profissional saved = profissionalService.create(profissional);
        ProfissionalResponseDTO savedUser = profissionalMapper.toResponse(saved);
        URI location = gerarHeaderLocation(saved.getId());

        return ResponseEntity.created(location).body(savedUser);
    }

}
