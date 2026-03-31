import mongoose from "mongoose";

const schema = new mongoose.Schema({
  deviceId: String,
  command: String,
  value: String,
  executed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Command || mongoose.model("Command", schema);