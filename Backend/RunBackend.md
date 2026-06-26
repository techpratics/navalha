# RunBackend.md — Documentação Completa do Backend Navalha

## Visão Geral

API REST desenvolvida em **Java 17 + Spring Boot**, banco de dados **PostgreSQL 16**, executada via **Docker Compose**. O sistema gerencia uma barbearia: clientes, profissionais, agendamentos, serviços e planos de assinatura.

---

## Como Rodar

```bash
docker compose up --build
```

A API sobe na porta **8080**. O banco sobe na porta **5432**.

### Variáveis de ambiente (definidas no `docker-compose.yml`)

| Variável | Valor |
|----------|-------|
| `DATABASE_URL` | `jdbc:postgresql://alabama-db:5432/alabama_barbers_db` |
| `DB_USERNAME` | `postgres` |
| `DB_PASSWORD` | `postgres` |
| `JWT_SECRET` | string longa de 64 chars (definida no compose) |
| `SPRING_PROFILES_ACTIVE` | `prod` |

---

## Arquitetura

```
controller/   → recebe requisições HTTP, delega ao service
service/      → regras de negócio
repository/   → acesso ao banco via Spring Data JPA
model/        → entidades JPA
dto/          → objetos de entrada e saída das rotas
mapper/       → conversão entre model e DTO
validator/    → validações de negócio reutilizáveis
exceptions/   → exceções customizadas
audit/        → auditoria automática (criado por, alterado por)
infra/        → segurança (JWT, filtros, configurações)
```

---

## Segurança e Autenticação

### JWT

- Biblioteca: `com.auth0:java-jwt`
- Algoritmo: **HMAC256**
- Emissor (`issuer`): `navalha`
- Expiração: **1 ano** a partir do login
- O token carrega: `subject` (login/email), `id` (UUID do usuário), `role`

### Como autenticar

Todas as rotas protegidas exigem o header:
```
Authorization: Bearer <token>
```

### Hierarquia de Roles

O sistema possui 3 roles com herança de permissões:

| Role | Herda |
|------|-------|
| `ADMIN` | ROLE_ADMIN + ROLE_PROFISSIONAL + ROLE_CLIENTE |
| `PROFISSIONAL` | ROLE_PROFISSIONAL + ROLE_CLIENTE |
| `CLIENTE` | ROLE_CLIENTE |

Isso significa que um `ADMIN` pode acessar qualquer rota que exija `PROFISSIONAL` ou `CLIENTE`.

### Rotas públicas (sem token)

| Método | Rota |
|--------|------|
| `POST` | `/auth/login` |
| `POST` | `/clientes` |
| `GET` | `/profissionais/{id}/slots` |
| `GET` | `/empresa` |
| `GET` | `/v3/api-docs/**` |
| `GET` | `/swagger-ui/**` |

---

## Auditoria

As entidades que estendem `Auditable` têm os campos preenchidos automaticamente:

| Campo | Descrição |
|-------|-----------|
| `createAt` | Timestamp de criação (imutável) |
| `createdBy` | Login do usuário que criou |
| `updatedAt` | Timestamp da última alteração |
| `updatedBy` | Login do usuário que alterou |

Entidades auditadas: `Usuario`, `Agendamento`, `Servicos`, `ProfissionalDisponibilidade`, `ProfissionalServicos`.

---

## Tratamento de Erros

Todos os erros são retornados no formato:
```json
{ "erro": "mensagem descritiva" }
```

Ou, em caso de validação de campos:
```json
{ "nomeCampo": "mensagem do erro", "outroCampo": "mensagem do erro" }
```

| Situação | HTTP |
|----------|------|
| Recurso não encontrado (`ResourceNotFoundException`) | `404` |
| Validação de campos (`@Valid` falhou) | `400` |
| Dados duplicados no banco | `409` |
| Horário já ocupado (`HorarioOcupadoException`) | `409` |
| Credenciais inválidas no login | `401` |
| Token ausente, inválido ou expirado | `401` |
| Sem permissão para a rota (`AccessDeniedException`) | `403` |
| Erro interno genérico | `500` |

---

## Migration do Banco

Gerenciada pelo **Flyway**. Os scripts ficam em `src/main/resources/db/migration/`.

| Arquivo | Conteúdo |
|---------|----------|
| `V1__criar-esquema-inicial.sql` | Tabelas: `users`, `profissional`, `clientes`, `servicos`, `profissional_servicos`, `profissional_disponibilidade`, `agendamentos` |
| `V2__plano-assinatura.sql` | Tabelas: `plano_assinatura`, `assinatura_cliente` |

---

## Modelos e Relacionamentos

```
Usuario (1) ──── (1) Cliente
Usuario (1) ──── (1) Profissional

Profissional (1) ──── (N) ProfissionalDisponibilidade
Profissional (1) ──── (N) ProfissionalServicos ──── (N) Servicos

Agendamento (N) ──── (1) Profissional
Agendamento (N) ──── (1) Cliente
Agendamento (N) ──── (1) Servicos

Empresa (1) ──── (MAP<DayOfWeek, HorarioFuncionamento>) horarios

PlanoAssinatura (1) ──── (N) AssinaturaCliente ──── (N) Cliente
```

### StatusAgendamento (enum)
```
CONFIRMADO | EM_ATENDIMENTO | CONCLUIDO | CANCELADO | NAO_COMPARECEU
```

---

## Rotas Completas

### AUTH — `/auth`

#### `POST /auth/login` — Público
Autentica um usuário e retorna o token JWT.

**Body:**
```json
{
  "login": "email@exemplo.com",
  "senha": "senha123"
}
```
**Resposta `200`:**
```json
{ "token": "eyJhbGciOiJIUzI1NiJ9..." }
```

---

### EMPRESA — `/empresa`

#### `GET /empresa` — Público
Retorna as configurações da barbearia (nome, endereço, telefone e horários de funcionamento por dia da semana).

**Resposta `200`:**
```json
{
  "id": "...",
  "nome": "Alabama Barbers",
  "endereco": "Rua das Flores, 123",
  "telefone": "11999999999",
  "horarios": {
    "MONDAY": { "horaAbertura": "08:00", "horaFechamento": "18:00", "fechado": false },
    "SUNDAY":  { "horaAbertura": null, "horaFechamento": null, "fechado": true }
  }
}
```

#### `PUT /empresa` — `ADMIN`
Salva ou atualiza as configurações da barbearia.

**Body:**
```json
{
  "nome": "Alabama Barbers",
  "endereco": "Rua das Flores, 123",
  "telefone": "11999999999",
  "horarios": {
    "MONDAY": { "horaAbertura": "08:00", "horaFechamento": "18:00", "fechado": false }
  }
}
```

---

### CLIENTES — `/clientes`

#### `POST /clientes` — Público
Cadastra um novo cliente (cria `Usuario` com role `CLIENTE` e `Cliente` vinculado).

**Body:**
```json
{
  "nome": "Carlos Silva",
  "telefone": "11988887777",
  "dataNascimento": "1995-04-10",
  "cpf": "000.000.000-00",
  "email": "carlos@email.com",
  "senha": "senha123"
}
```
**Resposta `201`** com header `Location` e body do cliente criado.

#### `GET /clientes` — `PROFISSIONAL` ou `ADMIN`
Lista todos os clientes cadastrados.

#### `GET /clientes/buscar?q=termo` — `PROFISSIONAL` ou `ADMIN`
Busca clientes por nome, CPF ou telefone.

#### `GET /clientes/meu-perfil` — `CLIENTE`
Retorna os dados do cliente autenticado.

#### `GET /clientes/{id}` — `ADMIN` ou `PROFISSIONAL`
Retorna os dados de um cliente pelo ID.

#### `PUT /clientes/meu-perfil` — `CLIENTE`
Atualiza os dados do próprio cliente. Body igual ao `POST /clientes`.

#### `PUT /clientes/{id}` — `ADMIN` ou `PROFISSIONAL`
Atualiza os dados de um cliente pelo ID. Body igual ao `POST /clientes`.

#### `PATCH /clientes/{id}/status` — `PROFISSIONAL` ou `ADMIN`
Inverte o status do cliente (ativo/inativo). Sem body.

#### `POST /clientes/{id}/assinatura` — `ADMIN`
Associa um plano de assinatura ao cliente. Se o cliente já possuir assinatura ativa, ela é desativada automaticamente.

**Body:**
```json
{
  "planoId": "uuid-do-plano",
  "dataInicio": "2026-06-23",
  "dataFim": "2026-07-23"
}
```
**Resposta `201`** com header `Location`.

#### `GET /clientes/{id}/assinatura` — `ADMIN`
Retorna o plano ativo do cliente e os usos da semana corrente (segunda a domingo).

**Resposta `200`:**
```json
{
  "assinaturaId": "...",
  "clienteId": "...",
  "nomeCliente": "Carlos Silva",
  "plano": {
    "id": "...",
    "nome": "Plano Premium",
    "descricao": "Até 3 visitas por semana",
    "precoMensal": 89.90,
    "usosPorSemana": 3,
    "ativo": true
  },
  "dataInicio": "2026-06-23",
  "dataFim": "2026-07-23",
  "ativa": true,
  "usosSemanaAtual": 1,
  "limiteSemana": 3,
  "usosRestantes": 2
}
```

#### `GET /clientes/minha-assinatura` — `CLIENTE`
Igual ao endpoint acima, mas para o próprio cliente autenticado.

#### `GET /clientes/{id}/historico` — `ADMIN`
Retorna o histórico completo de atendimentos de um cliente pelo ID. Lança `404` se o cliente não existir.

**Resposta `200`:**
```json
[
  {
    "id": "...",
    "profissionalId": "...",
    "nomeProfissional": "João Barbeiro",
    "clienteId": "...",
    "nomeCliente": "Carlos Silva",
    "servicoId": "...",
    "nomeServico": "Corte + Barba",
    "data": "2026-05-10",
    "horarioInicio": "10:00",
    "horarioFim": "11:00",
    "status": "CONCLUIDO"
  }
]
```

---

### PROFISSIONAIS — `/profissionais`

#### `POST /profissionais` — `ADMIN`
Cadastra um novo profissional (cria `Usuario` com role `PROFISSIONAL` e `Profissional` vinculado).

**Body:**
```json
{
  "nome": "João Barbeiro",
  "cpf": "000.000.000-00",
  "dataNascimento": "1990-01-15",
  "telefone": "11977776666",
  "email": "joao@barbearia.com",
  "senha": "senha123"
}
```
**Resposta `201`** com header `Location`.

#### `GET /profissionais` — `ADMIN`
Lista todos os profissionais.

#### `GET /profissionais/meu-perfil` — `PROFISSIONAL`
Retorna os dados do profissional autenticado.

#### `GET /profissionais/{id}` — `ADMIN` ou `CLIENTE`
Retorna os dados de um profissional pelo ID.

#### `PUT /profissionais/meu-perfil` — `PROFISSIONAL`
Atualiza os próprios dados. Body igual ao `POST /profissionais`.

#### `PUT /profissionais/{id}` — `ADMIN`
Atualiza os dados de um profissional pelo ID. Body igual ao `POST /profissionais`.

#### `PATCH /profissionais/{id}/status` — `ADMIN`
Inverte o status do profissional (ativo/inativo). Sem body.

#### `GET /profissionais/{id}/slots?data=YYYY-MM-DD&servicoId=uuid` — Público
Retorna os horários disponíveis de um profissional para uma data e serviço específicos. Considera disponibilidade cadastrada, agendamentos existentes e horário de funcionamento da empresa.

**Resposta `200`:**
```json
["08:00", "08:30", "09:00", "10:00"]
```

#### `POST /profissionais/meus-servicos` — `PROFISSIONAL`
Vincula um serviço ao profissional autenticado.

**Body:**
```json
{ "servicoId": "uuid-do-servico" }
```

#### `POST /profissionais/{id}/servicos` — `ADMIN`
Vincula um serviço a um profissional pelo ID.

**Body:**
```json
{ "servicoId": "uuid-do-servico" }
```

#### `GET /profissionais/meus-servicos` — `PROFISSIONAL`
Lista os serviços vinculados ao profissional autenticado.

#### `GET /profissionais/{id}/servicos` — `ADMIN` ou `CLIENTE`
Lista os serviços vinculados a um profissional pelo ID.

#### `DELETE /profissionais/{id}/servicos/{servicoId}` — `PROFISSIONAL` ou `ADMIN`
Remove o vínculo de um serviço com um profissional.

---

### DISPONIBILIDADE — `/profissionais/.../disponibilidade`

#### `POST /profissionais/minha-disponibilidade` — `PROFISSIONAL`
Cadastra um horário de disponibilidade para o profissional autenticado.

**Body:**
```json
{
  "diaSemana": 1,
  "horaInicio": "08:00",
  "horaFim": "18:00"
}
```
> `diaSemana`: 1 = Segunda, 2 = Terça, ..., 7 = Domingo (padrão ISO).

**Resposta `201`** com header `Location`.

#### `POST /profissionais/minha-disponibilidade/copiar` — `PROFISSIONAL`
Copia a disponibilidade de um dia para outro.

**Body:**
```json
{ "diaOrigem": 1, "diaDestino": 2 }
```

#### `GET /profissionais/minha-disponibilidade` — `PROFISSIONAL`
Lista a disponibilidade do profissional autenticado.

#### `POST /profissionais/{id}/disponibilidade` — `ADMIN`
Cadastra disponibilidade para um profissional pelo ID. Body igual ao de cima.

#### `POST /profissionais/{id}/disponibilidade/copiar` — `ADMIN`
Copia disponibilidade de um dia para outro para um profissional pelo ID.

#### `GET /profissionais/{id}/disponibilidade` — `ADMIN` ou `CLIENTE`
Lista a disponibilidade de um profissional pelo ID.

#### `PUT /profissionais/disponibilidade/{dispId}` — `ADMIN` ou `PROFISSIONAL`
Atualiza um registro de disponibilidade pelo ID da disponibilidade.

**Body:**
```json
{
  "diaSemana": 1,
  "horaInicio": "09:00",
  "horaFim": "17:00"
}
```

#### `DELETE /profissionais/disponibilidade/{dispId}` — `ADMIN` ou `PROFISSIONAL`
Remove um registro de disponibilidade pelo ID. **Resposta `204`**.

---

### SERVIÇOS — `/servicos`

#### `POST /servicos` — `ADMIN`
Cadastra um novo serviço.

**Body:**
```json
{
  "nome": "Corte + Barba",
  "preco": 50.00,
  "duracaoMinutos": 60
}
```
**Resposta `201`** com header `Location`.

#### `GET /servicos` — `ADMIN`, `PROFISSIONAL` ou `CLIENTE`
Lista todos os serviços.

#### `GET /servicos/{id}` — `ADMIN`, `PROFISSIONAL` ou `CLIENTE`
Retorna um serviço pelo ID.

#### `PUT /servicos/{id}` — `ADMIN`
Atualiza um serviço pelo ID. Body igual ao `POST /servicos`.

#### `PATCH /servicos/{id}/status` — `ADMIN`
Inverte o status do serviço (ativo/inativo). Sem body. **Resposta `204`**.

---

### AGENDAMENTOS — `/agendamentos`

#### `POST /agendamentos/meu-agendamento` — `CLIENTE`
O cliente cria um agendamento para si próprio. O `clienteId` é extraído do token — não precisa ser enviado no body.

**Body:**
```json
{
  "profissionalId": "uuid-do-profissional",
  "clienteId": "qualquer-valor-ignorado",
  "servicoId": "uuid-do-servico",
  "data": "2026-07-01",
  "horarioInicio": "10:00"
}
```
> O `horarioFim` é calculado automaticamente com base na duração do serviço.

**Resposta `201`** com header `Location`.

**Validações executadas:**
1. A barbearia está aberta na data e horário solicitados
2. O profissional atende naquele dia e horário (disponibilidade cadastrada)
3. Não há conflito com outro agendamento já existente

#### `POST /agendamentos/encaixe` — `PROFISSIONAL`
O profissional cria um agendamento para um cliente (encaixe). O `profissionalId` é extraído do token.

**Body:**
```json
{
  "profissionalId": "qualquer-valor-ignorado",
  "clienteId": "uuid-do-cliente",
  "servicoId": "uuid-do-servico",
  "data": "2026-07-01",
  "horarioInicio": "14:00"
}
```

#### `POST /agendamentos/admin` — `ADMIN`
O admin cria um agendamento informando todos os campos.

**Body:**
```json
{
  "profissionalId": "uuid-do-profissional",
  "clienteId": "uuid-do-cliente",
  "servicoId": "uuid-do-servico",
  "data": "2026-07-01",
  "horarioInicio": "09:00"
}
```

#### `GET /agendamentos/meus-agendamentos` — `CLIENTE` ou `PROFISSIONAL`
- Se `CLIENTE`: retorna todos os agendamentos do próprio cliente
- Se `PROFISSIONAL`: retorna todos os agendamentos da agenda do profissional

#### `GET /agendamentos` — `ADMIN`
Lista todos os agendamentos do sistema.

#### `GET /agendamentos/{id}` — `ADMIN`
Retorna um agendamento pelo ID.

#### `PATCH /agendamentos/{id}/status` — `ADMIN`, `PROFISSIONAL` ou `CLIENTE`
Altera o status de um agendamento. Possui restrições de segurança:
- `CLIENTE` só pode alterar status de agendamentos que são seus
- `PROFISSIONAL` só pode alterar agendamentos da sua agenda
- `ADMIN` pode alterar qualquer agendamento

**Body:**
```json
{ "status": "CONCLUIDO" }
```

**Valores válidos para `status`:**
```
CONFIRMADO | EM_ATENDIMENTO | CONCLUIDO | CANCELADO | NAO_COMPARECEU
```
**Resposta `204`**.

---

### PLANOS DE ASSINATURA — `/planos`

> Todos os endpoints deste grupo requerem role `ADMIN`.

#### `POST /planos` — `ADMIN`
Cria um novo plano de assinatura.

**Body:**
```json
{
  "nome": "Plano Premium",
  "descricao": "Até 3 visitas por semana",
  "precoMensal": 89.90,
  "usosPorSemana": 3
}
```
**Resposta `201`** com header `Location` e body do plano criado.

#### `GET /planos` — `ADMIN`
Lista todos os planos cadastrados.

**Resposta `200`:**
```json
[
  { "id": "...", "nome": "Plano Basic", "descricao": "...", "precoMensal": 49.90, "usosPorSemana": 1, "ativo": true },
  { "id": "...", "nome": "Plano Premium", "descricao": "...", "precoMensal": 89.90, "usosPorSemana": 3, "ativo": true }
]
```

#### `GET /planos/{id}` — `ADMIN`
Retorna um plano pelo ID.

#### `GET /planos/distribuicao` — `ADMIN`
Retorna todos os planos com a contagem de clientes ativos em cada um.

**Resposta `200`:**
```json
[
  { "id": "...", "nome": "Plano Basic", "precoMensal": 49.90, "usosPorSemana": 1, "ativo": true, "clientesAtivos": 12 },
  { "id": "...", "nome": "Plano Premium", "precoMensal": 89.90, "usosPorSemana": 3, "ativo": true, "clientesAtivos": 5 }
]
```

---

### RELATÓRIOS — `/relatorios`

#### `GET /relatorios/faturamento?dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD` — `ADMIN`
Retorna o relatório de faturamento do período, considerando apenas agendamentos com status `CONCLUIDO` para o cálculo do valor. Os rankings de profissional e serviço são ordenados de forma decrescente por valor faturado.

**Resposta `200`:**
```json
{
  "dataInicio": "2026-01-01",
  "dataFim": "2026-06-30",
  "totalAgendamentos": 120,
  "agendamentosConcluidos": 98,
  "totalFaturado": 4850.00,
  "porProfissional": [
    {
      "profissionalId": "...",
      "nomeProfissional": "João Barbeiro",
      "totalAgendamentos": 55,
      "totalFaturado": 2750.00
    }
  ],
  "porServico": [
    {
      "servicoId": "...",
      "nomeServico": "Corte + Barba",
      "totalAgendamentos": 40,
      "totalFaturado": 2000.00
    }
  ]
}
```

#### `GET /relatorios/desempenho-profissionais` — `ADMIN`
Retorna o desempenho individual de cada profissional. `dataInicio` e `dataFim` são opcionais — sem filtro considera todo o histórico. Ordenado do profissional com mais atendimentos concluídos para o com menos.

**Query params opcionais:** `dataInicio=YYYY-MM-DD`, `dataFim=YYYY-MM-DD`

**Resposta `200`:**
```json
[
  {
    "profissionalId": "...",
    "nomeProfissional": "João Barbeiro",
    "totalAgendamentos": 80,
    "totalConcluidos": 72,
    "totalCancelados": 5,
    "taxaConclusao": 90.0,
    "totalFaturado": 3600.00,
    "servicoMaisRealizado": "Corte + Barba"
  }
]
```

#### `GET /relatorios/clientes-frequentes` — `ADMIN`
Retorna os clientes ordenados pelo número de atendimentos concluídos (do mais para o menos frequente). Considera apenas agendamentos com status `CONCLUIDO`. `dataInicio` e `dataFim` são opcionais.

**Query params opcionais:** `dataInicio=YYYY-MM-DD`, `dataFim=YYYY-MM-DD`

**Resposta `200`:**
```json
[
  {
    "clienteId": "...",
    "nomeCliente": "Carlos Silva",
    "telefone": "11988887777",
    "totalAtendimentos": 15,
    "totalGasto": 750.00,
    "ultimoAtendimento": "2026-06-20"
  }
]
```

#### `GET /relatorios/servicos-mais-vendidos` — `ADMIN`
Retorna os serviços ordenados pelo número de vezes realizados (do mais para o menos vendido). Considera apenas agendamentos com status `CONCLUIDO`. `dataInicio` e `dataFim` são opcionais.

**Query params opcionais:** `dataInicio=YYYY-MM-DD`, `dataFim=YYYY-MM-DD`

**Resposta `200`:**
```json
[
  {
    "servicoId": "...",
    "nomeServico": "Corte + Barba",
    "totalAgendamentos": 40,
    "totalFaturado": 2000.00
  }
]
```

---

## Resumo de Todas as Rotas

| Método | Rota | Acesso |
|--------|------|--------|
| `POST` | `/auth/login` | Público |
| `GET` | `/empresa` | Público |
| `PUT` | `/empresa` | ADMIN |
| `POST` | `/clientes` | Público |
| `GET` | `/clientes` | PROFISSIONAL, ADMIN |
| `GET` | `/clientes/buscar?q=` | PROFISSIONAL, ADMIN |
| `GET` | `/clientes/meu-perfil` | CLIENTE |
| `GET` | `/clientes/minha-assinatura` | CLIENTE |
| `GET` | `/clientes/{id}` | ADMIN, PROFISSIONAL |
| `PUT` | `/clientes/meu-perfil` | CLIENTE |
| `PUT` | `/clientes/{id}` | ADMIN, PROFISSIONAL |
| `PATCH` | `/clientes/{id}/status` | PROFISSIONAL, ADMIN |
| `POST` | `/clientes/{id}/assinatura` | ADMIN |
| `GET` | `/clientes/{id}/assinatura` | ADMIN |
| `GET` | `/clientes/{id}/historico` | ADMIN |
| `POST` | `/profissionais` | ADMIN |
| `GET` | `/profissionais` | ADMIN |
| `GET` | `/profissionais/meu-perfil` | PROFISSIONAL |
| `GET` | `/profissionais/{id}` | ADMIN, CLIENTE |
| `PUT` | `/profissionais/meu-perfil` | PROFISSIONAL |
| `PUT` | `/profissionais/{id}` | ADMIN |
| `PATCH` | `/profissionais/{id}/status` | ADMIN |
| `GET` | `/profissionais/{id}/slots?data=&servicoId=` | Público |
| `POST` | `/profissionais/meus-servicos` | PROFISSIONAL |
| `POST` | `/profissionais/{id}/servicos` | ADMIN |
| `GET` | `/profissionais/meus-servicos` | PROFISSIONAL |
| `GET` | `/profissionais/{id}/servicos` | ADMIN, CLIENTE |
| `DELETE` | `/profissionais/{id}/servicos/{servicoId}` | PROFISSIONAL, ADMIN |
| `POST` | `/profissionais/minha-disponibilidade` | PROFISSIONAL |
| `POST` | `/profissionais/minha-disponibilidade/copiar` | PROFISSIONAL |
| `GET` | `/profissionais/minha-disponibilidade` | PROFISSIONAL |
| `POST` | `/profissionais/{id}/disponibilidade` | ADMIN |
| `POST` | `/profissionais/{id}/disponibilidade/copiar` | ADMIN |
| `GET` | `/profissionais/{id}/disponibilidade` | ADMIN, CLIENTE |
| `PUT` | `/profissionais/disponibilidade/{dispId}` | ADMIN, PROFISSIONAL |
| `DELETE` | `/profissionais/disponibilidade/{dispId}` | ADMIN, PROFISSIONAL |
| `POST` | `/servicos` | ADMIN |
| `GET` | `/servicos` | ADMIN, PROFISSIONAL, CLIENTE |
| `GET` | `/servicos/{id}` | ADMIN, PROFISSIONAL, CLIENTE |
| `PUT` | `/servicos/{id}` | ADMIN |
| `PATCH` | `/servicos/{id}/status` | ADMIN |
| `POST` | `/agendamentos/meu-agendamento` | CLIENTE |
| `POST` | `/agendamentos/encaixe` | PROFISSIONAL |
| `POST` | `/agendamentos/admin` | ADMIN |
| `GET` | `/agendamentos/meus-agendamentos` | CLIENTE, PROFISSIONAL |
| `GET` | `/agendamentos` | ADMIN |
| `GET` | `/agendamentos/{id}` | ADMIN |
| `PATCH` | `/agendamentos/{id}/status` | ADMIN, PROFISSIONAL, CLIENTE |
| `POST` | `/planos` | ADMIN |
| `GET` | `/planos` | ADMIN |
| `GET` | `/planos/{id}` | ADMIN |
| `GET` | `/planos/distribuicao` | ADMIN |
| `GET` | `/relatorios/faturamento?dataInicio=&dataFim=` | ADMIN |
| `GET` | `/relatorios/desempenho-profissionais` | ADMIN |
| `GET` | `/relatorios/clientes-frequentes` | ADMIN |
| `GET` | `/relatorios/servicos-mais-vendidos` | ADMIN |
