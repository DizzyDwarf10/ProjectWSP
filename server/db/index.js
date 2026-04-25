const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let db;

async function connectDb() {
  if (db) return db;

  const fileName = process.env.DB_FILE || 'projectwsp.sqlite';
  const dbPath = path.resolve(process.cwd(), fileName);

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec('PRAGMA foreign_keys = ON;');
  return db;
}

async function run(sql, params = []) {
  const database = await connectDb();
  return database.run(sql, params);
}

async function get(sql, params = []) {
  const database = await connectDb();
  return database.get(sql, params);
}

async function all(sql, params = []) {
  const database = await connectDb();
  return database.all(sql, params);
}

module.exports = {
  connectDb,
  run,
  get,
  all
};
