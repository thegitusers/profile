import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { Company } from "@/lib/types";

export async function getCompanyById(id: string): Promise<Company | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const company = await db
    .collection("companies")
    .findOne({ _id: new ObjectId(id) }, { projection: { passwordHash: 0 } });
  if (!company) return null;
  return { ...company, _id: company._id.toString() } as Company;
}

export async function getAllCompanies(): Promise<Company[]> {
  const db = await getDb();
  const companies = await db
    .collection("companies")
    .find({}, { projection: { passwordHash: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  return companies.map((c) => ({ ...c, _id: c._id.toString() })) as Company[];
}
