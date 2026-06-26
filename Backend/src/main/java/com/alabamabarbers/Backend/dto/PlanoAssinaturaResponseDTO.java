package com.alabamabarbers.Backend.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record PlanoAssinaturaResponseDTO(
        UUID id,
        String nome,
        String descricao,
        BigDecimal precoMensal,
        int usosPorSemana,
        boolean ativo
) {}
