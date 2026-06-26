package com.alabamabarbers.Backend.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record AtribuirAssinaturaRequestDTO(
        @NotNull UUID planoId,
        @NotNull LocalDate dataInicio,
        LocalDate dataFim
) {}
