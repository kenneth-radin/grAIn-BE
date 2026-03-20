import { Router } from "express";
import {
  start,
  stop,
  mode
} from "../controllers/dryerController";

const router = Router();

// POST /api/v1/dryer/:deviceId/start
router.post("/:deviceId/start", start);

// POST /api/v1/dryer/:deviceId/stop
router.post("/:deviceId/stop", stop);

// POST /api/v1/dryer/:deviceId/mode
router.post("/:deviceId/mode", mode);

export default router;