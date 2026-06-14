package com.alabamabarbers.Backend.repository;

import com.alabamabarbers.Backend.model.Agendamento;
import com.alabamabarbers.Backend.model.StatusAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface AgendamentoRepository extends JpaRepository<Agendamento, UUID> {

    List<Agendamento> findByProfissionalIdAndDataAndStatusNotIn(
            UUID profissionalId, LocalDate data, Collection<StatusAgendamento> status);

    List<Agendamento> findByClienteId(UUID clienteId);

    List<Agendamento> findByProfissionalId(UUID profissionalId);

    @Query("""
        SELECT COUNT(a) > 0 FROM Agendamento a
        WHERE a.profissional.id = :profissionalId
        AND a.data = :data
        AND a.status != 'cancelado'
        AND a.horarioInicio < :fim
        AND a.horarioFim > :inicio
    """)
    boolean existsConflito(
            @Param("profissionalId") UUID profissionalId,
            @Param("data") LocalDate data,
            @Param("inicio") LocalTime inicio,
            @Param("fim") LocalTime fim
    );
}
