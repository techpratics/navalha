#!/usr/bin/env bash
# Quick health overview of the stack: container status + healthcheck state.
#
# Usage: ./scripts/status.sh
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "==> Containers"
docker compose ps

echo
echo "==> Healthcheck details"
for container in alabama_postgres alabama_backend alabama_frontend; do
  if docker inspect "$container" >/dev/null 2>&1; then
    status="$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}no healthcheck{{end}}' "$container")"
    echo "${container}: ${status}"
  else
    echo "${container}: not running"
  fi
done
