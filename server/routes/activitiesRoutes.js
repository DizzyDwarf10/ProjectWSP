const express = require('express');
const activitiesController = require('../controllers/activitiesController');
const socialController = require('../controllers/socialController');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler } = require('../utils/http');

const router = express.Router();

router.use(requireAuth);

router.get('/me', asyncHandler(activitiesController.listMyActivities));
router.get('/me/insights', asyncHandler(activitiesController.getMyInsights));
router.get('/me/summary', asyncHandler(activitiesController.getMySummary));
router.get('/friends/feed', asyncHandler(activitiesController.listMyFriendsFeed));
router.get('/friends/:friendId', asyncHandler(activitiesController.listFriendActivities));
router.post('/me', asyncHandler(activitiesController.createActivity));
router.patch('/:id', asyncHandler(activitiesController.updateActivity));
router.delete('/:id', asyncHandler(activitiesController.deleteActivity));

// Likes
router.post('/:activityId/like', asyncHandler(socialController.toggleLike));

// Comments
router.get('/:activityId/comments', asyncHandler(socialController.listComments));
router.post('/:activityId/comments', asyncHandler(socialController.addComment));
router.delete('/:activityId/comments/:commentId', asyncHandler(socialController.deleteComment));

module.exports = router;
