package com.alabamabarbers.Backend.repository;

import com.alabamabarbers.Backend.model.PlanoAssinatura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PlanoAssinaturaRepository extends JpaRepository<PlanoAssinatura, UUID> {
}
