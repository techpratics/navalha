package com.alabamabarbers.Backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "agendamentos")
@Data
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "profissional_id", nullable = false)
    private Profissional profissional;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "servico_id", nullable = false)
    private Servicos servicos;

    @Column(nullable = false)
    private LocalDate data;

    @Column(name = "horario_inicio", nullable = false)
    private LocalTime horarioInicio;

    @Column(name = "horario_fim", nullable = false)
    private LocalTime horarioFim;

    @Column(nullable = false)
    private String status;
}
