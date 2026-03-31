import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: String,
  assignedTo: String,
});

export default mongoose.models.Device || mongoose.model("Device", schema);