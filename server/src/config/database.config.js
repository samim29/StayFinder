const mongoose = require("mongoose");

let connectionPromise;

const connectDb = async () => {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not configured");
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectionPromise) return connectionPromise;
  try {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });
    await connectionPromise;
    console.log("database connected");
    return mongoose.connection;
  } catch (error) {
    connectionPromise = undefined;
    console.error("database connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDb;
