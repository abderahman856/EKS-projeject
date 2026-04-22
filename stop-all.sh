#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

stop_service() {
  local name="$1"
  local pid_file="$ROOT_DIR/.run-${name}.pid"

  if [[ -f "$pid_file" ]]; then
    local pid
    pid="$(cat "$pid_file")"
    if kill -0 "$pid" 2>/dev/null; then
      echo "Stopping $name (pid $pid)..."
      kill "$pid" || true
    else
      echo "$name pid file exists but process not running."
    fi
    rm -f "$pid_file"
  else
    echo "$name is not running (no pid file)."
  fi
}

stop_service "auth"
stop_service "product"
stop_service "cart"
stop_service "order"
stop_service "payment"
stop_service "notification"
stop_service "frontend"

echo "Stopping any leftover matching Node/Vite processes..."
pkill -f "services/auth/src/index.js" || true
pkill -f "services/product/src/index.js" || true
pkill -f "services/cart/src/index.js" || true
pkill -f "services/order/src/index.js" || true
pkill -f "services/payment/src/index.js" || true
pkill -f "services/notification/src/index.js" || true
pkill -f "vite" || true

echo "App services stopped."
echo "To also stop database: brew services stop postgresql@15"
