# Claude for Chrome — SSF Guide Nepal Deployment Prompt

Copy everything below the line into Claude for Chrome. Fill in the two `<<<PLACEHOLDERS>>>` first.

---

You are deploying the **SSF Guide Nepal** web platform from GitHub to a Hostinger VPS. Work step by step, verify each step before the next, and follow the safety rules absolutely.

## ⛔ SAFETY RULES (highest priority)

This VPS (`1285482`) already hosts **multiple production websites**. You must not disturb them:

1. NEVER stop, restart, delete, or reconfigure any existing service, container, website, database, cron job, or config file on the VPS. Do not run `systemctl stop/restart`, `docker stop/rm`, `rm`, or edit any existing file.
2. ONLY run the exact commands written in this prompt — nothing improvised on the VPS.
3. Do not enable/disable any firewall and do not change any DNS record except the single new `ssf` A record in Step 5.
4. Do not touch, reset, or reveal the VPS root password; do not change SSH settings beyond appending one key line as instructed.
5. On GitHub, work only in the repository `digitalsolution2078/SSF-Guide-`: only add the 4 secrets and run the one workflow. Do not change repo settings, branches, webhooks, or collaborators.
6. If anything looks different from what this prompt describes, or a command returns an unexpected error: STOP and report exactly what you see. Do not improvise a fix.

## Step 1 — VPS: add deploy key and inspect (browser terminal)

1. Open `https://hpanel.hostinger.com/vps/1285482/overview`
2. Note the **IP address** shown on the overview — call it `VPS_IP`. You will need it in Steps 2 and 5.
3. Open the **Browser terminal** (button on the overview page) and log in as `root` (the user will enter the password if prompted — never ask them to tell it to you).
4. Paste exactly this one command and press Enter:
   ```
   mkdir -p ~/.ssh && echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIE2RL28eg3Jfyk/Ma7WOglBmVvXgGf883einvvwYhBvu ssf-guide-deploy" >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys && echo KEY-ADDED
   ```
   Confirm it prints `KEY-ADDED`.
5. Then paste exactly this read-only inspection command and record its full output for the final report:
   ```
   echo "=PORTS="; ss -tlnp | grep -E '[:.](80|443)\s' || echo none; echo "=DOCKER="; docker ps --format '{{.Names}} {{.Ports}}' 2>/dev/null || echo no-docker; echo "=DISK="; df -h / | tail -1
   ```
   This changes nothing — it only shows which web server owns ports 80/443, existing containers, and free disk. Do not act on this output; just record it.

## Step 2 — GitHub: add the four repository secrets

1. Open `https://github.com/digitalsolution2078/SSF-Guide-/settings/secrets/actions`
2. Using **New repository secret**, create exactly these four (names must match exactly):
   - Name `VPS_HOST` → value: the `VPS_IP` from Step 1
   - Name `VPS_USER` → value: `root`
   - Name `VPS_SSH_KEY` → value: the entire private key below, including the BEGIN/END lines:
     ```
     <<<PASTE THE ed25519 PRIVATE KEY BLOCK HERE>>>
     ```
   - Name `GEMINI_API_KEY` → value:
     ```
     <<<PASTE THE GEMINI API KEY HERE>>>
     ```
3. Verify all four appear in the secrets list.

## Step 3 — GitHub: run the deploy workflow

1. Open `https://github.com/digitalsolution2078/SSF-Guide-/actions/workflows/deploy.yml`
2. Click **Run workflow**, select branch **`claude/ssf-guide-setup-vm4w43`**, click the green **Run workflow** button.
3. Open the run and watch it. It takes ~5–10 minutes (it installs Docker on the VPS, clones the repo to `/opt/ssf-guide`, builds the image, starts the app and its own PostgreSQL).
4. The workflow log ends with either:
   - `Ports 80/443 free — starting full stack with Caddy HTTPS` — site will be reachable at `http://VPS_IP`, **or**
   - `Ports 80/443 are in use by an existing web server` — the app runs safely on `127.0.0.1:3001` instead, deliberately NOT touching the existing sites. This is expected on this VPS and is a success, not an error.
5. If the run fails (red): open the failed step, copy the last ~40 log lines, and include them verbatim in your final report. Do not retry more than once and do not modify anything to "fix" it.

## Step 4 — Verify

- If the log said Caddy started: open `http://VPS_IP` in a new tab — the SSF Guide Nepal homepage (purple, Nepali text "SSF सम्बन्धी सबै जानकारी, अब एउटै ठाउँमा") should load.
- If the log said ports were busy: verification happens in the terminal — in the hPanel browser terminal run exactly:
  ```
  curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3001/
  ```
  `200` means the app is running correctly behind the port. (Connecting the domain to it then needs one vhost in the existing web server — do NOT attempt this yourself; just report which web server Step 1 found on ports 80/443.)

## Step 5 — DNS record

1. Open `https://hpanel.hostinger.com` → **Domains** → `digitalsolutionnepal.com` → **DNS / Name Servers** (DNS records).
2. Add ONE new record (change nothing else): Type `A`, Name `ssf`, Points to `VPS_IP`, TTL `300` — then save.
3. Confirm the new `ssf` record appears in the list. Do not edit or delete any other record.

## Final report

Reply with: the `VPS_IP`; the Step 1 inspection output (ports/docker/disk); whether the workflow went green and which mode it chose (Caddy or 127.0.0.1:3001); the verification result from Step 4; and confirmation the `ssf` A record was added.
