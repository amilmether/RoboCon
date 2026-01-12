const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

/**
 * Connect to MongoDB using Mongoose
 *
 * - If `mongoUri` is provided, connects to that DB.
 * - If no URI is provided and NODE_ENV !== 'production', starts an in-memory DB for dev/testing.
 * - If no URI and NODE_ENV === 'production', throws an error.
 *
 * This function is safe to call multiple times (it will reuse an existing connection).
 */
async function connectDB(mongoUri) {
  if (mongoose.connection.readyState >= 1) {
    console.log('✅ MongoDB already connected');
    return;
  }

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

  // No mongoUri provided
  if (process.env.NODE_ENV === 'production') {
    const err = new Error('MONGO_URI is not set in production environment');
    console.error('❌', err.message);
    throw err;
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
