import { Router } from "express";
import { getCommand, markCommandExecuted } from "../controllers/controllerCommand";

const router = Router();

/*
GET /api/v1/commands/:deviceId
→ ESP32 calls this to check commands
*/
router.get("/:deviceId", getCommand);

/*
PATCH /api/v1/commands/:id/execute
→ ESP32 calls this after executing command
*/
router.patch("/:id/execute", markCommandExecuted);

export default router;