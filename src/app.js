const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const itemRoutes = require('./routes/item.routes');
const notFound = require('./middlewares/notFound.middleware');
const errorHandler = require('./middlewares/error.middleware');

/**
 * Create Express application, mount middleware and routes
 * This file defines how requests flow through the app:
 * Client -> Express middleware (security, parsers) -> Routes -> Controllers -> DB
 */
function createApp() {
  const app = express();

  // Security headers
  app.use(helmet());

  // Logging - concise for production
  app.use(morgan('dev'));

  // CORS
  app.use(cors());

  // Body parser
  app.use(express.json());

  // API routes
  app.use('/api/items', itemRoutes);

  // 404 handler
  app.use(notFound);

  // Centralized error handler (must be last)
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
