import { Request, Response } from "express";
import Command from "../models/Command";

// ESP32 polls latest command
export const getCommand = async (req: Request, res: Response) => {
  try {
    const command = await Command.findOne({
      deviceId: req.params.deviceId,
      executed: false
    }).sort({ createdAt: -1 });

    res.json(command);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ESP32 marks command as executed
export const markCommandExecuted = async (req: Request, res: Response) => {
  try {
    const command = await Command.findByIdAndUpdate(
      req.params.id,
      { executed: true },
      { new: true }
    );

    res.json(command);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};