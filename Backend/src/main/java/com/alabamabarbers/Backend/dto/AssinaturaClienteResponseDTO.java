package com.alabamabarbers.Backend.dto;

import java.time.LocalDate;
import java.util.UUID;

public record AssinaturaClienteResponseDTO(
        UUID assinaturaId,
        UUID clienteId,
        String nomeCliente,
        PlanoAssinaturaResponseDTO plano,
        LocalDate dataInicio,
        LocalDate dataFim,
        boolean ativa,
        int usosSemanaAtual,
        int limiteSemana,
        int usosRestantes
) {}
