import { StackClient } from "@/components/admin/stack-client";
import { listSkills } from "@/server/actions/stack";

export default async function AdminStackPage() {
  return <StackClient rows={await listSkills()} />;
}
