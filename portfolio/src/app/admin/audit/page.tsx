import { AuditClient } from "@/components/admin/audit-client";
import { listAuditLogs } from "@/server/actions/audit";

export default async function AdminAuditPage() {
  return <AuditClient rows={await listAuditLogs()} />;
}
