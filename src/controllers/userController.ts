import { Request, Response } from "express";
import User from "../models/User";

export const getUsers = async (_: Request, res: Response) => {
  const users = await User.find().select("-password");
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select("-password");
  res.json(user);
};

export const updateStatus = async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(user);
};