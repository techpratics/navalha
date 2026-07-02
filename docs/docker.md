# Docker

Como as imagens são construídas e como o `docker-compose.yml` orquestra os serviços.

## Serviços

| Serviço | Imagem base | Container | Porta publicada |
|---|---|---|---|
| `postgres` | `postgres:16-alpine` | `alabama_postgres` | interna apenas (5432) |
| `backend` | multi-stage: `maven:3.9.6-eclipse-temurin-21-alpine` → `eclipse-temurin:21-jre-alpine` | `alabama_backend` | `8080:8080` |
| `frontend` | multi-stage: `node:22-alpine` → `nginx:1.29-alpine` | `alabama_frontend` | `80:80` |

## Contextos de build

- **backend**: contexto `./Backend`. O `Backend/Dockerfile` copia `pom.xml`/`src` normalmente.
- **frontend**: contexto é a **raiz do repositório** (não `./Frontend`), porque a imagem final copia a configuração do Nginx de `infra/nginx/frontend.conf`. Por isso o `Frontend/Dockerfile` referencia `Frontend/package.json`, `Frontend/pnpm-lock.yaml` etc. com o prefixo `Frontend/`.

Cada contexto tem seu próprio `.dockerignore`:
- `Backend/.dockerignore` — usado quando o contexto é `./Backend`.
- `.dockerignore` (raiz) — usado quando o contexto é `.` (build do frontend).

## Backend — `Backend/Dockerfile`

1. **Stage `build`**: baixa as dependências Maven (`mvn dependency:go-offline`) em uma camada separada do código-fonte, para que alterações no código não invalidem o cache de dependências. Depois compila o jar (`mvn clean package -DskipTests`).
2. **Stage final**: copia só o `.jar` para uma imagem JRE (sem o Maven, mais leve) e roda como usuário não-root (`spring`).

## Frontend — `Frontend/Dockerfile`

1. **Stage `build`**: instala dependências com `pnpm` (via Corepack) e roda `pnpm run build` (Vite).
2. **Stage final**: uma imagem Nginx enxuta serve o build estático (`dist/`) e usa `infra/nginx/frontend.conf` para rotear `/api/*` para o container `backend`.

## docker-compose.yml

Pontos relevantes:

- **`restart: unless-stopped`** em todos os serviços — reinicia automaticamente após falhas ou reboot do host, mas respeita paradas manuais.
- **`healthcheck`**: cada serviço expõe uma forma de verificar se está realmente pronto:
  - `postgres`: `pg_isready`.
  - `backend`: requisição HTTP a `/v3/api-docs` (rota pública do Springdoc).
  - `frontend`: requisição HTTP à raiz do Nginx.
- **`depends_on` com `condition: service_healthy`**: o backend só inicia depois que o Postgres responde ao healthcheck, e o frontend só depois que o backend responde — evita erros de conexão na subida a frio.
- **Nomes fixos** de containers/rede/volume (`alabama_*`, `alabama-network`, `postgres_data`) — mantidos exatamente como já estavam em produção, para não invalidar o volume de dados existente.
- Segredos vêm de `.env` (via `env_file`), nunca hardcoded no compose.

## Comandos úteis

```bash
docker compose config          # valida e mostra o compose final (com variáveis interpoladas)
docker compose up -d --build   # build + subir tudo em background
docker compose ps              # status dos serviços
docker compose logs -f backend # logs em tempo real de um serviço
docker compose down            # para e remove os containers (mantém o volume postgres_data)
```

Veja também os scripts prontos em [scripts/](../scripts/).
