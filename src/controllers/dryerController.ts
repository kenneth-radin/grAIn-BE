import { Request, Response } from "express";
import Command from "../models/Command";

export const start = async (req: Request, res: Response) => {
  res.json(await Command.create({ deviceId: req.params.deviceId, command: "START" }));
};

export const stop = async (req: Request, res: Response) => {
  res.json(await Command.create({ deviceId: req.params.deviceId, command: "STOP" }));
};

export const mode = async (req: Request, res: Response) => {
  res.json(await Command.create({
    deviceId: req.params.deviceId,
    command: "MODE",
    value: req.body.mode
  }));
};