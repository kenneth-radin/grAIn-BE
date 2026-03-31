import { connectDB } from "@/src/lib/db";
import Command from "@/src/models/Command";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { deviceId: string } }
) {
  await connectDB();

  const cmd = await Command.create({
    deviceId: params.deviceId,
    command: "START",
  });

  return NextResponse.json(cmd);
}