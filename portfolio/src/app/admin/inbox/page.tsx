import { InboxClient } from "@/components/admin/inbox-client";
import { listMessages } from "@/server/actions/inbox";

export default async function AdminInboxPage() {
  return <InboxClient messages={await listMessages()} />;
}
