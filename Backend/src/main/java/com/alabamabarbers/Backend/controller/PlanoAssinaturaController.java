package com.alabamabarbers.Backend.controller;

import com.alabamabarbers.Backend.controller.common.GenericController;
import com.alabamabarbers.Backend.dto.PlanoAssinaturaRequestDTO;
import com.alabamabarbers.Backend.dto.PlanoAssinaturaResponseDTO;
import com.alabamabarbers.Backend.dto.PlanoDistribuicaoResponseDTO;
import com.alabamabarbers.Backend.model.PlanoAssinatura;
import com.alabamabarbers.Backend.service.AssinaturaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("planos")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class PlanoAssinaturaController implements GenericController {

    private final AssinaturaService service;

    @PostMapping
    public ResponseEntity<PlanoAssinaturaResponseDTO> criar(@RequestBody @Valid PlanoAssinaturaRequestDTO dto) {
        PlanoAssinatura plano = service.criarPlano(dto);
        return ResponseEntity.created(gerarHeaderLocation(plano.getId())).body(toResponse(plano));
    }

    @GetMapping
    public ResponseEntity<List<PlanoAssinaturaResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarPlanos().stream().map(this::toResponse).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanoAssinaturaResponseDTO> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(toResponse(service.buscarPlano(id)));
    }

    @GetMapping("/distribuicao")
    public ResponseEntity<List<PlanoDistribuicaoResponseDTO>> distribuicao() {
        return ResponseEntity.ok(service.distribuicaoPorPlano());
    }

    private PlanoAssinaturaResponseDTO toResponse(PlanoAssinatura p) {
        return new PlanoAssinaturaResponseDTO(
                p.getId(), p.getNome(), p.getDescricao(),
                p.getPrecoMensal(), p.getUsosPorSemana(), p.isAtivo()
        );
    }
}
