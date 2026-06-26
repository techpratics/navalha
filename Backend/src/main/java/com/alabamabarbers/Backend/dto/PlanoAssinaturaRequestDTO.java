package com.alabamabarbers.Backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PlanoAssinaturaRequestDTO(
        @NotBlank String nome,
        String descricao,
        @NotNull @DecimalMin("0.01") BigDecimal precoMensal,
        @NotNull @Min(1) Integer usosPorSemana
) {}
