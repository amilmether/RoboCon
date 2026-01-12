require('dotenv').config();
const http = require('http');
const createApp = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 4000;

async function start() {
  // Connect to DB
  await connectDB(process.env.MONGO_URI);

  const app = createApp();
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('Shutting down...');
    server.close(() => {
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
