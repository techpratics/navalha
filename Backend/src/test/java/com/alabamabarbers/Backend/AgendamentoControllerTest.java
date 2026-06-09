package com.alabamabarbers.Backend;

import com.alabamabarbers.Backend.dto.AgendamentoRequestDTO;
import com.alabamabarbers.Backend.model.Cliente;
import com.alabamabarbers.Backend.model.Profissional;
import com.alabamabarbers.Backend.model.ProfissionalDisponibilidade;
import com.alabamabarbers.Backend.model.Servicos;
import com.alabamabarbers.Backend.repository.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AgendamentoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper =  new ObjectMapper();

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
    private UUID clienteId;
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
        disp.setDiaSemana(3);
        disp.setHoraInicio(LocalTime.of(8, 0));
        disp.setHoraFim(LocalTime.of(12, 0));
        disponibilidadeRepository.save(disp);

        Cliente cliente = new Cliente();
        cliente.setNome("Cliente Teste");
        cliente.setTelefone("85988888888");
        cliente.setCpf("529.982.247-25");
        cliente.setStatus(true);
        clienteId = clienteRepository.save(cliente).getId();

        Servicos servico = new Servicos();
        servico.setNome("Corte");
        servico.setPreco(new BigDecimal("35.00"));
        servico.setDuracaoMinutos(30);
        servico.setAtivo(true);
        servicoId = servicosRepository.save(servico).getId();
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
    void deveRetornar409QuandoHorarioJaOcupado() throws Exception {
        AgendamentoRequestDTO dto = new AgendamentoRequestDTO(
                profissionalId,
                clienteId,
                servicoId,
                LocalDate.of(2026, 6, 10),
                LocalTime.of(9, 0)
        );

        mockMvc.perform(post("/agendamentos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/agendamentos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.erro").value("Horário já ocupado"));
    }
}
