# Deploying SSF Guide Nepal to a Hostinger VPS

Stack per `docker-compose.yml`: **Next.js app + PostgreSQL 16 (pgvector) + Caddy** (automatic HTTPS via Let's Encrypt).

## Prerequisites

1. A Hostinger **VPS** (KVM 1 or bigger) running **Ubuntu 22.04/24.04** — plain Ubuntu, not a panel template.
2. **DNS:** in your domain manager, add an **A record** for `ssf.digitalsolutionnepal.com` pointing to the VPS IP. (HTTPS certificates only issue after DNS resolves to the VPS.)
3. If this GitHub repository is private, the VPS needs access to clone it — easiest is a fine-grained **personal access token** used in the clone URL, or make the repo public.

## Option A — Auto-deploy from GitHub (recommended, zero VPS commands)

The `Deploy to VPS` workflow bootstraps everything over SSH: installs Docker, opens the firewall, clones the repo, writes `.env`, builds, and starts. Every later push redeploys automatically.

**1. Create an SSH key pair** (on any machine, or in Hostinger's browser terminal):

```bash
ssh-keygen -t ed25519 -f deploy_key -N ""
cat deploy_key.pub >> ~/.ssh/authorized_keys    # run this ON the VPS
cat deploy_key                                   # this private key goes to GitHub
```

(In hPanel you can also add the public key under **VPS → Settings → SSH keys**.)

**2. Add repository secrets** — GitHub → repo → Settings → Secrets and variables → Actions → *New repository secret*:

| Secret | Value |
|--------|-------|
| `VPS_HOST` | VPS IP address (from hPanel → VPS overview) |
| `VPS_USER` | `root` |
| `VPS_SSH_KEY` | contents of the `deploy_key` private key file |
| `GEMINI_API_KEY` | your Gemini key (written into the VPS `.env` on first deploy) |

**3. Run it** — GitHub → **Actions** tab → *Deploy to VPS* → **Run workflow** (pick the branch). Later pushes to `main` or the working branch redeploy automatically.

**4. Point DNS** — in your DNS manager (hPanel → Domains → digitalsolutionnepal.com → DNS records) add:

| Type | Name | Content | TTL |
|------|------|---------|-----|
| A | `ssf` | VPS IP address | 300 |

HTTPS activates automatically (Let's Encrypt via Caddy) once the record propagates — the deploy itself doesn't wait for DNS.

## Option B — Manual first-time setup (one command)

SSH into the VPS (or use Hostinger's **Browser terminal** in hPanel) as root and run:

```bash
curl -fsSL https://raw.githubusercontent.com/digitalsolution2078/SSF-Guide-/claude/ssf-guide-setup-vm4w43/deploy/setup-vps.sh -o setup-vps.sh
bash setup-vps.sh
```

For a **private repo**, pass a token in the URL instead:

```bash
REPO_URL="https://<TOKEN>@github.com/digitalsolution2078/SSF-Guide-.git" bash setup-vps.sh
```

The script installs Docker, opens firewall ports 22/80/443, clones the repo to `/opt/ssf-guide`, generates a `.env` with a random database password, builds, and starts everything.

## After setup

1. **Add the Gemini key** (the generated `.env` has it empty):
   ```bash
   nano /opt/ssf-guide/.env        # set GEMINI_API_KEY=...
   cd /opt/ssf-guide && docker compose up -d
   ```
2. Visit `https://ssf.digitalsolutionnepal.com` — Caddy fetches the TLS certificate automatically on first request once DNS points at the VPS.

## Updating to a new version

```bash
cd /opt/ssf-guide
git pull
docker compose up -d --build
```

With Option A configured, updates are automatic — every push to `main` or the working branch redeploys, and the workflow can always be run manually from the Actions tab.

## Operations

```bash
cd /opt/ssf-guide
docker compose ps                     # status
docker compose logs -f app            # app logs
docker compose logs -f caddy          # TLS/proxy logs
docker compose exec db pg_dump -U ssf ssf_guide > backup_$(date +%F).sql   # backup
```

Nightly backups: add the pg_dump line to `crontab -e`, and copy the file off the VPS (spec §6.7 requires offsite retention).

## Notes

- Database data persists in the `db_data` Docker volume; app rebuilds never touch it.
- Migrations run automatically on every app start (`prisma migrate deploy`), and the idempotent seed tops up reference data.
- The `.env` on the VPS is the only place secrets live — never commit it.
