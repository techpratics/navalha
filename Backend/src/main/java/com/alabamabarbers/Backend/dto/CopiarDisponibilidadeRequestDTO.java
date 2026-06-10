package com.alabamabarbers.Backend.dto;

import jakarta.validation.constraints.NotNull;

public record CopiarDisponibilidadeRequestDTO(
        @NotNull(message = "Campo obrigatório")
        int diaOrigem,
        @NotNull(message = "Campo obrigatório")
        int diaDestino
    ) {}
