package com.alabamabarbers.Backend.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ProfissionalServicosRequestDTO(
        @NotNull(message = "Campo obrigatório")
        UUID servicoId
    ) {}
