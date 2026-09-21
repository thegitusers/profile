import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { setSessionCookie, signSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const db = await getDb();
    const company = await db.collection("companies").findOne({ email: normalizedEmail });

    if (!company) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, company.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (!company.approved) {
      return NextResponse.json(
        { error: "Your account is pending admin approval." },
        { status: 403 },
      );
    }

    const token = await signSession({
      id: company._id.toString(),
      role: "company",
      name: company.name,
      email: company.email,
    });

    const res = NextResponse.json({ success: true });
    setSessionCookie(res, token);
    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
