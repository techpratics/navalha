#!/usr/bin/env bash
# Tails logs from the stack. Pass a service name to filter (backend, frontend, postgres);
# with no argument, follows logs from every service.
#
# Usage: ./scripts/logs.sh [service]
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

docker compose logs -f --tail=200 "$@"
