package com.alabamabarbers.Backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "profissional_disponibilidade", schema = "public")
@Data
public class ProfissionalDisponibilidade {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "profissional_id", nullable = false)
    private Profissional profissional;

    @Column(name = "dia_semana", nullable = false)
    private int diaSemana;

    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "hora_fim", nullable = false)
    private LocalTime horaFim;

}
