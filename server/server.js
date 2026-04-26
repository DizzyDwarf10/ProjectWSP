require('dotenv').config();

const app = require('./app');
const { connectDb } = require('./db');
const { initSchema } = require('./db/schema');

const PORT = Number(process.env.PORT || 3000);

function validateConfiguration() {
  const requiredVariables = ['JWT_SECRET'];
  const missing = requiredVariables.filter((name) => !process.env[name]);

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

async function start() {
  validateConfiguration();
  await connectDb();
  await initSchema();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
