import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  name: String,
  assignedTo: String
});

export default mongoose.model("Device", deviceSchema);