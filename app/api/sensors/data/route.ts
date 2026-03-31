import { connectDB } from "@/src/lib/db";
import SensorData from "@/src/models/SensorData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();

  const data = await SensorData.create({
    ...body,
    timestamp: new Date(),
  });

  return NextResponse.json(data);
}