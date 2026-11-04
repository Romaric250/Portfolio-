import { SecurityClient } from "@/components/admin/security-client";
import { getSecurityProfile } from "@/server/actions/security";

export default async function AdminSecurityPage() {
  const profile = await getSecurityProfile();
  return <SecurityClient profile={profile} />;
}
