package com.alabamabarbers.Backend;

import com.alabamabarbers.Backend.model.*;
import com.alabamabarbers.Backend.repository.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
class ProfissionalSlotsTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProfissionalRepository profissionalRepository;

    @Autowired
    private ProfissionalDisponibilidadeRepository disponibilidadeRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ServicosRepository servicosRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    private UUID profissionalId;
    private UUID servicoId;

    @BeforeEach
    void setup() {
        Profissional profissional = new Profissional();
        profissional.setNome("Barbeiro Teste");
        profissional.setCpf("111.444.777-35");
        profissional.setDataNascimento(LocalDate.of(1990, 1, 1));
        profissional.setTelefone("85999999999");
        profissional.setAtivo(true);
        profissionalId = profissionalRepository.save(profissional).getId();

        ProfissionalDisponibilidade disp = new ProfissionalDisponibilidade();
        disp.setProfissional(profissional);
        disp.setDiaSemana(3); // quarta
        disp.setHoraInicio(LocalTime.of(8, 0));
        disp.setHoraFim(LocalTime.of(10, 0));
        disponibilidadeRepository.save(disp);

        Cliente cliente = new Cliente();
        cliente.setNome("Cliente Teste");
        cliente.setTelefone("85988888888");
        cliente.setCpf("529.982.247-25");
        cliente.setStatus(true);
        Cliente savedCliente = clienteRepository.save(cliente);

        Servicos servico = new Servicos();
        servico.setNome("Corte");
        servico.setPreco(new BigDecimal("35.00"));
        servico.setDuracaoMinutos(30);
        servico.setAtivo(true);
        servicoId = servicosRepository.save(servico).getId();

        Agendamento agendamento = new Agendamento();
        agendamento.setProfissional(profissional);
        agendamento.setCliente(savedCliente);
        agendamento.setServicos(servicosRepository.findById(servicoId).get());
        agendamento.setData(LocalDate.of(2026, 6, 10));
        agendamento.setHorarioInicio(LocalTime.of(8, 0));
        agendamento.setHorarioFim(LocalTime.of(8, 30));
        agendamento.setStatus("confirmado");
        agendamentoRepository.save(agendamento);
    }

    @AfterEach
    void cleanup() {
        agendamentoRepository.deleteAll();
        disponibilidadeRepository.deleteAll();
        servicosRepository.deleteAll();
        clienteRepository.deleteAll();
        profissionalRepository.deleteAll();
    }

    @Test
    void deveRetornarSomenteSlotsLivres() throws Exception {
        mockMvc.perform(get("/profissionais/{id}/slots", profissionalId)
                        .param("data", "2026-06-10")
                        .param("servicoId", servicoId.toString()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[?(@=='08:00:00')]").doesNotExist())
                .andExpect(jsonPath("$[?(@=='08:30:00')]").exists())
                .andExpect(jsonPath("$[?(@=='09:00:00')]").exists())
                .andExpect(jsonPath("$[?(@=='09:30:00')]").exists());
    }
}
