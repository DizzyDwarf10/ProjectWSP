const bcrypt = require('bcryptjs');
const { run, get } = require('./index');

async function createTables() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      profile_picture TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS user_friends (
      user_id INTEGER NOT NULL,
      friend_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, friend_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS exercise_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      metric_mode TEXT NOT NULL DEFAULT 'mixed',
      created_by INTEGER,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      exercise_type_id INTEGER NOT NULL,
      reps INTEGER,
      minutes INTEGER,
      distance_km REAL,
      photo_url TEXT,
      performed_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (exercise_type_id) REFERENCES exercise_types(id) ON DELETE RESTRICT
    )
  `);
}

async function seedData() {
  const existingAdmin = await get('SELECT id FROM users WHERE role = ?', ['admin']);
  if (!existingAdmin) {
    const adminPasswordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'admin123', 10);
    await run(
      'INSERT INTO users (name, password_hash, role, profile_picture) VALUES (?, ?, ?, ?)',
      ['Joseph', adminPasswordHash, 'admin', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=60']
    );
  }

  const defaultUsers = [
    {
      name: 'Sam',
      role: 'user',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60'
    },
    {
      name: 'Lebron',
      role: 'user',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60'
    }
  ];

  for (const user of defaultUsers) {
    const exists = await get('SELECT id FROM users WHERE name = ?', [user.name]);
    if (!exists) {
      const passwordHash = await bcrypt.hash('password123', 10);
      await run(
        'INSERT INTO users (name, password_hash, role, profile_picture) VALUES (?, ?, ?, ?)',
        [user.name, passwordHash, user.role, user.image]
      );
    }
  }

  const defaultTypes = [
    { name: 'Push-ups', metricMode: 'reps' },
    { name: 'Squats', metricMode: 'reps' },
    { name: 'Plank', metricMode: 'minutes' },
    { name: 'Running', metricMode: 'distance_minutes' },
    { name: 'Cycling', metricMode: 'distance_minutes' },
    { name: 'Jump Rope', metricMode: 'reps_minutes' },
    { name: 'Other', metricMode: 'mixed' }
  ];

  for (const item of defaultTypes) {
    const exists = await get('SELECT id FROM exercise_types WHERE name = ?', [item.name]);
    if (!exists) {
      await run(
        'INSERT INTO exercise_types (name, metric_mode) VALUES (?, ?)',
        [item.name, item.metricMode]
      );
    }
  }
}

async function initSchema() {
  await createTables();
  await seedData();
}

module.exports = { initSchema };
