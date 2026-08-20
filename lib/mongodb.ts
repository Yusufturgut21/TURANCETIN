import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export function isMongoConfigured(): boolean {
  if (!MONGODB_URI) return false;
  // Yerel MongoDB yoksa Atlas string beklenir
  if (
    MONGODB_URI.includes("127.0.0.1") ||
    MONGODB_URI.includes("localhost")
  ) {
    return process.env.ALLOW_LOCAL_MONGO === "true";
  }
  return MONGODB_URI.startsWith("mongodb");
}

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI tanımlı değil. .env.local dosyasına MongoDB Atlas connection string ekleyin."
    );
  }

  if (
    (MONGODB_URI.includes("127.0.0.1") || MONGODB_URI.includes("localhost")) &&
    process.env.ALLOW_LOCAL_MONGO !== "true"
  ) {
    throw new Error(
      "Yerel MongoDB (127.0.0.1) kullanılıyor ancak çalışmıyor. MongoDB Atlas connection string ekleyin. Detay: DEPLOYMENT.md"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }

  return cached.conn;
}
