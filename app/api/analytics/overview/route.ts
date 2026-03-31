import { connectDB } from "@/src/lib/db";
import SensorData from "@/src/models/SensorData";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const total = await SensorData.countDocuments();

  return NextResponse.json({ total });
}