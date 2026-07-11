#!/usr/bin/env bash
# One-shot setup for a fresh Ubuntu 22.04/24.04 Hostinger VPS.
# Run as root:  bash setup-vps.sh
set -euo pipefail

APP_DIR=/opt/ssf-guide
REPO_URL="${REPO_URL:-https://github.com/digitalsolution2078/SSF-Guide-.git}"
BRANCH="${BRANCH:-claude/ssf-guide-setup-vm4w43}"

echo "==> Installing Docker & git"
apt-get update -qq
apt-get install -y -qq ca-certificates curl git
if ! command -v docker >/dev/null; then
  curl -fsSL https://get.docker.com | sh
fi

# Shared-VPS safe: never enable a firewall; only add allow-rules if one
# is already active.
if command -v ufw >/dev/null && ufw status | grep -q "Status: active"; then
  ufw allow 80/tcp >/dev/null || true
  ufw allow 443/tcp >/dev/null || true
fi

echo "==> Cloning repository"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" fetch origin "$BRANCH" && git -C "$APP_DIR" checkout "$BRANCH" && git -C "$APP_DIR" pull origin "$BRANCH"
else
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
fi
cd "$APP_DIR"

echo "==> Writing .env (edit values as needed)"
if [ ! -f .env ]; then
  DB_PASSWORD_GEN=$(head -c 24 /dev/urandom | base64 | tr -dc 'A-Za-z0-9' | head -c 24)
  cat > .env <<EOF
DB_PASSWORD=${DB_PASSWORD_GEN}
SITE_DOMAIN=${SITE_DOMAIN:-ssf.digitalsolutionnepal.com}
GEMINI_API_KEY=${GEMINI_API_KEY:-}
WHATSAPP_NUMBER=${WHATSAPP_NUMBER:-9779705433699}
EOF
  chmod 600 .env
  if [ -z "${GEMINI_API_KEY:-}" ]; then
    echo "   Created .env — ADD YOUR GEMINI_API_KEY later: nano $APP_DIR/.env"
  fi
else
  echo "   .env already exists — leaving it untouched"
fi

echo "==> Building and starting"
if ss -tlnp 2>/dev/null | grep -qE '[:.](80|443)\s'; then
  echo "   Ports 80/443 already in use — starting app+db only (app on 127.0.0.1:3001)."
  echo "   Add a vhost in your existing web server proxying to http://127.0.0.1:3001"
  docker compose up -d --build db app
else
  echo "   Ports 80/443 free — starting full stack with Caddy HTTPS."
  docker compose --profile edge up -d --build
fi

echo ""
echo "✅ Done. Check status:   docker compose -f $APP_DIR/docker-compose.yml ps"
echo "   App logs:             docker compose -f $APP_DIR/docker-compose.yml logs -f app"
echo "   HTTPS works once the domain's A record points to this VPS IP."
