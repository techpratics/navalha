package com.alabamabarbers.Backend.repository;

import com.alabamabarbers.Backend.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EmpresaRepository extends JpaRepository<Empresa, UUID> {
}
