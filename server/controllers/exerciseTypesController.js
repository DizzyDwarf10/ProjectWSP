const exerciseTypesModel = require('../models/exerciseTypesModel');

const VALID_METRIC_MODES = new Set([
  'mixed',
  'reps',
  'minutes',
  'distance',
  'reps_minutes',
  'distance_minutes'
]);

function isValidMetricMode(metricMode) {
  return metricMode === undefined || VALID_METRIC_MODES.has(metricMode);
}

async function listExerciseTypes(_req, res) {
  const exerciseTypes = await exerciseTypesModel.listExerciseTypes();
  return res.json({ exerciseTypes });
}

async function createExerciseType(req, res) {
  const { name, metricMode } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  if (!isValidMetricMode(metricMode)) {
    return res.status(400).json({ error: 'metricMode is invalid' });
  }

  const created = await exerciseTypesModel.createExerciseType({
    name,
    metricMode,
    createdBy: req.user.id
  });
  return res.status(201).json({ exerciseType: created });
}

async function updateExerciseType(req, res) {
  const id = Number(req.params.id);
  if (!isValidMetricMode(req.body.metricMode)) {
    return res.status(400).json({ error: 'metricMode is invalid' });
  }

  const updated = await exerciseTypesModel.updateExerciseType(id, {
    name: req.body.name,
    metricMode: req.body.metricMode
  });

  if (!updated) {
    return res.status(404).json({ error: 'Exercise type not found' });
  }

  return res.json({ exerciseType: updated });
}

async function deleteExerciseType(req, res) {
  const id = Number(req.params.id);
  await exerciseTypesModel.deleteExerciseType(id);
  return res.status(204).send();
}

module.exports = {
  listExerciseTypes,
  createExerciseType,
  updateExerciseType,
  deleteExerciseType
};
