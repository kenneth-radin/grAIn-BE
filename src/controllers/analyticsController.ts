import { Request, Response } from "express";
import SensorData from "../models/SensorData";

export const overview = async (_: Request, res: Response) => {
  res.json({ total: await SensorData.countDocuments() });
};

export const deviceAnalytics = async (req: Request, res: Response) => {
  const data = await SensorData.find({ deviceId: req.params.id });
  res.json({ total: data.length, data });
};