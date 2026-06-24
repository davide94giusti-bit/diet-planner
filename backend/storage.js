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
  mealEvents: path.join(DATA_DIR, 'meal-events.json'),
  preferences: path.join(DATA_DIR, 'preferences.json'),
  bodyMeasurements: path.join(DATA_DIR, 'body-measurements.json'),
  progressLogs: path.join(DATA_DIR, 'progress-logs.json'),
  groceryLists: path.join(DATA_DIR, 'grocery-lists.json'),
  checkIns: path.join(DATA_DIR, 'check-ins.json'),
  pantryItems: path.join(DATA_DIR, 'pantry-items.json'),
  supplements: path.join(DATA_DIR, 'supplements.json'),
  supplementLogs: path.join(DATA_DIR, 'supplement-logs.json'),
  adminFoodReviews: path.join(DATA_DIR, 'admin-food-reviews.json'),
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
    name: row.display_name || row.email,
    displayName: row.display_name || row.email,
    language: row.language || 'en',
    theme: row.theme || 'system',
    units: row.units || 'metric',
    role: row.role || 'user',
    onboardingCompleted: Boolean(row.onboarding_completed),
    onboardingStep: Number(row.onboarding_step || 0),
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
    revokedAt: iso(row.revoked_at),
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
      `INSERT INTO users (id, email, password_hash, display_name, language, theme, units, role, onboarding_completed, onboarding_step, created_at, updated_at)
       VALUES ($1, $2, $3, $4, COALESCE($5, 'en'), COALESCE($6, 'system'), COALESCE($7, 'metric'), COALESCE($8, 'user'), COALESCE($9::boolean, FALSE), COALESCE($10::integer, 0), COALESCE($11::timestamptz, NOW()), COALESCE($12::timestamptz, NOW()))
       ON CONFLICT (email) DO NOTHING
       RETURNING *`,
      [user.id, user.email, user.passwordHash || user.password_hash, user.displayName || user.name || null, user.language || null, user.theme || null, user.units || null, user.role || 'user', Boolean(user.onboardingCompleted || user.onboarding_completed), Number(user.onboardingStep || user.onboarding_step || 0), user.createdAt || null, user.updatedAt || null]
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

async function updateUser(userId, updates = {}) {
  const allowed = {
    displayName: updates.displayName || updates.name,
    language: updates.language,
    theme: updates.theme,
    units: updates.units,
    onboardingCompleted: updates.onboardingCompleted ?? updates.onboarding_completed,
    onboardingStep: updates.onboardingStep ?? updates.onboarding_step,
  };
  if (usingPostgres()) {
    const current = await getUserById(userId);
    if (!current) return null;
    const result = await db.query(
      `UPDATE users SET
         display_name = COALESCE($2, display_name),
         language = COALESCE($3, language),
         theme = COALESCE($4, theme),
         units = COALESCE($5, units),
         onboarding_completed = COALESCE($6::boolean, onboarding_completed),
         onboarding_step = COALESCE($7::integer, onboarding_step),
         updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [userId, allowed.displayName || null, allowed.language || null, allowed.theme || null, allowed.units || null, allowed.onboardingCompleted == null ? null : Boolean(allowed.onboardingCompleted), allowed.onboardingStep == null ? null : Number(allowed.onboardingStep)]
    );
    return userFromRow(result.rows[0]);
  }
  const users = readJson(files.users, []);
  const index = users.findIndex((item) => item.id === userId);
  if (index < 0) return null;
  users[index] = { ...users[index], ...Object.fromEntries(Object.entries(allowed).filter(([, value]) => value !== undefined && value !== null && value !== '')), updatedAt: new Date().toISOString() };
  writeJson(files.users, users);
  return users[index];
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
       WHERE token_hash = $1 AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at > NOW())
       LIMIT 1`,
      [tokenHash]
    );
    return sessionFromRow(result.rows[0]);
  }
  return readJson(files.sessions, []).find((item) => item.tokenHash === tokenHash && (!item.expiresAt || new Date(item.expiresAt).getTime() > Date.now())) || null;
}

async function deleteSession(tokenHash) {
  if (usingPostgres()) {
    await db.query('UPDATE sessions SET revoked_at = NOW() WHERE token_hash = $1', [tokenHash]);
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


async function updateCustomFood(userId, foodId, food) {
  return createCustomFood(userId, { ...food, id: foodId, userId, updatedAt: new Date().toISOString() });
}

async function deleteCustomFood(userId, foodId) {
  if (usingPostgres()) {
    await db.query('DELETE FROM custom_foods WHERE id = $1 AND user_id = $2', [foodId, userId]);
    return;
  }
  writeJson(files.customFoods, readJson(files.customFoods, []).filter((food) => !(food.id === foodId && food.userId === userId)));
}

async function createMealEvent(userId, event) {
  const record = { ...event, id: event.id || crypto.randomUUID(), userId, createdAt: event.createdAt || new Date().toISOString() };
  if (usingPostgres()) {
    const result = await db.query(
      `INSERT INTO meal_events (id, user_id, meal_plan_id, planned_meal_id, event_type, actual_items, actual_macro_snapshot, adjustment_applied, data, created_at)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8::boolean, $9::jsonb, COALESCE($10::timestamptz, NOW()))
       RETURNING *`,
      [record.id, userId, record.mealPlanId || null, record.plannedMealId || null, record.eventType || null, JSON.stringify(record.actualItems || []), JSON.stringify(record.actualMacroSnapshot || {}), Boolean(record.adjustmentApplied), JSON.stringify(record), record.createdAt || null]
    );
    return publicDataRecord(result.rows[0]);
  }
  const events = readJson(files.mealEvents, []);
  events.push(record);
  writeJson(files.mealEvents, events);
  return record;
}

async function listMealEvents(userId, start = null, end = null) {
  if (usingPostgres()) {
    const result = await db.query(
      `SELECT * FROM meal_events
       WHERE user_id = $1
         AND ($2::timestamptz IS NULL OR created_at >= $2::timestamptz)
         AND ($3::timestamptz IS NULL OR created_at <= $3::timestamptz)
       ORDER BY created_at DESC`,
      [userId, start || null, end || null]
    );
    return result.rows.map(publicDataRecord);
  }
  return readJson(files.mealEvents, []).filter((event) => {
    if (event.userId !== userId) return false;
    if (start && event.createdAt < start) return false;
    if (end && event.createdAt > end) return false;
    return true;
  });
}

async function savePreferences(userId, preferences) {
  const record = { ...preferences, userId, updatedAt: new Date().toISOString(), createdAt: preferences.createdAt || new Date().toISOString() };
  if (usingPostgres()) {
    const result = await db.query(
      `INSERT INTO preferences (user_id, data, created_at, updated_at)
       VALUES ($1, $2::jsonb, COALESCE($3::timestamptz, NOW()), NOW())
       ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
       RETURNING *`,
      [userId, JSON.stringify(record), record.createdAt || null]
    );
    return publicDataRecord({ ...result.rows[0], id: userId });
  }
  const rows = readJson(files.preferences, []).filter((item) => item.userId !== userId);
  rows.push(record);
  writeJson(files.preferences, rows);
  return record;
}

async function getPreferences(userId) {
  if (usingPostgres()) {
    const result = await db.query('SELECT user_id AS id, user_id, data, created_at, updated_at FROM preferences WHERE user_id = $1 LIMIT 1', [userId]);
    return result.rows[0] ? publicDataRecord(result.rows[0]) : null;
  }
  return readJson(files.preferences, []).find((item) => item.userId === userId) || null;
}

async function saveDatedRecord(fileKey, tableName, userId, record, dateField = 'date') {
  const item = { ...record, id: record.id || crypto.randomUUID(), userId, createdAt: record.createdAt || new Date().toISOString() };
  if (usingPostgres()) {
    const result = await db.query(
      `INSERT INTO ${tableName} (id, user_id, ${dateField}, data, created_at)
       VALUES ($1, $2, $3::date, $4::jsonb, COALESCE($5::timestamptz, NOW()))
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
       RETURNING *`,
      [item.id, userId, item[dateField] || item.date || item.periodStart || item.startDate || item.weekStart || null, JSON.stringify(item), item.createdAt || null]
    );
    return publicDataRecord(result.rows[0]);
  }
  const rows = readJson(files[fileKey], []).filter((row) => !(row.id === item.id && row.userId === userId));
  rows.push(item);
  writeJson(files[fileKey], rows);
  return item;
}

async function listDatedRecords(fileKey, tableName, userId, start = null, end = null, dateColumn = 'measurement_date') {
  if (usingPostgres()) {
    const result = await db.query(
      `SELECT * FROM ${tableName}
       WHERE user_id = $1
         AND ($2::date IS NULL OR ${dateColumn} >= $2::date)
         AND ($3::date IS NULL OR ${dateColumn} <= $3::date)
       ORDER BY ${dateColumn} DESC, created_at DESC`,
      [userId, start || null, end || null]
    );
    return result.rows.map(publicDataRecord);
  }
  return readJson(files[fileKey], []).filter((item) => {
    const date = item.date || item.measurementDate || item.periodStart || item.startDate || item.weekStart || '';
    if (item.userId !== userId) return false;
    if (start && date < start) return false;
    if (end && date > end) return false;
    return true;
  });
}

async function saveBodyMeasurement(userId, record) {
  const date = record.date || record.measurementDate || new Date().toISOString().slice(0, 10);
  return saveDatedRecord('bodyMeasurements', 'body_measurements', userId, { ...record, measurement_date: date, date }, 'measurement_date');
}

async function listBodyMeasurements(userId, start = null, end = null) {
  return listDatedRecords('bodyMeasurements', 'body_measurements', userId, start, end, 'measurement_date');
}

async function saveProgressLog(userId, record) {
  const item = { ...record, id: record.id || crypto.randomUUID(), userId, periodStart: record.periodStart || record.period_start || null, periodEnd: record.periodEnd || record.period_end || null, createdAt: record.createdAt || new Date().toISOString() };
  if (usingPostgres()) {
    const result = await db.query(
      `INSERT INTO progress_logs (id, user_id, period_start, period_end, data, created_at)
       VALUES ($1, $2, $3::date, $4::date, $5::jsonb, COALESCE($6::timestamptz, NOW()))
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
       RETURNING *`,
      [item.id, userId, item.periodStart || null, item.periodEnd || null, JSON.stringify(item), item.createdAt || null]
    );
    return publicDataRecord(result.rows[0]);
  }
  const rows = readJson(files.progressLogs, []).filter((row) => !(row.id === item.id && row.userId === userId));
  rows.push(item);
  writeJson(files.progressLogs, rows);
  return item;
}

async function listProgressLogs(userId, start = null, end = null) {
  if (usingPostgres()) {
    const result = await db.query(
      `SELECT * FROM progress_logs
       WHERE user_id = $1
         AND ($2::date IS NULL OR period_end >= $2::date)
         AND ($3::date IS NULL OR period_start <= $3::date)
       ORDER BY period_start DESC, created_at DESC`,
      [userId, start || null, end || null]
    );
    return result.rows.map(publicDataRecord);
  }
  return readJson(files.progressLogs, []).filter((item) => item.userId === userId);
}

async function saveGroceryList(userId, record) {
  const item = { ...record, id: record.id || crypto.randomUUID(), userId, startDate: record.startDate || record.start_date || null, endDate: record.endDate || record.end_date || null, updatedAt: new Date().toISOString(), createdAt: record.createdAt || new Date().toISOString() };
  if (usingPostgres()) {
    const result = await db.query(
      `INSERT INTO grocery_lists (id, user_id, start_date, end_date, data, created_at, updated_at)
       VALUES ($1, $2, $3::date, $4::date, $5::jsonb, COALESCE($6::timestamptz, NOW()), NOW())
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date, updated_at = NOW()
       RETURNING *`,
      [item.id, userId, item.startDate || null, item.endDate || null, JSON.stringify(item), item.createdAt || null]
    );
    return publicDataRecord(result.rows[0]);
  }
  const rows = readJson(files.groceryLists, []).filter((row) => !(row.id === item.id && row.userId === userId));
  rows.push(item);
  writeJson(files.groceryLists, rows);
  return item;
}

async function listGroceryLists(userId, start = null, end = null) {
  if (usingPostgres()) {
    const result = await db.query(
      `SELECT * FROM grocery_lists
       WHERE user_id = $1
         AND ($2::date IS NULL OR end_date >= $2::date)
         AND ($3::date IS NULL OR start_date <= $3::date)
       ORDER BY start_date DESC, updated_at DESC`,
      [userId, start || null, end || null]
    );
    return result.rows.map(publicDataRecord);
  }
  return readJson(files.groceryLists, []).filter((item) => item.userId === userId);
}

async function saveCheckIn(userId, record) {
  const item = { ...record, id: record.id || crypto.randomUUID(), userId, weekStart: record.weekStart || record.week_start || record.periodStart || null, updatedAt: new Date().toISOString(), createdAt: record.createdAt || new Date().toISOString() };
  if (usingPostgres()) {
    const result = await db.query(
      `INSERT INTO check_ins (id, user_id, week_start, data, created_at, updated_at)
       VALUES ($1, $2, $3::date, $4::jsonb, COALESCE($5::timestamptz, NOW()), NOW())
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
       RETURNING *`,
      [item.id, userId, item.weekStart || null, JSON.stringify(item), item.createdAt || null]
    );
    return publicDataRecord(result.rows[0]);
  }
  const rows = readJson(files.checkIns, []).filter((row) => !(row.id === item.id && row.userId === userId));
  rows.push(item);
  writeJson(files.checkIns, rows);
  return item;
}

async function listCheckIns(userId) {
  if (usingPostgres()) {
    const result = await db.query('SELECT * FROM check_ins WHERE user_id = $1 ORDER BY week_start DESC, updated_at DESC', [userId]);
    return result.rows.map(publicDataRecord);
  }
  return readJson(files.checkIns, []).filter((item) => item.userId === userId);
}

function jsonDataRecord(row) {
  if (!row) return null;
  return publicDataRecord(row);
}

async function listJsonRows(fileKey, tableName, userId, orderBy = 'updated_at DESC') {
  if (usingPostgres()) {
    const result = await db.query(`SELECT * FROM ${tableName} WHERE user_id = $1 ORDER BY ${orderBy}`, [userId]);
    return result.rows.map(jsonDataRecord);
  }
  return readJson(files[fileKey], []).filter((item) => item.userId === userId);
}

async function saveJsonRow(fileKey, tableName, userId, record, columnMap = {}) {
  const item = { ...record, id: record.id || crypto.randomUUID(), userId, createdAt: record.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
  if (usingPostgres()) {
    const columns = ['id', 'user_id', 'data', 'created_at', 'updated_at'];
    const values = ['$1', '$2', '$3::jsonb', 'COALESCE($4::timestamptz, NOW())', 'NOW()'];
    const params = [item.id, userId, JSON.stringify(item), item.createdAt || null];
    let i = params.length + 1;
    for (const [column, key] of Object.entries(columnMap)) {
      const value = item[key] ?? null;
      const isJson = value && typeof value === 'object';
      columns.splice(columns.length - 2, 0, column);
      values.splice(values.length - 2, 0, isJson ? `$${i}::jsonb` : `$${i}`);
      params.push(isJson ? JSON.stringify(value) : value);
      i += 1;
    }
    const updateSet = ['data = EXCLUDED.data', 'updated_at = NOW()', ...Object.keys(columnMap).map((column) => `${column} = EXCLUDED.${column}`)].join(', ');
    const result = await db.query(
      `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')})
       ON CONFLICT (id) DO UPDATE SET ${updateSet}
       RETURNING *`,
      params
    );
    return jsonDataRecord(result.rows[0]);
  }
  const rows = readJson(files[fileKey], []).filter((row) => !(row.id === item.id && row.userId === userId));
  rows.push(item);
  writeJson(files[fileKey], rows);
  return item;
}

async function deleteJsonRow(fileKey, tableName, userId, id) {
  if (usingPostgres()) {
    await db.query(`DELETE FROM ${tableName} WHERE id = $1 AND user_id = $2`, [id, userId]);
    return;
  }
  writeJson(files[fileKey], readJson(files[fileKey], []).filter((item) => !(item.id === id && item.userId === userId)));
}

async function listPantryItems(userId) {
  return listJsonRows('pantryItems', 'pantry_items', userId, 'COALESCE(expires_at, DATE \'9999-12-31\') ASC, updated_at DESC');
}

async function savePantryItem(userId, record) {
  const item = { ...record, foodId: record.foodId || record.food_id || null, rawName: record.rawName || record.raw_name || record.name || '', expiresAt: record.expiresAt || record.expires_at || null };
  return saveJsonRow('pantryItems', 'pantry_items', userId, item, { food_id: 'foodId', raw_name: 'rawName', quantity: 'quantity', unit: 'unit', grams: 'grams', category: 'category', location: 'location', expires_at: 'expiresAt', priority: 'priority' });
}

async function deletePantryItem(userId, id) {
  return deleteJsonRow('pantryItems', 'pantry_items', userId, id);
}

async function listSupplements(userId) {
  return listJsonRows('supplements', 'supplements', userId, 'active DESC, updated_at DESC');
}

async function saveSupplement(userId, record) {
  return saveJsonRow('supplements', 'supplements', userId, record, { name: 'name', type: 'type', dose: 'dose', unit: 'unit', schedule: 'schedule', active: 'active', notes: 'notes' });
}

async function deleteSupplement(userId, id) {
  return deleteJsonRow('supplements', 'supplements', userId, id);
}

async function saveSupplementLog(userId, supplementId, record) {
  const item = { ...record, supplementId, takenAt: record.takenAt || record.taken_at || new Date().toISOString() };
  return saveJsonRow('supplementLogs', 'supplement_logs', userId, item, { supplement_id: 'supplementId', taken_at: 'takenAt', status: 'status', notes: 'notes' });
}

async function listAdminFoodReviews() {
  if (usingPostgres()) {
    const result = await db.query('SELECT * FROM admin_food_reviews ORDER BY updated_at DESC LIMIT 200');
    return result.rows.map(jsonDataRecord);
  }
  return readJson(files.adminFoodReviews, []);
}

async function saveAdminFoodReview(reviewerUserId, record) {
  const item = { ...record, id: record.id || crypto.randomUUID(), reviewerUserId, createdAt: record.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
  if (usingPostgres()) {
    const result = await db.query(
      `INSERT INTO admin_food_reviews (id, food_id, reviewer_user_id, status, issue_type, notes, before_payload, after_payload, data, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9::jsonb, COALESCE($10::timestamptz, NOW()), NOW())
       ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, issue_type = EXCLUDED.issue_type, notes = EXCLUDED.notes, after_payload = EXCLUDED.after_payload, data = EXCLUDED.data, updated_at = NOW()
       RETURNING *`,
      [item.id, item.foodId || item.food_id || null, reviewerUserId, item.status || 'open', item.issueType || item.issue_type || null, item.notes || '', JSON.stringify(item.beforePayload || item.before_payload || {}), JSON.stringify(item.afterPayload || item.after_payload || {}), JSON.stringify(item), item.createdAt || null]
    );
    return jsonDataRecord(result.rows[0]);
  }
  const rows = readJson(files.adminFoodReviews, []).filter((row) => row.id !== item.id);
  rows.push(item);
  writeJson(files.adminFoodReviews, rows);
  return item;
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

async function listMealPlans(userId, start = null, end = null) {
  if (usingPostgres()) {
    if (start || end) {
      const result = await db.query(
        `SELECT * FROM meal_plans
         WHERE user_id = $1
           AND ($2::date IS NULL OR NULLIF(data->>'date', '')::date >= $2::date)
           AND ($3::date IS NULL OR NULLIF(data->>'date', '')::date <= $3::date)
         ORDER BY (data->>'date') DESC, updated_at DESC`,
        [userId, start || null, end || null]
      );
      return result.rows.map(publicDataRecord);
    }
    const result = await db.query('SELECT * FROM meal_plans WHERE user_id = $1 ORDER BY updated_at DESC', [userId]);
    return result.rows.map(publicDataRecord);
  }
  return readJson(files.mealPlans, []).filter((plan) => {
    if (plan.userId !== userId) return false;
    if (start && plan.date < start) return false;
    if (end && plan.date > end) return false;
    return true;
  });
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
  updateUser,
  createSession,
  getSessionByTokenHash,
  deleteSession,
  listRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  listCustomFoods,
  createCustomFood,
  updateCustomFood,
  deleteCustomFood,
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
  createMealEvent,
  listMealEvents,
  savePreferences,
  getPreferences,
  saveBodyMeasurement,
  listBodyMeasurements,
  saveProgressLog,
  listProgressLogs,
  saveGroceryList,
  listGroceryLists,
  saveCheckIn,
  listCheckIns,
  listPantryItems,
  savePantryItem,
  deletePantryItem,
  listSupplements,
  saveSupplement,
  deleteSupplement,
  saveSupplementLog,
  listAdminFoodReviews,
  saveAdminFoodReview,
};
