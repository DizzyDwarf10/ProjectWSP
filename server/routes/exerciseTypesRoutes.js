const express = require('express');
const exerciseTypesController = require('../controllers/exerciseTypesController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { asyncHandler } = require('../utils/http');

const router = express.Router();

router.get('/', requireAuth, asyncHandler(exerciseTypesController.listExerciseTypes));
router.post('/', requireAuth, requireRole('admin'), asyncHandler(exerciseTypesController.createExerciseType));
router.patch('/:id', requireAuth, requireRole('admin'), asyncHandler(exerciseTypesController.updateExerciseType));
router.delete('/:id', requireAuth, requireRole('admin'), asyncHandler(exerciseTypesController.deleteExerciseType));

module.exports = router;
