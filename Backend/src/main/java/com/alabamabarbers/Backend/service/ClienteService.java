package com.alabamabarbers.Backend.service;

import com.alabamabarbers.Backend.model.Cliente;
import com.alabamabarbers.Backend.repository.ClienteRepository;
import com.alabamabarbers.Backend.validator.ClienteValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository repository;
    private final ClienteValidator validator;

    public Cliente create(Cliente cliente) {
        validator.validate(cliente);
        return repository.save(cliente);
    }

    public List<Cliente> findAll() {
        return repository.findByStatusTrue();
    }

    public Cliente findById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
    }

    public Cliente update(UUID id, Cliente cliente) {
        Cliente existing = findById(id);
        existing.setNome(cliente.getNome());
        existing.setTelefone(cliente.getTelefone());
        existing.setEmail(cliente.getEmail());
        return repository.save(existing);
    }

    public void inverterStatus(UUID id) {
        Cliente cliente = findById(id);
        cliente.setStatus(!cliente.isStatus());
        repository.save(cliente);
    }
}
