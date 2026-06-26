package com.alabamabarbers.Backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ClienteFrequenteDTO(
        UUID clienteId,
        String nomeCliente,
        String telefone,
        int totalAtendimentos,
        BigDecimal totalGasto,
        LocalDate ultimoAtendimento
) {}
