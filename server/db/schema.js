const bcrypt = require('bcryptjs');
const { run, get } = require('./index');

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_PROFILE_PICTURE = 'https://images.unsplash.com/photo-1672344048213-76b6e77304bd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGR1bWJlbGx8ZW58MHx8MHx8fDA%3D';

const workoutPhotos = {
  'Push-ups': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHVzaCUyMHVwfGVufDB8fDB8fHww',
  Squats: 'https://plus.unsplash.com/premium_photo-1661906824628-3ac1f6c4ce1c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3F1YXRzfGVufDB8fDB8fHww',
  Plank: 'https://plus.unsplash.com/premium_photo-1672352100050-65cb2ee4d818?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGxhbmt8ZW58MHx8MHx8fDA%3D',
  Running: 'https://images.unsplash.com/photo-1486218119243-13883505764c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHJ1bm5pbmd8ZW58MHx8MHx8fDA%3D',
  Cycling: 'https://plus.unsplash.com/premium_photo-1713184149461-69b0abeb3daa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y3ljbGluZ3xlbnwwfHwwfHx8MA%3D%3D',
  'Jump Rope': 'https://plus.unsplash.com/premium_photo-1664299555455-3e0a5542d3ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8anVtcCUyMHJvcGV8ZW58MHx8MHx8fDA%3D',
  Other: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHdvcmtvdXR8ZW58MHx8MHx8fDA%3D'
};

const workoutTemplates = [
  { typeName: 'Push-ups', reps: 35, minutes: null, distanceKm: null },
  { typeName: 'Squats', reps: 50, minutes: null, distanceKm: null },
  { typeName: 'Plank', reps: null, minutes: 5, distanceKm: null },
  { typeName: 'Running', reps: null, minutes: 30, distanceKm: 4.8 },
  { typeName: 'Cycling', reps: null, minutes: 45, distanceKm: 12.4 },
  { typeName: 'Jump Rope', reps: 120, minutes: 12, distanceKm: null },
  { typeName: 'Other', reps: 25, minutes: null, distanceKm: null }
];

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
  const baseUsers = [
    {
      name: 'Joe',
      legacyNames: ['Joseph'],
      role: 'admin',
      image: 'https://images.unsplash.com/photo-1590692994802-fc18443010a3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGdvcmlsbGF8ZW58MHx8MHx8fDA%3D',
      password: process.env.SEED_JOE_PASSWORD || process.env.SEED_ADMIN_PASSWORD || 'joe123'
    },
    {
      name: 'Sam',
      role: 'user',
      image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D',
      password: process.env.SEED_SAM_PASSWORD || 'sam123'
    },
    {
      name: 'Lebron',
      role: 'user',
      image: 'https://thfvnext.bing.com/th/id/OIP.aXbHZ-VxdlhLKKXmo_u30gHaFE?w=311&h=180&c=7&r=0&o=7&cb=thfvnext&dpr=1.3&pid=1.7&rm=3',
      password: process.env.SEED_LEBRON_PASSWORD || 'lebron123'
    }
  ];

  for (const user of baseUsers) {
    for (const legacyName of user.legacyNames || []) {
      const current = await get('SELECT id FROM users WHERE name = ?', [user.name]);
      const legacy = await get('SELECT id FROM users WHERE name = ?', [legacyName]);

      if (!current && legacy) {
        await run('UPDATE users SET name = ? WHERE id = ?', [user.name, legacy.id]);
      }
    }

    const passwordHash = await bcrypt.hash(user.password, 10);
    const exists = await get('SELECT id FROM users WHERE name = ?', [user.name]);
    if (!exists) {
      await run(
        'INSERT INTO users (name, password_hash, role, profile_picture) VALUES (?, ?, ?, ?)',
        [user.name, passwordHash, user.role, user.image]
      );
      continue;
    }

    await run(
      'UPDATE users SET password_hash = ?, role = ?, profile_picture = ? WHERE id = ?',
      [passwordHash, user.role, user.image, exists.id]
    );
  }

  // Backfill any users with null profile_picture to the default avatar.
  await run('UPDATE users SET profile_picture = ? WHERE profile_picture IS NULL', [DEFAULT_PROFILE_PICTURE]);

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

  await seedActivities();
}

async function seedActivities() {
  const baseUserNames = ['Joe', 'Sam', 'Lebron'];

  const typeIdByName = {};
  for (const template of workoutTemplates) {
    if (typeIdByName[template.typeName]) continue;
    const typeRow = await get('SELECT id FROM exercise_types WHERE name = ?', [template.typeName]);
    if (typeRow) {
      typeIdByName[template.typeName] = typeRow.id;
    }
  }

  for (const name of baseUserNames) {
    const user = await get('SELECT id FROM users WHERE name = ?', [name]);
    if (!user) continue;

    const countRow = await get('SELECT COUNT(*) AS count FROM activities WHERE user_id = ?', [user.id]);
    const existingCount = countRow?.count || 0;

    if (existingCount >= 5) continue;

    const needed = 5 - existingCount;
    const nameOffset = name.length;

    for (let i = 0; i < needed; i += 1) {
      const templateIndex = (existingCount + i + nameOffset) % workoutTemplates.length;
      const template = workoutTemplates[templateIndex];
      const exerciseTypeId = typeIdByName[template.typeName];
      if (!exerciseTypeId) continue;

      const performedAt = new Date(Date.now() - (i + nameOffset + 1) * DAY_MS).toISOString();

      await run(
        `INSERT INTO activities
          (user_id, exercise_type_id, reps, minutes, distance_km, photo_url, performed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          exerciseTypeId,
          template.reps,
          template.minutes,
          template.distanceKm,
          workoutPhotos[template.typeName] || null,
          performedAt
        ]
      );
    }
  }
}

async function initSchema() {
  await createTables();
  await seedData();
}

module.exports = { initSchema };
