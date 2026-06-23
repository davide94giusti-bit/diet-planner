'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const ROOT_DIR = path.resolve(__dirname, '..');
loadDotEnv(path.join(ROOT_DIR, '.env'));
const PORT = Number(process.env.PORT || 3000);
const USDA_FDC_API_KEY = process.env.USDA_FDC_API_KEY || '';
const OPENFOODFACTS_ENABLED = /^(1|true|yes|on)$/i.test(process.env.OPENFOODFACTS_ENABLED || 'true');
const NUTRITION_CACHE_TTL_DAYS = Number(process.env.NUTRITION_CACHE_TTL_DAYS || 30);
const AUTO_PROVISION_ACCOUNTS = !/^(0|false|no|off)$/i.test(process.env.DIET_PLANNER_AUTO_PROVISION || 'true');
const storage = require('./storage');
const plannerEngine = require('./plannerEngine');
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

function nowIso() { return new Date().toISOString(); }
function addDays(date, days) { const d = new Date(date); d.setUTCDate(d.getUTCDate() + days); return d; }
function normalizeText(value) { return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
function randomId(prefix) { return `${prefix}_${crypto.randomBytes(16).toString('hex')}`; }

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const iterations = 120000;
  const hash = crypto.pbkdf2Sync(String(password), salt, iterations, 32, 'sha256').toString('hex');
  return `pbkdf2_sha256$${iterations}$${salt}$${hash}`;
}

function timingSafeHexEqual(a, b) {
  const aa = Buffer.from(String(a || ''), 'hex');
  const bb = Buffer.from(String(b || ''), 'hex');
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

function verifyPassword(password, user) {
  const stored = user?.passwordHash || user?.password_hash || '';
  const parts = String(stored).split('$');
  if (parts.length === 4 && parts[0] === 'pbkdf2_sha256') {
    const [, iterationsRaw, salt, expected] = parts;
    const iterations = Number(iterationsRaw) || 120000;
    const candidate = crypto.pbkdf2Sync(String(password), salt, iterations, 32, 'sha256').toString('hex');
    return timingSafeHexEqual(candidate, expected);
  }
  if (user?.salt && user?.hash) {
    const candidate = crypto.pbkdf2Sync(String(password), user.salt, 120000, 32, 'sha256').toString('hex');
    return timingSafeHexEqual(candidate, user.hash);
  }
  return false;
}

function hashSessionToken(token) {
  return crypto.createHash('sha256').update(String(token || '')).digest('hex');
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

function sessionCookie(token, req) {
  const forwardedProto = String(req.headers['x-forwarded-proto'] || '').toLowerCase();
  const secure = forwardedProto === 'https' ? '; Secure' : '';
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 30}${secure}`;
}

async function getUserFromRequest(req) {
  const token = getSessionToken(req);
  if (!token) return null;
  const session = await storage.getSessionByTokenHash(hashSessionToken(token));
  if (!session) return null;
  const user = await storage.getUserById(session.userId);
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
    role: user.role || 'user',
    onboardingCompleted: Boolean(user.onboardingCompleted || user.onboarding_completed),
    onboardingStep: Number(user.onboardingStep || user.onboarding_step || 0),
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
    servingSize: food.servingSize || food.serving_size || '',
    servingQuantity: nullableNumber(food.servingQuantity || food.serving_quantity),
    productQuantity: nullableNumber(food.productQuantity || food.product_quantity),
    confidence: food.confidence || 'unknown',
    confidenceScore: food.confidenceScore ?? food.confidence_score ?? (food.confidence === 'high' ? 0.9 : food.confidence === 'medium' ? 0.7 : food.confidence === 'low' ? 0.45 : 0.25),
    rawOrCookedState: food.rawOrCookedState || food.raw_cooked_state || inferFoodState(name),
    raw_cooked_state: food.rawOrCookedState || food.raw_cooked_state || inferFoodState(name),
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

async function upsertCachedFoods(foods, query = '') {
  if (!foods.length) return;
  const expiresAt = addDays(new Date(), NUTRITION_CACHE_TTL_DAYS).toISOString();
  for (const food of foods.map(normalizeFood)) {
    if (!food.sourceProvider || !food.sourceId) continue;
    await storage.saveCachedFood({
      ...food,
      provider: food.sourceProvider,
      providerFoodId: food.sourceId,
      query,
      cachedAt: nowIso(),
      expiresAt,
      sourceMetadata: {
        provider: food.sourceProvider,
        providerFoodId: food.sourceId,
        sourceUrl: food.sourceUrl || '',
        cachedAt: nowIso(),
      },
    });
  }
}

const Providers = {
  custom_foods: {
    id: 'custom_foods',
    name: 'User custom foods',
    enabled: true,
    requiresApiKey: false,
    async search(query, userContext) {
      return storage.searchCustomFoods(query, userContext.userId);
    },
    async getFood(id, userContext) {
      return storage.getCustomFood(userContext.userId, id);
    },
    normalizeFood,
  },
  cache: {
    id: 'cache',
    name: 'User cached foods',
    enabled: true,
    requiresApiKey: false,
    async search(query, userContext) {
      return storage.searchCachedFoods(query, userContext.userId);
    },
    async getFood(id, userContext) {
      return storage.getCachedFood(id, userContext.userId);
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
      await upsertCachedFoods(foods, query);
      return foods;
    },
    async getFood(id) {
      const cached = await storage.findCachedFood('usda_fdc', id);
      if (cached?.sourceProvider === 'usda_fdc') return cached;
      if (!USDA_FDC_API_KEY) return null;
      const params = new URLSearchParams({ api_key: USDA_FDC_API_KEY });
      const response = await fetch(`https://api.nal.usda.gov/fdc/v1/food/${encodeURIComponent(id)}?${params.toString()}`);
      if (!response.ok) throw new Error(`USDA HTTP ${response.status}`);
      const food = normalizeUsdaFood(await response.json());
      await upsertCachedFoods([food]);
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
      const params = new URLSearchParams({ search_terms: query, search_simple: '1', action: 'process', json: '1', page_size: '8', fields: 'code,product_name,brands,nutriments,categories_tags,url,serving_size,serving_quantity,product_quantity' });
      const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?${params.toString()}`);
      if (!response.ok) throw new Error(`Open Food Facts HTTP ${response.status}`);
      const data = await response.json();
      const foods = (data.products || []).map(normalizeOffFood).filter(hasMacros);
      await upsertCachedFoods(foods, query);
      return foods;
    },
    async getFood(id) {
      const cached = await storage.findCachedFood('open_food_facts', id);
      if (cached?.sourceProvider === 'open_food_facts') return cached;
      if (!OPENFOODFACTS_ENABLED) return null;
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(id)}.json?fields=code,product_name,brands,nutriments,categories_tags,url,serving_size,serving_quantity,product_quantity`);
      if (!response.ok) throw new Error(`Open Food Facts HTTP ${response.status}`);
      const data = await response.json();
      const food = data.product ? normalizeOffFood(data.product) : null;
      if (food) await upsertCachedFoods([food]);
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
    servingSize: product.serving_size || '',
    servingQuantity: nullableNumber(product.serving_quantity),
    productQuantity: nullableNumber(product.product_quantity),
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


function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeMealEvent(user, plan, meal, eventType, extra = {}) {
  return {
    id: extra.id || randomId('event'),
    userId: user.id,
    mealPlanId: plan.id || plan.date || null,
    plannedMealId: meal?.id || extra.plannedMealId || null,
    eventType,
    actualItems: extra.actualItems || meal?.items || [],
    actualMacroSnapshot: extra.actualMacroSnapshot || meal?.currentMacroSnapshot || null,
    adjustmentApplied: Boolean(extra.adjustmentApplied),
    createdAt: nowIso(),
    ...extra,
  };
}


function planTargetFromBodyOrPlan(body, plan) {
  return body.target || body.targetSnapshot || body.target_snapshot || plan.targetSnapshot || plan.target || {};
}

function mealEventTypeForAction(action) {
  if (action === 'complete') return 'eaten_as_planned';
  if (action === 'skip') return 'skipped';
  if (action === 'swap') return 'swapped';
  return 'replaced';
}

function applyMealAction(meal, action, body = {}) {
  const current = { ...meal, items: Array.isArray(meal.items) ? [...meal.items] : [] };
  if (body.meal && (action === 'replace' || action === 'swap')) {
    const replacement = {
      ...body.meal,
      id: current.id,
      slot: current.slot,
      time: current.time,
      originalItems: current.originalItems || current.items || [],
      status: body.meal.status || (action === 'swap' ? 'planned' : 'changed'),
    };
    replacement.adjustments = [...(current.adjustments || []), ...(body.meal.adjustments || []), { at: nowIso(), type: `server_${action}`, from: current.recipeName || current.slot, to: replacement.recipeName || replacement.slot }];
    return replacement;
  }
  if (action === 'complete') return { ...current, status: 'completed', completedAt: nowIso(), actualItems: current.items || [] };
  if (action === 'skip') return { ...current, status: 'skipped', skippedAt: nowIso(), skipReason: body.reason || '' };
  if (action === 'replace') {
    const replacement = body.meal && typeof body.meal === 'object' ? body.meal : {};
    return { ...current, ...replacement, id: current.id, date: current.date, slot: current.slot, time: replacement.time || current.time, status: 'changed', items: replacement.items || body.items || current.items || [], recipeName: replacement.recipeName || body.recipeName || body.name || current.recipeName, replacedAt: nowIso() };
  }
  if (action === 'swap') {
    const replacement = body.meal && typeof body.meal === 'object' ? body.meal : {};
    return { ...current, ...replacement, id: current.id, date: current.date, slot: current.slot, time: replacement.time || current.time, status: 'planned', items: replacement.items || body.items || current.items || [], recipeName: replacement.recipeName || body.recipeName || body.name || current.recipeName, swappedAt: nowIso() };
  }
  return current;
}

async function mutateStoredMealPlan(user, mealId, action, body = {}) {
  const plans = await storage.listMealPlans(user.id);
  for (const plan of plans) {
    const hit = findMealInPlan(plan, mealId);
    if (!hit) continue;
    const nextPlan = { ...plan, meals: [...(plan.meals || [])] };
    const mutatedMeal = applyMealAction(hit.meal, action, body);
    nextPlan.meals[hit.index] = mutatedMeal;
    const eventType = mealEventTypeForAction(action);
    const eventData = normalizeMealEvent(user, nextPlan, mutatedMeal, eventType, {
      ...(body.event || {}),
      adjustmentApplied: body.recalculate !== false,
      actualItems: body.actualItems || body.items || mutatedMeal.actualItems || mutatedMeal.items || [],
      actualMacroSnapshot: body.actualMacroSnapshot || mutatedMeal.actualMacroSnapshot || null,
    });
    let recalcPayload = null;
    let savedPlan = nextPlan;
    if (body.recalculate !== false) {
      const result = plannerEngine.recalculateMealPlan(nextPlan, {
        type: eventType,
        eventType,
        plannedMealId: mutatedMeal.id,
        mealName: mutatedMeal.slot || mutatedMeal.recipeName || 'Meal',
      }, { foods: CURATED_FOODS, target: planTargetFromBodyOrPlan(body, nextPlan) });
      savedPlan = result.mealPlan;
      recalcPayload = result.recalculation;
      eventData.adjustmentApplied = true;
      eventData.adjustment = recalcPayload;
    } else {
      savedPlan.updatedAt = nowIso();
    }
    const saved = await storage.saveMealPlan(user.id, savedPlan);
    const event = await storage.createMealEvent(user.id, eventData);
    return { mealPlan: saved, meal: saved.meals?.find((meal) => String(meal.id) === String(mealId)) || mutatedMeal, event, recalculation: recalcPayload };
  }
  return null;
}

function findMealInPlan(plan, mealId) {
  const meals = Array.isArray(plan?.meals) ? plan.meals : [];
  const index = meals.findIndex((meal) => String(meal.id) === String(mealId));
  return index >= 0 ? { meal: meals[index], index } : null;
}

async function mutateStoredMeal(user, mealId, mutator) {
  const plans = await storage.listMealPlans(user.id);
  for (const plan of plans) {
    const hit = findMealInPlan(plan, mealId);
    if (!hit) continue;
    const nextPlan = { ...plan, meals: [...(plan.meals || [])], updatedAt: nowIso() };
    const currentMeal = { ...hit.meal };
    const mutatedMeal = await mutator(currentMeal, nextPlan) || currentMeal;
    nextPlan.meals[hit.index] = mutatedMeal;
    const saved = await storage.saveMealPlan(user.id, nextPlan);
    return { mealPlan: saved, meal: mutatedMeal };
  }
  return null;
}

function generateServerMealPlan(user, body = {}) {
  const date = String(body.date || todayDate()).slice(0, 10);
  return {
    id: body.id || date,
    userId: user.id,
    date,
    goalMode: body.goalMode || body.goal_mode || 'custom_nutritionist_plan',
    workoutDay: Boolean(body.workoutDay || body.workout_day),
    workoutTime: body.workoutTime || body.workout_time || '',
    targetSnapshot: body.targetSnapshot || body.target_snapshot || {},
    meals: Array.isArray(body.meals) ? body.meals : [],
    generatedAt: nowIso(),
    updatedAt: nowIso(),
    source: 'server_scaffold',
    notes: body.meals ? 'Server-saved generated meal plan.' : 'Server scaffold created. Use frontend planner to add meals or send meals in the request body.',
  };
}

function aggregateGroceryFromPlans(plans) {
  const byName = new Map();
  for (const plan of plans) {
    for (const meal of plan.meals || []) {
      for (const item of meal.items || []) {
        const key = normalizeText(item.foodName || item.rawName || item.name || item.foodId || 'item');
        if (!key) continue;
        const existing = byName.get(key) || { name: item.foodName || item.rawName || item.name || 'Item', grams: 0, department: item.department || 'Other', checked: false };
        existing.grams += Number(item.grams || item.quantity || 0);
        if (item.department) existing.department = item.department;
        byName.set(key, existing);
      }
    }
  }
  return [...byName.values()].sort((a, b) => String(a.department).localeCompare(String(b.department)) || String(a.name).localeCompare(String(b.name)));
}

function progressSummary(measurements = [], mealPlans = []) {
  const sorted = [...measurements].sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const completedMeals = mealPlans.flatMap((plan) => plan.meals || []).filter((meal) => meal.status === 'completed' || meal.status === 'changed');
  const totalMeals = mealPlans.flatMap((plan) => plan.meals || []).length;
  return {
    weightTrend: first && last ? Number(last.bodyWeight || last.body_weight || 0) - Number(first.bodyWeight || first.body_weight || 0) : null,
    measurementCount: measurements.length,
    adherenceScore: totalMeals ? Math.round((completedMeals.length / totalMeals) * 100) : null,
    recommendation: measurements.length < 3 ? 'Not enough data for a reliable adjustment yet.' : 'Review the trend with adherence before changing targets.',
  };
}

async function handleApi(req, res, url, user) {
  if (!rateLimit(req, user)) return json(res, 429, { error: 'Rate limit exceeded' });

  if (url.pathname === '/api/nutrition/providers') {
    if (req.method !== 'GET') return methodNotAllowed(res);
    return json(res, 200, {
      providers: providerStatus(),
      cloud: { status: storage.usingPostgres() ? 'postgres' : 'local-json-fallback', cacheTtlDays: NUTRITION_CACHE_TTL_DAYS },
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

  const barcodeMatch = url.pathname.match(/^\/api\/nutrition\/barcode\/([^/]+)$/);
  if (barcodeMatch) {
    if (req.method !== 'GET') return methodNotAllowed(res);
    const barcode = decodeURIComponent(barcodeMatch[1]).replace(/[^0-9]/g, '');
    if (!barcode) return json(res, 400, { error: 'barcode is required' });
    const cached = await storage.findCachedFood('open_food_facts', barcode);
    if (cached) return json(res, 200, { food: normalizeFood(cached), provider: 'open_food_facts', cached: true });
    let food = null;
    try {
      food = await getProviderFood('open_food_facts', barcode, user);
    } catch (error) {
      console.warn('Open Food Facts barcode lookup failed:', error.message);
      return json(res, 503, { error: 'barcode provider unavailable', provider: 'open_food_facts', barcode });
    }
    if (!food) return notFound(res);
    await upsertCachedFoods([food], barcode);
    return json(res, 200, { food, provider: 'open_food_facts', cached: false });
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
    const sourceId = body.sourceId || body.id || randomId('custom_source');
    const food = normalizeFood({ ...body, id: body.id || randomId('custom_food'), sourceProvider: 'custom_foods', source: 'custom_foods', sourceId, userId: user.id, userEdited: true });
    const saved = await storage.createCustomFood(user.id, food);
    return json(res, 201, { food: saved });
  }

  const customFoodMatch = url.pathname.match(/^\/api\/nutrition\/custom-foods\/([^/]+)$/);
  if (customFoodMatch) {
    if (!user) return unauthorized(res);
    const id = decodeURIComponent(customFoodMatch[1]);
    if (req.method === 'PUT') {
      const body = await readBody(req);
      const sourceId = body.sourceId || id;
      const food = normalizeFood({ ...body, id, sourceProvider: 'custom_foods', source: 'custom_foods', sourceId, userId: user.id, userEdited: true });
      const saved = await storage.updateCustomFood(user.id, id, food);
      return json(res, 200, { food: saved });
    }
    if (req.method === 'DELETE') {
      await storage.deleteCustomFood(user.id, id);
      return noContent(res);
    }
    return methodNotAllowed(res);
  }

  if (url.pathname === '/api/users/me') {
    if (!user) return unauthorized(res);
    if (req.method === 'GET') return json(res, 200, { user });
    if (req.method === 'PUT') {
      const body = await readBody(req);
      const updated = await storage.updateUser(user.id, body);
      return json(res, 200, { user: publicUser(updated) });
    }
    return methodNotAllowed(res);
  }

  if (url.pathname === '/api/auth/register') {
    if (req.method !== 'POST') return methodNotAllowed(res);
    const body = await readBody(req);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const displayName = String(body.displayName || body.name || email).trim();
    if (!email || !password) return json(res, 400, { error: 'email and password are required' });
    const existing = await storage.getUserByEmail(email);
    if (existing) return json(res, 409, { error: 'Account already exists' });
    const stored = await storage.createUser({ id: randomId('user'), email, passwordHash: hashPassword(password), displayName, language: body.language || 'en', theme: body.theme || 'system', units: body.units || 'metric', role: 'user', onboardingCompleted: false, onboardingStep: 1, createdAt: nowIso(), updatedAt: nowIso() });
    const token = crypto.randomBytes(32).toString('hex');
    await storage.createSession({ id: randomId('session'), userId: stored.id, tokenHash: hashSessionToken(token), createdAt: nowIso(), expiresAt: addDays(new Date(), 30).toISOString(), ip: getClientIp(req) });
    return json(res, 201, { user: publicUser(stored), token }, { 'Set-Cookie': sessionCookie(token, req) });
  }

  if (url.pathname === '/api/auth/login') {
    if (req.method !== 'POST') return methodNotAllowed(res);
    const body = await readBody(req);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!email || !password) return json(res, 400, { error: 'email and password are required' });
    let stored = await storage.getUserByEmail(email);
    if (!stored) {
      if (!AUTO_PROVISION_ACCOUNTS) return json(res, 401, { error: 'Invalid email or password' });
      stored = await storage.createUser({ id: randomId('user'), email, passwordHash: hashPassword(password), createdAt: nowIso(), updatedAt: nowIso() });
    } else if (!verifyPassword(password, stored)) {
      return json(res, 401, { error: 'Invalid email or password' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    await storage.createSession({ id: randomId('session'), userId: stored.id, tokenHash: hashSessionToken(token), createdAt: nowIso(), expiresAt: addDays(new Date(), 30).toISOString(), ip: getClientIp(req) });
    return json(res, 200, { user: publicUser(stored), token }, { 'Set-Cookie': sessionCookie(token, req) });
  }

  if (url.pathname === '/api/auth/logout') {
    if (req.method !== 'POST') return methodNotAllowed(res);
    const token = getSessionToken(req);
    if (token) await storage.deleteSession(hashSessionToken(token));
    return noContent(res, { 'Set-Cookie': `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0` });
  }

  if (url.pathname === '/api/preferences') {
    if (!user) return unauthorized(res);
    if (req.method === 'GET') return json(res, 200, { preferences: await storage.getPreferences(user.id) || null });
    if (req.method === 'PUT') {
      const saved = await storage.savePreferences(user.id, await readBody(req));
      return json(res, 200, { preferences: saved });
    }
    return methodNotAllowed(res);
  }

  if (url.pathname === '/api/pantry') {
    if (!user) return unauthorized(res);
    if (req.method === 'GET') return json(res, 200, { pantryItems: await storage.listPantryItems(user.id) });
    if (req.method === 'POST') {
      const saved = await storage.savePantryItem(user.id, await readBody(req));
      return json(res, 201, { pantryItem: saved });
    }
    return methodNotAllowed(res);
  }

  if (url.pathname === '/api/pantry/use-available-foods') {
    if (!user) return unauthorized(res);
    if (req.method !== 'POST') return methodNotAllowed(res);
    const items = await storage.listPantryItems(user.id);
    return json(res, 200, { availableFoods: items.filter((item) => item.available !== false), scaffolded: true, message: 'Pantry preference captured. Planner integration is scaffolded for swaps and grocery generation.' });
  }

  const pantryMatch = url.pathname.match(/^\/api\/pantry\/([^/]+)$/);
  if (pantryMatch) {
    if (!user) return unauthorized(res);
    const id = decodeURIComponent(pantryMatch[1]);
    if (req.method === 'PUT') return json(res, 200, { pantryItem: await storage.savePantryItem(user.id, { ...(await readBody(req)), id }) });
    if (req.method === 'DELETE') { await storage.deletePantryItem(user.id, id); return noContent(res); }
    return methodNotAllowed(res);
  }

  if (url.pathname === '/api/supplements') {
    if (!user) return unauthorized(res);
    if (req.method === 'GET') return json(res, 200, { supplements: await storage.listSupplements(user.id) });
    if (req.method === 'POST') return json(res, 201, { supplement: await storage.saveSupplement(user.id, await readBody(req)) });
    return methodNotAllowed(res);
  }

  const supplementLogMatch = url.pathname.match(/^\/api\/supplements\/([^/]+)\/log$/);
  if (supplementLogMatch) {
    if (!user) return unauthorized(res);
    if (req.method !== 'POST') return methodNotAllowed(res);
    return json(res, 201, { supplementLog: await storage.saveSupplementLog(user.id, decodeURIComponent(supplementLogMatch[1]), await readBody(req)) });
  }

  const supplementMatch = url.pathname.match(/^\/api\/supplements\/([^/]+)$/);
  if (supplementMatch) {
    if (!user) return unauthorized(res);
    const id = decodeURIComponent(supplementMatch[1]);
    if (req.method === 'PUT') return json(res, 200, { supplement: await storage.saveSupplement(user.id, { ...(await readBody(req)), id }) });
    if (req.method === 'DELETE') { await storage.deleteSupplement(user.id, id); return noContent(res); }
    return methodNotAllowed(res);
  }

  if (url.pathname === '/api/admin/food-reviews') {
    if (!user) return unauthorized(res);
    if (user.role !== 'admin') return json(res, 403, { error: 'Admin role required' });
    if (req.method === 'GET') return json(res, 200, { foodReviews: await storage.listAdminFoodReviews() });
    if (req.method === 'POST') return json(res, 201, { foodReview: await storage.saveAdminFoodReview(user.id, await readBody(req)) });
    return methodNotAllowed(res);
  }

  if (url.pathname === '/api/recipes') {
    if (!user) return unauthorized(res);
    if (req.method === 'GET') return json(res, 200, { recipes: await storage.listRecipes(user.id) });
    if (req.method === 'POST') {
      const body = await readBody(req);
      const recipe = { ...body, id: body.id || randomId('recipe'), userId: user.id, createdAt: body.createdAt || nowIso(), updatedAt: nowIso() };
      const saved = await storage.createRecipe(user.id, recipe);
      return json(res, 201, { recipe: saved });
    }
    return methodNotAllowed(res);
  }

  const recipeMatch = url.pathname.match(/^\/api\/recipes\/([^/]+)$/);
  if (recipeMatch) {
    if (!user) return unauthorized(res);
    const id = decodeURIComponent(recipeMatch[1]);
    if (req.method === 'PUT') {
      const body = await readBody(req);
      const recipe = { ...body, id, userId: user.id, updatedAt: nowIso(), createdAt: body.createdAt || nowIso() };
      const saved = await storage.updateRecipe(user.id, id, recipe);
      return json(res, 200, { recipe: saved });
    }
    if (req.method === 'DELETE') {
      await storage.deleteRecipe(user.id, id);
      return noContent(res);
    }
    return methodNotAllowed(res);
  }

  if (url.pathname === '/api/meal-plans') {
    if (!user) return unauthorized(res);
    if (req.method === 'GET') return json(res, 200, { mealPlans: await storage.listMealPlans(user.id, url.searchParams.get('start'), url.searchParams.get('end')) });
    if (req.method === 'POST') {
      const body = await readBody(req);
      const plan = { ...body, id: body.id || body.date || randomId('plan'), userId: user.id, updatedAt: nowIso() };
      const saved = await storage.saveMealPlan(user.id, plan);
      return json(res, 201, { mealPlan: saved });
    }
    return methodNotAllowed(res);
  }


  if (url.pathname === '/api/meal-plans/generate') {
    if (!user) return unauthorized(res);
    if (req.method !== 'POST') return methodNotAllowed(res);
    const body = await readBody(req);
    const plan = generateServerMealPlan(user, body);
    const saved = await storage.saveMealPlan(user.id, plan);
    return json(res, 201, { mealPlan: saved, scaffolded: !Array.isArray(body.meals) });
  }

  const mealPlanRecalcMatch = url.pathname.match(/^\/api\/meal-plans\/([^/]+)\/recalculate$/);
  if (mealPlanRecalcMatch) {
    if (!user) return unauthorized(res);
    if (req.method !== 'POST') return methodNotAllowed(res);
    const id = decodeURIComponent(mealPlanRecalcMatch[1]);
    const body = await readBody(req);
    const existing = await storage.getMealPlan(user.id, id);
    if (!existing) return notFound(res);
    const plan = { ...existing, ...(body.plan || {}), id, userId: user.id };
    const eventType = body.event?.type || body.event?.eventType || 'recalculation';
    const result = plannerEngine.recalculateMealPlan(plan, { ...(body.event || {}), eventType }, { foods: CURATED_FOODS, target: planTargetFromBodyOrPlan(body, plan) });
    const saved = await storage.saveMealPlan(user.id, result.mealPlan);
    const event = await storage.createMealEvent(user.id, normalizeMealEvent(user, saved, null, eventType, { ...(body.event || {}), adjustmentApplied: true, adjustment: result.recalculation }));
    return json(res, 200, { mealPlan: saved, recalculation: result.recalculation, event });
  }

  const mealActionMatch = url.pathname.match(/^\/api\/meals\/([^/]+)\/(complete|skip|replace|swap)$/);
  if (mealActionMatch) {
    if (!user) return unauthorized(res);
    if (req.method !== 'POST') return methodNotAllowed(res);
    const mealId = decodeURIComponent(mealActionMatch[1]);
    const action = mealActionMatch[2];
    const body = await readBody(req);
    const mutated = await mutateStoredMealPlan(user, mealId, action, body);
    if (!mutated) return notFound(res);
    return json(res, 200, mutated);
  }

  if (url.pathname === '/api/body-measurements') {
    if (!user) return unauthorized(res);
    if (req.method === 'GET') return json(res, 200, { bodyMeasurements: await storage.listBodyMeasurements(user.id, url.searchParams.get('start'), url.searchParams.get('end')) });
    if (req.method === 'POST') {
      const saved = await storage.saveBodyMeasurement(user.id, await readBody(req));
      return json(res, 201, { bodyMeasurement: saved });
    }
    return methodNotAllowed(res);
  }

  if (url.pathname === '/api/progress/summary') {
    if (!user) return unauthorized(res);
    if (req.method !== 'GET') return methodNotAllowed(res);
    const start = url.searchParams.get('start');
    const end = url.searchParams.get('end');
    const measurements = await storage.listBodyMeasurements(user.id, start, end);
    const mealPlans = await storage.listMealPlans(user.id, start, end);
    const logs = await storage.listProgressLogs(user.id, start, end);
    return json(res, 200, { summary: progressSummary(measurements, mealPlans), bodyMeasurements: measurements, progressLogs: logs });
  }

  if (url.pathname === '/api/check-ins') {
    if (!user) return unauthorized(res);
    if (req.method === 'GET') return json(res, 200, { checkIns: await storage.listCheckIns(user.id) });
    if (req.method === 'POST') {
      const saved = await storage.saveCheckIn(user.id, await readBody(req));
      return json(res, 201, { checkIn: saved });
    }
    return methodNotAllowed(res);
  }

  if (url.pathname === '/api/grocery/generate') {
    if (!user) return unauthorized(res);
    if (req.method !== 'POST') return methodNotAllowed(res);
    const body = await readBody(req);
    const start = body.startDate || body.start || todayDate();
    const end = body.endDate || body.end || start;
    const plans = await storage.listMealPlans(user.id, start, end);
    const groceryList = await storage.saveGroceryList(user.id, { id: body.id || randomId('grocery'), startDate: start, endDate: end, items: aggregateGroceryFromPlans(plans), checkedItems: [], createdAt: nowIso(), updatedAt: nowIso() });
    return json(res, 201, { groceryList });
  }

  if (url.pathname === '/api/grocery/current') {
    if (!user) return unauthorized(res);
    if (req.method !== 'GET') return methodNotAllowed(res);
    const lists = await storage.listGroceryLists(user.id, url.searchParams.get('start'), url.searchParams.get('end'));
    return json(res, 200, { groceryList: lists[0] || null, groceryLists: lists });
  }

  const groceryMatch = url.pathname.match(/^\/api\/grocery\/([^/]+)$/);
  if (groceryMatch) {
    if (!user) return unauthorized(res);
    if (req.method !== 'PUT') return methodNotAllowed(res);
    const id = decodeURIComponent(groceryMatch[1]);
    const saved = await storage.saveGroceryList(user.id, { ...(await readBody(req)), id, updatedAt: nowIso() });
    return json(res, 200, { groceryList: saved });
  }

  const mealPlanMatch = url.pathname.match(/^\/api\/meal-plans\/([^/]+)$/);
  if (mealPlanMatch) {
    if (!user) return unauthorized(res);
    const id = decodeURIComponent(mealPlanMatch[1]);
    if (req.method === 'GET') {
      const plan = await storage.getMealPlan(user.id, id);
      return plan ? json(res, 200, { mealPlan: plan }) : notFound(res);
    }
    if (req.method === 'PUT') {
      const body = await readBody(req);
      const plan = { ...body, id, userId: user.id, updatedAt: nowIso() };
      const saved = await storage.saveMealPlan(user.id, plan);
      return json(res, 200, { mealPlan: saved });
    }
    if (req.method === 'DELETE') {
      await storage.deleteMealPlan(user.id, id);
      return noContent(res);
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
    const user = await getUserFromRequest(req);
    if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url, user);
    return serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: error.message || 'Internal server error' });
  }
});

async function start() {
  await storage.initializeStorage();
  server.listen(PORT, () => {
    console.log(`Diet Planner backend listening on http://localhost:${PORT}`);
    console.log(`Storage: ${storage.usingPostgres() ? 'PostgreSQL via DATABASE_URL' : 'local JSON fallback (non-production only)'}`);
    console.log(`USDA provider: ${USDA_FDC_API_KEY ? 'enabled' : 'disabled - set USDA_FDC_API_KEY'}`);
    console.log(`Open Food Facts provider: ${OPENFOODFACTS_ENABLED ? 'enabled' : 'disabled'}`);
  });
}

start().catch((error) => {
  console.error('Diet Planner backend failed to start:', error.message);
  process.exit(1);
});
