package com.alabamabarbers.Backend.controller;

import com.alabamabarbers.Backend.controller.common.GenericController;
import com.alabamabarbers.Backend.dto.ClienteRequestDTO;
import com.alabamabarbers.Backend.dto.ClienteResponseDTO;
import com.alabamabarbers.Backend.mapper.ClienteMapper;
import com.alabamabarbers.Backend.model.Cliente;
import com.alabamabarbers.Backend.service.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<ClienteResponseDTO>> findAll() {
        return ResponseEntity.ok(service.findAll().stream().map(mapper::toResponse).toList());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ClienteResponseDTO>> buscar(@RequestParam String q) {
        List<Cliente> clientes = service.buscar(q);
        return ResponseEntity.ok(clientes.stream().map(mapper::toResponse).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(mapper.toResponse(service.findById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> update(@PathVariable UUID id,
                                                     @RequestBody @Valid ClienteRequestDTO dto) {
        Cliente updated = service.update(id, mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toResponse(updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> alternarStatus(@PathVariable UUID id) {
        service.inverterStatus(id);
        return ResponseEntity.noContent().build();
    }
}
