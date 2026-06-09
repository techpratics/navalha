package com.alabamabarbers.Backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "profissional", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profissional {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "cpf", nullable = false)
    private String cpf;

    @Column(name = "data_nascimeto", nullable = false)
    private LocalDate dataNascimento;

    @Column(name = "telefone")
    private String telefone;

    @Column(name = "foto")
    private String foto;

    @Column(name = "status")
    private boolean ativo = true;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false, unique = true)
    private Usuario usuario;

    @OneToMany(mappedBy = "profissional", cascade = CascadeType.ALL)
    private List<ProfissionalDisponibilidade> disponibilidades;

    @OneToMany(mappedBy = "profissional", cascade = CascadeType.ALL)
    private List<ProfissionalServicos> servicos;

}
