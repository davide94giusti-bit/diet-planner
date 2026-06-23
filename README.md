# Diet Planner MVP

Diet Planner is a mobile-first PWA with a Node/Render backend for cloud login, backend-managed nutrition-provider integrations, recipes, grocery planning, meal prep, body data, blood exams, macro tracking, and cloud account persistence.

## Current production architecture

```text
Browser frontend -> Render Node backend -> Supabase Postgres
```

Production data must flow through Diet Planner's own backend API routes. Do not connect the browser directly to Supabase. Do not add `supabase-js` to the frontend. Do not expose `DATABASE_URL`, USDA keys, or provider keys in browser code.

## Data storage model

When `DATABASE_URL` is configured, the backend stores durable cloud data in Supabase Postgres:

- users
- sessions
- recipes
- custom foods
- nutrition cache
- meal plans

Offline/demo data may remain local to the browser. Cloud account data is stored in Supabase Postgres through the Render backend. Cloud accounts are required for multi-device sync.

When `DATABASE_URL` is missing and `NODE_ENV` is not `production`, the backend can use `./backend/data/*.json` as a non-production fallback for local development only. `DIET_PLANNER_DATA_DIR` is not part of the production architecture and should not be used for the Render/Supabase deployment.

## Run locally

Requirements: Node.js 18 or newer.

```bash
cd diet-planner-mvp
cp .env.example .env
npm install
npm run check
npm start
```

Open:

```text
http://localhost:3000
```

Do not double-click `index.html` for normal testing. The backend serves both the app shell and `/api/...` endpoints from the same origin.

## Backend environment variables

Configure these only on the backend/server, not in frontend/static hosting variables:

```env
DATABASE_URL=your_supabase_transaction_pooler_connection_string
USDA_FDC_API_KEY=your_usda_key_here
OPENFOODFACTS_ENABLED=true
NUTRITION_CACHE_TTL_DAYS=30
DIET_PLANNER_AUTO_PROVISION=true
PORT=3000
```

For first Render testing, `DIET_PLANNER_AUTO_PROVISION=true` lets unknown users be created automatically on login. After test accounts are no longer needed, use:

```env
DIET_PLANNER_AUTO_PROVISION=false
```

Users only log in to Diet Planner. Users do not need USDA, Open Food Facts, Supabase, or external provider API keys. API keys are configured once on the backend using Render environment variables.

## Render deployment

Render service settings:

```text
Build Command: npm install
Start Command: npm start
```

Required Render environment variables:

```env
DATABASE_URL=your_supabase_transaction_pooler_connection_string
USDA_FDC_API_KEY=your_usda_key_here
OPENFOODFACTS_ENABLED=true
NUTRITION_CACHE_TTL_DAYS=30
DIET_PLANNER_AUTO_PROVISION=true
```

Do not add `DIET_PLANNER_DATA_DIR` for this production architecture.

## Main backend endpoints

Nutrition and providers:

- `GET /api/nutrition/providers`
- `GET /api/nutrition/search?q=`
- `GET /api/nutrition/food/:provider/:id`
- `POST /api/nutrition/custom-foods`

Auth/user:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/users/me`

Recipes:

- `GET /api/recipes`
- `POST /api/recipes`
- `PUT /api/recipes/:id`
- `DELETE /api/recipes/:id`

Meal plans:

- `GET /api/meal-plans`
- `POST /api/meal-plans`
- `GET /api/meal-plans/:id`
- `PUT /api/meal-plans/:id`

## Nutrition provider priority

1. User custom foods
2. User cached foods
3. Curated Diet Planner database
4. USDA FoodData Central through backend-managed credentials
5. Open Food Facts through backend
6. Manual entry

Normalized foods are cached in Postgres with provider/source metadata and expiry based on `NUTRITION_CACHE_TTL_DAYS`. Browser data may also be cached locally for offline use.

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

Recipes are a dedicated top-level section, not only a Settings panel.

## Commands

```bash
npm start      # run backend + frontend locally
npm run dev    # same as npm start for this MVP
npm run check  # syntax check frontend and backend modules
```

## Validation checklist

With a valid `DATABASE_URL`, run:

```bash
npm install
npm run check
npm start
```

Then test:

```http
GET /api/nutrition/providers
POST /api/auth/login
GET /api/users/me
POST /api/nutrition/custom-foods
GET /api/nutrition/search?q=chicken
GET /api/recipes
POST /api/recipes
PUT /api/recipes/:id
DELETE /api/recipes/:id
```

Persistence test:

1. Create/login as a test user.
2. Create a recipe.
3. Create a custom food.
4. Search a USDA/Open Food Facts item so it gets cached.
5. Stop and restart the server.
6. Confirm the user, recipe, custom food, and nutrition cache still exist.
7. Redeploy/restart simulation should not erase data because durable cloud data is in Supabase Postgres.
