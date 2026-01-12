const serverless = require('serverless-http');
const createApp = require('../src/app');
const { connectDB } = require('../src/config/db');

// Lazy-initialized handler: connect DB on cold start and cache handler across warm invocations
let handlerPromise;

module.exports = async (req, res) => {
  if (!handlerPromise) {
    handlerPromise = (async () => {
      await connectDB(process.env.MONGO_URI);
      const app = createApp();
      return serverless(app);
    })();
  }

  const handler = await handlerPromise;
  return handler(req, res);
};
