package com.alabamabarbers.Backend.service;

import com.alabamabarbers.Backend.model.Profissional;
import com.alabamabarbers.Backend.model.ProfissionalServicos;
import com.alabamabarbers.Backend.model.Servicos;
import com.alabamabarbers.Backend.repository.ProfissionalRepository;
import com.alabamabarbers.Backend.repository.ProfissionalServicosRepository;
import com.alabamabarbers.Backend.repository.ServicosRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfissionalServicosService {

    private final ProfissionalServicosRepository repository;
    private final ProfissionalRepository profissionalRepository;
    private final ServicosRepository servicosRepository;

    public ProfissionalServicos create(UUID id, UUID servicoId) {
        Profissional profissional = profissionalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));
        Servicos servicos = servicosRepository.findById(servicoId)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

        ProfissionalServicos entity = new ProfissionalServicos();
        entity.setProfissional(profissional);
        entity.setServico(servicos);
        return repository.save(entity);
    }

    public List<ProfissionalServicos> findByProfissional(UUID id) {
        return repository.findByProfissionalId(id);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
