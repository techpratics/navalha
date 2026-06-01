package com.alabamabarbers.Backend.mapper;

import com.alabamabarbers.Backend.dto.AgendamentoRequestDTO;
import com.alabamabarbers.Backend.dto.AgendamentoResponseDTO;
import com.alabamabarbers.Backend.model.Agendamento;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AgendamentoMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "profissional", ignore = true)
    @Mapping(target = "cliente", ignore = true)
    @Mapping(target = "servicos", ignore = true)
    @Mapping(target = "horarioFim", ignore = true)
    @Mapping(target = "status", ignore = true)
    Agendamento toEntity(AgendamentoRequestDTO dto);

    @Mapping(source = "profissional.id", target = "profissionalId")
    @Mapping(source = "profissional.nome", target = "nomeProfissional")
    @Mapping(source = "cliente.id", target = "clienteId")
    @Mapping(source = "cliente.nome", target = "nomeCliente")
    @Mapping(source = "servicos.id", target = "servicoId")
    @Mapping(source = "servicos.nome", target = "nomeServico")
    AgendamentoResponseDTO toResponse(Agendamento agendamento);
}
