const { all, get, run } = require('../db');

function mapUserRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    profilePicture: row.profile_picture,
    createdAt: row.created_at
  };
}

const DEFAULT_PROFILE_PICTURE = 'https://images.unsplash.com/photo-1672344048213-76b6e77304bd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGR1bWJlbGx8ZW58MHx8MHx8fDA%3D';

async function createUser({ name, passwordHash, role = 'user', profilePicture = DEFAULT_PROFILE_PICTURE }) {
  const result = await run(
    'INSERT INTO users (name, password_hash, role, profile_picture) VALUES (?, ?, ?, ?)',
    [name, passwordHash, role, profilePicture]
  );
  return findUserById(result.lastID);
}

async function findUserByName(name) {
  const normalizedName = String(name || '').trim();
  if (!normalizedName) {
    return null;
  }

  return get(
    `SELECT *
     FROM users
     WHERE LOWER(name) = LOWER(?)
     ORDER BY CASE WHEN name = ? THEN 0 ELSE 1 END, id ASC
     LIMIT 1`,
    [normalizedName, normalizedName]
  );
}

async function findUserById(id) {
  const row = await get(
    'SELECT id, name, role, profile_picture, created_at FROM users WHERE id = ?',
    [id]
  );
  return mapUserRow(row);
}

async function listUsers() {
  const rows = await all('SELECT id, name, role, profile_picture, created_at FROM users ORDER BY id');
  return rows.map(mapUserRow);
}

async function updateUser(id, fields) {
  const updates = [];
  const values = [];

  if (fields.name !== undefined) {
    updates.push('name = ?');
    values.push(fields.name);
  }
  if (fields.role !== undefined) {
    updates.push('role = ?');
    values.push(fields.role);
  }
  if (fields.profilePicture !== undefined) {
    updates.push('profile_picture = ?');
    values.push(fields.profilePicture);
  }

  if (!updates.length) {
    return findUserById(id);
  }

  values.push(id);
  await run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
  return findUserById(id);
}

async function updateUserPassword(id, passwordHash) {
  await run('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
}

async function deleteUser(id) {
  await run('DELETE FROM users WHERE id = ?', [id]);
}

async function listFriendsForUser(userId) {
  const rows = await all(
    `SELECT u.id, u.name, u.role, u.profile_picture, u.created_at
     FROM user_friends f
     JOIN users u ON u.id = f.friend_id
     WHERE f.user_id = ?
     ORDER BY u.name`,
    [userId]
  );

  return rows.map(mapUserRow);
}

async function addFriend(userId, friendId) {
  await run('INSERT OR IGNORE INTO user_friends (user_id, friend_id) VALUES (?, ?)', [userId, friendId]);
  await run('INSERT OR IGNORE INTO user_friends (user_id, friend_id) VALUES (?, ?)', [friendId, userId]);
}

async function removeFriend(userId, friendId) {
  await run('DELETE FROM user_friends WHERE user_id = ? AND friend_id = ?', [userId, friendId]);
  await run('DELETE FROM user_friends WHERE user_id = ? AND friend_id = ?', [friendId, userId]);
}

async function isFriend(userId, friendId) {
  const row = await get(
    'SELECT 1 as exists_flag FROM user_friends WHERE user_id = ? AND friend_id = ?',
    [userId, friendId]
  );
  return Boolean(row);
}

module.exports = {
  createUser,
  findUserByName,
  findUserById,
  listUsers,
  updateUser,
  updateUserPassword,
  deleteUser,
  listFriendsForUser,
  addFriend,
  removeFriend,
  isFriend
};
