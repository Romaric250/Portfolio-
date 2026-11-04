import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/server/actions/settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  return <SettingsForm settings={settings} />;
}
