import { Router } from "express";
import { register, login, getMe } from "../controllers/authController";

const router = Router();

// POST /api/v1/auth/login
router.post("/login", login);

// POST /api/v1/auth/register
router.post("/register", register);

// GET /api/v1/auth/me
router.get("/me", getMe);

export default router;