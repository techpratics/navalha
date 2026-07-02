#!/usr/bin/env bash
# Restarts the stack without rebuilding images. Pass a service name to restart
# only that service (backend, frontend, postgres); with no argument, restarts all.
#
# Usage: ./scripts/restart.sh [service]
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "==> Restarting: ${*:-all services}"
docker compose restart "$@"

docker compose ps
