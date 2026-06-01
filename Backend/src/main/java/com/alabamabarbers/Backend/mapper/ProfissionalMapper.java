package com.alabamabarbers.Backend.mapper;

import com.alabamabarbers.Backend.dto.ProfissionalRequestDTO;
import com.alabamabarbers.Backend.dto.ProfissionalResponseDTO;
import com.alabamabarbers.Backend.model.Profissional;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfissionalMapper {

    Profissional toEntity(ProfissionalRequestDTO dto);

    ProfissionalResponseDTO toResponse(Profissional profissional);

}
