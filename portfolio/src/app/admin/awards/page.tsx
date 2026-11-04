import { AwardsClient } from "@/components/admin/story-pages";
import { listAwards } from "@/server/actions/story";

export default async function AdminAwardsPage() {
  return <AwardsClient rows={await listAwards()} />;
}
