import { MediaClient } from "@/components/admin/media-client";
import { listMediaAssets } from "@/server/actions/media";

export default async function AdminMediaPage() {
  return <MediaClient assets={await listMediaAssets()} />;
}
