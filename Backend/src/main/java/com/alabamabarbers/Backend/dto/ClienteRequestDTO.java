package com.alabamabarbers.Backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

public record ClienteRequestDTO(
        @NotBlank
        String nome,
        @NotBlank
        String telefone,
        @NotNull
        LocalDate dataNascimento,
        @NotBlank
        @CPF
        String cpf,
        @NotBlank
        String email,
        @NotBlank
        String senha
) {}
