import { SecurityLabClient } from "@/components/admin/security-lab-client";
import { listSecurityLabEntries } from "@/server/actions/security-lab";

export default async function AdminSecurityLabPage() {
  return <SecurityLabClient rows={await listSecurityLabEntries()} />;
}
