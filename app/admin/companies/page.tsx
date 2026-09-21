import CompaniesList from "@/components/CompaniesList";
import { getAllCompanies } from "@/lib/companies";

export default async function AdminCompaniesPage() {
  const companies = await getAllCompanies();
  return <CompaniesList initialCompanies={companies} />;
}
