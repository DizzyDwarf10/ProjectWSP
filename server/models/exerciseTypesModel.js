const { all, get, run } = require('../db');

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    metricMode: row.metric_mode,
    createdBy: row.created_by,
    createdAt: row.created_at
  };
}

async function createExerciseType({ name, metricMode = 'mixed', createdBy = null }) {
  await run(
    'INSERT INTO exercise_types (name, metric_mode, created_by) VALUES (?, ?, ?)',
    [name, metricMode, createdBy]
  );
  const row = await get('SELECT * FROM exercise_types WHERE name = ?', [name]);
  return mapRow(row);
}

async function findExerciseTypeById(id) {
  const row = await get('SELECT * FROM exercise_types WHERE id = ?', [id]);
  return mapRow(row);
}

async function listExerciseTypes() {
  const rows = await all('SELECT * FROM exercise_types ORDER BY name');
  return rows.map(mapRow);
}

async function updateExerciseType(id, fields) {
  const updates = [];
  const values = [];

  if (fields.name !== undefined) {
    updates.push('name = ?');
    values.push(fields.name);
  }
  if (fields.metricMode !== undefined) {
    updates.push('metric_mode = ?');
    values.push(fields.metricMode);
  }

  if (!updates.length) {
    return findExerciseTypeById(id);
  }

  values.push(id);
  await run(`UPDATE exercise_types SET ${updates.join(', ')} WHERE id = ?`, values);
  return findExerciseTypeById(id);
}

async function deleteExerciseType(id) {
  await run('DELETE FROM exercise_types WHERE id = ?', [id]);
}

module.exports = {
  createExerciseType,
  findExerciseTypeById,
  listExerciseTypes,
  updateExerciseType,
  deleteExerciseType
};
