# Siphon — Hosting quickstart (test → live domain)

A concrete path from zero to a working, TLS-secured deployment. Two things get
hosted: the **API** (does the actual downloading; needs a server that can run
Docker or Node + yt-dlp + ffmpeg) and the **web app** (static files). Static-only
hosts (GitHub Pages, plain Netlify) are **not enough by themselves** — the web
app is a frontend for the API.

---

## 0. Test locally first

```bash
# Terminal 1 — API (or use Docker, see below)
cd siphon/backend
cp .env.example .env                  # set SIGNING_SECRET to anything long
npm install && npm run dev            # → http://localhost:8787

# Terminal 2 — web app
cd siphon/web
npm install && npm run dev            # → http://localhost:5173
```

Open http://localhost:5173, paste a YouTube link, pick a quality — the file
should download. (`yt-dlp` and `ffmpeg` must be installed and on PATH for the
non-Docker path: `pip install yt-dlp` / `apt install ffmpeg`.)

**Android testing:**

- Emulator: install the **debug APK** — it already points at
  `http://10.0.2.2:8787` (your machine's localhost).
- Physical phone on the same Wi-Fi: build with your PC's LAN IP —
  `./gradlew :app:assembleDebug -PsiphonApiBaseUrl=http://192.168.1.20:8787`
  (debug builds allow plain HTTP; release builds require HTTPS).
- Install: `adb install app/build/outputs/apk/debug/app-debug.apk`, or copy
  the APK to the phone and open it (allow "install unknown apps").
- Test the flagship flow: open YouTube → Share → **Save with Siphon**.

## 1. Get a server + domain

- Any small VPS works to start: 2 vCPU / 2–4 GB RAM / 40 GB disk
  (Hetzner CX22, DigitalOcean, Lightsail…). Ubuntu 22.04+.
- Buy a domain anywhere (Namecheap, Cloudflare, …).

**DNS**: in your domain's DNS panel add two **A records** pointing to the
VPS's public IP:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` (or `siphon`) | `<VPS IP>` — serves the web app |
| A | `api` | `<VPS IP>` — serves the API |

Propagation is usually minutes. Verify with `dig +short yourdomain.com`.

## 2. Run the API on the VPS

```bash
ssh root@<VPS-IP>
apt update && apt install -y docker.io docker-compose-v2 nginx certbot python3-certbot-nginx git
git clone <your repo> && cd pixxelpulse/siphon/backend

SIGNING_SECRET=$(openssl rand -hex 32) \
ALLOWED_ORIGINS=https://yourdomain.com \
docker compose up --build -d

curl http://127.0.0.1:8787/readyz     # → {"status":"ready",...}
```

## 3. Put the web build on the VPS

Build locally (`cd siphon/web && npm run build`) or grab the
`siphon-web-dist` artifact from GitHub Actions, then:

```bash
scp -r dist/* root@<VPS-IP>:/var/www/siphon/
```

## 4. nginx: one site for web, one for API, then TLS

`/etc/nginx/sites-available/siphon`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/siphon;
    location / { try_files $uri /index.html; }
    # Same-origin API proxy — the web app calls /api/... relatively
    location /api/ {
        proxy_pass http://127.0.0.1:8787;
        proxy_buffering off;
        proxy_read_timeout 1200s;
    }
}

server {
    listen 80;
    server_name api.yourdomain.com;   # used by the Android app
    location / {
        proxy_pass http://127.0.0.1:8787;
        proxy_buffering off;
        proxy_read_timeout 1200s;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/siphon /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d yourdomain.com -d api.yourdomain.com   # free TLS, auto-renew
```

Now `https://yourdomain.com` is the product and
`https://api.yourdomain.com/healthz` returns `{"status":"ok"}`.

## 5. Point the Android app at your domain

Build the release APK against your API and sign it:

```bash
cd siphon/android
./gradlew :app:assembleRelease -PsiphonApiBaseUrl=https://api.yourdomain.com
```

The CI workflow (`.github/workflows/siphon-build.yml`) produces an unsigned
release APK; sign it with `apksigner` and your keystore, or configure
`signingConfigs` / Play App Signing for Play Store distribution
(`:app:bundleRelease` for the AAB).

## Maintenance

- **yt-dlp goes stale** as platforms change — rebuild the API image weekly:
  `docker compose build --pull && docker compose up -d`.
- Watch disk: proxied downloads buffer in the container's `/tmp` (tmpfs).
- Logs: `docker compose logs -f api` (JSON, pino).
