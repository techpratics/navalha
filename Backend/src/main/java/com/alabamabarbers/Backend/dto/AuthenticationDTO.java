package com.alabamabarbers.Backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthenticationDTO(
        @NotBlank(message = "Campo obrigatório")
        @Email(message = "Email inválido")
        String login,
        @NotBlank(message = "Campo obrigatório")
        String senha
) {
}
