# Cloudflare Tunnel

O Navalha é publicado na internet através de um **Cloudflare Tunnel**, que roda diretamente no host (fora do Docker Compose) e encaminha requisições para o container do Nginx (`alabama_frontend`, porta 80).

```
Internet → Cloudflare → cloudflared (host) → localhost:80 → alabama_frontend (Nginx) → alabama_backend (/api)
```

Por que fora do docker-compose: o `cloudflared` só precisa alcançar `localhost:80`, algo que ele já faz rodando no host sem precisar entrar na rede Docker interna — e assim ele sobrevive independentemente do ciclo de vida dos containers da aplicação (`docker compose down` não derruba o túnel).

## Instalação

```bash
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
```

## Autenticação e criação do túnel

```bash
cloudflared tunnel login
cloudflared tunnel create navalha
```

Isso gera um arquivo de credenciais em `~/.cloudflared/<TUNNEL_ID>.json` — **não versione esse arquivo**.

## Configuração

Copie o template deste repositório e preencha os placeholders:

```bash
mkdir -p ~/.cloudflared
cp infra/cloudflared/config.example.yml ~/.cloudflared/config.yml
```

Edite `~/.cloudflared/config.yml`:

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: seu-dominio.com
    service: http://localhost:80
  - service: http_status:404
```

## Rota de DNS

```bash
cloudflared tunnel route dns navalha seu-dominio.com
```

## Rodando como serviço (recomendado)

```bash
sudo cloudflared service install
sudo systemctl enable --now cloudflared
```

Assim o túnel sobe automaticamente após reboot do servidor, independente do Docker Compose.

## Verificando

```bash
cloudflared tunnel info navalha
sudo systemctl status cloudflared
```

Se o túnel estiver de pé mas o domínio não responder, confirme primeiro que `docker compose ps` mostra o `alabama_frontend` saudável e que `curl http://localhost:80` responde no próprio servidor — isso isola se o problema está no túnel ou na aplicação.
