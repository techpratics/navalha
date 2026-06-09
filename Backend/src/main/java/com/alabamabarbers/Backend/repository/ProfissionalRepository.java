package com.alabamabarbers.Backend.repository;

import com.alabamabarbers.Backend.model.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProfissionalRepository extends JpaRepository<Profissional, UUID> {

    Optional<Profissional> findByCpf(String cpf);

    Optional<Profissional> findByUsuarioId(UUID id);

    List<Profissional> findByAtivoTrue();

}
