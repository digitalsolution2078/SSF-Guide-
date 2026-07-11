#!/usr/bin/env bash
# One-time setup: nightly database backups (03:17), 14-day rotation.
# Run on the VPS:  bash /opt/ssf-guide/deploy/enable-backups.sh
set -euo pipefail

APP_DIR=/opt/ssf-guide
BACKUP_DIR=/opt/ssf-backups
mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

cat > "$APP_DIR/deploy/run-backup.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
cd /opt/ssf-guide
STAMP=$(date +%F_%H%M)
docker compose exec -T db pg_dump -U ssf ssf_guide | gzip > "/opt/ssf-backups/ssf_${STAMP}.sql.gz"
# keep 14 days
find /opt/ssf-backups -name 'ssf_*.sql.gz' -mtime +14 -delete
echo "[$(date '+%F %T')] backup ok: ssf_${STAMP}.sql.gz ($(du -h /opt/ssf-backups/ssf_${STAMP}.sql.gz | cut -f1))"
EOF
chmod +x "$APP_DIR/deploy/run-backup.sh"

CRON_LINE="17 3 * * * /bin/bash $APP_DIR/deploy/run-backup.sh >> /var/log/ssf-backup.log 2>&1"
( crontab -l 2>/dev/null | grep -vF "run-backup.sh" ; echo "$CRON_LINE" ) | crontab -

# run one immediately to prove it works
bash "$APP_DIR/deploy/run-backup.sh"

echo "✅ Nightly backups enabled (03:17, kept 14 days) in $BACKUP_DIR"
echo "   Restore: gunzip -c /opt/ssf-backups/FILE.sql.gz | docker compose exec -T db psql -U ssf ssf_guide"
echo "   ⚠️ Backups live on this VPS — download important ones off-server periodically."