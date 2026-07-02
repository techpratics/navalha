# Arquitetura

Visão geral de como as peças do Navalha se encaixam em produção.

```
                         ┌──────────────────────┐
 Internet ──────────────▶│   Cloudflare Tunnel   │   (roda no host, fora do Docker)
                         └──────────┬───────────┘
                                    │ http://localhost:80
                                    ▼
                         ┌──────────────────────┐
                         │   alabama_frontend    │   Nginx + build estático (Vite)
                         │   (container, :80)    │
                         └──────────┬───────────┘
                                    │ /api/*  (proxy_pass)
                                    ▼
                         ┌──────────────────────┐
                         │   alabama_backend     │   Spring Boot (Java 21), :8080
                         └──────────┬───────────┘
                                    │ JDBC
                                    ▼
                         ┌──────────────────────┐
                         │   alabama_postgres    │   PostgreSQL 16
                         └──────────────────────┘
```

## Componentes

- **Backend** (`Backend/`): API REST em Spring Boot. Camadas: `controller` → `service` → `repository`, com `dto`/`mapper` para entrada/saída e `infra` para segurança (JWT). Ver [api.md](./api.md) para a lista completa de rotas.
- **Frontend** (`Frontend/`): SPA em React + Vite + TypeScript, servida como arquivos estáticos pelo Nginx dentro do próprio container de produção.
- **Banco de dados**: PostgreSQL 16, com migrations gerenciadas pelo Flyway (`Backend/src/main/resources/db/migration/`).
- **Nginx** (`infra/nginx/frontend.conf`): serve o build do frontend e faz proxy reverso de `/api/*` para o container `backend` via rede interna do Docker.
- **Cloudflare Tunnel** (`infra/cloudflared/`): roda no host (fora do docker-compose) e expõe o Nginx (porta 80) para a internet, sem necessidade de abrir portas no roteador/firewall. Ver [cloudflare.md](./cloudflare.md).

## Comunicação entre serviços

Todos os containers da aplicação compartilham a rede Docker `alabama-network`. O frontend acessa o backend pelo nome do serviço (`http://backend:8080`) e o backend acessa o banco pelo nome do serviço (`postgres:5432`) — resolução de nomes feita pelo DNS interno do Docker.

## Por que essa separação

- O Nginx dentro do container do frontend evita expor o backend diretamente à internet: só a porta 80 (Nginx) precisa ser alcançável externamente.
- O Cloudflare Tunnel elimina a necessidade de IP público/portas abertas no servidor — toda a exposição externa passa pela rede da Cloudflare.
