import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema({
  deviceId: String,
  temperature: Number,
  humidity: Number,
  timestamp: Date
});

export default mongoose.model("SensorData", sensorSchema);