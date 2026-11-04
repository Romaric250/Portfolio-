import { ExperienceClient } from "@/components/admin/story-pages";
import { listExperience } from "@/server/actions/story";

export default async function AdminExperiencePage() {
  return <ExperienceClient rows={await listExperience()} />;
}
