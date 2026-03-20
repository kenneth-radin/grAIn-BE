import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import deviceRoutes from "./routes/deviceRoutes";
import sensorRoutes from "./routes/sensorRoutes";
import dryerRoutes from "./routes/dryerRoutes";
import commandRoutes from "./routes/commandRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/devices", deviceRoutes);
app.use("/api/v1/sensors", sensorRoutes);
app.use("/api/v1/dryer", dryerRoutes);
app.use("/api/v1/commands", commandRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

// Connect DB
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));