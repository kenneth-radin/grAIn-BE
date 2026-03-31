import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  status: { type: String, default: "active" },
});

export default mongoose.models.User || mongoose.model("User", schema);