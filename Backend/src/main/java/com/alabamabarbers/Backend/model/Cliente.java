package com.alabamabarbers.Backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name = "clientes")
@Data
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String telefone;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, unique = true)
    private String cpf;

    @Column(nullable = false)
    private boolean status = true;
}
