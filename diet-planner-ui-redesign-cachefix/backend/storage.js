'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const DATA_DIR = path.join(__dirname, 'data');
const files = {
  users: path.join(DATA_DIR, 'users.json'),
  sessions: path.join(DATA_DIR, 'sessions.json'),
  customFoods: path.join(DATA_DIR, 'custom-foods.json'),
  nutritionCache: path.join(DATA_DIR, 'nutrition-cache.json'),
  recipes: path.join(DATA_DIR, 'recipes.json'),
  mealPlans: path.join(DATA_DIR, 'meal-plans.json'),
};

function usingPostgres() {
  return db.hasDatabase();
}

async function initializeStorage() {
  const result = await db.initializeDatabase();
  if (!usingPostgres()) fs.mkdirSync(DATA_DIR, { recursive: true });
  return result;
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
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2));
  fs.renameSync(tmp, file);
}

function iso(value) {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function matchesFood(food, query) {
  const q = normalizeText(query);
  if (!q) return true;
  return [food.name, food.displayNameEn, food.displayNameIt, food.brand, ...(food.aliases || [])]
    .some((value) => normalizeText(value).includes(q));
}

function publicDataRecord(row) {
  const data = row.data || {};
  return {
    ...data,
    id: row.id,
    userId: row.user_id || data.userId || null,
    createdAt: data.createdAt || iso(row.created_at),
    updatedAt: data.updatedAt || iso(row.updated_at),
  };
}

function userFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
  };
}

function sessionFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    tokenHash: row.token_hash,
    createdAt: iso(row.created_at),
    expiresAt: iso(row.expires_at),
  };
}

function cacheId(provider, providerFoodId) {
  return `cache_${crypto.createHash('sha256').update(`${provider}:${providerFoodId}`).digest('hex').slice(0, 32)}`;
}

function cacheIsFresh(item) {
  return !item.expiresAt || new Date(item.expiresAt).getTime() > Date.now();
}

function normalizeCacheEntry(entry) {
  const provider = String(entry.provider || entry.sourceProvider || 'unknown');
  const providerFoodId = String(entry.providerFoodId || entry.sourceId || entry.id || 'unknown');
  return {
    id: entry.cacheId || cacheId(provider, providerFoodId),
    userId: entry.userId || null,
    provider,
    providerFoodId,
    query: entry.query || null,
    data: { ...entry, sourceProvider: entry.sourceProvider || provider, sourceId: entry.sourceId || providerFoodId },
    sourceMetadata: entry.sourceMetadata || entry.source_metadata || {
      provider,
      providerFoodId,
      sourceUrl: entry.sourceUrl || '',
      cachedAt: entry.cachedAt || null,
    },
    expiresAt: entry.expiresAt || null,
  };
}

async function getUserByEmail(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (usingPostgres()) {
    const result = await db.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [normalizedEmail]);
    return userFromRow(result.rows[0]);
  }
  return readJson(files.users, []).find((item) => item.email === normalizedEmail) || null;
}

async function getUserById(id) {
  if (usingPostgres()) {
    const result = await db.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
    return userFromRow(result.rows[0]);
  }
  return readJson(files.users, []).find((item) => item.id === id) || null;
}

async function createUser(user) {
  if (usingPostgres()) {
    const result = await db.query(
      `INSERT INTO users (id, email, password_hash, created_at, updated_at)
       VALUES ($1, $2, $3, COALESCE($4::timestamptz, NOW()), COALESCE($5::timestamptz, NOW()))
       ON CONFLICT (email) DO NOTHING
       RETURNING *`,
      [user.id, user.email, user.passwordHash || user.password_hash, user.createdAt || null, user.updatedAt || null]
    );
    if (result.rows[0]) return userFromRow(result.rows[0]);
    return getUserByEmail(user.email);
  }
  const users = readJson(files.users, []);
  const existing = users.find((item) => item.email === user.email);
  if (existing) return existing;
  users.push(user);
  writeJson(files.users, users);
  return user;
}

async function createSession(session) {
  if (usingPostgres()) {
    const result = await db.query(
      `INSERT INTO sessions (id, user_id, token_hash, created_at, expires_at)
       VALUES ($1, $2, $3, COALESCE($4::timestamptz, NOW()), $5::timestamptz)
       RETURNING *`,
      [session.id, session.userId, session.tokenHash, session.createdAt || null, session.expiresAt || null]
    );
    return sessionFromRow(result.rows[0]);
  }
  const sessions = readJson(files.sessions, []).filter((item) => !item.expiresAt || new Date(item.expiresAt).getTime() > Date.now());
  sessions.push(session);
  writeJson(files.sessions, sessions);
  return session;
}

async function getSessionByTokenHash(tokenHash) {
  if (usingPostgres()) {
    const result = await db.query(
      `SELECT * FROM sessions
       WHERE token_hash = $1 AND (expires_at IS NULL OR expires_at > NOW())
       LIMIT 1`,
      [tokenHash]
    );
    return sessionFromRow(result.rows[0]);
  }
  return readJson(files.sessions, []).find((item) => item.tokenHash === tokenHash && (!item.expiresAt || new Date(item.expiresAt).getTime() > Date.now())) || null;
}

async function deleteSession(tokenHash) {
  if (usingPostgres()) {
    await db.query('DELETE FROM sessions WHERE token_hash = $1', [tokenHash]);
    return;
  }
  writeJson(files.sessions, readJson(files.sessions, []).filter((item) => item.tokenHash !== tokenHash));
}

async function listRecipes(userId) {
  if (usingPostgres()) {
    const result = await db.query('SELECT * FROM recipes WHERE user_id = $1 ORDER BY updated_at DESC', [userId]);
    return result.rows.map(publicDataRecord);
  }
  return readJson(files.recipes, []).filter((recipe) => recipe.userId === userId);
}

async function createRecipe(userId, recipe) {
  const record = { ...recipe, userId };
  if (usingPostgres()) {
    const result = await db.query(
      `INSERT INTO recipes (id, user_id, data, created_at, updated_at)
       VALUES ($1, $2, $3::jsonb, COALESCE($4::timestamptz, NOW()), NOW())
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
       WHERE recipes.user_id = EXCLUDED.user_id
       RETURNING *`,
      [record.id, userId, JSON.stringify(record), record.createdAt || null]
    );
    return publicDataRecord(result.rows[0]);
  }
  const recipes = readJson(files.recipes, []);
  recipes.push(record);
  writeJson(files.recipes, recipes);
  return record;
}

async function updateRecipe(userId, recipeId, recipe) {
  const existing = (await listRecipes(userId)).find((item) => item.id === recipeId);
  const record = { ...recipe, id: recipeId, userId, createdAt: recipe.createdAt || existing?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
  if (usingPostgres()) {
    const result = await db.query(
      `INSERT INTO recipes (id, user_id, data, created_at, updated_at)
       VALUES ($1, $2, $3::jsonb, COALESCE($4::timestamptz, NOW()), NOW())
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
       WHERE recipes.user_id = EXCLUDED.user_id
       RETURNING *`,
      [recipeId, userId, JSON.stringify(record), record.createdAt || null]
    );
    return publicDataRecord(result.rows[0]);
  }
  const recipes = readJson(files.recipes, []);
  const index = recipes.findIndex((item) => item.id === recipeId && item.userId === userId);
  if (index >= 0) recipes[index] = record;
  else recipes.push(record);
  writeJson(files.recipes, recipes);
  return record;
}

async function deleteRecipe(userId, recipeId) {
  if (usingPostgres()) {
    await db.query('DELETE FROM recipes WHERE id = $1 AND user_id = $2', [recipeId, userId]);
    return;
  }
  writeJson(files.recipes, readJson(files.recipes, []).filter((item) => !(item.id === recipeId && item.userId === userId)));
}

async function listCustomFoods(userId) {
  if (usingPostgres()) {
    const result = await db.query('SELECT * FROM custom_foods WHERE user_id = $1 ORDER BY updated_at DESC', [userId]);
    return result.rows.map(publicDataRecord);
  }
  return readJson(files.customFoods, []).filter((food) => food.userId === userId);
}

async function createCustomFood(userId, food) {
  const record = { ...food, userId };
  if (usingPostgres()) {
    const result = await db.query(
      `INSERT INTO custom_foods (id, user_id, data, created_at, updated_at)
       VALUES ($1, $2, $3::jsonb, COALESCE($4::timestamptz, NOW()), NOW())
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
       WHERE custom_foods.user_id = EXCLUDED.user_id
       RETURNING *`,
      [record.id, userId, JSON.stringify(record), record.createdAt || null]
    );
    return publicDataRecord(result.rows[0]);
  }
  const foods = readJson(files.customFoods, []).filter((item) => !(item.id === record.id && item.userId === userId));
  foods.push(record);
  writeJson(files.customFoods, foods);
  return record;
}

async function getCustomFood(userId, foodId) {
  if (usingPostgres()) {
    const result = await db.query('SELECT * FROM custom_foods WHERE id = $1 AND user_id = $2 LIMIT 1', [foodId, userId]);
    return result.rows[0] ? publicDataRecord(result.rows[0]) : null;
  }
  return readJson(files.customFoods, []).find((food) => food.id === foodId && food.userId === userId) || null;
}

async function searchCustomFoods(query, userId) {
  if (!userId) return [];
  const foods = await listCustomFoods(userId);
  return foods.filter((food) => matchesFood(food, query)).slice(0, 12);
}

async function findCachedFood(provider, providerFoodId) {
  if (usingPostgres()) {
    const result = await db.query(
      `SELECT * FROM nutrition_cache
       WHERE provider = $1 AND provider_food_id = $2 AND (expires_at IS NULL OR expires_at > NOW())
       LIMIT 1`,
      [provider, providerFoodId]
    );
    if (!result.rows[0]) return null;
    return { ...result.rows[0].data, expiresAt: iso(result.rows[0].expires_at) };
  }
  return readJson(files.nutritionCache, []).filter(cacheIsFresh).find((item) => item.sourceProvider === provider && item.sourceId === providerFoodId) || null;
}

async function getCachedFood(id, userId = null) {
  if (usingPostgres()) {
    const result = await db.query(
      `SELECT * FROM nutrition_cache
       WHERE (id = $1 OR provider_food_id = $1 OR data->>'id' = $1 OR data->>'sourceId' = $1)
         AND (user_id IS NULL OR user_id = $2)
         AND (expires_at IS NULL OR expires_at > NOW())
       ORDER BY updated_at DESC
       LIMIT 1`,
      [id, userId]
    );
    if (!result.rows[0]) return null;
    return { ...result.rows[0].data, expiresAt: iso(result.rows[0].expires_at) };
  }
  return readJson(files.nutritionCache, []).filter(cacheIsFresh).find((food) => food.id === id || food.sourceId === id) || null;
}

async function saveCachedFood(cacheEntry) {
  const entry = normalizeCacheEntry(cacheEntry);
  if (usingPostgres()) {
    const result = await db.query(
      `INSERT INTO nutrition_cache (id, user_id, provider, provider_food_id, query, data, source_metadata, expires_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8::timestamptz, NOW())
       ON CONFLICT (provider, provider_food_id) DO UPDATE SET
         data = EXCLUDED.data,
         source_metadata = EXCLUDED.source_metadata,
         query = COALESCE(EXCLUDED.query, nutrition_cache.query),
         expires_at = EXCLUDED.expires_at,
         updated_at = NOW()
       RETURNING *`,
      [entry.id, entry.userId, entry.provider, entry.providerFoodId, entry.query, JSON.stringify(entry.data), JSON.stringify(entry.sourceMetadata), entry.expiresAt]
    );
    return { ...result.rows[0].data, expiresAt: iso(result.rows[0].expires_at) };
  }
  const cache = readJson(files.nutritionCache, []).filter(cacheIsFresh);
  const next = cache.filter((item) => !(item.sourceProvider === entry.provider && item.sourceId === entry.providerFoodId));
  next.push({ ...entry.data, cachedAt: new Date().toISOString(), expiresAt: entry.expiresAt });
  writeJson(files.nutritionCache, next);
  return entry.data;
}

async function searchCachedFoods(query, userId = null) {
  if (usingPostgres()) {
    const pattern = `%${String(query || '').trim()}%`;
    const result = await db.query(
      `SELECT * FROM nutrition_cache
       WHERE (expires_at IS NULL OR expires_at > NOW())
         AND (user_id IS NULL OR user_id = $2)
         AND (
           $1 = '%%'
           OR query ILIKE $1
           OR data->>'name' ILIKE $1
           OR data->>'displayNameEn' ILIKE $1
           OR data->>'displayNameIt' ILIKE $1
           OR data->>'brand' ILIKE $1
           OR data::text ILIKE $1
         )
       ORDER BY updated_at DESC
       LIMIT 12`,
      [pattern, userId]
    );
    return result.rows.map((row) => ({ ...row.data, expiresAt: iso(row.expires_at) }));
  }
  return readJson(files.nutritionCache, []).filter(cacheIsFresh).filter((food) => matchesFood(food, query)).slice(0, 12);
}

async function getMealPlan(userId, planId) {
  if (usingPostgres()) {
    const result = await db.query('SELECT * FROM meal_plans WHERE id = $1 AND user_id = $2 LIMIT 1', [planId, userId]);
    return result.rows[0] ? publicDataRecord(result.rows[0]) : null;
  }
  return readJson(files.mealPlans, []).find((plan) => plan.id === planId && plan.userId === userId) || null;
}

async function listMealPlans(userId) {
  if (usingPostgres()) {
    const result = await db.query('SELECT * FROM meal_plans WHERE user_id = $1 ORDER BY updated_at DESC', [userId]);
    return result.rows.map(publicDataRecord);
  }
  return readJson(files.mealPlans, []).filter((plan) => plan.userId === userId);
}

async function saveMealPlan(userId, plan) {
  const record = { ...plan, userId };
  if (usingPostgres()) {
    const result = await db.query(
      `INSERT INTO meal_plans (id, user_id, data, created_at, updated_at)
       VALUES ($1, $2, $3::jsonb, COALESCE($4::timestamptz, NOW()), NOW())
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
       WHERE meal_plans.user_id = EXCLUDED.user_id
       RETURNING *`,
      [record.id, userId, JSON.stringify(record), record.createdAt || null]
    );
    return publicDataRecord(result.rows[0]);
  }
  const plans = readJson(files.mealPlans, []).filter((item) => !(item.id === record.id && item.userId === userId));
  plans.push(record);
  writeJson(files.mealPlans, plans);
  return record;
}

async function deleteMealPlan(userId, planId) {
  if (usingPostgres()) {
    await db.query('DELETE FROM meal_plans WHERE id = $1 AND user_id = $2', [planId, userId]);
    return;
  }
  writeJson(files.mealPlans, readJson(files.mealPlans, []).filter((plan) => !(plan.id === planId && plan.userId === userId)));
}

module.exports = {
  usingPostgres,
  initializeStorage,
  getUserByEmail,
  getUserById,
  createUser,
  createSession,
  getSessionByTokenHash,
  deleteSession,
  listRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  listCustomFoods,
  createCustomFood,
  getCustomFood,
  searchCustomFoods,
  findCachedFood,
  getCachedFood,
  saveCachedFood,
  searchCachedFoods,
  getMealPlan,
  listMealPlans,
  saveMealPlan,
  deleteMealPlan,
};
