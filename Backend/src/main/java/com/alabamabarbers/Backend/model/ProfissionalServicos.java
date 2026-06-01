package com.alabamabarbers.Backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name = "profissional_servicos")
@Data
public class ProfissionalServicos {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "profissional_id", nullable = false)
    private Profissional profissional;

    @ManyToOne
    @JoinColumn(name = "servico_id", nullable = false)
    private Servicos servico;

}
