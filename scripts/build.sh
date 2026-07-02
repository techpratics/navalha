#!/usr/bin/env bash
# Builds the Docker images (backend + frontend) without starting the containers.
# Useful to validate that a change builds before running deploy.sh.
set -euo pipefail

# Always run from the repository root, regardless of where the script was called from.
cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "==> Building images defined in docker-compose.yml"
docker compose build "$@"

echo "==> Done."
