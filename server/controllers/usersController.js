const bcrypt = require('bcryptjs');
const usersModel = require('../models/usersModel');

async function listUsers(req, res) {
  const users = await usersModel.listUsers();
  return res.json({ users });
}

async function createUser(req, res) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: only admins can create users' });
  }

  const { name, password, role, profilePicture } = req.body;
  if (!name || !password) {
    return res.status(400).json({ error: 'name and password are required' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await usersModel.createUser({
    name,
    passwordHash,
    role: role || 'user',
    profilePicture: profilePicture || null
  });

  return res.status(201).json({ user });
}

async function getUserById(req, res) {
  const targetId = Number(req.params.id);
  const isSelf = req.user.id === targetId;

  if (!isSelf && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: can only read your own user record' });
  }

  const user = await usersModel.findUserById(targetId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({ user });
}

async function updateUser(req, res) {
  const targetId = Number(req.params.id);
  const isSelf = req.user.id === targetId;

  if (!isSelf && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: can only update your own user record' });
  }

  const payload = {
    name: req.body.name,
    profilePicture: req.body.profilePicture
  };

  if (req.user.role === 'admin' && req.body.role) {
    payload.role = req.body.role;
  }

  const updated = await usersModel.updateUser(targetId, payload);
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (req.body.password) {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    await usersModel.updateUserPassword(targetId, passwordHash);
  }

  return res.json({ user: updated });
}

async function deleteUser(req, res) {
  const targetId = Number(req.params.id);
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: only admins can delete users' });
  }

  if (targetId === req.user.id) {
    return res.status(400).json({ error: 'Admins cannot delete themselves' });
  }

  await usersModel.deleteUser(targetId);
  return res.status(204).send();
}

async function listMyFriends(req, res) {
  const friends = await usersModel.listFriendsForUser(req.user.id);
  return res.json({ friends });
}

async function addMyFriend(req, res) {
  const friendId = Number(req.body.friendId);
  if (!friendId || friendId === req.user.id) {
    return res.status(400).json({ error: 'friendId must be a valid user id and not your own id' });
  }

  const friend = await usersModel.findUserById(friendId);
  if (!friend) {
    return res.status(404).json({ error: 'Friend user not found' });
  }

  await usersModel.addFriend(req.user.id, friendId);
  return res.status(201).json({ message: 'Friend added' });
}

async function removeMyFriend(req, res) {
  const friendId = Number(req.params.friendId);
  await usersModel.removeFriend(req.user.id, friendId);
  return res.status(204).send();
}

module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
  listMyFriends,
  addMyFriend,
  removeMyFriend
};
