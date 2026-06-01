package com.alabamabarbers.Backend.repository;

import com.alabamabarbers.Backend.model.ProfissionalDisponibilidade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProfissionalDisponibilidadeRepository extends JpaRepository<ProfissionalDisponibilidade, UUID> {

    List<ProfissionalDisponibilidade> findByProfissionalId(UUID id);

    Optional<ProfissionalDisponibilidade> findByProfissionalIdAndDiaSemana(UUID id, int diaSemana);

    boolean existsByProfissionalIdAndDiaSemanaAndHoraInicioLessThanEqualAndHoraFimGreaterThanEqual(UUID id, int diaSemana, LocalTime horaInicio, LocalTime horaFim);

}
