package com.alabamabarbers.Backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "plano_assinatura")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlanoAssinatura {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "preco_mensal", nullable = false)
    private BigDecimal precoMensal;

    @Column(name = "usos_por_semana", nullable = false)
    private int usosPorSemana;

    @Column(nullable = false)
    private boolean ativo = true;
}
