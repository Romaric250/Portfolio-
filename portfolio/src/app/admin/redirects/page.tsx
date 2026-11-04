import { RedirectsClient } from "@/components/admin/redirects-client";
import { listRedirects } from "@/server/actions/redirects";

export default async function AdminRedirectsPage() {
  return <RedirectsClient rows={await listRedirects()} />;
}
