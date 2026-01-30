import { NextRequest, NextResponse } from "next/server";
import Doctor from "@/models/Doctor";
import { signToken } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Validate input
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Find Doctor
    const doctor = await Doctor.findOne({ email }).select('+password');
    if (!doctor) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify Password
    const isMatch = await doctor.matchPassword(password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate Token
    const token = signToken(doctor._id, doctor.email);

    const response = NextResponse.json({
      message: "Login successful",
      user: { id: doctor._id, name: doctor.name, email: doctor.email },
    });

    // Set Cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
