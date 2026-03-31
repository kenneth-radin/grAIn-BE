import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  const db = await mongoose.connect(MONGO_URI);
  isConnected = db.connections[0].readyState === 1;

  console.log("MongoDB Connected");
};