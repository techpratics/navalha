package com.alabamabarbers.Backend.dto;

import java.time.LocalDate;
import java.util.UUID;

public record ProfissionalResponseDTO(
        UUID id,
        String nome,
        String cpf,
        LocalDate dataNascimento,
        String telefone,
        boolean ativo
    ) {}
