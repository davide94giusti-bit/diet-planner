# Diet Planner MVP

Diet Planner is a mobile-first PWA with a Node backend for cloud login, backend-managed nutrition-provider integrations, recipe management, grocery planning, meal prep, body data, blood exams, and macro tracking.

## Current architecture

- The browser serves the PWA UI and stores an offline cache in IndexedDB.
- The frontend calls Diet Planner's own backend endpoints under `/api/...`.
- Normal users log in to Diet Planner only.
- Normal users do **not** enter USDA, Open Food Facts, or other external provider API keys.
- External nutrition provider credentials are configured once by the app owner as backend environment variables.
- Local profiles remain available as offline/demo mode.
- Cloud accounts are the production path for login and multi-device sync.

## Run locally

Requirements: Node.js 18 or newer.

```bash
cd diet-planner-mvp
cp .env.example .env
npm start
```

Open:

```text
http://localhost:3000
```

Do not double-click `index.html` for normal testing. The backend serves both the app shell and `/api/...` endpoints from the same origin.

## Local test login

For local development, `.env.example` enables account auto-provisioning:

```env
DIET_PLANNER_AUTO_PROVISION=true
```

You can log in with any normal-looking test email and password, for example:

```text
Email: test@example.com
Password: test1234
```

## Backend environment variables

Configure these only on the server/backend:

```env
USDA_FDC_API_KEY=
OPENFOODFACTS_ENABLED=true
NUTRITION_CACHE_TTL_DAYS=30
PORT=3000
DIET_PLANNER_AUTO_PROVISION=true
DIET_PLANNER_DATA_DIR=./backend/data
```

Important: never put provider keys in frontend code, browser settings, localStorage, IndexedDB, or static hosting variables exposed to the client.

## Main backend endpoints

Nutrition and providers:

- `GET /api/nutrition/providers`
- `GET /api/nutrition/search?q=`
- `GET /api/nutrition/food/:provider/:id`
- `POST /api/nutrition/custom-foods`

Recipes:

- `GET /api/recipes`
- `POST /api/recipes`
- `PUT /api/recipes/:id`
- `DELETE /api/recipes/:id`

Auth/user:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/users/me`

Meal plans:

- `GET /api/meal-plans`
- `POST /api/meal-plans`

## Nutrition provider priority

1. User custom foods
2. User cached foods
3. Curated Diet Planner database
4. USDA FoodData Central through backend-managed credentials
5. Open Food Facts through backend
6. Manual entry

Normalized foods are cached in the backend with provider/source metadata. Browser data may also be cached locally for offline use.

## App sections

The left navigation contains primary page sections:

- Dashboard
- Weekly Plan
- Grocery List
- Meal Prep
- Body Data
- Blood Exams
- Analysis
- Recipes
- Settings

Recipes are now a dedicated top-level section, not only a Settings panel.

## Commands

```bash
npm start      # run backend + frontend locally
npm run dev    # same as npm start for this MVP
npm run check  # syntax check app.js and backend/server.js
```

## Production notes

The MVP backend uses JSON files for persistence. For production, replace this with a durable database and proper account/session storage before onboarding real users.

See `docs/deployment.md` for deployment steps.
