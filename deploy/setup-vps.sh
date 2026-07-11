#!/usr/bin/env bash
# One-shot setup for a fresh Ubuntu 22.04/24.04 Hostinger VPS.
# Run as root:  bash setup-vps.sh
set -euo pipefail

APP_DIR=/opt/ssf-guide
REPO_URL="${REPO_URL:-https://github.com/digitalsolution2078/SSF-Guide-.git}"
BRANCH="${BRANCH:-claude/ssf-guide-setup-vm4w43}"

echo "==> Installing Docker & git"
apt-get update -qq
apt-get install -y -qq ca-certificates curl git ufw
if ! command -v docker >/dev/null; then
  curl -fsSL https://get.docker.com | sh
fi

echo "==> Firewall: allow SSH/HTTP/HTTPS"
ufw allow OpenSSH >/dev/null
ufw allow 80/tcp >/dev/null
ufw allow 443/tcp >/dev/null
yes | ufw enable >/dev/null || true

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
SITE_DOMAIN=ssf.digitalsolutionnepal.com
GEMINI_API_KEY=
WHATSAPP_NUMBER=9779800000000
EOF
  echo "   Created .env — ADD YOUR GEMINI_API_KEY: nano $APP_DIR/.env"
else
  echo "   .env already exists — leaving it untouched"
fi

echo "==> Building and starting (app + postgres + caddy)"
docker compose up -d --build

echo ""
echo "✅ Done. Check status:   docker compose -f $APP_DIR/docker-compose.yml ps"
echo "   App logs:             docker compose -f $APP_DIR/docker-compose.yml logs -f app"
echo "   HTTPS works once the domain's A record points to this VPS IP."
