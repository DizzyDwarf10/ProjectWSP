const express = require('express');
const activitiesController = require('../controllers/activitiesController');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler } = require('../utils/http');

const router = express.Router();

router.use(requireAuth);

router.get('/me', asyncHandler(activitiesController.listMyActivities));
router.get('/me/summary', asyncHandler(activitiesController.getMySummary));
router.get('/friends/feed', asyncHandler(activitiesController.listMyFriendsFeed));
router.get('/friends/:friendId', asyncHandler(activitiesController.listFriendActivities));
router.post('/me', asyncHandler(activitiesController.createActivity));
router.patch('/:id', asyncHandler(activitiesController.updateActivity));
router.delete('/:id', asyncHandler(activitiesController.deleteActivity));

module.exports = router;
