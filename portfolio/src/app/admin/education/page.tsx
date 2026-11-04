import { EducationClient } from "@/components/admin/story-pages";
import { listEducation } from "@/server/actions/story";

export default async function AdminEducationPage() {
  return <EducationClient rows={await listEducation()} />;
}
