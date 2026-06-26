package com.alabamabarbers.Backend.controller;

import com.alabamabarbers.Backend.dto.ClienteFrequenteDTO;
import com.alabamabarbers.Backend.dto.DesempenhoProfissionalDTO;
import com.alabamabarbers.Backend.dto.FaturamentoPorServicoDTO;
import com.alabamabarbers.Backend.dto.RelatorioFaturamentoResponseDTO;
import com.alabamabarbers.Backend.service.RelatorioService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("relatorios")
@RequiredArgsConstructor
public class RelatorioController {

    private final RelatorioService relatorioService;

    @GetMapping("/faturamento")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RelatorioFaturamentoResponseDTO> faturamentoPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {

        return ResponseEntity.ok(relatorioService.gerarFaturamento(dataInicio, dataFim));
    }

    @GetMapping("/desempenho-profissionais")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DesempenhoProfissionalDTO>> desempenhoProfissionais(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {

        return ResponseEntity.ok(relatorioService.gerarDesempenhoProfissionais(dataInicio, dataFim));
    }

    @GetMapping("/clientes-frequentes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ClienteFrequenteDTO>> clientesFrequentes(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {

        return ResponseEntity.ok(relatorioService.gerarClientesFrequentes(dataInicio, dataFim));
    }

    @GetMapping("/servicos-mais-vendidos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FaturamentoPorServicoDTO>> servicosMaisVendidos(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {

        return ResponseEntity.ok(relatorioService.gerarServicosMaisVendidos(dataInicio, dataFim));
    }
}
