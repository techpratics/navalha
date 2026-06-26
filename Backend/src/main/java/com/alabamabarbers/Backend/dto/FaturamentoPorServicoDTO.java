package com.alabamabarbers.Backend.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record FaturamentoPorServicoDTO(
        UUID servicoId,
        String nomeServico,
        int totalAgendamentos,
        BigDecimal totalFaturado
) {}
