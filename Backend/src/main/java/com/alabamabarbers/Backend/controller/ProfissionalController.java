package com.alabamabarbers.Backend.controller;

import com.alabamabarbers.Backend.controller.common.GenericController;
import com.alabamabarbers.Backend.dto.ProfissionalRequestDTO;
import com.alabamabarbers.Backend.dto.ProfissionalResponseDTO;
import com.alabamabarbers.Backend.dto.ProfissionalServicosRequestDTO;
import com.alabamabarbers.Backend.dto.ProfissionalServicosResponseDTO;
import com.alabamabarbers.Backend.mapper.ProfissionalMapper;
import com.alabamabarbers.Backend.mapper.ProfissionalServicosMapper;
import com.alabamabarbers.Backend.model.Profissional;
import com.alabamabarbers.Backend.model.ProfissionalServicos;
import com.alabamabarbers.Backend.model.Usuario;
import com.alabamabarbers.Backend.service.ProfissionalService;
import com.alabamabarbers.Backend.service.ProfissionalServicosService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("profissionais")
@RequiredArgsConstructor
public class ProfissionalController implements GenericController {

    private final ProfissionalService profissionalService;
    private final ProfissionalMapper profissionalMapper;
    private final ProfissionalServicosService profissionalServicosService;
    private final ProfissionalServicosMapper profissionalServicosMapper;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProfissionalResponseDTO> create(@RequestBody @Valid ProfissionalRequestDTO dto) {
        Profissional profissional = profissionalMapper.toEntity(dto);
        Profissional saved = profissionalService.create(profissional);
        ProfissionalResponseDTO savedProfissional = profissionalMapper.toResponse(saved);
        URI location = gerarHeaderLocation(saved.getId());

        return ResponseEntity.created(location).body(savedProfissional);
    }

    @PostMapping("/meus-servicos")
    @PreAuthorize("hasRole('PROFISSIONAL')")
    public ResponseEntity<ProfissionalServicosResponseDTO> addServicoSelf(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @RequestBody @Valid ProfissionalServicosRequestDTO dto) {
        Profissional profissional = profissionalService.findByUsuarioId(usuarioLogado.getId());
        ProfissionalServicos saved = profissionalServicosService.create(profissional.getId(), dto.servicoId());
        return ResponseEntity.ok(profissionalServicosMapper.toResponse(saved));
    }

    @PostMapping("/{id}/servicos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProfissionalServicosResponseDTO> addServicoById(
            @PathVariable UUID id,
            @RequestBody @Valid ProfissionalServicosRequestDTO dto) {
        ProfissionalServicos saved = profissionalServicosService.create(id, dto.servicoId());
        return ResponseEntity.ok(profissionalServicosMapper.toResponse(saved));
    }

    @GetMapping("/meus-servicos")
    @PreAuthorize("hasRole('PROFISSIONAL')")
    public ResponseEntity<List<ProfissionalServicosResponseDTO>> findAllServicosSelf(@AuthenticationPrincipal Usuario usuarioLogado) {
        Profissional profissional = profissionalService.findByUsuarioId(usuarioLogado.getId());
        List<ProfissionalServicos> servicos = profissionalServicosService.findByProfissional(profissional.getId());
        return ResponseEntity.ok(servicos.stream().map(profissionalServicosMapper::toResponse).toList());
    }

    @GetMapping("/{id}/servicos")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<List<ProfissionalServicosResponseDTO>> findAllServicosById(@PathVariable("id") UUID id) {
        List<ProfissionalServicos> servicos = profissionalServicosService.findByProfissional(id);
        return ResponseEntity.ok(servicos.stream().map(profissionalServicosMapper::toResponse).toList());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProfissionalResponseDTO>> findAll() {
        List<Profissional> profissionais = profissionalService.findAll();
        List<ProfissionalResponseDTO> list = profissionais.stream().map(profissionalMapper::toResponse).toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/meu-perfil")
    @PreAuthorize("hasRole('PROFISSIONAL')")
    public ResponseEntity<ProfissionalResponseDTO> findMe(@AuthenticationPrincipal Usuario usuarioLogado) {
        Profissional profissional = profissionalService.findByUsuarioId(usuarioLogado.getId());
        return ResponseEntity.ok(profissionalMapper.toResponse(profissional));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<ProfissionalResponseDTO> findById(@PathVariable("id") UUID id) {
        Profissional profissional = profissionalService.findById(id);
        return ResponseEntity.ok(profissionalMapper.toResponse(profissional));
    }

    @PutMapping("/meu-perfil")
    @PreAuthorize("hasRole('PROFISSIONAL')")
    public ResponseEntity<ProfissionalResponseDTO> updateSelf(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @RequestBody @Valid ProfissionalRequestDTO dto) {
        Profissional profissionalLogado = profissionalService.findByUsuarioId(usuarioLogado.getId());
        Profissional updated = profissionalService.update(profissionalLogado.getId(), profissionalMapper.toEntity(dto));
        return ResponseEntity.ok(profissionalMapper.toResponse(updated));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProfissionalResponseDTO> updateById(
            @PathVariable UUID id,
            @RequestBody @Valid ProfissionalRequestDTO dto) {
        Profissional profissional = profissionalMapper.toEntity(dto);
        Profissional updated = profissionalService.update(id, profissional);
        return ResponseEntity.ok(profissionalMapper.toResponse(updated));
    }

    @GetMapping("/{id}/slots")
    public ResponseEntity<List<LocalTime>> getSlots(
            @PathVariable UUID id,
            @RequestParam LocalDate data,
            @RequestParam UUID servicoId) {
        List<LocalTime> slots = profissionalService.getSlots(id, data, servicoId);
        return ResponseEntity.ok(slots);
    }

    @DeleteMapping("/{id}/servicos/{servicoId}")
    @PreAuthorize("hasAnyRole('PROFISSIONAL', 'ADMIN')")
    public ResponseEntity<Void> deleteServico(
            @PathVariable UUID id,
            @PathVariable UUID servicoId) {
        profissionalServicosService.delete(servicoId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> alternarStatus(@PathVariable UUID id) {
        profissionalService.inverterStatus(id);
        return ResponseEntity.noContent().build();
    }
}