package com.alabamabarbers.Backend.service;

import com.alabamabarbers.Backend.model.Cliente;
import com.alabamabarbers.Backend.model.Role;
import com.alabamabarbers.Backend.model.Usuario;
import com.alabamabarbers.Backend.repository.ClienteRepository;
import com.alabamabarbers.Backend.repository.UserRepository;
import com.alabamabarbers.Backend.validator.ClienteValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository repository;
    private final ClienteValidator validator;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Cliente create(Cliente cliente) {
        validator.validate(cliente);

        String encryptedPassword = passwordEncoder.encode(cliente.getUsuario().getSenha());
        Usuario usuario = new Usuario(cliente.getUsuario().getLogin(), encryptedPassword, Role.CLIENTE);
        userRepository.save(usuario);

        cliente.setUsuario(usuario);

        return repository.save(cliente);
    }

    public List<Cliente> findAll() {
        return repository.findByStatusTrue();
    }

    public Cliente findById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
    }

    public List<Cliente> buscar(String q) {
        return repository.findByNomeContainingIgnoreCaseOrTelefoneContaining(q, q);
    }

    public Cliente update(UUID id, Cliente cliente) {
        Cliente existing = findById(id);
        existing.setNome(cliente.getNome());
        existing.setTelefone(cliente.getTelefone());
        return repository.save(existing);
    }

    public void inverterStatus(UUID id) {
        Cliente cliente = findById(id);
        cliente.setStatus(!cliente.isStatus());
        repository.save(cliente);
    }

    public Cliente findByUsuarioId(UUID id) {
        return repository.findByUsuarioId(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
    }
}
