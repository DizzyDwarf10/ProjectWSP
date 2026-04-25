const bcrypt = require('bcryptjs');
const { createAccessToken } = require('../utils/jwt');
const usersModel = require('../models/usersModel');

async function register(req, res) {
  const { name, password, profilePicture } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: 'name and password are required' });
  }

  const existing = await usersModel.findUserByName(name);
  if (existing) {
    return res.status(409).json({ error: 'A user with this name already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await usersModel.createUser({ name, passwordHash, profilePicture });
  const token = createAccessToken(user);

  return res.status(201).json({ token, user });
}

async function login(req, res) {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: 'name and password are required' });
  }

  const existing = await usersModel.findUserByName(name);
  if (!existing) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, existing.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const user = {
    id: existing.id,
    name: existing.name,
    role: existing.role,
    profilePicture: existing.profile_picture,
    createdAt: existing.created_at
  };

  const token = createAccessToken(user);
  return res.json({ token, user });
}

async function me(req, res) {
  const user = await usersModel.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({ user });
}

module.exports = {
  register,
  login,
  me
};
