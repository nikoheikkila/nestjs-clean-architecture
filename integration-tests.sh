#!/usr/bin/env bash
set -euo pipefail

HOST=localhost
PORT=3000
APP_URL="http://${HOST}:${PORT}"

JOBS=$(nproc)

if ! command -v hurl > /dev/null; then
  echo "Hurl is not installed. Please install it from https://hurl.dev/docs/installation"
  exit 1
fi

echo "Starting the server..."
docker compose up --build -d

echo "Testing whether the server at ${APP_URL} is ready..."
hurl --no-color --retry -1 healthcheck.hurl > /dev/null

echo "Running integration tests..."
hurl --test --parallel --jobs "${JOBS}" --variable API_KEY="${API_KEY}" --variable APP_URL="${APP_URL}" test/specs/**/*.hurl
