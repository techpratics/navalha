package com.alabamabarbers.Backend.dto;

import jakarta.validation.constraints.NotBlank;

public record ClienteUpdateRequestDTO(
        @NotBlank(message = "Campo obrigatório")
        String nome,
        @NotBlank(message = "Campo obrigatório")
        String telefone
) {}
