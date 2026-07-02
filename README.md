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
- [Documento de Sprints](https://docs.google.com/document/d/1fS84MfhAbpekBTlM2FqldgBf8MSI_aha/edit?usp=drive_link&ouid=109597382508282434795&rtpof=true&sd=true)
- [Pasta do Projeto (Google Drive)](https://drive.google.com/drive/folders/1pwW3LjfzHrEeARXwzhax_helfkJhnfj_?usp=sharing)

---

## 👥 Equipe de Desenvolvimento

| Nome | Curso | GitHub |
| :--- | :--- | :--- |
| **Arthur Lelis** | Sistemas de Informação | [@Arthur32p](https://github.com/Arthur32p) |
| **Júlio Emanuel** | Sistemas de Informação | [@DevJulioEmanuel](https://github.com/DevJulioEmanuel) |
| **Mateus Valentim** | Engenharia de Computação | [@mattsu014](https://github.com/mattsu014) |
| **Victor Farias** | Sistemas de Informação | [@vistomia](https://github.com/vistomia) |
| **Rodrigo Rodrigues (fora da disciplina)** | Engenharia de Software | [@rudriguu2099](https://github.com/rudriguu2099) |

---

## 📖 Sobre o Projeto

O **Navalha** é um sistema web desenvolvido para o gerenciamento de barbearias e salões. A plataforma centraliza o fluxo de agendamentos em três perfis distintos — Cliente, Profissional e Administrador — cada um com seu painel dedicado e regras de acesso próprias.

---

## 📌 O Problema e a Solução

Muitos profissionais da área de estética ainda dependem de anotações em papel ou trocas intermináveis de mensagens no WhatsApp para agendar clientes. Isso gera:
- Conflitos e sobreposições de horários.
- Furos na agenda por cancelamentos de última hora.
- Perda de histórico de atendimentos dos clientes.

O **Navalha** resolve isso automatizando a exibição de disponibilidade, aplicando regras de negócio inteligentes (como prazo mínimo de 2 horas para cancelamentos) e fornecendo painéis específicos para cada tipo de usuário.

---

## ✨ Principais Funcionalidades

O sistema é dividido em três módulos, um para cada perfil de usuário:

### 👤 Módulo do Cliente
- **Agendamento em 4 etapas:** Escolha do serviço → seleção de profissional, data e horário disponível → confirmação → tela de sucesso.
- **Horários inteligentes:** O sistema cruza a duração do serviço com a grade de disponibilidade do profissional e exibe apenas os slots possíveis.
- **Meus Agendamentos:** Visualização de todos os agendamentos com status (Pendente, Confirmado, Concluído, Cancelado).
- **Cancelamento autônomo:** Regra de antecedência mínima de 2 horas para cancelamento.

### ✂️ Módulo do Profissional
- **Agenda Diária:** Navegação por data com listagem dos atendimentos do dia e métricas de status.
- **Controle de status:** Marcar atendimentos como Concluído diretamente pela agenda.
- **Encaixe rápido:** Criação manual de agendamento (walk-in) para clientes cadastrados no sistema, sem necessidade de reserva prévia pelo app.
- **Disponibilidade:** Configuração de blocos de horário por dia da semana, com opção de copiar a grade de um dia para outro.
- **Base de Clientes:** Listagem e busca de clientes atendidos, ordenados por frequência.

### 🛡️ Módulo do Administrador
- **Gestão de Clientes:** Listagem, busca, edição de dados, ativação/desativação e consulta do histórico completo de atendimentos por cliente.
- **Planos de Assinatura:** Criação de planos e atribuição a clientes.
- **Gestão de Profissionais:** Cadastro, edição, gerenciamento dos serviços ofertados por cada profissional, configuração de disponibilidade e ativação/desativação.
- **Agenda Global:** Visualização de todos os agendamentos nos modos Dia e Semana, com criação manual de agendamentos.
- **Agenda por Profissional:** Visualização da agenda individual de cada profissional.
- **Gestão de Serviços:** CRUD completo de serviços (nome, preço, duração), com ativação/desativação.
- **Relatórios:** Distribuição de clientes por plano de assinatura, desempenho dos profissionais e serviços mais realizados.

---

## 🔄 Fluxo do Sistema

1. **Setup:** O Administrador cadastra os profissionais, os serviços disponíveis e os planos de assinatura.
2. **Disponibilidade:** Cada Profissional acessa seu painel e configura sua grade de horários semanais.
3. **Agendamento:** O Cliente faz login, percorre as 4 etapas de reserva e confirma o horário.
4. **Execução:** No dia marcado, o Profissional visualiza sua agenda e marca o atendimento como "Concluído" ao finalizar.
5. **Gestão:** O Administrador acompanha relatórios, histórico de clientes e a agenda global em tempo real.

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
- **PostgreSQL:** Banco de dados relacional utilizado para persistência dos dados de agendamentos, usuários e disponibilidade dos profissionais.
- **Autenticação JWT (JSON Web Token):** O sistema utiliza tokens encodados em Base64 para garantir a identidade do usuário (Cliente, Profissional ou Admin) e proteger rotas sensíveis (ex: `@Navalha:token`).

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose
- [Node.js 18+](https://nodejs.org/) e [pnpm](https://pnpm.io/)

---

### 🐳 Subindo tudo com Docker (Backend + Banco + Frontend)

```bash
cp .env.example .env   # preencha as variáveis com valores reais
docker compose up -d --build
```

- Frontend (Nginx): `http://localhost`
- API: `http://localhost:8080`
- Swagger: `http://localhost:8080/swagger-ui.html`

Veja [docs/docker.md](./docs/docker.md) e [docs/environment.md](./docs/environment.md) para detalhes.

[Referência completa da API](./docs/api.md)

---

### 🎨 Frontend

**1. Instale as dependências:**

```bash
cd Frontend
pnpm install
```

**2. Inicie o servidor de desenvolvimento:**

```bash
pnpm dev
```

O frontend estará disponível em `http://localhost:5173`.

[Documentação do Frontend](./Frontend/README.md)

---

## 📁 Estrutura do Projeto

```
.
├── Backend/          # API Spring Boot (Java 21 + Maven)
├── Frontend/          # SPA React + Vite + TypeScript (PNPM)
├── infra/
│   ├── nginx/          # Config do Nginx usada pela imagem do Frontend
│   └── cloudflared/    # Template de config do Cloudflare Tunnel (roda no host)
├── scripts/           # Scripts de deploy/operação (build, deploy, backup, logs...)
├── docs/               # Documentação de arquitetura, deploy, docker, env e cloudflare
├── docker-compose.yml
├── .env.example
└── README.md
```

## 📄 Documentação

| Documento | Conteúdo |
|---|---|
| [docs/architecture.md](./docs/architecture.md) | Visão geral da arquitetura do sistema |
| [docs/deploy.md](./docs/deploy.md) | Passo a passo de deploy em produção |
| [docs/docker.md](./docs/docker.md) | Detalhes dos Dockerfiles e do docker-compose |
| [docs/environment.md](./docs/environment.md) | Variáveis de ambiente |
| [docs/cloudflare.md](./docs/cloudflare.md) | Configuração do Cloudflare Tunnel |
| [docs/api.md](./docs/api.md) | Referência completa das rotas da API |

---

## 🧠 Metodologia e Organização

O projeto foi conduzido utilizando a metodologia ágil **SCRUM**, garantindo entregas contínuas e estruturadas em Sprints de valor. A gestão do fluxo de trabalho proporcionou:
- Mapeamento detalhado de User Stories.
- Divisão rigorosa de tarefas entre frontend, backend e modelagem.
- Acompanhamento do progresso da equipe em tempo real através do **ClickUp**.

---

## 🎓 Observações Acadêmicas

Este é um projeto acadêmico e de extensão desenvolvido durante os cursos **Engenharia de Computação | Engenharia de Software | Sistemas de Informação - Universidade Federal do Ceará (UFC), Campus Quixadá**. O projeto foi concebido sem fins lucrativos, com o objetivo principal de aplicar conhecimentos práticos de engenharia de software no desenvolvimento de aplicações reais e promover benefícios diretos à sociedade por meio da tecnologia.
