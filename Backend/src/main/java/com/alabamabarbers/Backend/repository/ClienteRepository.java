package com.alabamabarbers.Backend.repository;

import com.alabamabarbers.Backend.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClienteRepository extends JpaRepository<Cliente, UUID> {
    List<Cliente> findByStatusTrue();

    Optional<Cliente> findByCpf(String cpf);

    List<Cliente> findByNomeContainingIgnoreCaseOrTelefoneContaining(String nome, String telefone);
}
