package com.alabamabarbers.Backend.repository;

import com.alabamabarbers.Backend.model.Servicos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ServicosRepository extends JpaRepository<Servicos, UUID> {

    Optional<Servicos> findByNome(String nome);

    List<Servicos> findByAtivoTrue();

}
