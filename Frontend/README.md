# Frontend — Navalha

Interface web do sistema de gerenciamento de barbearias, desenvolvida em **React 19 + TypeScript**, com Vite como bundler e Tailwind CSS v4 para estilização.

---

## Como Rodar

**Pré-requisitos:** [Node.js 18+](https://nodejs.org/) e [pnpm](https://pnpm.io/)

```bash
cd Frontend
pnpm install
pnpm dev
```

O app estará disponível em `http://localhost:5173`.

> O backend deve estar rodando em `http://localhost:8080` para a integração funcionar. Veja o [Manual do Backend](../Backend/RunBackend.md).

---

## Stack

| Tecnologia | Versão | Papel |
|---|---|---|
| React | 19 | UI e gerenciamento de estado local |
| TypeScript | 6 | Tipagem estática |
| Vite | 8 | Bundler e servidor de desenvolvimento |
| Tailwind CSS | v4 | Estilização utilitária |
| React Router DOM | v7 | Roteamento client-side |
| Axios | 1.x | Requisições HTTP para a API |
| Lucide React | 1.x | Biblioteca de ícones |

---

## Estrutura de Pastas

```
src/
├── pages/
│   ├── auth/           # Login
│   ├── client/         # Agendamento e listagem de agendamentos do cliente
│   │   └── steps/      # 4 etapas do fluxo de agendamento
│   ├── professional/   # Agenda, clientes e disponibilidade do profissional
│   └── admin/          # Painel completo do administrador
│
├── components/
│   ├── layout/         # Layouts, sidebars e headers por perfil
│   ├── auth/           # Logo e seletor de role
│   ├── booking/        # Stepper de agendamento
│   ├── appointments/   # Cards e modais de agendamento
│   ├── professionals/  # Modais de serviços e disponibilidade
│   ├── stepsAgendamento/ # Seletores de data, profissional e horário
│   └── ui/             # Componentes primitivos (Button, Input, DateInput, TimeInput)
│
├── hooks/              # Hooks customizados de lógica e estado
├── services/           # Camada de comunicação com a API REST
├── routes/             # Definição de rotas e guards de autenticação
└── types/              # Interfaces TypeScript globais
```

---

## Autenticação

O sistema usa **JWT** armazenado no `localStorage`. Após o login, dois itens são gravados:

| Chave | Conteúdo |
|-------|----------|
| `@Navalha:token` | Token JWT para o header `Authorization: Bearer <token>` |
| `@Navalha:user` | Objeto com `{ id, nome, role }` do usuário autenticado |

O Axios injeta o token automaticamente em todas as requisições via interceptor em `src/services/api.ts`.

### Guards de rota

| Guard | Comportamento |
|-------|--------------|
| `PublicRoute` | Redireciona usuário já logado para o painel do seu perfil |
| `PrivateRoute` | Bloqueia acesso sem token; redireciona se o role for diferente do exigido |

---

## Rotas

### Públicas

| Rota | Página |
|------|--------|
| `/login` | Tela de login com seletor de perfil |

### Cliente (`role: CLIENTE`)

| Rota | Página |
|------|--------|
| `/client/agendar` | Fluxo de agendamento em 4 etapas |
| `/client/agendamentos` | Listagem de agendamentos com status e opção de cancelamento |

### Profissional (`role: PROFISSIONAL`)

| Rota | Página |
|------|--------|
| `/professional/agenda` | Agenda diária com navegação por data |
| `/professional/clientes` | Base de clientes atendidos |
| `/professional/disponibilidade` | Configuração de horários por dia da semana |

### Admin (`role: ADMIN`)

| Rota | Página |
|------|--------|
| `/admin/profissionais` | Listagem e gestão de profissionais |
| `/admin/cadastro-profissional` | Cadastro de novo profissional |
| `/admin/clientes` | Listagem e gestão de clientes |
| `/admin/cadastro-cliente` | Cadastro de novo cliente |
| `/admin/servicos` | CRUD de serviços (nome, preço, duração) |
| `/admin/agenda` | Agenda global (modos Dia e Semana) |
| `/admin/agenda-profissionais` | Agenda individual por profissional |
| `/admin/relatorios` | Faturamento, desempenho e clientes frequentes |

---

## Serviços (camada de API)

| Arquivo | Responsabilidade |
|---------|-----------------|
| `api.ts` | Instância Axios com baseURL e interceptor de token |
| `auth.service.ts` | Login e logout |
| `catalog.service.ts` | Serviços da barbearia (listagem, CRUD) |
| `client.service.ts` | Clientes (listagem, edição, histórico, assinatura) |
| `professional.service.ts` | Profissionais, vínculos de serviços e disponibilidade |
| `schedule.service.ts` | Agendamentos (criação, listagem, alteração de status) |

---

## Hooks

| Hook | Descrição |
|------|-----------|
| `useLogin` | Lógica de autenticação e redirecionamento pós-login |
| `useBooking` | Orquestra as 4 etapas do fluxo de agendamento |
| `useAppointments` | Busca e cancela agendamentos do cliente logado |
| `useSchedule` | Agenda do profissional com navegação por data |
| `useProfessionals` | CRUD de profissionais (painel admin) |
| `useProfessionalsSchedule` | Agenda global e por profissional (painel admin) |
| `useProfessionalServices` | Serviços vinculados a um profissional |
| `useAvailability` | Configuração de disponibilidade semanal |
| `useClients` | Listagem e gestão de clientes |
| `useServices` | Listagem de serviços da barbearia |
| `useAppointmentForm` | Estado do modal de criação de agendamento |
| `useSubmitAppointment` | Envio do agendamento e tratamento de erros |
| `useTheme` | Alternância de tema claro/escuro |
