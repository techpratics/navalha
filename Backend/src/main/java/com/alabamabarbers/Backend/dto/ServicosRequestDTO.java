package com.alabamabarbers.Backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ServicosRequestDTO(
        @NotBlank(message = "Campo obrigatório")
        String nome,
        @NotNull(message = "Campo obrigatório")
        BigDecimal preco,
        @NotNull(message = "Campo obrigatório")
        int duracaoMinutos
        ) {}