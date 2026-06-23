'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const ROOT_DIR = path.resolve(__dirname, '..');
loadDotEnv(path.join(ROOT_DIR, '.env'));
const DATA_DIR = process.env.DIET_PLANNER_DATA_DIR || path.join(__dirname, 'data');
const PORT = Number(process.env.PORT || 3000);
const USDA_FDC_API_KEY = process.env.USDA_FDC_API_KEY || '';
const OPENFOODFACTS_ENABLED = /^(1|true|yes|on)$/i.test(process.env.OPENFOODFACTS_ENABLED || 'true');
const NUTRITION_CACHE_TTL_DAYS = Number(process.env.NUTRITION_CACHE_TTL_DAYS || 30);
const AUTO_PROVISION_ACCOUNTS = !/^(0|false|no|off)$/i.test(process.env.DIET_PLANNER_AUTO_PROVISION || 'true');
const SESSION_COOKIE = 'dp_session';
const MAX_JSON_BYTES = 1_000_000;

function loadDotEnv(file) {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (!Object.prototype.hasOwnProperty.call(process.env, key)) process.env[key] = value;
  }
}

fs.mkdirSync(DATA_DIR, { recursive: true });

const files = {
  users: path.join(DATA_DIR, 'users.json'),
  sessions: path.join(DATA_DIR, 'sessions.json'),
  customFoods: path.join(DATA_DIR, 'custom-foods.json'),
  nutritionCache: path.join(DATA_DIR, 'nutrition-cache.json'),
  recipes: path.join(DATA_DIR, 'recipes.json'),
  mealPlans: path.join(DATA_DIR, 'meal-plans.json'),
};

const CURATED_FOODS = [
  curated('greek_yogurt_0', 'Greek yogurt 0%', ['greek yogurt', 'yogurt greco', 'yogurt greco 0'], 57, 10.3, 3.6, 0.2, 'Dairy & eggs', 'high'),
  curated('skyr_plain', 'Skyr plain', ['skyr', 'icelandic yogurt', 'yogurt islandese'], 63, 11, 4, 0.2, 'Dairy & eggs', 'high'),
  curated('oats', 'Oats', ['avena', 'fiocchi di avena'], 389, 16.9, 66.3, 6.9, 'Pasta, rice & grains', 'high'),
  curated('banana', 'Banana', ['banana', 'banane'], 89, 1.1, 22.8, 0.3, 'Fruit & vegetables', 'high'),
  curated('chicken_breast', 'Chicken breast', ['petto di pollo', 'pollo'], 165, 31, 0, 3.6, 'Meat & fish', 'high'),
  curated('rice_dry', 'Rice, dry weight', ['rice', 'riso', 'basmati rice', 'riso basmati'], 360, 7, 79, 0.6, 'Pasta, rice & grains', 'medium'),
  curated('olive_oil', 'Olive oil', ['olio evo', 'extra virgin olive oil', 'olio d oliva'], 884, 0, 0, 100, 'Pantry & condiments', 'high'),
  curated('rice_cakes', 'Rice cakes', ['gallette di riso', 'gallette'], 387, 8, 81, 3, 'Snacks', 'medium'),
  curated('bresaola', 'Bresaola', ['bresaola'], 151, 32, 0.5, 2.6, 'Meat & fish', 'medium'),
  curated('salmon', 'Salmon', ['salmone'], 208, 20, 0, 13, 'Meat & fish', 'medium'),
  curated('potatoes', 'Potatoes', ['patate', 'patata'], 77, 2, 17, 0.1, 'Fruit & vegetables', 'high'),
  curated('eggs', 'Eggs', ['uova', 'uovo'], 143, 12.6, 0.7, 9.5, 'Dairy & eggs', 'medium'),
  curated('tuna_natural', 'Tuna, natural', ['tonno al naturale', 'tonno'], 116, 26, 0, 1, 'Canned goods', 'medium'),
  curated('pasta_dry', 'Pasta, dry weight', ['pasta', 'spaghetti', 'penne'], 360, 13, 72, 1.5, 'Pasta, rice & grains', 'medium'),
  curated('whey_protein', 'Whey protein powder', ['whey', 'protein powder', 'proteine whey'], 390, 78, 8, 6, 'Supplements / protein products', 'low'),
  curated('almonds', 'Almonds', ['mandorle'], 579, 21, 22, 50, 'Pantry & condiments', 'medium'),
  curated('turkey_slices', 'Turkey breast slices', ['fesa di tacchino', 'tacchino'], 110, 23, 1, 1.5, 'Meat & fish', 'medium'),
  curated('cottage_cheese', 'Cottage cheese / fiocchi di latte', ['cottage cheese', 'fiocchi di latte'], 98, 11, 3.4, 4.3, 'Dairy & eggs', 'medium'),
];

const rateBuckets = new Map();

function curated(id, name, aliases, calories, protein, carbs, fat, department, confidence) {
  return normalizeFood({
    id,
    name,
    displayNameEn: name,
    displayNameIt: aliases.find((alias) => /[àèìòù]|^[a-z ]+$/.test(alias)) || name,
    aliases,
    caloriesPer100g: calories,
    proteinPer100g: protein,
    carbsPer100g: carbs,
    fatPer100g: fat,
    department,
    category: department,
    confidence,
    sourceProvider: 'curated_seed',
    sourceId: id,
    source: 'curated_seed',
    rawOrCookedState: inferFoodState(name),
    notes: 'Curated Diet Planner database value. Verify brand and raw/cooked state when precision matters.',
  });
}

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    const text = fs.readFileSync(file, 'utf8');
    return text.trim() ? JSON.parse(text) : fallback;
  } catch (error) {
    console.error(`Failed reading ${file}:`, error.message);
    return fallback;
  }
}

function writeJson(file, value) {
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2));
  fs.renameSync(tmp, file);
}

function nowIso() { return new Date().toISOString(); }
function addDays(date, days) { const d = new Date(date); d.setUTCDate(d.getUTCDate() + days); return d; }
function normalizeText(value) { return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
function randomId(prefix) { return `${prefix}_${crypto.randomBytes(16).toString('hex')}`; }

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(String(password), salt, 120000, 32, 'sha256').toString('hex');
  return { salt, hash };
}

function safeEqual(a, b) {
  const aa = Buffer.from(String(a || ''), 'hex');
  const bb = Buffer.from(String(b || ''), 'hex');
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map((part) => part.trim()).filter(Boolean).map((part) => {
    const index = part.indexOf('=');
    return index === -1 ? [part, ''] : [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
  }));
}

function getBearer(req) {
  const auth = req.headers.authorization || '';
  return auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';
}

function getSessionToken(req) {
  return getBearer(req) || parseCookies(req.headers.cookie || '')[SESSION_COOKIE] || '';
}

function getClientIp(req) {
  return String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
}

function getUserFromRequest(req) {
  const token = getSessionToken(req);
  if (!token) return null;
  const sessions = readJson(files.sessions, []);
  const session = sessions.find((item) => item.token === token && new Date(item.expiresAt).getTime() > Date.now());
  if (!session) return null;
  const users = readJson(files.users, []);
  const user = users.find((item) => item.id === session.userId);
  return user ? publicUser(user) : null;
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name || user.email,
    displayName: user.name || user.email,
    language: user.language || 'en',
    theme: user.theme || 'system',
    units: user.units || 'metric',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function json(res, status, payload, headers = {}) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    ...headers,
  });
  res.end(body);
}

function noContent(res, headers = {}) {
  res.writeHead(204, { 'Cache-Control': 'no-store', ...headers });
  res.end();
}

function methodNotAllowed(res) { json(res, 405, { error: 'Method not allowed' }); }
function notFound(res) { json(res, 404, { error: 'Not found' }); }
function unauthorized(res) { json(res, 401, { error: 'Authentication required' }); }

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let data = '';
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_JSON_BYTES) {
        reject(new Error('JSON body is too large'));
        req.destroy();
        return;
      }
      data += chunk;
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch { reject(new Error('Invalid JSON body')); }
    });
    req.on('error', reject);
  });
}

function rateLimit(req, user) {
  const key = user?.id || getClientIp(req);
  const now = Date.now();
  const windowMs = 60_000;
  const max = user ? 120 : 60;
  const bucket = rateBuckets.get(key) || { resetAt: now + windowMs, count: 0 };
  if (bucket.resetAt < now) {
    bucket.resetAt = now + windowMs;
    bucket.count = 0;
  }
  bucket.count += 1;
  rateBuckets.set(key, bucket);
  return bucket.count <= max;
}

function providerStatus() {
  return [
    { id: 'custom_foods', name: 'User custom foods', enabled: true, requiresApiKey: false, priority: 1 },
    { id: 'cache', name: 'User cached foods', enabled: true, requiresApiKey: false, priority: 2 },
    { id: 'curated_seed', name: 'Curated Diet Planner database', enabled: true, requiresApiKey: false, priority: 3 },
    { id: 'usda_fdc', name: 'USDA FoodData Central', enabled: Boolean(USDA_FDC_API_KEY), requiresApiKey: true, priority: 4 },
    { id: 'open_food_facts', name: 'Open Food Facts', enabled: OPENFOODFACTS_ENABLED, requiresApiKey: false, priority: 5 },
    { id: 'manual', name: 'Manual entry', enabled: true, requiresApiKey: false, priority: 6 },
  ];
}

function inferFoodState(name) {
  const n = String(name || '').toLowerCase();
  if (n.includes('dry') || n.includes('rice') || n.includes('pasta') || n.includes('oats')) return 'dry_raw';
  if (n.includes('oil') || n.includes('butter') || n.includes('honey')) return 'as_sold';
  if (n.includes('chicken') || n.includes('turkey') || n.includes('beef') || n.includes('salmon')) return 'raw_or_cooked_varies';
  return 'as_sold_or_raw';
}

function normalizeFood(food) {
  const name = String(food.name || food.description || 'Food').trim();
  const id = String(food.id || food.sourceId || randomId('food'));
  const sourceProvider = food.sourceProvider || food.provider || 'manual';
  return {
    id,
    name,
    displayNameEn: food.displayNameEn || name,
    displayNameIt: food.displayNameIt || name,
    aliases: [...new Set([...(food.aliases || []), name, food.displayNameEn, food.displayNameIt].filter(Boolean))],
    brand: food.brand || '',
    defaultUnit: food.defaultUnit || 'g',
    unitGrams: Number(food.unitGrams || food.gramsPerUnit || 100),
    gramsPerUnit: Number(food.gramsPerUnit || food.unitGrams || 100),
    caloriesPer100g: Number(food.caloriesPer100g || 0),
    proteinPer100g: Number(food.proteinPer100g || 0),
    carbsPer100g: Number(food.carbsPer100g || 0),
    fatPer100g: Number(food.fatPer100g || 0),
    fiberPer100g: nullableNumber(food.fiberPer100g),
    sugarPer100g: nullableNumber(food.sugarPer100g),
    sodiumPer100g: nullableNumber(food.sodiumPer100g),
    department: food.department || food.category || 'Other',
    category: food.category || food.department || 'Other',
    source: food.source || sourceProvider,
    sourceProvider,
    sourceId: String(food.sourceId || id),
    sourceUrl: food.sourceUrl || '',
    confidence: food.confidence || 'unknown',
    rawOrCookedState: food.rawOrCookedState || inferFoodState(name),
    notes: food.notes || 'Normalized backend food record. Verify labels when precision matters.',
    importedAt: food.importedAt || nowIso(),
    lastVerifiedAt: food.lastVerifiedAt || nowIso(),
    lastUpdated: food.lastUpdated || nowIso(),
    userEdited: Boolean(food.userEdited),
    userId: food.userId || null,
    minG: Number(food.minG ?? 0),
    maxG: Number(food.maxG ?? 1000),
  };
}

function nullableNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function matchesFood(food, query) {
  const q = normalizeText(query);
  if (!q) return true;
  return [food.name, food.displayNameEn, food.displayNameIt, food.brand, ...(food.aliases || [])].some((value) => normalizeText(value).includes(q));
}

function cacheKey(provider, id) { return `${provider}:${id}`; }
function cacheIsFresh(item) { return !item.expiresAt || new Date(item.expiresAt).getTime() > Date.now(); }

function readCache() { return readJson(files.nutritionCache, []); }
function writeCache(cache) { writeJson(files.nutritionCache, cache); }

function upsertCachedFoods(foods) {
  if (!foods.length) return;
  const cache = readCache().filter(cacheIsFresh);
  const byKey = new Map(cache.map((item) => [cacheKey(item.sourceProvider, item.sourceId), item]));
  const expiresAt = addDays(new Date(), NUTRITION_CACHE_TTL_DAYS).toISOString();
  for (const food of foods.map(normalizeFood)) {
    if (!food.sourceProvider || !food.sourceId) continue;
    byKey.set(cacheKey(food.sourceProvider, food.sourceId), { ...food, cachedAt: nowIso(), expiresAt });
  }
  writeCache([...byKey.values()]);
}

const Providers = {
  custom_foods: {
    id: 'custom_foods',
    name: 'User custom foods',
    enabled: true,
    requiresApiKey: false,
    search(query, userContext) {
      const foods = readJson(files.customFoods, []);
      return foods.filter((food) => (!food.userId || food.userId === userContext.userId) && matchesFood(food, query)).slice(0, 12);
    },
    getFood(id, userContext) {
      const foods = readJson(files.customFoods, []);
      return foods.find((food) => food.id === id && (!food.userId || food.userId === userContext.userId)) || null;
    },
    normalizeFood,
  },
  cache: {
    id: 'cache',
    name: 'User cached foods',
    enabled: true,
    requiresApiKey: false,
    search(query) {
      return readCache().filter(cacheIsFresh).filter((food) => matchesFood(food, query)).slice(0, 12);
    },
    getFood(id) {
      return readCache().filter(cacheIsFresh).find((food) => food.id === id || food.sourceId === id) || null;
    },
    normalizeFood,
  },
  curated_seed: {
    id: 'curated_seed',
    name: 'Curated Diet Planner database',
    enabled: true,
    requiresApiKey: false,
    search(query) { return CURATED_FOODS.filter((food) => matchesFood(food, query)).slice(0, 12); },
    getFood(id) { return CURATED_FOODS.find((food) => food.id === id || food.sourceId === id) || null; },
    normalizeFood,
  },
  usda_fdc: {
    id: 'usda_fdc',
    name: 'USDA FoodData Central',
    enabled: Boolean(USDA_FDC_API_KEY),
    requiresApiKey: true,
    async search(query) {
      if (!USDA_FDC_API_KEY) return [];
      const params = new URLSearchParams({ query, pageSize: '8', api_key: USDA_FDC_API_KEY });
      const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?${params.toString()}`);
      if (!response.ok) throw new Error(`USDA HTTP ${response.status}`);
      const data = await response.json();
      const foods = (data.foods || []).map(normalizeUsdaFood).filter(hasMacros);
      upsertCachedFoods(foods);
      return foods;
    },
    async getFood(id) {
      const cached = Providers.cache.getFood(id);
      if (cached?.sourceProvider === 'usda_fdc') return cached;
      if (!USDA_FDC_API_KEY) return null;
      const params = new URLSearchParams({ api_key: USDA_FDC_API_KEY });
      const response = await fetch(`https://api.nal.usda.gov/fdc/v1/food/${encodeURIComponent(id)}?${params.toString()}`);
      if (!response.ok) throw new Error(`USDA HTTP ${response.status}`);
      const food = normalizeUsdaFood(await response.json());
      upsertCachedFoods([food]);
      return food;
    },
    normalizeFood: normalizeUsdaFood,
  },
  open_food_facts: {
    id: 'open_food_facts',
    name: 'Open Food Facts',
    enabled: OPENFOODFACTS_ENABLED,
    requiresApiKey: false,
    async search(query) {
      if (!OPENFOODFACTS_ENABLED) return [];
      const params = new URLSearchParams({ search_terms: query, search_simple: '1', action: 'process', json: '1', page_size: '8', fields: 'code,product_name,brands,nutriments,categories_tags,url' });
      const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?${params.toString()}`);
      if (!response.ok) throw new Error(`Open Food Facts HTTP ${response.status}`);
      const data = await response.json();
      const foods = (data.products || []).map(normalizeOffFood).filter(hasMacros);
      upsertCachedFoods(foods);
      return foods;
    },
    async getFood(id) {
      const cached = Providers.cache.getFood(id);
      if (cached?.sourceProvider === 'open_food_facts') return cached;
      if (!OPENFOODFACTS_ENABLED) return null;
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(id)}.json?fields=code,product_name,brands,nutriments,categories_tags,url`);
      if (!response.ok) throw new Error(`Open Food Facts HTTP ${response.status}`);
      const data = await response.json();
      const food = data.product ? normalizeOffFood(data.product) : null;
      if (food) upsertCachedFoods([food]);
      return food;
    },
    normalizeFood: normalizeOffFood,
  },
  manual: {
    id: 'manual',
    name: 'Manual entry',
    enabled: true,
    requiresApiKey: false,
    search() { return []; },
    getFood() { return null; },
    normalizeFood,
  },
};

function hasMacros(food) {
  return Boolean(Number(food.caloriesPer100g) || Number(food.proteinPer100g) || Number(food.carbsPer100g) || Number(food.fatPer100g));
}

function usdaNutrient(food, ids, names = []) {
  const nutrients = food.foodNutrients || [];
  const row = nutrients.find((n) => ids.includes(String(n.nutrientId || n.nutrientNumber || n.nutrient?.id || '')) || names.some((name) => normalizeText(n.nutrientName || n.nutrient?.name || '').includes(name)));
  return Number(row?.value ?? row?.amount ?? 0);
}

function normalizeUsdaFood(food) {
  return normalizeFood({
    id: `usda_${food.fdcId}`,
    name: food.description || 'USDA food',
    brand: food.brandOwner || food.dataType || 'USDA FoodData Central',
    caloriesPer100g: usdaNutrient(food, ['1008'], ['energy']),
    proteinPer100g: usdaNutrient(food, ['1003'], ['protein']),
    carbsPer100g: usdaNutrient(food, ['1005'], ['carbohydrate']),
    fatPer100g: usdaNutrient(food, ['1004'], ['total lipid', 'fat']),
    fiberPer100g: usdaNutrient(food, ['1079'], ['fiber']) || null,
    sugarPer100g: usdaNutrient(food, ['2000'], ['sugars']) || null,
    sodiumPer100g: usdaNutrient(food, ['1093'], ['sodium']) || null,
    sourceProvider: 'usda_fdc',
    sourceId: String(food.fdcId || ''),
    sourceUrl: food.fdcId ? `https://fdc.nal.usda.gov/fdc-app.html#/food-details/${food.fdcId}/nutrients` : '',
    confidence: food.dataType === 'Foundation' || food.dataType === 'SR Legacy' ? 'high' : 'medium',
    department: 'Other',
    rawOrCookedState: 'as_listed_by_provider',
    aliases: [food.description, food.brandOwner].filter(Boolean),
  });
}

function normalizeOffFood(product) {
  const nutriments = product.nutriments || {};
  return normalizeFood({
    id: `off_${product.code}`,
    name: product.product_name || 'Open Food Facts product',
    brand: product.brands || 'Open Food Facts',
    caloriesPer100g: Number(nutriments['energy-kcal_100g'] ?? nutriments['energy-kcal'] ?? 0),
    proteinPer100g: Number(nutriments.proteins_100g ?? 0),
    carbsPer100g: Number(nutriments.carbohydrates_100g ?? 0),
    fatPer100g: Number(nutriments.fat_100g ?? 0),
    fiberPer100g: nullableNumber(nutriments.fiber_100g),
    sugarPer100g: nullableNumber(nutriments.sugars_100g),
    sodiumPer100g: nullableNumber(nutriments.sodium_100g),
    sourceProvider: 'open_food_facts',
    sourceId: String(product.code || ''),
    sourceUrl: product.url || '',
    confidence: nutriments['energy-kcal_100g'] && nutriments.proteins_100g !== undefined ? 'medium' : 'low',
    department: 'Other',
    rawOrCookedState: 'as_sold',
    aliases: [product.product_name, product.brands].filter(Boolean),
  });
}

async function nutritionSearch(query, user, providerId = 'auto') {
  const userContext = { userId: user?.id || null };
  const order = ['custom_foods', 'cache', 'curated_seed', 'usda_fdc', 'open_food_facts'];
  const selected = providerId && providerId !== 'auto' ? [providerId] : order;
  const results = [];
  const seen = new Set();
  for (const id of selected) {
    const provider = Providers[id];
    if (!provider || provider.enabled === false) continue;
    try {
      const providerResults = await provider.search(query, userContext);
      for (const item of providerResults.map((food) => provider.normalizeFood(food))) {
        const key = cacheKey(item.sourceProvider, item.sourceId || item.id || item.name);
        if (seen.has(key)) continue;
        seen.add(key);
        results.push(item);
      }
    } catch (error) {
      console.warn(`Nutrition provider ${id} failed:`, error.message);
    }
    if (providerId !== 'auto' && results.length) break;
  }
  return results.slice(0, 24);
}

async function getProviderFood(providerId, id, user) {
  const provider = Providers[providerId];
  if (!provider || provider.enabled === false) return null;
  const food = await provider.getFood(id, { userId: user?.id || null });
  return food ? provider.normalizeFood(food) : null;
}

async function handleApi(req, res, url, user) {
  if (!rateLimit(req, user)) return json(res, 429, { error: 'Rate limit exceeded' });

  if (url.pathname === '/api/nutrition/providers') {
    if (req.method !== 'GET') return methodNotAllowed(res);
    return json(res, 200, {
      providers: providerStatus(),
      cloud: { status: 'connected', cacheTtlDays: NUTRITION_CACHE_TTL_DAYS },
    });
  }

  if (url.pathname === '/api/nutrition/search') {
    if (req.method !== 'GET') return methodNotAllowed(res);
    const q = String(url.searchParams.get('q') || '').trim();
    const provider = String(url.searchParams.get('provider') || 'auto');
    if (!q) return json(res, 400, { error: 'q is required' });
    const results = await nutritionSearch(q, user, provider);
    return json(res, 200, { query: q, provider, priority: providerStatus(), results });
  }

  const foodMatch = url.pathname.match(/^\/api\/nutrition\/food\/([^/]+)\/([^/]+)$/);
  if (foodMatch) {
    if (req.method !== 'GET') return methodNotAllowed(res);
    const provider = decodeURIComponent(foodMatch[1]);
    const id = decodeURIComponent(foodMatch[2]);
    const food = await getProviderFood(provider, id, user);
    return food ? json(res, 200, { food }) : notFound(res);
  }

  if (url.pathname === '/api/nutrition/custom-foods') {
    if (req.method !== 'POST') return methodNotAllowed(res);
    if (!user) return unauthorized(res);
    const body = await readBody(req);
    const customFoods = readJson(files.customFoods, []);
    const food = normalizeFood({ ...body, id: body.id || randomId('custom_food'), sourceProvider: 'custom_foods', source: 'custom_foods', sourceId: body.sourceId || body.id || randomId('custom_source'), userId: user.id, userEdited: true });
    const next = customFoods.filter((item) => !(item.id === food.id && item.userId === user.id));
    next.push(food);
    writeJson(files.customFoods, next);
    return json(res, 201, { food });
  }

  if (url.pathname === '/api/users/me') {
    if (req.method !== 'GET') return methodNotAllowed(res);
    if (!user) return unauthorized(res);
    return json(res, 200, { user });
  }

  if (url.pathname === '/api/auth/login') {
    if (req.method !== 'POST') return methodNotAllowed(res);
    const body = await readBody(req);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!email || !password) return json(res, 400, { error: 'email and password are required' });
    const users = readJson(files.users, []);
    let stored = users.find((item) => item.email === email);
    if (!stored) {
      if (!AUTO_PROVISION_ACCOUNTS) return json(res, 401, { error: 'Invalid email or password' });
      const passwordHash = hashPassword(password);
      stored = { id: randomId('user'), email, name: body.name || email.split('@')[0], ...passwordHash, createdAt: nowIso(), updatedAt: nowIso(), language: body.language || 'en', theme: 'system', units: 'metric' };
      users.push(stored);
      writeJson(files.users, users);
    } else {
      const candidate = hashPassword(password, stored.salt);
      if (!safeEqual(candidate.hash, stored.hash)) return json(res, 401, { error: 'Invalid email or password' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    const sessions = readJson(files.sessions, []).filter((item) => new Date(item.expiresAt).getTime() > Date.now());
    sessions.push({ token, userId: stored.id, createdAt: nowIso(), expiresAt: addDays(new Date(), 30).toISOString(), ip: getClientIp(req) });
    writeJson(files.sessions, sessions);
    return json(res, 200, { user: publicUser(stored), token }, { 'Set-Cookie': `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 30}` });
  }

  if (url.pathname === '/api/auth/logout') {
    if (req.method !== 'POST') return methodNotAllowed(res);
    const token = getSessionToken(req);
    if (token) writeJson(files.sessions, readJson(files.sessions, []).filter((item) => item.token !== token));
    return noContent(res, { 'Set-Cookie': `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0` });
  }

  if (url.pathname === '/api/recipes') {
    if (!user) return unauthorized(res);
    const recipes = readJson(files.recipes, []);
    if (req.method === 'GET') return json(res, 200, { recipes: recipes.filter((recipe) => recipe.userId === user.id) });
    if (req.method === 'POST') {
      const body = await readBody(req);
      const recipe = { ...body, id: body.id || randomId('recipe'), userId: user.id, createdAt: body.createdAt || nowIso(), updatedAt: nowIso() };
      recipes.push(recipe);
      writeJson(files.recipes, recipes);
      return json(res, 201, { recipe });
    }
    return methodNotAllowed(res);
  }

  const recipeMatch = url.pathname.match(/^\/api\/recipes\/([^/]+)$/);
  if (recipeMatch) {
    if (!user) return unauthorized(res);
    const id = decodeURIComponent(recipeMatch[1]);
    const recipes = readJson(files.recipes, []);
    const index = recipes.findIndex((recipe) => recipe.id === id && recipe.userId === user.id);
    if (req.method === 'PUT') {
      const body = await readBody(req);
      const recipe = { ...body, id, userId: user.id, updatedAt: nowIso(), createdAt: body.createdAt || recipes[index]?.createdAt || nowIso() };
      if (index >= 0) recipes[index] = recipe;
      else recipes.push(recipe);
      writeJson(files.recipes, recipes);
      return json(res, 200, { recipe });
    }
    if (req.method === 'DELETE') {
      if (index >= 0) writeJson(files.recipes, recipes.filter((recipe) => !(recipe.id === id && recipe.userId === user.id)));
      return noContent(res);
    }
    return methodNotAllowed(res);
  }

  if (url.pathname === '/api/meal-plans') {
    if (!user) return unauthorized(res);
    const mealPlans = readJson(files.mealPlans, []);
    if (req.method === 'GET') return json(res, 200, { mealPlans: mealPlans.filter((plan) => plan.userId === user.id) });
    if (req.method === 'POST') {
      const body = await readBody(req);
      const plan = { ...body, id: body.id || body.date || randomId('plan'), userId: user.id, updatedAt: nowIso() };
      const next = mealPlans.filter((item) => !(item.id === plan.id && item.userId === user.id));
      next.push(plan);
      writeJson(files.mealPlans, next);
      return json(res, 201, { mealPlan: plan });
    }
    return methodNotAllowed(res);
  }

  return notFound(res);
}

function contentTypeFor(file) {
  const ext = path.extname(file).toLowerCase();
  return {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
  }[ext] || 'application/octet-stream';
}

function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';
  const requested = path.resolve(ROOT_DIR, `.${pathname}`);
  if (!requested.startsWith(ROOT_DIR) || !fs.existsSync(requested) || !fs.statSync(requested).isFile()) return notFound(res);
  const stream = fs.createReadStream(requested);
  res.writeHead(200, { 'Content-Type': contentTypeFor(requested), 'Cache-Control': pathname === '/index.html' ? 'no-cache' : 'public, max-age=3600' });
  stream.pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': req.headers.origin || '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    });
    return res.end();
  }

  try {
    const user = getUserFromRequest(req);
    if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url, user);
    return serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: error.message || 'Internal server error' });
  }
});

server.listen(PORT, () => {
  console.log(`Diet Planner backend listening on http://localhost:${PORT}`);
  console.log(`USDA provider: ${USDA_FDC_API_KEY ? 'enabled' : 'disabled - set USDA_FDC_API_KEY'}`);
  console.log(`Open Food Facts provider: ${OPENFOODFACTS_ENABLED ? 'enabled' : 'disabled'}`);
});
