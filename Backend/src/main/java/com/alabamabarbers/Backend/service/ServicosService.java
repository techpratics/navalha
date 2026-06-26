package com.alabamabarbers.Backend.service;

import com.alabamabarbers.Backend.model.Servicos;
import com.alabamabarbers.Backend.repository.ServicosRepository;
import com.alabamabarbers.Backend.validator.ServicosValidator;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ServicosService {

    private final ServicosRepository servicosRepository;
    private final ServicosValidator servicosValidator;

    public Servicos create(Servicos servicos) {
        servicosValidator.validate(servicos);
        return servicosRepository.save(servicos);
    }

    public Servicos findById(UUID id) {
        return servicosRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(id.toString()));
    }

    public List<Servicos> findAll() {
        return servicosRepository.findByAtivoTrue();
    }

    public List<Servicos> findAllAdmin() {
        return servicosRepository.findAll();
    }

    @Transactional
    public Servicos update(UUID id, Servicos servicos) {
        Servicos servicosToUpdate = findById(id);
        servicosToUpdate.setNome(servicos.getNome());
        servicosToUpdate.setPreco(servicos.getPreco());
        servicosToUpdate.setDuracaoMinutos(servicos.getDuracaoMinutos());

        return servicosRepository.save(servicosToUpdate);
    }

    @Transactional
    public void inverterStatus(@PathVariable UUID id) {
        Servicos servicos = servicosRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Serviço não encontrado com o ID: " + id));

        servicos.setAtivo(!servicos.isAtivo());

        servicosRepository.save(servicos);
    }

}
