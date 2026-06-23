# Nutrition data source review

## Summary

The app uses a conservative nutrition-source architecture. It ships with a curated Diet Planner database for common gym-diet foods and supports user-entered foods, backend normalized-food cache, USDA FoodData Central, and Open Food Facts. Normal users do not enter external provider keys; the app owner configures provider credentials once on the backend through environment variables. Future providers should be added only after checking technical access, licensing, attribution, rate limits, and redistribution rules.

## Provider review

| Source | API available? | Key required? | Redistribution allowed? | Attribution required/requested? | Best use in this app | Limitations |
|---|---:|---:|---|---|---|---|
| USDA FoodData Central | Yes, REST API | Yes for production use through `api.data.gov`; `DEMO_KEY` is for limited evaluation | USDA states FDC data is public domain / CC0 | USDA requests FoodData Central be listed as the source | Generic foods, foundation foods, branded U.S. products, fallback enrichment | U.S.-centric, API limits, not every Italian/EU packaged product is covered |
| Open Food Facts | Yes | No | Database under ODbL; contents under Database Contents License; images have separate license | Attribution and share-alike obligations apply when reusing/combining database content | Packaged products, barcode/product lookup, fallback source | User-contributed data quality varies; share-alike can affect redistributed combined databases |
| EFSA / European resources | Data resources and standards exist | Depends on dataset | Dataset-specific | Dataset-specific | Research notes and future EU-aligned provider strategy | Not a simple macro lookup API for this MVP; licensing and data structure vary |
| Italian food composition databases, e.g. BDA/IEO | Online lookup available | Not treated as an app API here | Must be checked per source before embedding | Must be checked per source | Manual reference during curated-entry creation or future licensed provider | Do not bulk-copy without explicit compatible license |
| Curated local seed database | Local only | No | Owned/curated estimates in this project | No external attribution required except general source notes | Fast offline recognition of common gym foods in English/Italian | Estimates only; brand and preparation method vary |
| User custom foods | Local only | No | User-owned local data | No | Highest-priority corrections and brand-specific labels | Per-device unless exported/imported |

## Implementation notes

The backend provider shape is:

```js
NutritionProvider {
  id,
  name,
  enabled,
  requiresApiKey,
  search(query, userContext),
  getFood(id, userContext),
  normalizeFood(rawResult)
}
```

Current provider priority:

1. User custom foods.
2. Cached imported foods.
3. Curated local database.
4. USDA FoodData Central through backend-managed credentials.
5. Open Food Facts through the backend.
6. Manual entry.

## Policy for adding new datasets

- Do not embed a third-party dataset unless its license clearly allows redistribution in this app.
- Keep attribution metadata on imported records.
- Store provider ID, source ID, source URL, confidence, raw/cooked state, and verification timestamp.
- Treat brand/package values as product-specific, not universal.
- Keep user-edited foods higher priority than provider data.

## Frontend boundary

The frontend must call Diet Planner backend endpoints only. It must not call USDA FoodData Central, Open Food Facts, or other external nutrition provider APIs directly, and it must never store external provider credentials in IndexedDB, localStorage, source code, or settings.
