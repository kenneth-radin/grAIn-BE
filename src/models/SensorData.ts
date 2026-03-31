import mongoose from "mongoose";

const schema = new mongoose.Schema({
  deviceId: String,
  temperature: Number,
  humidity: Number,
  timestamp: Date,
});

export default mongoose.models.SensorData || mongoose.model("SensorData", schema);