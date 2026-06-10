package com.alabamabarbers.Backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

public record ClienteRequestDTO(
        @NotBlank(message = "Campo obrigatório")
        String nome,
        @NotBlank(message = "Campo obrigatório")
        String telefone,
        @NotNull(message = "Campo obrigatório")
        LocalDate dataNascimento,
        @NotBlank(message = "Campo obrigatório")
        @CPF
        String cpf,
        @Email
        @NotBlank(message = "Campo obrigatório")
        String email,
        @NotBlank(message = "Campo obrigatório")
        String senha
) {}
