#!/usr/bin/env bash
# Auto-deploy: pull + rebuild only when GitHub has new commits.
# Installed as a cron job by enable-auto-update.sh (runs every 5 minutes).
set -euo pipefail

APP_DIR=/opt/ssf-guide
BRANCH="claude/ssf-guide-setup-vm4w43"
LOCK=/tmp/ssf-auto-update.lock

# never run two updates at once (build takes minutes)
exec 9>"$LOCK"
flock -n 9 || exit 0

cd "$APP_DIR"
git fetch origin "$BRANCH" --quiet

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")
[ "$LOCAL" = "$REMOTE" ] && exit 0

echo "[$(date '+%F %T')] New commits found: ${LOCAL:0:7} -> ${REMOTE:0:7} — deploying"
git reset --hard "origin/$BRANCH"
docker compose up -d --build db app
docker image prune -f >/dev/null
echo "[$(date '+%F %T')] Deploy complete: $(git rev-parse --short HEAD)"
