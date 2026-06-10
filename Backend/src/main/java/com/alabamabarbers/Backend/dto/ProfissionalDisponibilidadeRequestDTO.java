package com.alabamabarbers.Backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;

public record ProfissionalDisponibilidadeRequestDTO(
        @NotNull(message = "Campo obrigatório")
        int diaSemana,
        @NotNull(message = "Campo obrigatório")
        LocalTime horaInicio,
        @NotNull(message = "Campo obrigatório")
        LocalTime horaFim
    ) {}
