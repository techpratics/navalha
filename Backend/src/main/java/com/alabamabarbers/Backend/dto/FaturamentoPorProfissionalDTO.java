package com.alabamabarbers.Backend.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record FaturamentoPorProfissionalDTO(
        UUID profissionalId,
        String nomeProfissional,
        int totalAgendamentos,
        BigDecimal totalFaturado
) {}
