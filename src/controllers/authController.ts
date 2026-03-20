import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "7d"
  });
};

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id.toString()),
      user
    });

  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ SAFE CHECK
    if (!user.password) {
      return res.status(500).json({ message: "User password missing" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      success: true,
      token: generateToken(user._id.toString()),
      user
    });

  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// GET ME
export const getMe = async (req: any, res: Response) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};