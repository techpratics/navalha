package com.alabamabarbers.Backend.mapper;

import com.alabamabarbers.Backend.dto.EmpresaRequestDTO;
import com.alabamabarbers.Backend.dto.EmpresaResponseDTO;
import com.alabamabarbers.Backend.model.Empresa;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EmpresaMapper {

    Empresa toEntity(EmpresaRequestDTO dto);

    EmpresaResponseDTO toResponse(Empresa empresa);

}
