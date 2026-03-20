import mongoose from "mongoose";

const commandSchema = new mongoose.Schema({
  deviceId: String,
  command: String,
  value: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Command", commandSchema);