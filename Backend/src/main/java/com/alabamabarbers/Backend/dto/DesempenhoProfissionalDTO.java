package com.alabamabarbers.Backend.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record DesempenhoProfissionalDTO(
        UUID profissionalId,
        String nomeProfissional,
        int totalAgendamentos,
        int totalConcluidos,
        int totalCancelados,
        double taxaConclusao,
        BigDecimal totalFaturado,
        String servicoMaisRealizado
) {}
