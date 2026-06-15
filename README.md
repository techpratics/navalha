# 💈 Navalha - Sistema de Gerenciamento para Barbearias

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange?style=for-the-badge" alt="Status do Projeto"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white"/>
</p>

---

## 🔗 Links Úteis

- [Board do Projeto (ClickUp)](https://app.clickup.com/90171245411/v/s/90175723797)
- [Documentação de Requisitos (Google Docs)](https://docs.google.com/document/d/14TAXifBhv1Tt1Tm4cGVbhKHskTcMTCM3/edit?usp=drive_link&ouid=109597382508282434795&rtpof=true&sd=true)
- [Pasta do Projeto (Google Drive)](https://drive.google.com/drive/folders/1pwW3LjfzHrEeARXwzhax_helfkJhnfj_?usp=sharing)

---

## 👥 Equipe de Desenvolvimento

| Nome | Função Principal | GitHub |
| :--- | :--- | :--- |
| **Arthur Lelis** | Desenvolvedor | [@Arthur32p](https://github.com/Arthur32p) |
| **Júlio Emanuel** | Desenvolvedor | [@DevJulioEmanuel](https://github.com/DevJulioEmanuel) |
| **Mateus Valentim** | Desenvolvedor | [@mattsu014](https://github.com/mattsu014) |
| **Victor Farias** | Desenvolvedor | [@vistomia](https://github.com/vistomia) |
| **Rodrigo Rodrigues (fora da disciplina)** | Desenvolvedor | [@rudriguu2099](https://github.com/rudriguu2099) |

O **Navalha** é um sistema web robusto desenvolvido para o gerenciamento inteligente de barbearias e salões. Com foco na autonomia do cliente e na organização do profissional, a plataforma elimina processos manuais e centraliza toda a rotina de agendamentos em um ecossistema digital.

---

## 📌 O Problema e a Solução

Muitos profissionais da área de estética ainda dependem de anotações em papel ou trocas intermináveis de mensagens no WhatsApp para agendar clientes. Isso gera:
- Conflitos e sobreposições de horários.
- Furos na agenda por cancelamentos de última hora.
- Perda de histórico de preferências dos clientes.

O **Navalha** resolve isso automatizando a exibição de disponibilidade, aplicando regras de negócio inteligentes (como prazo mínimo para cancelamentos) e fornecendo um painel administrativo claro para o dia a dia do profissional.

---

## ✨ Principais Funcionalidades

O sistema foi arquitetado em dois módulos principais para garantir uma experiência personalizada para cada tipo de usuário:

### 👤 Módulo do Cliente
- **Autoagendamento:** Escolha de serviços, profissional e horários disponíveis em tempo real.
- **Painel de Controle:** Visualização de agendamentos futuros e passados.
- **Gestão de Compromissos:** Cancelamento autônomo de horários (com regra de antecedência mínima de 2 horas).
- **Notificações Visuais:** Contadores e alertas de status.

### ✂️ Módulo do Profissional
- **Gestão de Disponibilidade:** Configuração de dias úteis e blocos de horários de trabalho, com funcionalidade de replicação rápida para a semana.
- **Agenda Diária Dinâmica:** Painel focado no dia atual com métricas de atendimentos (Total, Confirmados, Concluídos).
- **Controle de Fluxo:** Ações de mudança de status (Confirmar, Cancelar, Concluir Atendimento).
- **Encaixes Rápidos:** Criação de agendamentos manuais (walk-ins) diretamente pelo painel para clientes sem cadastro prévio.
- **Base de Clientes:** Listagem e filtro de clientes frequentes para ações de fidelização.

---

## 🔄 Fluxo do Sistema

O fluxo de funcionamento foi desenhado para ser fluido e intuitivo:

1. **Setup Inicial:** O Profissional acessa o sistema e cadastra sua grade de horários semanais.
2. **Reserva:** O Cliente faz login, escolhe o serviço e o sistema cruza o tempo do serviço com a grade livre do profissional para exibir apenas os horários possíveis.
3. **Confirmação:** Ao confirmar, o horário é bloqueado e o status fica como "Confirmado" no banco de dados.
4. **Execução:** No dia marcado, o Cliente comparece. Ao finalizar o corte, o Profissional acessa a Agenda Diária e marca o atendimento como "Concluído", limpando o painel e alimentando o histórico financeiro/gerencial.

---

## 🛠️ Arquitetura e Escolhas de Stack

O projeto adota uma arquitetura baseada em API RESTful, separando completamente as responsabilidades entre o Frontend (Interface) e o Backend (Regras de Negócio e Persistência).

### 🎨 Frontend
- **React (com Vite):** Escolhido pela alta performance de renderização, componentização forte e vasto ecossistema.
- **TypeScript:** Essencial para garantir a tipagem estática e evitar erros de tempo de execução, especialmente ao tipar os payloads e respostas da API REST.
- **Tailwind CSS:** Utilizado para estilização utilitária, garantindo um design responsivo, moderno e de fácil manutenção sem a necessidade de extensos arquivos CSS.
- **Lucide React:** Biblioteca de ícones moderna e leve.

### ⚙️ Backend
- **Java + Spring Boot:** Escolhido pela robustez, escalabilidade e facilidade na construção de APIs de nível corporativo. O ecossistema Spring permite implementações rápidas de segurança, injeção de dependências e mapeamento de banco de dados.
- **Autenticação JWT (JSON Web Token):** O sistema utiliza tokens encodados em Base64 para garantir a identidade do usuário (Cliente ou Profissional) e proteger rotas sensíveis (ex: `@Navalha:token`).

---

## 🧠 Metodologia e Organização

O projeto foi conduzido utilizando a metodologia ágil **Kanban**, garantindo entregas contínuas e estruturadas em Sprints de valor. A gestão do fluxo de trabalho proporcionou:
- Mapeamento detalhado de User Stories.
- Divisão rigorosa de tarefas entre frontend, backend e modelagem.
- Acompanhamento do progresso da equipe em tempo real através do **ClickUp**.

---

## 🎓 Observações Acadêmicas

Este é um projeto acadêmico e de extensão desenvolvido por estudantes do curso de **Bacharelado em Sistemas de Informação** da **Universidade Federal do Ceará (UFC) - Campus Quixadá**. O projeto foi concebido sem fins lucrativos, com o objetivo principal de aplicar conhecimentos práticos de engenharia de software no desenvolvimento de aplicações reais e promover benefícios diretos à sociedade por meio da tecnologia.
