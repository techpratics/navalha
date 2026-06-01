package com.alabamabarbers.Backend.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ServicosResponseDTO(
        UUID id,
        String nome,
        BigDecimal preco,
        Integer duracaoMinutos,
        boolean ativo
    ) {}
