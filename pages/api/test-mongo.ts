import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!MONGO_URI) {
    return res.status(500).json({ error: "MONGO_URI not set in .env" });
  }

  if (!isConnected) {
    try {
      const db = await mongoose.connect(MONGO_URI); // ✅ no options needed
      isConnected = db.connections[0].readyState === 1;
      console.log("MongoDB Connected:", isConnected);
    } catch (error) {
      console.error("MongoDB connection error:", error);
      return res.status(500).json({ error: "Failed to connect", details: error });
    }
  }

  res.status(200).json({ message: "MongoDB is connected!", status: isConnected });
}