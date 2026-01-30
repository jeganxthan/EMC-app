import { NextRequest, NextResponse } from "next/server";
import Patient from "@/models/Patient";
import dbConnect from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";

type ParamsPromise = Promise<{ id: string }>;

export async function GET(req: NextRequest, props: { params: ParamsPromise }) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = await props.params;
    const patient = await Patient.findOne({ _id: params.id, doctor: userId });
    
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch {
    return NextResponse.json({ error: "Details fetch failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, props: { params: ParamsPromise }) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = await props.params;
    const body = await req.json();
    
    const patient = await Patient.findOneAndUpdate(
      { _id: params.id, doctor: userId },
      body,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: ParamsPromise }) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = await props.params;
    const patient = await Patient.findOneAndDelete({ _id: params.id, doctor: userId });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Patient deleted" });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
