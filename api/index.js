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

  // If running in production, ensure MONGO_URI is set to avoid throwing
  if (!appPromise) {
    if (process.env.NODE_ENV === 'production' && !process.env.MONGO_URI) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'MONGO_URI is not set in production environment' }));
    }

    appPromise = (async () => {
      await connectDB(process.env.MONGO_URI);
      const app = createApp();
      return app;
    })();
  }

  let app;
  try {
    app = await appPromise;
  } catch (err) {
    // Reset appPromise so a next invocation can retry initialization
    appPromise = undefined;
    console.error('Failed to initialize app:', err && err.message ? err.message : err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Failed to initialize app', details: err && err.message ? err.message : String(err) }));
  }

  return app(req, res);
};
