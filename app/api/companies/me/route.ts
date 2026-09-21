import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getSession, setSessionCookie, signSession } from "@/lib/auth";
import { sanitizeLogoDataUrl } from "@/lib/attachments";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const company = await db
    .collection("companies")
    .findOne({ _id: new ObjectId(session.id) }, { projection: { passwordHash: 0 } });
  if (!company) {
    return NextResponse.json({ error: "Company not found." }, { status: 404 });
  }

  return NextResponse.json({ company: { ...company, _id: company._id.toString() } });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, logoDataUrl } = await request.json();

  const update: Record<string, unknown> = {};
  if (typeof name === "string" && name.trim()) {
    update.name = name.trim();
  }

  const sanitizedLogo = sanitizeLogoDataUrl(logoDataUrl);
  if (sanitizedLogo === null && logoDataUrl !== undefined && logoDataUrl !== null) {
    return NextResponse.json({ error: "Invalid logo image." }, { status: 400 });
  }
  if (sanitizedLogo !== undefined) {
    update.logoDataUrl = sanitizedLogo;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const db = await getDb();
  await db.collection("companies").updateOne({ _id: new ObjectId(session.id) }, { $set: update });

  const res = NextResponse.json({ success: true });

  if (typeof update.name === "string") {
    await db
      .collection("tickets")
      .updateMany({ companyId: session.id }, { $set: { companyName: update.name } });

    const token = await signSession({ ...session, name: update.name });
    setSessionCookie(res, token);
  }

  return res;
}
