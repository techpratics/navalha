package com.alabamabarbers.Backend.mapper;

import com.alabamabarbers.Backend.dto.ProfissionalRequestDTO;
import com.alabamabarbers.Backend.dto.ProfissionalResponseDTO;
import com.alabamabarbers.Backend.model.Profissional;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfissionalMapper {

    public abstract Profissional toEntity(ProfissionalRequestDTO dto);

    public abstract ProfissionalResponseDTO toResponse(Profissional profissional);

    public abstract ProfissionalRequestDTO toDto(Profissional profissional);

}
