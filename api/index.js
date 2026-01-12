const createApp = require('../src/app');
const { connectDB } = require('../src/config/db');

// Lazy-initialized app: connect DB on cold start and cache app across warm invocations
let appPromise;

module.exports = async (req, res) => {
  // Quick responses for site root and health checks so Vercel shows a friendly page
  if (req.url === '/' || req.url === '') {
    // Redirect the site root to the API items endpoint
    res.statusCode = 302;
    res.setHeader('Location', '/api/items');
    return res.end();
  }

  if (req.url === '/_health' || req.url === '/health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    return res.end('OK');
  }

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
