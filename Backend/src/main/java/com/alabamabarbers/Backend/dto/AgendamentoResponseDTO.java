package com.alabamabarbers.Backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record AgendamentoResponseDTO(
        UUID id,
        UUID profissionalId,
        String nomeProfissional,
        UUID clienteId,
        String nomeCliente,
        UUID servicoId,
        String nomeServico,
        LocalDate data,
        LocalTime horarioInicio,
        LocalTime horarioFim,
        String status
) {}
