package com.alabamabarbers.Backend.mapper;

import com.alabamabarbers.Backend.dto.ProfissionalDisponibilidadeRequestDTO;
import com.alabamabarbers.Backend.dto.ProfissionalDisponibilidadeResponseDTO;
import com.alabamabarbers.Backend.model.ProfissionalDisponibilidade;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProfissionalDisponibilidadeMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "profissional", ignore = true)
    ProfissionalDisponibilidade toEntity(ProfissionalDisponibilidadeRequestDTO dto);

    ProfissionalDisponibilidadeResponseDTO toResponse(ProfissionalDisponibilidade entity);
}
