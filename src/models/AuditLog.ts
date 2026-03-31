import mongoose from "mongoose";

const schema = new mongoose.Schema({
  userId: String,
  action: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.AuditLog || mongoose.model("AuditLog", schema);