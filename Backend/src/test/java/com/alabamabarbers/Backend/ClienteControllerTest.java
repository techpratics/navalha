package com.alabamabarbers.Backend;



import com.alabamabarbers.Backend.dto.ClienteRequestDTO;
import com.alabamabarbers.Backend.repository.ClienteRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ClienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper =  new ObjectMapper();

    @Autowired
    private ClienteRepository clienteRepository;

    @AfterEach
    void cleanup() {
        clienteRepository.deleteAll();
    }

    @Test
    void deveCadastrarClienteComSucesso() throws Exception {
        LocalDate date = LocalDate.of(2005, 07, 11);

        ClienteRequestDTO dto = new ClienteRequestDTO(
                "João Silva",
                "85999999999",
                date,
                "529.982.247-25",
                "teste@gmail.com",
                "teste"
        );

        mockMvc.perform(post("/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("João Silva"))
                .andExpect(jsonPath("$.telefone").value("85999999999"))
                .andExpect(jsonPath("$.cpf").value("529.982.247-25"))
                .andExpect(jsonPath("$.id").isNotEmpty());
    }

    @Test
    void deveRetornar400QuandoCampoObrigatorioFaltando() throws Exception {
        LocalDate date = LocalDate.of(2005, 07, 12);
        ClienteRequestDTO dto = new ClienteRequestDTO(
                "",
                "85999999999",
                date,
                "529.982.247-25",
                "teste2@gmail.com",
                "teste"
        );

        mockMvc.perform(post("/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.nome").isNotEmpty());
    }
}
