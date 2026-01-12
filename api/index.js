const createApp = require('../src/app');
const { connectDB } = require('../src/config/db');

// Lazy-initialized app: connect DB on cold start and cache app across warm invocations
let appPromise;

module.exports = async (req, res) => {
  if (!appPromise) {
    appPromise = (async () => {
      await connectDB(process.env.MONGO_URI);
      const app = createApp();
      return app;
    })();
  }

  const app = await appPromise;
  return app(req, res);
};
