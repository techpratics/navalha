package com.alabamabarbers.Backend.controller;

import com.alabamabarbers.Backend.controller.common.GenericController;
import com.alabamabarbers.Backend.dto.AgendamentoRequestDTO;
import com.alabamabarbers.Backend.dto.AgendamentoResponseDTO;
import com.alabamabarbers.Backend.dto.AlterarStatusRequestDTO;
import com.alabamabarbers.Backend.mapper.AgendamentoMapper;
import com.alabamabarbers.Backend.model.Agendamento;
import com.alabamabarbers.Backend.model.Usuario;
import com.alabamabarbers.Backend.service.AgendamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    @PostMapping("/meu-agendamento")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<AgendamentoResponseDTO> createSelf(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @RequestBody @Valid AgendamentoRequestDTO dto) {

        Agendamento saved = service.createParaClienteLogado(dto, usuarioLogado.getId());
        return ResponseEntity.created(gerarHeaderLocation(saved.getId())).body(mapper.toResponse(saved));
    }

    @PostMapping("/encaixe")
    @PreAuthorize("hasRole('PROFISSIONAL')")
    public ResponseEntity<AgendamentoResponseDTO> createEncaixe(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @RequestBody @Valid AgendamentoRequestDTO dto) {
        Agendamento saved = service.createEncaixeProfissionalLogado(dto, usuarioLogado.getId());
        return ResponseEntity.created(gerarHeaderLocation(saved.getId())).body(mapper.toResponse(saved));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AgendamentoResponseDTO> createAdmin(@RequestBody @Valid AgendamentoRequestDTO dto) {
        Agendamento saved = service.create(dto);
        return ResponseEntity.created(gerarHeaderLocation(saved.getId())).body(mapper.toResponse(saved));
    }

    @GetMapping("/meus-agendamentos")
    @PreAuthorize("hasAnyRole('CLIENTE', 'PROFISSIONAL')")
    public ResponseEntity<List<AgendamentoResponseDTO>> findMyAgendamentos(@AuthenticationPrincipal Usuario usuarioLogado) {
        List<Agendamento> agendamentos = service.findByUsuarioLogado(usuarioLogado);
        return ResponseEntity.ok(agendamentos.stream().map(mapper::toResponse).toList());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AgendamentoResponseDTO>> findAll() {
        return ResponseEntity.ok(service.findAll().stream().map(mapper::toResponse).toList());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AgendamentoResponseDTO> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(mapper.toResponse(service.findById(id)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFISSIONAL', 'CLIENTE')")
    public ResponseEntity<Void> alterarStatus(
            @PathVariable UUID id,
            @AuthenticationPrincipal Usuario usuarioLogado,
            @RequestBody @Valid AlterarStatusRequestDTO dto) {
        service.alterarStatusSeguro(id, dto.status(), usuarioLogado);
        return ResponseEntity.noContent().build();
    }
}