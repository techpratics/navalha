package com.alabamabarbers.Backend.repository;

import com.alabamabarbers.Backend.model.ProfissionalServicos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProfissionalServicosRepository extends JpaRepository<ProfissionalServicos, UUID> {
    List<ProfissionalServicos> findByProfissionalId(UUID id);
}
