package com.alabamabarbers.Backend.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record PlanoDistribuicaoResponseDTO(
        UUID id,
        String nome,
        BigDecimal precoMensal,
        int usosPorSemana,
        boolean ativo,
        long clientesAtivos
) {}
