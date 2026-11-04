import { WorkClient } from "@/components/admin/work-client";
import { listClientWork } from "@/server/actions/work";

export default async function AdminWorkPage() {
  const rows = await listClientWork();
  return <WorkClient rows={rows} />;
}
