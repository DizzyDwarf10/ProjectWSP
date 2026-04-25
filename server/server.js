require('dotenv').config();

const app = require('./app');
const { connectDb } = require('./db');
const { initSchema } = require('./db/schema');

const PORT = Number(process.env.PORT || 3000);

async function start() {
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
