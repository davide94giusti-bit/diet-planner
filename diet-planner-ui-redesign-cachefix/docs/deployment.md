# Deployment

## Target architecture

```text
Browser frontend -> Render Node backend -> Supabase Postgres
```

This project is a single Node app:

- `backend/server.js` serves the frontend files.
- `backend/server.js` serves `/api/...` backend endpoints.
- `backend/db.js` initializes the Postgres schema through `DATABASE_URL`.
- `backend/storage.js` routes durable cloud data to Postgres when `DATABASE_URL` is configured.

The frontend must be opened from the backend origin, for example `https://your-domain.com`, not as a standalone static file.

## Required production environment variables

Set these in Render's backend/server environment:

```env
DATABASE_URL=your_supabase_transaction_pooler_connection_string
USDA_FDC_API_KEY=your_usda_key_here
OPENFOODFACTS_ENABLED=true
NUTRITION_CACHE_TTL_DAYS=30
DIET_PLANNER_AUTO_PROVISION=true
```

Notes:

- `DATABASE_URL` is required for production durable storage.
- `USDA_FDC_API_KEY` must stay server-side only.
- `OPENFOODFACTS_ENABLED` controls whether the backend calls Open Food Facts.
- `NUTRITION_CACHE_TTL_DAYS` controls normalized-food cache freshness.
- `DIET_PLANNER_AUTO_PROVISION=true` is useful for initial testing; set `DIET_PLANNER_AUTO_PROVISION=false` after test account creation is no longer needed.
- Do not use `DIET_PLANNER_DATA_DIR` for this production architecture.

## Render deployment settings

Use a normal Node Web Service.

```text
Build Command: npm install
Start Command: npm start
Runtime: Node 18+
Port: use Render's PORT environment variable
```

After deployment:

1. Open the Render URL.
2. Log in with a Diet Planner account.
3. Go to Settings > Nutrition Sources.
4. Confirm providers show as connected through Diet Planner Cloud.
5. Search for a food and confirm the frontend never asks for a provider API key.
6. Create a recipe and custom food.
7. Restart/redeploy the Render service and confirm the data remains available.

## Supabase Postgres notes

Use the Supabase transaction pooler connection string as `DATABASE_URL` when possible. The backend uses `pg.Pool` with SSL configured as:

```js
ssl: { rejectUnauthorized: false }
```

On startup, the backend creates these tables if missing:

- `users`
- `sessions`
- `recipes`
- `custom_foods`
- `nutrition_cache`
- `meal_plans`

Do not expose Supabase credentials to the frontend. Users only authenticate with Diet Planner; they do not need Supabase, USDA, Open Food Facts, or other provider accounts.

## Local development

```bash
cp .env.example .env
npm install
npm run check
npm start
```

For local Postgres testing, put a valid `DATABASE_URL` in `.env`. If `DATABASE_URL` is missing and `NODE_ENV` is not `production`, the backend uses `./backend/data/*.json` as a non-production fallback only.

## Static hosting warning

Do not deploy only `index.html`, `app.js`, and `styles.css` for production. Static-only hosting will load the UI but these features will fail or degrade:

- Cloud login
- `/api/users/me`
- Nutrition provider status
- USDA lookup
- Open Food Facts lookup
- Backend recipe sync
- Cloud account persistence
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

- Set `DIET_PLANNER_AUTO_PROVISION=false` unless self-signup is intentional.
- Add password reset and email verification.
- Add backups for Supabase Postgres.
- Add stricter rate limits for auth and nutrition search.
- Add structured logging and monitoring.
- Review secure-cookie behavior behind HTTPS.
- Add account administration/invite flows if needed.
