import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoMemoryServer;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (mongoUri) {
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return conn;
    }

    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected via in-memory server: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    const isLocalConnectionIssue = /ECONNREFUSED|ENOTFOUND|failed to connect|MongoServerSelectionError/i.test(error.message || "");

    if (isLocalConnectionIssue) {
      try {
        mongoMemoryServer = await MongoMemoryServer.create();
        const uri = mongoMemoryServer.getUri();
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB fallback connected via in-memory server: ${conn.connection.host}`);
        return conn;
      } catch (fallbackError) {
        console.error(`MongoDB fallback connection error: ${fallbackError.message}`);
        process.exit(1);
      }
    }

    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

