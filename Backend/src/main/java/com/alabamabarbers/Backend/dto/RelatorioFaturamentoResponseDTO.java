package com.alabamabarbers.Backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record RelatorioFaturamentoResponseDTO(
        LocalDate dataInicio,
        LocalDate dataFim,
        int totalAgendamentos,
        int agendamentosConcluidos,
        BigDecimal totalFaturado,
        List<FaturamentoPorProfissionalDTO> porProfissional,
        List<FaturamentoPorServicoDTO> porServico
) {}
