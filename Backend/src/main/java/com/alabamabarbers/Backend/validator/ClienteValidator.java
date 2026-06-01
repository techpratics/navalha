package com.alabamabarbers.Backend.validator;

import com.alabamabarbers.Backend.exceptions.DuplicateRecordException;
import com.alabamabarbers.Backend.model.Cliente;
import com.alabamabarbers.Backend.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ClienteValidator {

    private final ClienteRepository repository;

    public void validate(Cliente cliente){
        if(existsCliente(cliente)){
            throw new DuplicateRecordException("Cliente já cadastrado");
        }
    }

    private boolean existsCliente(Cliente cliente){
        Optional<Cliente> clienteFound = repository.findByCpf(cliente.getCpf());

        if(cliente.getId() == null){
            return clienteFound.isPresent();
        }

        return clienteFound.isPresent() && !cliente.getId().equals(clienteFound.get().getId());
    }

}
