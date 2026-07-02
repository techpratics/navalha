# Deploy

Como publicar o Navalha em um servidor Linux (Ubuntu) usando Docker Compose e Cloudflare Tunnel.

## Pré-requisitos no servidor

- Docker + Docker Compose plugin instalados.
- `cloudflared` instalado e autenticado (ver [cloudflare.md](./cloudflare.md)).
- Acesso SSH ao servidor.

## Primeiro deploy

```bash
git clone <url-do-repositorio> navalha
cd navalha

cp .env.example .env
# edite o .env com os valores reais de produção (senha do banco, JWT_SECRET, etc.)

docker compose up -d --build
```

Verifique se os três serviços subiram saudáveis:

```bash
docker compose ps
```

O `frontend` só é considerado pronto depois que o `backend` responde ao healthcheck, e o `backend` só depois do `postgres` — então um `docker compose ps` logo após o `up` pode mostrar containers em `starting` por alguns segundos.

## Atualizações (novo deploy)

```bash
git pull
docker compose up -d --build
```

O Docker recria apenas os containers cujas imagens mudaram; o `postgres` mantém os dados no volume `postgres_data`. Um script pronto para esse fluxo está em [scripts/deploy.sh](../scripts/deploy.sh).

## Rollback

```bash
git checkout <commit-ou-tag-anterior>
docker compose up -d --build
```

## Backup do banco

Use [scripts/backup.sh](../scripts/backup.sh), que roda um `pg_dump` dentro do container `alabama_postgres` e salva o arquivo localmente.

## Cloudflare Tunnel

O tráfego externo chega via Cloudflare Tunnel, que roda **no host** (fora do `docker-compose.yml`) e encaminha para `http://localhost:80` (o container `alabama_frontend`). Detalhes de configuração em [cloudflare.md](./cloudflare.md).

## Checklist de produção

- [ ] `.env` preenchido com segredos reais (nunca os valores de exemplo).
- [ ] `docker compose ps` mostra todos os serviços `healthy`.
- [ ] `cloudflared` rodando como serviço (systemd) para sobreviver a reboots.
- [ ] Backup do banco configurado (cron + `scripts/backup.sh`, por exemplo).
