package com.alabamabarbers.Backend.mapper;

import com.alabamabarbers.Backend.dto.ProfissionalRequestDTO;
import com.alabamabarbers.Backend.dto.ProfissionalResponseDTO;
import com.alabamabarbers.Backend.model.Profissional;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProfissionalMapper {

    @Mapping(target = "usuario.login", source = "email")
    @Mapping(target = "usuario.senha", source = "senha")
    Profissional toEntity(ProfissionalRequestDTO dto);

    @Mapping(target = "email", source = "usuario.login")
    ProfissionalResponseDTO toResponse(Profissional profissional);

}
