package com.alabamabarbers.Backend.validator;

import com.alabamabarbers.Backend.exceptions.DuplicateRecordException;
import com.alabamabarbers.Backend.model.Servicos;
import com.alabamabarbers.Backend.repository.ServicosRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ServicosValidator {

    private final ServicosRepository repository;

    public void validate(Servicos servicos){
        if(existsServicos(servicos)){
            throw new DuplicateRecordException("Serviço já cadastrado");
        }
    }

    private boolean existsServicos(Servicos servicos){
        Optional<Servicos> servicosFound = repository.findByNome(servicos.getNome());

        if(servicos.getId() == null){
            return servicosFound.isPresent();
        }

        return servicosFound.isPresent() && !servicos.getId().equals(servicosFound.get().getId());
    }

}

