import { Router } from "express";
import {
  postSensor,
  getSensor
} from "../controllers/sensorController";

const router = Router();

// POST /api/v1/sensors/data
router.post("/data", postSensor);

// GET /api/v1/sensors/:deviceId
router.get("/:deviceId", getSensor);

export default router;