import { SeoClient } from "@/components/admin/seo-client";
import { listPageSeo } from "@/server/actions/seo";

export default async function AdminSeoPage() {
  return <SeoClient rows={await listPageSeo()} />;
}
