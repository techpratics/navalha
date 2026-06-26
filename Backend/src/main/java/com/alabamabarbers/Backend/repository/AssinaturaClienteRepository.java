package com.alabamabarbers.Backend.repository;

import com.alabamabarbers.Backend.model.AssinaturaCliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AssinaturaClienteRepository extends JpaRepository<AssinaturaCliente, UUID> {

    Optional<AssinaturaCliente> findByClienteIdAndAtivaTrue(UUID clienteId);

    long countByPlanoIdAndAtivaTrue(UUID planoId);
}
