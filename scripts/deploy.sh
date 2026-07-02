#!/usr/bin/env bash
# Deploys the latest code: pulls the current branch (if this is a git checkout),
# rebuilds the images that changed and (re)starts the stack in the background.
#
# Usage: ./scripts/deploy.sh
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

if [ ! -f .env ]; then
  echo "Error: .env not found. Copy .env.example to .env and fill in the real values first." >&2
  exit 1
fi

if [ -d .git ]; then
  echo "==> Pulling latest changes"
  git pull
fi

echo "==> Building and starting containers"
docker compose up -d --build

echo "==> Current status"
docker compose ps

echo "==> Done. Use ./scripts/logs.sh to follow the logs."
