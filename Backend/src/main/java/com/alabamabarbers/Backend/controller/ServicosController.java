package com.alabamabarbers.Backend.controller;


import com.alabamabarbers.Backend.controller.common.GenericController;
import com.alabamabarbers.Backend.dto.ServicosRequestDTO;
import com.alabamabarbers.Backend.dto.ServicosResponseDTO;
import com.alabamabarbers.Backend.mapper.ServicosMapper;
import com.alabamabarbers.Backend.model.Servicos;
import com.alabamabarbers.Backend.service.ServicosService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("servicos")
@RequiredArgsConstructor
public class ServicosController implements GenericController {

    private final ServicosService servicosService;
    private final ServicosMapper servicosMapper;

    @PostMapping
    public ResponseEntity<ServicosResponseDTO> create(@RequestBody @Valid ServicosRequestDTO dto) {
        Servicos servicos = servicosMapper.toEntity(dto);
        Servicos saved = servicosService.create(servicos);
        ServicosResponseDTO savedService = servicosMapper.toResponse(saved);
        URI location = gerarHeaderLocation(saved.getId());

        return ResponseEntity.created(location).body(savedService);
    }

    @GetMapping
    public ResponseEntity<List<ServicosResponseDTO>> findAll(){
        List<Servicos> profissionais = servicosService.findAll();
        List<ServicosResponseDTO> list = profissionais.stream().map(servicosMapper::toResponse).toList();

        return ResponseEntity.ok(list);
    }

    @GetMapping("{id}")
    public ResponseEntity<ServicosResponseDTO> findById(@PathVariable("id") UUID id){
        Servicos profissional = servicosService.findById(id);
        ServicosResponseDTO profissionalFound = servicosMapper.toResponse(profissional);

        return ResponseEntity.ok(profissionalFound);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServicosResponseDTO> update(
            @PathVariable UUID id,
            @RequestBody @Valid ServicosRequestDTO dto) {
        Servicos profissional = servicosMapper.toEntity(dto);
        Servicos updated = servicosService.update(id, profissional);
        ServicosResponseDTO updatedUser = servicosMapper.toResponse(updated);

        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> alternarStatus(@PathVariable UUID id) {
        servicosService.inverterStatus(id);
        return ResponseEntity.noContent().build();
    }

}
