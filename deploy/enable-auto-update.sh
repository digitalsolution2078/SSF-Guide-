#!/usr/bin/env bash
# One-time setup: installs the auto-update cron job (every 5 minutes).
# Run on the VPS:  bash /opt/ssf-guide/deploy/enable-auto-update.sh
set -euo pipefail

APP_DIR=/opt/ssf-guide
SCRIPT="$APP_DIR/deploy/auto-update.sh"
LOG=/var/log/ssf-auto-update.log
CRON_LINE="*/5 * * * * /bin/bash $SCRIPT >> $LOG 2>&1"

chmod +x "$SCRIPT"
touch "$LOG"

# idempotent: replace any previous entry for this script
( crontab -l 2>/dev/null | grep -vF "$SCRIPT" ; echo "$CRON_LINE" ) | crontab -

echo "✅ Auto-deploy enabled — the VPS now checks GitHub every 5 minutes."
echo "   New pushes go live automatically. Log: $LOG"
echo "   Disable anytime:  crontab -l | grep -vF '$SCRIPT' | crontab -"
