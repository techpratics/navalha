package com.alabamabarbers.Backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "empresa")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false)
    private String telefone;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "empresa_horarios", joinColumns = @JoinColumn(name = "empresa_id"))
    @MapKeyColumn(name = "dia_semana")
    @MapKeyEnumerated(EnumType.STRING)
    private Map<DayOfWeek, HorarioFuncionamento> horarios;

}
