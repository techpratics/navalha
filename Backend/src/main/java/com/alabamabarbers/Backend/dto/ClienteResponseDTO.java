package com.alabamabarbers.Backend.dto;

import java.util.UUID;

public record ClienteResponseDTO(
        UUID id,
        String nome,
        String telefone,
        String email,
        String cpf,
        boolean status
) {}
