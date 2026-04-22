#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting PostgreSQL..."
brew services start postgresql@15 >/dev/null || true

start_service() {
  local name="$1"
  local dir="$2"
  local cmd="$3"
  local log_file="$ROOT_DIR/.run-${name}.log"
  local pid_file="$ROOT_DIR/.run-${name}.pid"

  if [[ -f "$pid_file" ]] && kill -0 "$(cat "$pid_file")" 2>/dev/null; then
    echo "$name is already running (pid $(cat "$pid_file"))."
    return
  fi

  echo "Starting $name..."
  nohup bash -lc "cd \"$dir\" && $cmd" >"$log_file" 2>&1 &
  echo $! >"$pid_file"
}

start_service "auth" "$ROOT_DIR/services/auth" "npm run dev"
start_service "product" "$ROOT_DIR/services/product" "npm run dev"
start_service "cart" "$ROOT_DIR/services/cart" "npm run dev"
start_service "order" "$ROOT_DIR/services/order" "npm run dev"
start_service "payment" "$ROOT_DIR/services/payment" "npm run dev"
start_service "notification" "$ROOT_DIR/services/notification" "npm run dev"
start_service "frontend" "$ROOT_DIR/frontend" "npm run dev"

echo ""
echo "All services started."
echo "Frontend: http://localhost:5173"
echo "Logs: .run-*.log"
