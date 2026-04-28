const { all, get, run } = require('../db');

// ── Likes ─────────────────────────────────────────────────────────────────────

async function getLikeCount(activityId) {
  const row = await get(
    `SELECT COUNT(*) AS count FROM activity_likes WHERE activity_id = ?`,
    [activityId]
  );
  return row ? Number(row.count) : 0;
}

async function hasUserLiked(activityId, userId) {
  const row = await get(
    `SELECT 1 FROM activity_likes WHERE activity_id = ? AND user_id = ?`,
    [activityId, userId]
  );
  return !!row;
}

async function addLike(activityId, userId) {
  await run(
    `INSERT OR IGNORE INTO activity_likes (activity_id, user_id) VALUES (?, ?)`,
    [activityId, userId]
  );
}

async function removeLike(activityId, userId) {
  await run(
    `DELETE FROM activity_likes WHERE activity_id = ? AND user_id = ?`,
    [activityId, userId]
  );
}

async function getLikesForActivities(activityIds) {
  if (!activityIds.length) return {};
  const placeholders = activityIds.map(() => '?').join(',');
  const rows = await all(
    `SELECT activity_id, user_id FROM activity_likes WHERE activity_id IN (${placeholders})`,
    activityIds
  );
  const map = {};
  for (const id of activityIds) map[id] = [];
  for (const row of rows) {
    map[row.activity_id].push(row.user_id);
  }
  return map;
}

// ── Comments ──────────────────────────────────────────────────────────────────

function mapComment(row) {
  if (!row) return null;
  return {
    id: row.id,
    activityId: row.activity_id,
    userId: row.user_id,
    userName: row.user_name,
    userProfilePicture: row.user_profile_picture,
    body: row.body,
    createdAt: row.created_at
  };
}

async function getCommentsForActivity(activityId) {
  const rows = await all(
    `SELECT ac.*, u.name AS user_name, u.profile_picture AS user_profile_picture
     FROM activity_comments ac
     JOIN users u ON u.id = ac.user_id
     WHERE ac.activity_id = ?
     ORDER BY ac.created_at ASC`,
    [activityId]
  );
  return rows.map(mapComment);
}

async function getCommentsForActivities(activityIds) {
  if (!activityIds.length) return {};
  const placeholders = activityIds.map(() => '?').join(',');
  const rows = await all(
    `SELECT ac.*, u.name AS user_name, u.profile_picture AS user_profile_picture
     FROM activity_comments ac
     JOIN users u ON u.id = ac.user_id
     WHERE ac.activity_id IN (${placeholders})
     ORDER BY ac.created_at ASC`,
    activityIds
  );
  const map = {};
  for (const id of activityIds) map[id] = [];
  for (const row of rows) {
    map[row.activity_id].push(mapComment(row));
  }
  return map;
}

async function addComment(activityId, userId, body) {
  await run(
    `INSERT INTO activity_comments (activity_id, user_id, body) VALUES (?, ?, ?)`,
    [activityId, userId, body]
  );
  const row = await get(
    `SELECT ac.*, u.name AS user_name, u.profile_picture AS user_profile_picture
     FROM activity_comments ac
     JOIN users u ON u.id = ac.user_id
     WHERE ac.activity_id = ? AND ac.user_id = ?
     ORDER BY ac.id DESC LIMIT 1`,
    [activityId, userId]
  );
  return mapComment(row);
}

async function deleteComment(commentId) {
  await run(`DELETE FROM activity_comments WHERE id = ?`, [commentId]);
}

async function findCommentById(commentId) {
  const row = await get(
    `SELECT ac.*, u.name AS user_name, u.profile_picture AS user_profile_picture
     FROM activity_comments ac
     JOIN users u ON u.id = ac.user_id
     WHERE ac.id = ?`,
    [commentId]
  );
  return mapComment(row);
}

module.exports = {
  getLikeCount,
  hasUserLiked,
  addLike,
  removeLike,
  getLikesForActivities,
  getCommentsForActivity,
  getCommentsForActivities,
  addComment,
  deleteComment,
  findCommentById
};
