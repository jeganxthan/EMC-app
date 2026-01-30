import { NextRequest, NextResponse } from "next/server";
import Patient from "@/models/Patient";
import dbConnect from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";
import { z } from "zod";

const patientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.coerce.number().int().positive("Age must be a positive number"),
  gender: z.enum(['Male', 'Female', 'Other'], { message: "Gender must be Male, Female, or Other" }),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  phone: z.string().min(5, "Phone number is required"),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const patients = await Patient.find({ doctor: userId }).sort({ createdAt: -1 });
    return NextResponse.json(patients);
  } catch {
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const result = patientSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const patient = await Patient.create({
      ...result.data,
      doctor: userId
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create patient";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
