package com.alabamabarbers.Backend.dto;

import java.time.LocalTime;

public record ProfissionalDisponibilidadeRequestDTO(
        int diaSemana,
        LocalTime horaInicio,
        LocalTime horaFim
    ) {}
