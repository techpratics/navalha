package com.alabamabarbers.Backend.service;

import com.alabamabarbers.Backend.dto.ClienteFrequenteDTO;
import com.alabamabarbers.Backend.dto.DesempenhoProfissionalDTO;
import com.alabamabarbers.Backend.dto.FaturamentoPorProfissionalDTO;
import com.alabamabarbers.Backend.dto.FaturamentoPorServicoDTO;
import com.alabamabarbers.Backend.dto.RelatorioFaturamentoResponseDTO;
import com.alabamabarbers.Backend.model.Agendamento;
import com.alabamabarbers.Backend.model.StatusAgendamento;
import com.alabamabarbers.Backend.repository.AgendamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RelatorioService {

    private final AgendamentoRepository agendamentoRepository;

    public RelatorioFaturamentoResponseDTO gerarFaturamento(LocalDate dataInicio, LocalDate dataFim) {
        List<Agendamento> todos = agendamentoRepository.findByDataBetween(dataInicio, dataFim);
        List<Agendamento> concluidos = todos.stream()
                .filter(a -> a.getStatus() == StatusAgendamento.CONCLUIDO)
                .toList();

        BigDecimal totalFaturado = concluidos.stream()
                .map(a -> a.getServicos().getPreco())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<FaturamentoPorProfissionalDTO> porProfissional = concluidos.stream()
                .collect(Collectors.groupingBy(a -> a.getProfissional().getId()))
                .entrySet().stream()
                .map(entry -> {
                    List<Agendamento> ags = entry.getValue();
                    BigDecimal total = ags.stream()
                            .map(a -> a.getServicos().getPreco())
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return new FaturamentoPorProfissionalDTO(
                            entry.getKey(),
                            ags.get(0).getProfissional().getNome(),
                            ags.size(),
                            total
                    );
                })
                .sorted(Comparator.comparing(FaturamentoPorProfissionalDTO::totalFaturado).reversed())
                .toList();

        List<FaturamentoPorServicoDTO> porServico = concluidos.stream()
                .collect(Collectors.groupingBy(a -> a.getServicos().getId()))
                .entrySet().stream()
                .map(entry -> {
                    List<Agendamento> ags = entry.getValue();
                    BigDecimal total = ags.stream()
                            .map(a -> a.getServicos().getPreco())
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return new FaturamentoPorServicoDTO(
                            entry.getKey(),
                            ags.get(0).getServicos().getNome(),
                            ags.size(),
                            total
                    );
                })
                .sorted(Comparator.comparing(FaturamentoPorServicoDTO::totalFaturado).reversed())
                .toList();

        return new RelatorioFaturamentoResponseDTO(
                dataInicio,
                dataFim,
                todos.size(),
                concluidos.size(),
                totalFaturado,
                porProfissional,
                porServico
        );
    }

    public List<FaturamentoPorServicoDTO> gerarServicosMaisVendidos(LocalDate dataInicio, LocalDate dataFim) {
        List<Agendamento> concluidos = (dataInicio != null && dataFim != null)
                ? agendamentoRepository.findByDataBetweenAndStatus(dataInicio, dataFim, StatusAgendamento.CONCLUIDO)
                : agendamentoRepository.findAll().stream()
                        .filter(a -> a.getStatus() == StatusAgendamento.CONCLUIDO)
                        .toList();

        return concluidos.stream()
                .collect(Collectors.groupingBy(a -> a.getServicos().getId()))
                .entrySet().stream()
                .map(entry -> {
                    List<Agendamento> ags = entry.getValue();
                    BigDecimal total = ags.stream()
                            .map(a -> a.getServicos().getPreco())
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return new FaturamentoPorServicoDTO(
                            entry.getKey(),
                            ags.get(0).getServicos().getNome(),
                            ags.size(),
                            total
                    );
                })
                .sorted(Comparator.comparing(FaturamentoPorServicoDTO::totalAgendamentos).reversed())
                .toList();
    }

    public List<ClienteFrequenteDTO> gerarClientesFrequentes(LocalDate dataInicio, LocalDate dataFim) {
        List<Agendamento> agendamentos = (dataInicio != null && dataFim != null)
                ? agendamentoRepository.findByDataBetweenAndStatus(dataInicio, dataFim, StatusAgendamento.CONCLUIDO)
                : agendamentoRepository.findAll().stream()
                        .filter(a -> a.getStatus() == StatusAgendamento.CONCLUIDO)
                        .toList();

        return agendamentos.stream()
                .collect(Collectors.groupingBy(a -> a.getCliente().getId()))
                .entrySet().stream()
                .map(entry -> {
                    List<Agendamento> ags = entry.getValue();

                    BigDecimal totalGasto = ags.stream()
                            .map(a -> a.getServicos().getPreco())
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    LocalDate ultimoAtendimento = ags.stream()
                            .map(Agendamento::getData)
                            .max(Comparator.naturalOrder())
                            .orElse(null);

                    return new ClienteFrequenteDTO(
                            entry.getKey(),
                            ags.get(0).getCliente().getNome(),
                            ags.get(0).getCliente().getTelefone(),
                            ags.size(),
                            totalGasto,
                            ultimoAtendimento
                    );
                })
                .sorted(Comparator.comparing(ClienteFrequenteDTO::totalAtendimentos).reversed())
                .toList();
    }

    public List<DesempenhoProfissionalDTO> gerarDesempenhoProfissionais(LocalDate dataInicio, LocalDate dataFim) {
        List<Agendamento> agendamentos = (dataInicio != null && dataFim != null)
                ? agendamentoRepository.findByDataBetween(dataInicio, dataFim)
                : agendamentoRepository.findAll();

        return agendamentos.stream()
                .collect(Collectors.groupingBy(a -> a.getProfissional().getId()))
                .entrySet().stream()
                .map(entry -> {
                    List<Agendamento> ags = entry.getValue();

                    int totalConcluidos = (int) ags.stream()
                            .filter(a -> a.getStatus() == StatusAgendamento.CONCLUIDO)
                            .count();
                    int totalCancelados = (int) ags.stream()
                            .filter(a -> a.getStatus() == StatusAgendamento.CANCELADO)
                            .count();

                    double taxaConclusao = ags.isEmpty() ? 0.0
                            : BigDecimal.valueOf((double) totalConcluidos / ags.size() * 100)
                                    .setScale(1, RoundingMode.HALF_UP)
                                    .doubleValue();

                    BigDecimal totalFaturado = ags.stream()
                            .filter(a -> a.getStatus() == StatusAgendamento.CONCLUIDO)
                            .map(a -> a.getServicos().getPreco())
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    String servicoMaisRealizado = ags.stream()
                            .filter(a -> a.getStatus() == StatusAgendamento.CONCLUIDO)
                            .collect(Collectors.groupingBy(a -> a.getServicos().getNome(), Collectors.counting()))
                            .entrySet().stream()
                            .max(Map.Entry.comparingByValue())
                            .map(Map.Entry::getKey)
                            .orElse(null);

                    return new DesempenhoProfissionalDTO(
                            entry.getKey(),
                            ags.get(0).getProfissional().getNome(),
                            ags.size(),
                            totalConcluidos,
                            totalCancelados,
                            taxaConclusao,
                            totalFaturado,
                            servicoMaisRealizado
                    );
                })
                .sorted(Comparator.comparing(DesempenhoProfissionalDTO::totalConcluidos).reversed())
                .toList();
    }
}
