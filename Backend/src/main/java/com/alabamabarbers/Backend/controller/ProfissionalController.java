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
import com.alabamabarbers.Backend.service.ProfissionalService;
import com.alabamabarbers.Backend.service.ProfissionalServicosService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<ProfissionalResponseDTO> create(@RequestBody @Valid ProfissionalRequestDTO dto) {
        Profissional profissional = profissionalMapper.toEntity(dto);
        Profissional saved = profissionalService.create(profissional);
        ProfissionalResponseDTO savedProfissional = profissionalMapper.toResponse(saved);
        URI location = gerarHeaderLocation(saved.getId());

        return ResponseEntity.created(location).body(savedProfissional);
    }

    @PostMapping("/{id}/servicos")
    public ResponseEntity<ProfissionalServicosResponseDTO> addServico(
            @PathVariable UUID id,
            @RequestBody @Valid ProfissionalServicosRequestDTO dto) {

        ProfissionalServicos saved = profissionalServicosService.create(id, dto.servicoId());
        ProfissionalServicosResponseDTO response = profissionalServicosMapper.toResponse(saved);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ProfissionalResponseDTO>> findAll(){
        List<Profissional> profissionais = profissionalService.findAll();
        List<ProfissionalResponseDTO> list = profissionais.stream().map(profissionalMapper::toResponse).toList();

        return ResponseEntity.ok(list);
    }

    @GetMapping("{id}")
    public ResponseEntity<ProfissionalResponseDTO> findById(@PathVariable("id") UUID id){
        Profissional profissional = profissionalService.findById(id);
        ProfissionalResponseDTO profissionalFound = profissionalMapper.toResponse(profissional);

        return ResponseEntity.ok(profissionalFound);
    }

    @GetMapping("/{id}/servicos")
    public ResponseEntity<List<ProfissionalServicosResponseDTO>> findAllServicos(@PathVariable("id") UUID id){
        List<ProfissionalServicos> servicos = profissionalServicosService.findByProfissional(id);
        List<ProfissionalServicosResponseDTO> list = servicos.stream().map(profissionalServicosMapper::toResponse).toList();

        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}/slots")
    public ResponseEntity<List<LocalTime>> getSlots(
            @PathVariable UUID id,
            @RequestParam LocalDate data,
            @RequestParam UUID servicoId) {

        List<LocalTime> slots = profissionalService.getSlots(id, data, servicoId);
        return ResponseEntity.ok(slots);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfissionalResponseDTO> update(
            @PathVariable UUID id,
            @RequestBody @Valid ProfissionalRequestDTO dto) {

        Profissional profissional = profissionalMapper.toEntity(dto);
        Profissional updated = profissionalService.update(id, profissional);
        return ResponseEntity.ok(profissionalMapper.toResponse(updated));
    }

    @DeleteMapping("/{id}/servicos/{servicoId}")
    public ResponseEntity<Void> deleteServico(
            @PathVariable UUID id,
            @PathVariable UUID servicoId) {

        profissionalServicosService.delete(servicoId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> alternarStatus(@PathVariable UUID id) {
        profissionalService.inverterStatus(id);
        return ResponseEntity.noContent().build();
    }

}
