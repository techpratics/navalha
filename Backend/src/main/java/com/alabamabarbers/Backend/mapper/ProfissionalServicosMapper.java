package com.alabamabarbers.Backend.mapper;

import com.alabamabarbers.Backend.dto.ProfissionalServicosRequestDTO;
import com.alabamabarbers.Backend.dto.ProfissionalServicosResponseDTO;
import com.alabamabarbers.Backend.model.ProfissionalServicos;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProfissionalServicosMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "profissional", ignore = true)
    @Mapping(target = "servico", ignore = true)
    ProfissionalServicos toEntity(ProfissionalServicosRequestDTO dto);

    @Mapping(source = "servico.id", target = "servicoId")
    @Mapping(source = "servico.nome", target = "nomeServico")
    ProfissionalServicosResponseDTO toResponse(ProfissionalServicos profissionalServicos);
}
