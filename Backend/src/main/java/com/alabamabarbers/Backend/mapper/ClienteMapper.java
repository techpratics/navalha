package com.alabamabarbers.Backend.mapper;

import com.alabamabarbers.Backend.dto.ClienteRequestDTO;
import com.alabamabarbers.Backend.dto.ClienteResponseDTO;
import com.alabamabarbers.Backend.model.Cliente;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ClienteMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "usuario.login", source = "email")
    @Mapping(target = "usuario.senha", source = "senha")
    Cliente toEntity(ClienteRequestDTO dto);

    @Mapping(target = "email", source = "usuario.login")
    ClienteResponseDTO toResponse(Cliente entity);
}
