import { connectDB } from "@/src/lib/db";
import Command from "@/src/models/Command";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { deviceId: string } }
) {
  await connectDB();

  const command = await Command.findOne({
    deviceId: params.deviceId,
    executed: false,
  }).sort({ createdAt: -1 });

  return NextResponse.json(command);
}