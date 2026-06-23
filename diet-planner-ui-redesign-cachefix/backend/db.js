'use strict';

const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || '';
const NODE_ENV = process.env.NODE_ENV || '';
const isProduction = NODE_ENV === 'production';
let pool = null;

function hasDatabase() {
  return Boolean(DATABASE_URL);
}

function getPool() {
  if (!DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

async function query(text, params = []) {
  const activePool = getPool();
  if (!activePool) throw new Error('DATABASE_URL is not configured');
  return activePool.query(text, params);
}

async function initializeDatabase() {
  if (!DATABASE_URL) {
    if (isProduction) throw new Error('DATABASE_URL is required in production. PostgreSQL-backed storage is required for durable cloud accounts.');
    console.warn('DATABASE_URL is not configured. Using local JSON fallback for non-production development only.');
    return { enabled: false };
  }

  try {
    await query('SELECT 1');
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        expires_at TIMESTAMPTZ
      );
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);
      CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

      CREATE TABLE IF NOT EXISTS recipes (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);

      CREATE TABLE IF NOT EXISTS custom_foods (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_custom_foods_user_id ON custom_foods(user_id);

      CREATE TABLE IF NOT EXISTS nutrition_cache (
        id TEXT PRIMARY KEY,
        user_id TEXT NULL REFERENCES users(id) ON DELETE CASCADE,
        provider TEXT NOT NULL,
        provider_food_id TEXT NOT NULL,
        query TEXT,
        data JSONB NOT NULL,
        source_metadata JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        expires_at TIMESTAMPTZ,
        CONSTRAINT nutrition_cache_provider_food_unique UNIQUE(provider, provider_food_id)
      );
      CREATE UNIQUE INDEX IF NOT EXISTS idx_nutrition_cache_provider_food_unique ON nutrition_cache(provider, provider_food_id);
      CREATE INDEX IF NOT EXISTS idx_nutrition_cache_provider ON nutrition_cache(provider);
      CREATE INDEX IF NOT EXISTS idx_nutrition_cache_provider_food_id ON nutrition_cache(provider_food_id);
      CREATE INDEX IF NOT EXISTS idx_nutrition_cache_expires_at ON nutrition_cache(expires_at);
      CREATE INDEX IF NOT EXISTS idx_nutrition_cache_query ON nutrition_cache(query);

      CREATE TABLE IF NOT EXISTS meal_plans (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON meal_plans(user_id);
    `);
    console.log('PostgreSQL storage initialized.');
    return { enabled: true };
  } catch (error) {
    console.error('PostgreSQL initialization failed:', error.message);
    throw error;
  }
}

async function closeDatabase() {
  if (pool) await pool.end();
}

module.exports = {
  hasDatabase,
  query,
  initializeDatabase,
  closeDatabase,
};
