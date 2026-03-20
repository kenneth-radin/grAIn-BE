import { Router } from "express";
import {
  overview,
  deviceAnalytics
} from "../controllers/analyticsController";

const router = Router();

// GET /api/v1/analytics/overview
router.get("/overview", overview);

// GET /api/v1/analytics/device/:id
router.get("/device/:id", deviceAnalytics);

export default router;