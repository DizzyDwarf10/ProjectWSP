const jwt = require('jsonwebtoken');

function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  );
}

module.exports = { createAccessToken };
