package com.alabamabarbers.Backend.dto;

import jakarta.validation.constraints.NotBlank;

public record AlterarStatusRequestDTO(@NotBlank String status) {}
