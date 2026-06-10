package com.alabamabarbers.Backend.service;

import com.alabamabarbers.Backend.model.Empresa;
import com.alabamabarbers.Backend.model.HorarioFuncionamento;
import com.alabamabarbers.Backend.repository.EmpresaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmpresaService {

    private final EmpresaRepository empresaRepository;

    public Empresa obterConfiguracoes() {
        return empresaRepository.findAll().stream().findFirst().orElse(new Empresa());
    }

    @Transactional
    public Empresa salvarConfiguracoes(Empresa empresa) {
        Empresa empresaExistente = empresaRepository.findAll().stream()
                .findFirst()
                .orElse(null);

        if (empresaExistente != null) {
            empresaExistente.setNome(empresa.getNome());
            empresaExistente.setEndereco(empresa.getEndereco());
            empresaExistente.setTelefone(empresa.getTelefone());
        } else {
            empresaExistente = empresa;
        }

        Map<DayOfWeek, HorarioFuncionamento> novosHorarios = new HashMap<>();

        empresa.getHorarios().forEach((dia, horario) -> {
            HorarioFuncionamento hf = new HorarioFuncionamento();
            hf.setHoraAbertura(horario.getHoraAbertura());
            hf.setHoraFechamento(horario.getHoraFechamento());
            hf.setFechado(horario.isFechado());
            novosHorarios.put(dia, hf);
        });

        empresa.setHorarios(novosHorarios);

        return empresaRepository.save(empresaExistente);
    }

}
