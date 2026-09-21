import { NextResponse, after } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { accountApprovedEmail, accountRejectedEmail } from "@/lib/emailTemplates";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { approved } = await request.json();
  if (typeof approved !== "boolean") {
    return NextResponse.json({ error: "approved (boolean) is required." }, { status: 400 });
  }

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid company id." }, { status: 400 });
  }

  const db = await getDb();
  const companies = db.collection("companies");
  const company = await companies.findOne({ _id: new ObjectId(id) });
  if (!company) {
    return NextResponse.json({ error: "Company not found." }, { status: 404 });
  }

  await companies.updateOne({ _id: new ObjectId(id) }, { $set: { approved } });

  after(() =>
    sendMail(
      company.email,
      approved ? "Your account has been approved" : "Your account approval was declined",
      approved
        ? accountApprovedEmail({ companyName: company.name })
        : accountRejectedEmail({ companyName: company.name }),
    ),
  );

  return NextResponse.json({ success: true });
}
