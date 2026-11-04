import { CvClient } from "@/components/admin/cv-client";
import { getCvSettings } from "@/server/actions/cv";

export default async function AdminCvPage() {
  return <CvClient settings={await getCvSettings()} />;
}
