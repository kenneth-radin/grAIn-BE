import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  status: { type: String, default: "active" }
});

export default mongoose.model("User", userSchema);