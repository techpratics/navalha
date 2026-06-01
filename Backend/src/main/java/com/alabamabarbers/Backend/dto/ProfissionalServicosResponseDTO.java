package com.alabamabarbers.Backend.dto;

import java.util.UUID;

public record ProfissionalServicosResponseDTO(
        UUID id,
        UUID servicoId,
        String nomeServico
    ) {}
