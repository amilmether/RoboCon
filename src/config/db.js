const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

/**
 * Connect to MongoDB using Mongoose
 * This module supports two modes:
 *  - If `mongoUri` is provided (MONGO_URI env var) it connects to that DB (recommended for production).
 *  - If no URI is provided it starts an in-memory MongoDB (mongodb-memory-server) for local/dev/testing.
 *
 * It also exports `closeDB` which stops the in-memory server when used.
 */

let mongoServer;

async function connectDB(mongoUri) {
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, opts);
      console.log('✅ MongoDB connected (URI)');
      return;
    } catch (err) {
      console.error('❌ MongoDB connection error (URI):', err.message);
      throw err;
    }
  }

  // Fallback to in-memory MongoDB for development / testing
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, opts);
    console.log('✅ In-memory MongoDB started');
  } catch (err) {
    console.error('❌ In-memory MongoDB error:', err.message);
    throw err;
  }
}

async function closeDB() {
  try {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
    console.log('🛑 MongoDB connection closed');
  } catch (err) {
    console.error('Error closing MongoDB:', err.message);
  }
}

module.exports = {
  connectDB,
  closeDB,
};
