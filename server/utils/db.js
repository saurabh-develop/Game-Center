// utils/db.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let db;

export async function connectToMongo() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db(process.env.DB_NAME || "game_center");
  console.log("✅ MongoDB connected");
}

export function getDB() {
  if (!db) {
    throw new Error("❌ Database not connected. Call connectToMongo() first.");
  }
  return db;
}
