import { CommunityClient } from "@/components/admin/story-pages";
import { listCommunity } from "@/server/actions/story";

export default async function AdminCommunityPage() {
  return <CommunityClient rows={await listCommunity()} />;
}
