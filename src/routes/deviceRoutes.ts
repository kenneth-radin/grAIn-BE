import { Router } from "express";
import {
  getDevices,
  getDevice,
  registerDevice,
  updateDevice,
  assignDevice
} from "../controllers/deviceController";

const router = Router();

// GET /api/v1/devices
router.get("/", getDevices);

// GET /api/v1/devices/:id
router.get("/:id", getDevice);

// POST /api/v1/devices/register
router.post("/register", registerDevice);

// PATCH /api/v1/devices/:id
router.patch("/:id", updateDevice);

// POST /api/v1/devices/:id/assign
router.post("/:id/assign", assignDevice);

export default router;