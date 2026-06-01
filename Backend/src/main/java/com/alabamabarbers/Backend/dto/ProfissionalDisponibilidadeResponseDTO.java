package com.alabamabarbers.Backend.dto;

import java.time.LocalTime;
import java.util.UUID;

public record ProfissionalDisponibilidadeResponseDTO(
        UUID id,
        int diaSemana,
        LocalTime horaInicio,
        LocalTime horaFim
) {}
