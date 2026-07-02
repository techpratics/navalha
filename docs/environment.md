# Variáveis de Ambiente

Todas as variáveis usadas em produção ficam em um único arquivo `.env` na raiz do projeto (lido pelo `docker-compose.yml` via `env_file`). Nunca versione o `.env` — use o `.env.example` como referência.

```bash
cp .env.example .env
```

## Referência

| Variável | Usada por | Descrição |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | backend | Perfil ativo do Spring Boot (`prod`, `dev`, ...). |
| `POSTGRES_DB` | postgres, backend | Nome do banco de dados criado no container Postgres. |
| `DB_USERNAME` | postgres, backend | Usuário do banco (usado tanto para criar o banco quanto para o backend se conectar). |
| `DB_PASSWORD` | postgres, backend | Senha do banco. Gere uma senha forte em produção. |
| `DATABASE_URL` | backend | URL JDBC completa. O host deve ser o nome do serviço no Docker (`postgres`), não `localhost`. |
| `JWT_SECRET` | backend | Segredo usado para assinar os tokens JWT (HMAC256). Gere com `openssl rand -base64 64`. |

## Onde cada uma é consumida

- `Backend/src/main/resources/application.yml` lê `DATABASE_URL`, `DB_USERNAME`, `DB_PASSWORD` e `JWT_SECRET` via `${...}`.
- `docker-compose.yml` usa `POSTGRES_DB`, `DB_USERNAME` e `DB_PASSWORD` para inicializar o container do Postgres.

## Boas práticas

- Nunca reutilize a senha do banco/JWT_SECRET de um ambiente de produção em desenvolvimento.
- Ao trocar `DB_PASSWORD` ou `POSTGRES_DB` em um ambiente que já tem dados, lembre-se que o Postgres só aplica `POSTGRES_*` na **primeira** inicialização do volume — para efetivar a troca em um volume existente é preciso alterar a senha manualmente dentro do banco (`ALTER USER ...`) ou recriar o volume (perde os dados).
- O frontend não usa variáveis de ambiente em tempo de build/execução: ele sempre chama a API via caminho relativo `/api`, resolvido pelo proxy do Nginx.
