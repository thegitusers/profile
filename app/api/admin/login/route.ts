import { NextResponse } from "next/server";
import { setSessionCookie, signSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Admin login is not configured." },
        { status: 500 },
      );
    }

    if (
      String(email).trim().toLowerCase() !== adminEmail.toLowerCase() ||
      password !== adminPassword
    ) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await signSession({
      id: "admin",
      role: "admin",
      name: "Admin",
      email: adminEmail,
    });

    const res = NextResponse.json({ success: true });
    setSessionCookie(res, token);
    return res;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
