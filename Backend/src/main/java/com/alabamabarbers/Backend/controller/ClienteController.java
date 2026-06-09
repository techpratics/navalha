package com.alabamabarbers.Backend.controller;

import com.alabamabarbers.Backend.controller.common.GenericController;
import com.alabamabarbers.Backend.dto.ClienteRequestDTO;
import com.alabamabarbers.Backend.dto.ClienteResponseDTO;
import com.alabamabarbers.Backend.mapper.ClienteMapper;
import com.alabamabarbers.Backend.model.Cliente;
import com.alabamabarbers.Backend.model.Usuario;
import com.alabamabarbers.Backend.service.ClienteService;
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
@RequestMapping("clientes")
@RequiredArgsConstructor
public class ClienteController implements GenericController {

    private final ClienteService service;
    private final ClienteMapper mapper;

    @PostMapping
    public ResponseEntity<ClienteResponseDTO> create(@RequestBody @Valid ClienteRequestDTO dto) {
        Cliente cliente = mapper.toEntity(dto);
        Cliente saved = service.create(cliente);
        URI location = gerarHeaderLocation(saved.getId());
        return ResponseEntity.created(location).body(mapper.toResponse(saved));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('PROFISSIONAL', 'ADMIN')")
    public ResponseEntity<List<ClienteResponseDTO>> findAll() {
        return ResponseEntity.ok(service.findAll().stream().map(mapper::toResponse).toList());
    }

    @GetMapping("/buscar")
    @PreAuthorize("hasAnyRole('PROFISSIONAL', 'ADMIN')")
    public ResponseEntity<List<ClienteResponseDTO>> buscar(@RequestParam String q) {
        List<Cliente> clientes = service.buscar(q);
        return ResponseEntity.ok(clientes.stream().map(mapper::toResponse).toList());
    }

    @GetMapping("/meu-perfil")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<ClienteResponseDTO> findMe(@AuthenticationPrincipal Usuario usuarioLogado) {
        Cliente cliente = service.findByUsuarioId(usuarioLogado.getId());
        return ResponseEntity.ok(mapper.toResponse(cliente));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFISSIONAL')")
    public ResponseEntity<ClienteResponseDTO> findById(@PathVariable UUID id) {
        Cliente cliente = service.findById(id);
        return ResponseEntity.ok(mapper.toResponse(cliente));
    }

    @PutMapping("/meu-perfil")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<ClienteResponseDTO> updateSelf(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @RequestBody @Valid ClienteRequestDTO dto
    ) {
        Cliente cliente = service.findByUsuarioId(usuarioLogado.getId());
        Cliente updated = service.update(cliente.getId(), mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toResponse(updated));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFISSIONAL')")
    public ResponseEntity<ClienteResponseDTO> updateById(
            @PathVariable UUID id,
            @RequestBody @Valid ClienteRequestDTO dto
    ) {
        Cliente updated = service.update(id, mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toResponse(updated));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('PROFISSIONAL', 'ADMIN')")
    public ResponseEntity<Void> alternarStatus(@PathVariable UUID id) {
        service.inverterStatus(id);
        return ResponseEntity.noContent().build();
    }
}
