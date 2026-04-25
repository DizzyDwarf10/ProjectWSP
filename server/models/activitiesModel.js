const { all, get, run } = require('../db');

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    exerciseTypeId: row.exercise_type_id,
    exerciseTypeName: row.exercise_type_name,
    reps: row.reps,
    minutes: row.minutes,
    distanceKm: row.distance_km,
    photoUrl: row.photo_url,
    performedAt: row.performed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function createActivity(payload) {
  const result = await run(
    `INSERT INTO activities
      (user_id, exercise_type_id, reps, minutes, distance_km, photo_url, performed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.userId,
      payload.exerciseTypeId,
      payload.reps ?? null,
      payload.minutes ?? null,
      payload.distanceKm ?? null,
      payload.photoUrl ?? null,
      payload.performedAt
    ]
  );

  return findActivityById(result.lastID);
}

async function findActivityById(id) {
  const row = await get(
    `SELECT a.*, et.name AS exercise_type_name
     FROM activities a
     JOIN exercise_types et ON et.id = a.exercise_type_id
     WHERE a.id = ?`,
    [id]
  );
  return mapRow(row);
}

async function listActivitiesForUser(userId) {
  const rows = await all(
    `SELECT a.*, et.name AS exercise_type_name
     FROM activities a
     JOIN exercise_types et ON et.id = a.exercise_type_id
     WHERE a.user_id = ?
     ORDER BY a.performed_at DESC`,
    [userId]
  );
  return rows.map(mapRow);
}

async function updateActivity(id, fields) {
  const updates = [];
  const values = [];

  if (fields.exerciseTypeId !== undefined) {
    updates.push('exercise_type_id = ?');
    values.push(fields.exerciseTypeId);
  }
  if (fields.reps !== undefined) {
    updates.push('reps = ?');
    values.push(fields.reps);
  }
  if (fields.minutes !== undefined) {
    updates.push('minutes = ?');
    values.push(fields.minutes);
  }
  if (fields.distanceKm !== undefined) {
    updates.push('distance_km = ?');
    values.push(fields.distanceKm);
  }
  if (fields.photoUrl !== undefined) {
    updates.push('photo_url = ?');
    values.push(fields.photoUrl);
  }
  if (fields.performedAt !== undefined) {
    updates.push('performed_at = ?');
    values.push(fields.performedAt);
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  await run(`UPDATE activities SET ${updates.join(', ')} WHERE id = ?`, values);
  return findActivityById(id);
}

async function deleteActivity(id) {
  await run('DELETE FROM activities WHERE id = ?', [id]);
}

async function getActivityOwnership(id) {
  return get('SELECT id, user_id FROM activities WHERE id = ?', [id]);
}

async function getSummaryForUser(userId) {
  return get(
    `SELECT
        COUNT(*) AS totalActivities,
        COALESCE(SUM(minutes), 0) AS totalMinutes,
        COALESCE(SUM(distance_km), 0) AS totalDistance,
        COALESCE(SUM(reps), 0) AS totalReps
     FROM activities
     WHERE user_id = ?`,
    [userId]
  );
}

async function listFriendsFeed(userId) {
  const rows = await all(
    `SELECT a.*, et.name AS exercise_type_name, u.name AS user_name, u.profile_picture
     FROM user_friends f
     JOIN activities a ON a.user_id = f.friend_id
     JOIN exercise_types et ON et.id = a.exercise_type_id
     JOIN users u ON u.id = a.user_id
     WHERE f.user_id = ?
     ORDER BY a.performed_at DESC
     LIMIT 100`,
    [userId]
  );

  return rows.map((row) => ({
    ...mapRow(row),
    userName: row.user_name,
    userProfilePicture: row.profile_picture
  }));
}

module.exports = {
  createActivity,
  findActivityById,
  listActivitiesForUser,
  updateActivity,
  deleteActivity,
  getActivityOwnership,
  getSummaryForUser,
  listFriendsFeed
};
