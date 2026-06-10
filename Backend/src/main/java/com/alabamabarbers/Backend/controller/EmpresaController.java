package com.alabamabarbers.Backend.controller;

import com.alabamabarbers.Backend.dto.EmpresaRequestDTO;
import com.alabamabarbers.Backend.dto.EmpresaResponseDTO;
import com.alabamabarbers.Backend.mapper.EmpresaMapper;
import com.alabamabarbers.Backend.model.Empresa;
import com.alabamabarbers.Backend.service.EmpresaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("empresa")
@RequiredArgsConstructor
public class EmpresaController {

    private final EmpresaService empresaService;
    private final EmpresaMapper empresaMapper;

    @GetMapping
    public ResponseEntity<EmpresaResponseDTO> obterConfiguracoes() {
        Empresa empresa = empresaService.obterConfiguracoes();
        return ResponseEntity.ok(empresaMapper.toResponse(empresa));
    }

    @PutMapping
    public ResponseEntity<EmpresaResponseDTO> salvarConfiguracoes(@RequestBody @Valid EmpresaRequestDTO dto) {
        Empresa empresa = empresaMapper.toEntity(dto);
        Empresa empresaSalva = empresaService.salvarConfiguracoes(empresa);
        return ResponseEntity.ok(empresaMapper.toResponse(empresaSalva));
    }

}
