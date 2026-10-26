import { MongoClient } from "mongodb";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

export function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const isAtlasConnection = uri.includes("mongodb.net");

  if (!globalForMongo.mongoClientPromise) {
    globalForMongo.mongoClientPromise = new MongoClient(uri, {
      connectTimeoutMS: 7000,
      serverSelectionTimeoutMS: 7000,
      ...(isAtlasConnection ? { tls: true } : {}),
    })
      .connect()
      .catch((error) => {
        globalForMongo.mongoClientPromise = undefined;
        throw error;
      });
  }

  return globalForMongo.mongoClientPromise;
}
