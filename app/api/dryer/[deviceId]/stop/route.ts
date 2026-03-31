export async function POST(
  req: Request,
  { params }: { params: { deviceId: string } }
) {
  await connectDB();

  const cmd = await Command.create({
    deviceId: params.deviceId,
    command: "STOP",
  });

  return NextResponse.json(cmd);
}