import { connectDB } from "@/src/lib/db";
import Device from "@/src/models/Device";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  return NextResponse.json(await Device.find());
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  return NextResponse.json(await Device.create(body));
}