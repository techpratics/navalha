package com.alabamabarbers.Backend.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Map;
import java.util.UUID;

public record EmpresaResponseDTO(
        UUID id,
        String nome,
        String endereco,
        String telefone,
        Map<DayOfWeek, HorarioResponseDTO> horarios
) {
    public record HorarioResponseDTO(
            LocalTime horaAbertura,
            LocalTime horaFechamento,
            boolean fechado
    ) {}
}
