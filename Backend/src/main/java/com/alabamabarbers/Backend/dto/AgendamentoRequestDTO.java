package com.alabamabarbers.Backend.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record AgendamentoRequestDTO(
        @NotNull(message = "Campo obrigatório")
        UUID profissionalId,
        @NotNull(message = "Campo obrigatório")
        UUID clienteId,
        @NotNull(message = "Campo obrigatório")
        UUID servicoId,
        @NotNull(message = "Campo obrigatório")
        LocalDate data,
        @NotNull(message = "Campo obrigatório")
        LocalTime horarioInicio
) {
}

