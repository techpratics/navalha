package com.alabamabarbers.Backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Map;

public record EmpresaRequestDTO(
        @NotBlank(message = "Campo obrigatório")
        String nome,
        @NotBlank(message = "Campo obrigatório")
        String endereco,
        @NotBlank(message = "Campo obrigatório")
        String telefone,
        Map<DayOfWeek, HorarioDTO> horarios
) {
    public record HorarioDTO(
       LocalTime horaAbertura,
       LocalTime horaFechamento,
       boolean fechado
    ) {}
}
