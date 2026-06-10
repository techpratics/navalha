package com.alabamabarbers.Backend.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.time.LocalTime;

@Embeddable
@Data
public class HorarioFuncionamento {

    private LocalTime horaAbertura;
    private LocalTime horaFechamento;
    private boolean fechado;

}
