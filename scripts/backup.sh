#!/usr/bin/env bash
# Dumps the Postgres database running in the "postgres" container to a local
# timestamped .sql file under backups/. Does not touch the live data.
#
# Usage: ./scripts/backup.sh
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

mkdir -p backups
timestamp="$(date +%Y%m%d-%H%M%S)"
output_file="backups/navalha-${timestamp}.sql"

echo "==> Dumping database to ${output_file}"
# POSTGRES_USER / POSTGRES_DB are read from the container's own environment
# (set by docker-compose.yml), so this script doesn't need to parse .env itself.
docker compose exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' > "${output_file}"

echo "==> Done: ${output_file}"
