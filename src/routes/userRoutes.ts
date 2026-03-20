import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateStatus
} from "../controllers/userController";

const router = Router();

// GET /api/v1/users
router.get("/", getUsers);

// GET /api/v1/users/:id
router.get("/:id", getUserById);

// PATCH /api/v1/users/:id/status
router.patch("/:id/status", updateStatus);

export default router;