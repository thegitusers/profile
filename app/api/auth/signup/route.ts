import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { HONEYPOT_FIELD, isBot } from "@/lib/honeypot";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (isBot(body[HONEYPOT_FIELD])) {
      // Pretend it worked so the bot doesn't learn it was caught.
      return NextResponse.json({
        success: true,
        message: "Account created. An admin needs to approve it before you can log in.",
      });
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required." },
        { status: 400 },
      );
    }
    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const db = await getDb();
    const companies = db.collection("companies");

    const existing = await companies.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await companies.insertOne({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
      approved: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Account created. An admin needs to approve it before you can log in.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
