package com.alabamabarbers.Backend.dto;

import com.alabamabarbers.Backend.model.StatusAgendamento;
import jakarta.validation.constraints.NotNull;

public record AlterarStatusRequestDTO(@NotNull(message = "Campo obrigatório") StatusAgendamento status) {}
