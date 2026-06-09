package com.alabamabarbers.Backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

public record ProfissionalRequestDTO(
        @NotNull(message = "campo obrigatório")
        String nome,
        @NotBlank(message = "campo obrigatório")
        @CPF(message = "Cpf inválido")
        String cpf,
        @NotNull(message = "campo obrigatório")
        @Past(message = "A data de nascimento deve ser uma data passada")
        LocalDate dataNascimento,
        @NotBlank
        String telefone,
        @NotBlank(message = "campo obrigatório")
        @Email(message = "Email inválido")
        String email,
        String senha
    ) {}
