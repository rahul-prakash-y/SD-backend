const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
console.log('MONGO_URI from env:', process.env.MONGO_URI);

/**
 * Connect to MongoDB with optimized connection pooling.
 * Uses retry logic for resilient startup.
 */
const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        // Connection pool size — tuned for moderate traffic
        maxPoolSize: 10,
        minPoolSize: 2,
        // Timeout settings
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        // Buffering
        bufferCommands: false,
      });

      console.log(`✅ MongoDB connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);

      // Graceful shutdown hooks
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err.message);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected');
      });

      return conn;
    } catch (err) {
      retries += 1;
      console.error(`❌ MongoDB connection attempt ${retries}/${maxRetries} failed: ${err.message}`);
      if (retries >= maxRetries) {
        console.error('💀 All MongoDB connection attempts exhausted. Exiting.');
        process.exit(1);
      }
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, retries) * 1000));
    }
  }
};

module.exports = connectDB;
