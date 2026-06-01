package com.alabamabarbers.Backend.controller;

import com.alabamabarbers.Backend.controller.common.GenericController;
import com.alabamabarbers.Backend.dto.CopiarDisponibilidadeRequestDTO;
import com.alabamabarbers.Backend.dto.ProfissionalDisponibilidadeRequestDTO;
import com.alabamabarbers.Backend.dto.ProfissionalDisponibilidadeResponseDTO;
import com.alabamabarbers.Backend.mapper.ProfissionalDisponibilidadeMapper;
import com.alabamabarbers.Backend.model.ProfissionalDisponibilidade;
import com.alabamabarbers.Backend.service.ProfissionalDisponibilidadeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("profissionais/{id}/disponibilidade")
@RequiredArgsConstructor
public class ProfissionalDisponibilidadeController implements GenericController {

    private final ProfissionalDisponibilidadeService service;
    private final ProfissionalDisponibilidadeMapper mapper;

    @PostMapping
    public ResponseEntity<ProfissionalDisponibilidadeResponseDTO> create(
            @PathVariable UUID id,
            @RequestBody @Valid ProfissionalDisponibilidadeRequestDTO dto) {

        ProfissionalDisponibilidade profissionalDisponibilidade = mapper.toEntity(dto);
        ProfissionalDisponibilidade saved = service.create(id, profissionalDisponibilidade);
        ProfissionalDisponibilidadeResponseDTO savedProfissional = mapper.toResponse(saved);
        URI location = gerarHeaderLocation(saved.getId());

        return ResponseEntity.created(location).body(savedProfissional);
    }

    @PostMapping("/copiar")
    public ResponseEntity<ProfissionalDisponibilidadeResponseDTO> copiar(
            @PathVariable UUID id,
            @RequestBody @Valid CopiarDisponibilidadeRequestDTO dto) {

        ProfissionalDisponibilidade copiado = service.copiar(id, dto.diaOrigem(), dto.diaDestino());
        ProfissionalDisponibilidadeResponseDTO response = mapper.toResponse(copiado);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ProfissionalDisponibilidadeResponseDTO>> findByProfissional(@PathVariable UUID id) {
        List<ProfissionalDisponibilidade> disponibilidades = service.findByProfissional(id);
        List<ProfissionalDisponibilidadeResponseDTO> list = disponibilidades.stream().map(mapper::toResponse).toList();

        return ResponseEntity.ok(list);
    }

    @PutMapping("/{dispId}")
    public ResponseEntity<ProfissionalDisponibilidadeResponseDTO> update(@PathVariable UUID dispId, @RequestBody ProfissionalDisponibilidadeRequestDTO dto) {
        ProfissionalDisponibilidade disp = mapper.toEntity(dto);
        ProfissionalDisponibilidade updated = service.update(dispId, disp);
        return ResponseEntity.ok(mapper.toResponse(updated));
    }

    @DeleteMapping("/{dispId}")
    public ResponseEntity<Void> delete(@PathVariable UUID dispId) {
        service.delete(dispId);
        return ResponseEntity.noContent().build();
    }


}
