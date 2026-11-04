import { ServicesClient } from "@/components/admin/services-client";
import { listServices } from "@/server/actions/services";

export default async function AdminServicesPage() {
  const rows = await listServices();
  return <ServicesClient initial={rows} />;
}
