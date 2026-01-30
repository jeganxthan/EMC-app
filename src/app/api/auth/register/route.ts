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
    console.log("Registration started...");
    await dbConnect();
    console.log("Database connected");
    
    const body = await req.json();
    console.log("Body received:", { ...body, password: "****" });
    
    // Zod Validation
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      console.log("Validation failed:", result.error.issues[0].message);
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, specialization } = result.data;

    // Hash password
    console.log("Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Password hashed");

    // Check existing
    console.log("Checking for existing doctor...");
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      console.log("Email already exists");
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Create doctor
    console.log("Creating doctor record...");
    const doctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
      specialization,
    });
    console.log("Doctor created:", doctor._id);

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

    console.log("Registration complete");
    return response;
  } catch (error: unknown) {
    console.error("Registration error:", error);
    const err = error as Error;
    return NextResponse.json({ 
      error: err.message || "Internal Server Error",
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
    }, { status: 500 });
  }
}
