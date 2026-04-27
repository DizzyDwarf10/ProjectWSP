const express = require('express');
const usersController = require('../controllers/users');
const { requireAuth, requireRole } = require('../middleware/auth');
const { asyncHandler } = require('../utils/http');

const router = express.Router();

router.use(requireAuth);

router.get('/', asyncHandler(usersController.listUsers));
router.post('/', requireRole('admin'), asyncHandler(usersController.createUser));
router.get('/me/friends', asyncHandler(usersController.listMyFriends));
router.post('/me/friends', asyncHandler(usersController.addMyFriend));
router.delete('/me/friends/:friendId', asyncHandler(usersController.removeMyFriend));
router.get('/:id', asyncHandler(usersController.getUserById));
router.patch('/:id', asyncHandler(usersController.updateUser));
router.delete('/:id', asyncHandler(usersController.deleteUser));

module.exports = router;
