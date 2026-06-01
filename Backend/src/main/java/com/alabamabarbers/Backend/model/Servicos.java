package com.alabamabarbers.Backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "servicos", schema = "public")
@Data
public class Servicos {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "preco", nullable = false)
    private BigDecimal preco;

    @Column(name = "duracao_minutos", nullable = false)
    private int duracaoMinutos;

    @Column(name = "ativo")
    private boolean ativo = true;

    @OneToMany(mappedBy = "servico")
    private List<ProfissionalServicos> profissionais;

}
