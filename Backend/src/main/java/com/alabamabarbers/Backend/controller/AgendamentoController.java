package com.alabamabarbers.Backend.controller;

import com.alabamabarbers.Backend.controller.common.GenericController;
import com.alabamabarbers.Backend.dto.AgendamentoRequestDTO;
import com.alabamabarbers.Backend.dto.AgendamentoResponseDTO;
import com.alabamabarbers.Backend.dto.AlterarStatusRequestDTO;
import com.alabamabarbers.Backend.mapper.AgendamentoMapper;
import com.alabamabarbers.Backend.model.Agendamento;
import com.alabamabarbers.Backend.service.AgendamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("agendamentos")
@RequiredArgsConstructor
public class AgendamentoController implements GenericController {

    private final AgendamentoService service;
    private final AgendamentoMapper mapper;

    @PostMapping
    public ResponseEntity<AgendamentoResponseDTO> create(
            @RequestBody @Valid AgendamentoRequestDTO dto) {
        Agendamento saved = service.create(dto);
        URI location = gerarHeaderLocation(saved.getId());
        return ResponseEntity.created(location).body(mapper.toResponse(saved));
    }

    @GetMapping
    public ResponseEntity<List<AgendamentoResponseDTO>> findAll() {
        return ResponseEntity.ok(service.findAll().stream().map(mapper::toResponse).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgendamentoResponseDTO> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(mapper.toResponse(service.findById(id)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> alterarStatus(
            @PathVariable UUID id,
            @RequestBody @Valid AlterarStatusRequestDTO dto) {
        service.alterarStatus(id, dto.status());
        return ResponseEntity.noContent().build();
    }
}