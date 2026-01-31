import { NextRequest, NextResponse } from "next/server";
import Doctor from "@/models/Doctor";
import { signToken } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  specialization: z.string().min(2, "Specialization is required"),
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Zod Validation
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, specialization } = result.data;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check existing
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Create doctor
    const doctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
      specialization,
    });

    // Create JWT Token
    const token = signToken(doctor._id, doctor.email);

    const response = NextResponse.json({
      message: "Registration successful",
      user: { id: doctor._id, name: doctor.name, email: doctor.email },
    });

    // Set secure cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error: unknown) {
    console.error("Registration error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
