# MUI frontend migration plan

## Current decision

A full React + Vite + MUI rewrite was not completed in this patch because the current app is a working static PWA with IndexedDB persistence, service worker cache, export/import, dashboard generation, macro optimizer, and meal checklist logic. Rewriting the full UI in one iteration would increase regression risk.

This patch implements a MUI-compatible UI layer in the static app and prepares clean migration seams.

## Recommended staged migration

### Stage 1 - Extract pure modules

Move the following from `app.js` into framework-neutral modules:

- `db.js` - IndexedDB helpers and migrations.
- `i18n.js` - translation dictionaries and `tr` helper.
- `nutrition/foods.js` - seed foods, normalization, lookup.
- `nutrition/providers.js` - provider interface and USDA/Open Food Facts adapters.
- `planner/macros.js` - macro math and optimizer.
- `planner/baseline.js` - baseline parser.
- `recipes/recipes.js` - recipe normalization and macro calculation.

### Stage 2 - Create React + Vite shell

Add:

```bash
npm create vite@latest diet-planner-react -- --template react
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install vite-plugin-pwa
```

### Stage 3 - MUI components

Map existing UI to MUI:

- App shell: `AppBar`, `Toolbar`, `BottomNavigation`, `BottomNavigationAction`.
- Cards: `Card`, `CardActionArea`, `Stack`, `Chip`.
- Panels: `Dialog`, `Drawer`, `Slide`, `Fade`.
- Forms: `TextField`, `Select`, `Menu`, `MenuItem`, `Button`.
- Feedback: `Snackbar`, `Alert`, `LinearProgress`.

### Stage 4 - Preserve IndexedDB

Keep the existing database name and migrations:

- `diet-planner-local-db`
- current version: `3`

Test that old v2 data migrates to v3 without wiping plans, foods, settings, baseline, profiles, and exports.

### Stage 5 - PWA build

Use Vite build output as static assets:

```bash
npm install
npm run dev
npm run build
npm run preview
```

Deploy `dist/` to Vercel, Netlify, Cloudflare Pages, or GitHub Pages.
