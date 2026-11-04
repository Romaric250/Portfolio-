import { SubscribersClient } from "@/components/admin/subscribers-client";
import { listSubscribers } from "@/server/actions/subscribers";

export default async function AdminSubscribersPage() {
  return <SubscribersClient rows={await listSubscribers()} />;
}
