const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { Pool } = require('pg');

let sqliteDb;
let pgPool;

function isPostgres() {
  const provider = String(process.env.DB_PROVIDER || '').toLowerCase();
  return provider === 'supabase' || provider === 'postgres' || provider === 'postgresql';
}

function toPostgresSql(sql) {
  let transformed = String(sql || '');

  // SQLite upsert shortcut
  transformed = transformed.replace(/INSERT\s+OR\s+IGNORE\s+INTO/gi, 'INSERT INTO');
  if (/INSERT\s+INTO/i.test(transformed) && !/ON\s+CONFLICT/i.test(transformed)) {
    const hasIgnore = /INSERT\s+OR\s+IGNORE\s+INTO/i.test(sql);
    if (hasIgnore) {
      transformed = `${transformed} ON CONFLICT DO NOTHING`;
    }
  }

  let index = 0;
  transformed = transformed.replace(/\?/g, () => {
    index += 1;
    return `$${index}`;
  });

  return transformed;
}

async function connectDb() {
  if (isPostgres()) {
    if (pgPool) return pgPool;

    const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('Missing SUPABASE_DB_URL (or DATABASE_URL) for Postgres connection');
    }

    pgPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });

    await pgPool.query('SELECT 1');
    return pgPool;
  }

  if (sqliteDb) return sqliteDb;

  const fileName = process.env.DB_FILE || 'projectwsp.sqlite';
  const dbPath = path.resolve(process.cwd(), fileName);

  sqliteDb = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await sqliteDb.exec('PRAGMA foreign_keys = ON;');
  return sqliteDb;
}

async function run(sql, params = []) {
  const database = await connectDb();
  if (!isPostgres()) {
    return database.run(sql, params);
  }

  const result = await database.query(toPostgresSql(sql), params);
  return { changes: result.rowCount || 0 };
}

async function get(sql, params = []) {
  const database = await connectDb();
  if (!isPostgres()) {
    return database.get(sql, params);
  }

  const result = await database.query(toPostgresSql(sql), params);
  return result.rows[0] || null;
}

async function all(sql, params = []) {
  const database = await connectDb();
  if (!isPostgres()) {
    return database.all(sql, params);
  }

  const result = await database.query(toPostgresSql(sql), params);
  return result.rows;
}

module.exports = {
  connectDb,
  run,
  get,
  all,
  isPostgres
};
