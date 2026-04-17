import { connectDB } from "@/src/lib/db";
import User from "@/src/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    //  Hash password
    const hashed = await bcrypt.hash(password, 10);

    //  Create user
    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Remove password before sending response
    const { password: _pwd, ...userWithoutPassword } = user.toObject();

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error("Register error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}