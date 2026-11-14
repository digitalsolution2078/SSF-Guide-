#!/usr/bin/env bash
# Install the daily alert job (milestone + employer-deadline push notifications).
# Run once on the VPS as root:  bash deploy/enable-push-cron.sh
#
# Requires in /opt/ssf-guide/.env:
#   CRON_SECRET=<long random string>        (openssl rand -hex 24)
#   VAPID_PRIVATE_KEY=<private key>         (npx web-push generate-vapid-keys)
# and docker compose restarted so the app picks them up.
set -euo pipefail

APP_DIR=/opt/ssf-guide
SITE_DOMAIN=$(grep -E '^SITE_DOMAIN=' "$APP_DIR/.env" | cut -d= -f2- || true)
SITE_DOMAIN=${SITE_DOMAIN:-ssf.digitalsolutionnepal.com}
SECRET=$(grep -E '^CRON_SECRET=' "$APP_DIR/.env" | cut -d= -f2- || true)
if [ -z "$SECRET" ]; then
  echo "CRON_SECRET missing in $APP_DIR/.env — add it first (openssl rand -hex 24)"; exit 1
fi

CRON_LINE="15 3 * * * curl -fsS -m 120 -H 'Authorization: Bearer ${SECRET}' https://${SITE_DOMAIN}/api/push/cron >> /var/log/ssf-push-cron.log 2>&1"
( crontab -l 2>/dev/null | grep -v '/api/push/cron' ; echo "$CRON_LINE" ) | crontab -
echo "Installed: daily at 03:15 UTC (≈ 09:00 NPT) → https://${SITE_DOMAIN}/api/push/cron"
