package com.alabamabarbers.Backend.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record AgendamentoRequestDTO(
        @NotNull
        UUID profissionalId,
        @NotNull
        UUID clienteId,
        @NotNull
        UUID servicoId,
        @NotNull
        LocalDate data,
        @NotNull
        LocalTime horarioInicio
) {
}

