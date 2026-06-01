package com.alabamabarbers.Backend.mapper;

import com.alabamabarbers.Backend.dto.ServicosRequestDTO;
import com.alabamabarbers.Backend.dto.ServicosResponseDTO;
import com.alabamabarbers.Backend.model.Servicos;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ServicosMapper {

    Servicos toEntity(ServicosRequestDTO dto);

    ServicosResponseDTO toResponse(Servicos servicos);

}
