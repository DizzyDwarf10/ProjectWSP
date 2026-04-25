const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const activitiesRoutes = require('./routes/activitiesRoutes');
const exerciseTypesRoutes = require('./routes/exerciseTypesRoutes');
const { notFoundHandler, errorHandler } = require('./utils/http');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/exercise-types', exerciseTypesRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
