import { Request, Response } from "express";
import SensorData from "../models/SensorData";

export const postSensor = async (req: Request, res: Response) => {
  const data = await SensorData.create({
    ...req.body,
    timestamp: new Date()
  });

  res.json(data);
};

export const getSensor = async (req: Request, res: Response) => {
  const data = await SensorData.find({ deviceId: req.params.deviceId });
  res.json(data);
};