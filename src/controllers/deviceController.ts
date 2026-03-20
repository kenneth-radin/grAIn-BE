import { Request, Response } from "express";
import Device from "../models/Device";

export const getDevices = async (_: Request, res: Response) => {
  res.json(await Device.find());
};

export const getDevice = async (req: Request, res: Response) => {
  res.json(await Device.findById(req.params.id));
};

export const registerDevice = async (req: Request, res: Response) => {
  const device = await Device.create(req.body);
  res.json(device);
};

export const updateDevice = async (req: Request, res: Response) => {
  const device = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(device);
};

export const assignDevice = async (req: Request, res: Response) => {
  const device = await Device.findByIdAndUpdate(
    req.params.id,
    { assignedTo: req.body.userId },
    { new: true }
  );
  res.json(device);
};