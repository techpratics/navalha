package com.alabamabarbers.Backend.dto;

import com.alabamabarbers.Backend.model.StatusAgendamento;

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
        StatusAgendamento status
) {}
