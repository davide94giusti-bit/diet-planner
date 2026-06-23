# Deployment

## What you are deploying

This project is a single Node app:

- `backend/server.js` serves the frontend files.
- `backend/server.js` also serves `/api/...` backend endpoints.
- The frontend must be opened from the backend origin, for example `https://your-domain.com`, not as a standalone static file.

## Required production environment variables

Set these in the host's backend/server environment:

```env
USDA_FDC_API_KEY=your_usda_key_here
OPENFOODFACTS_ENABLED=true
NUTRITION_CACHE_TTL_DAYS=30
PORT=3000
DIET_PLANNER_AUTO_PROVISION=false
DIET_PLANNER_DATA_DIR=/var/lib/diet-planner
```

Notes:

- `USDA_FDC_API_KEY` must stay server-side only.
- `OPENFOODFACTS_ENABLED` controls whether the backend calls Open Food Facts.
- `NUTRITION_CACHE_TTL_DAYS` controls backend normalized-food cache freshness.
- `DIET_PLANNER_AUTO_PROVISION=false` is recommended for production unless you intentionally want anyone to self-create an account.
- `DIET_PLANNER_DATA_DIR` must point to durable storage if you keep the JSON-file MVP persistence layer.

## Fast deployment path: Node app host

Use a host that can run a normal long-lived Node server.

Typical settings:

```text
Build command: npm install
Start command: npm start
Runtime: Node 18+
Port: use the platform-provided PORT environment variable
```

After deployment:

1. Open the hosted URL.
2. Log in with a Diet Planner account.
3. Go to Settings > Nutrition Sources.
4. Confirm providers show as connected through Diet Planner Cloud.
5. Search for a food and confirm the frontend never asks for a provider API key.

## VPS deployment path

On a Linux server:

```bash
sudo apt update
sudo apt install -y nodejs npm nginx
cd /opt
sudo git clone YOUR_REPO_URL diet-planner-mvp
cd diet-planner-mvp
sudo cp .env.example .env
sudo nano .env
npm install
npm run check
npm start
```

For production, run the app with a process manager such as systemd or pm2 and put Nginx/Caddy in front of it for HTTPS.

Example reverse proxy target:

```text
http://127.0.0.1:3000
```

## Docker-style deployment

A minimal Dockerfile can be added later. The app only needs:

```text
node:18+
working directory with project files
npm install
npm start
```

Mount a persistent volume for `DIET_PLANNER_DATA_DIR` if you use the MVP JSON store.

## Static hosting warning

Do not deploy only `index.html`, `app.js`, and `styles.css` for production. Static-only hosting will load the UI but these features will fail or degrade:

- Cloud login
- `/api/users/me`
- Nutrition provider status
- USDA lookup
- Open Food Facts lookup
- Backend recipe sync
- Cross-device sync path

Static-only is acceptable only for offline/demo UI testing.

## Phone testing

Local network test:

1. Run `npm start` on your computer.
2. Find your computer's local IP address.
3. Open `http://YOUR_LOCAL_IP:3000` on your phone.

Hosted HTTPS test:

1. Open the deployed HTTPS URL on your phone.
2. Log in.
3. Open Dashboard, Weekly Plan, Recipes, and Settings.
4. Install/Add to Home Screen.
5. Reopen once online so the PWA shell caches.
6. Test offline reopening after the first successful load.

## Production hardening checklist

Before public release:

- Replace JSON files with a real database.
- Add password reset and email verification.
- Disable automatic account provisioning if accounts are invitation-only.
- Add durable session storage.
- Add HTTPS and secure cookie settings behind a production proxy.
- Add structured logging and monitoring.
- Add database backups.
- Add stricter rate limits for nutrition search.
