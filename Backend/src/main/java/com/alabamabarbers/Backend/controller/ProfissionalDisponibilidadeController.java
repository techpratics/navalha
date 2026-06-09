package com.alabamabarbers.Backend.controller;

import com.alabamabarbers.Backend.controller.common.GenericController;
import com.alabamabarbers.Backend.dto.CopiarDisponibilidadeRequestDTO;
import com.alabamabarbers.Backend.dto.ProfissionalDisponibilidadeRequestDTO;
import com.alabamabarbers.Backend.dto.ProfissionalDisponibilidadeResponseDTO;
import com.alabamabarbers.Backend.mapper.ProfissionalDisponibilidadeMapper;
import com.alabamabarbers.Backend.model.ProfissionalDisponibilidade;
import com.alabamabarbers.Backend.model.Usuario;
import com.alabamabarbers.Backend.service.ProfissionalDisponibilidadeService;
import com.alabamabarbers.Backend.service.ProfissionalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class ProfissionalDisponibilidadeController implements GenericController {

    private final ProfissionalDisponibilidadeService service;
    private final ProfissionalDisponibilidadeMapper mapper;
    private final ProfissionalService profissionalService;

    @PostMapping("profissionais/minha-disponibilidade")
    @PreAuthorize("hasRole('PROFISSIONAL')")
    public ResponseEntity<ProfissionalDisponibilidadeResponseDTO> createSelf(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @RequestBody @Valid ProfissionalDisponibilidadeRequestDTO dto) {
        UUID profissionalId = profissionalService.findByUsuarioId(usuarioLogado.getId()).getId();

        ProfissionalDisponibilidade profissionalDisponibilidade = mapper.toEntity(dto);
        ProfissionalDisponibilidade saved = service.create(profissionalId, profissionalDisponibilidade);
        return ResponseEntity.created(gerarHeaderLocation(saved.getId())).body(mapper.toResponse(saved));
    }

    @PostMapping("profissionais/minha-disponibilidade/copiar")
    @PreAuthorize("hasRole('PROFISSIONAL')")
    public ResponseEntity<ProfissionalDisponibilidadeResponseDTO> copiarSelf(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @RequestBody @Valid CopiarDisponibilidadeRequestDTO dto) {
        UUID profesionalId = profissionalService.findByUsuarioId(usuarioLogado.getId()).getId();

        ProfissionalDisponibilidade copiado = service.copiar(profesionalId, dto.diaOrigem(), dto.diaDestino());
        return ResponseEntity.ok(mapper.toResponse(copiado));
    }

    @GetMapping("profissionais/minha-disponibilidade")
    @PreAuthorize("hasRole('PROFISSIONAL')")
    public ResponseEntity<List<ProfissionalDisponibilidadeResponseDTO>> findByProfissionalSelf(
            @AuthenticationPrincipal Usuario usuarioLogado) {
        UUID profesionalId = profissionalService.findByUsuarioId(usuarioLogado.getId()).getId();

        List<ProfissionalDisponibilidade> disponibilidades = service.findByProfissional(profesionalId);
        return ResponseEntity.ok(disponibilidades.stream().map(mapper::toResponse).toList());
    }

    @PostMapping("profissionais/{id}/disponibilidade")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProfissionalDisponibilidadeResponseDTO> createById(
            @PathVariable UUID id,
            @RequestBody @Valid ProfissionalDisponibilidadeRequestDTO dto) {
        ProfissionalDisponibilidade profissionalDisponibilidade = mapper.toEntity(dto);
        ProfissionalDisponibilidade saved = service.create(id, profissionalDisponibilidade);
        return ResponseEntity.created(gerarHeaderLocation(saved.getId())).body(mapper.toResponse(saved));
    }

    @PostMapping("profissionais/{id}/disponibilidade/copiar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProfissionalDisponibilidadeResponseDTO> copiarById(
            @PathVariable UUID id,
            @RequestBody @Valid CopiarDisponibilidadeRequestDTO dto) {
        ProfissionalDisponibilidade copiado = service.copiar(id, dto.diaOrigem(), dto.diaDestino());
        return ResponseEntity.ok(mapper.toResponse(copiado));
    }

    @GetMapping("profissionais/{id}/disponibilidade")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<List<ProfissionalDisponibilidadeResponseDTO>> findByProfissionalId(@PathVariable UUID id) {
        List<ProfissionalDisponibilidade> disponibilidades = service.findByProfissional(id);
        return ResponseEntity.ok(disponibilidades.stream().map(mapper::toResponse).toList());
    }

    @PutMapping("profissionais/disponibilidade/{dispId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFISSIONAL')")
    public ResponseEntity<ProfissionalDisponibilidadeResponseDTO> update(@PathVariable UUID dispId, @RequestBody ProfissionalDisponibilidadeRequestDTO dto) {
        ProfissionalDisponibilidade disp = mapper.toEntity(dto);
        ProfissionalDisponibilidade updated = service.update(dispId, disp);
        return ResponseEntity.ok(mapper.toResponse(updated));
    }

    @DeleteMapping("profissionais/disponibilidade/{dispId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFISSIONAL')")
    public ResponseEntity<Void> delete(@PathVariable UUID dispId) {
        service.delete(dispId);
        return ResponseEntity.noContent().build();
    }
}