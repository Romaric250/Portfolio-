"use client";

import * as React from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { SiteSettings } from "@prisma/client";
import { updateSiteSettings } from "@/server/actions/settings";

export function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [pending, setPending] = React.useState(false);
  const [form, setForm] = React.useState({
    name: settings?.name ?? "",
    headline: settings?.headline ?? "",
    tagline: settings?.tagline ?? "",
    bio: settings?.bio ?? "",
    shortBio: settings?.shortBio ?? "",
    location: settings?.location ?? "",
    availability: settings?.availability ?? "",
    availabilityOpen: settings?.availabilityOpen ?? true,
    email: settings?.email ?? "",
    phone: settings?.phone ?? "",
    bookingUrl: settings?.bookingUrl ?? "",
    githubUrl: settings?.githubUrl ?? "",
    linkedinUrl: settings?.linkedinUrl ?? "",
    xUrl: settings?.xUrl ?? "",
    whatsappUrl: settings?.whatsappUrl ?? "",
    siteUrl: settings?.siteUrl ?? "",
    defaultSeoTitle: settings?.defaultSeoTitle ?? "",
    defaultSeoDescription: settings?.defaultSeoDescription ?? "",
    defaultKeywords: (settings?.defaultKeywords ?? []).join(", "),
    googleVerification: settings?.googleVerification ?? "",
    bingVerification: settings?.bingVerification ?? "",
    jobTitle: settings?.jobTitle ?? "",
    worksFor: settings?.worksFor ?? "",
    nowText: settings?.nowText ?? "",
    usesText: settings?.usesText ?? "",
    accentHue: settings?.accentHue ?? 160,
  });

  const save = async () => {
    setPending(true);
    const result = await updateSiteSettings({
      ...form,
      defaultKeywords: form.defaultKeywords.split(",").map((s) => s.trim()).filter(Boolean),
      accentHue: Number(form.accentHue),
    });
    setPending(false);
    if (!result.ok) toast.error(result.error);
    else toast.success("Settings saved");
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const field = (key: keyof typeof form, label: string, multiline?: boolean) => (
    <div className="space-y-1.5">
      <Label htmlFor={key}>{label}</Label>
      {multiline ? (
        <Textarea id={key} value={String(form[key])} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} rows={4} />
      ) : (
        <Input id={key} value={String(form[key])} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
      )}
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Site settings"
        description="Identity, contact, SEO defaults, and accent."
        actions={
          <Button onClick={() => void save()} disabled={pending}>
            Save
          </Button>
        }
      />
      <div className="grid max-w-3xl gap-4">
        {field("name", "Name")}
        {field("headline", "Headline")}
        {field("tagline", "Tagline")}
        {field("jobTitle", "Job title")}
        {field("worksFor", "Works for")}
        {field("shortBio", "Short bio", true)}
        {field("bio", "Bio", true)}
        {field("location", "Location")}
        {field("availability", "Availability")}
        <div className="flex items-center justify-between hairline rounded-lg p-3">
          <Label htmlFor="availabilityOpen">Availability open</Label>
          <Switch
            id="availabilityOpen"
            checked={form.availabilityOpen}
            onCheckedChange={(v) => setForm((f) => ({ ...f, availabilityOpen: v }))}
          />
        </div>
        {field("email", "Email")}
        {field("phone", "Phone")}
        {field("bookingUrl", "Booking URL")}
        {field("githubUrl", "GitHub")}
        {field("linkedinUrl", "LinkedIn")}
        {field("xUrl", "X / Twitter")}
        {field("whatsappUrl", "WhatsApp")}
        {field("siteUrl", "Site URL")}
        {field("defaultSeoTitle", "Default SEO title")}
        {field("defaultSeoDescription", "Default SEO description", true)}
        {field("defaultKeywords", "Keywords (comma-separated)")}
        {field("googleVerification", "Google verification")}
        {field("bingVerification", "Bing verification")}
        {field("nowText", "Now", true)}
        {field("usesText", "Uses", true)}
        <div className="space-y-1.5">
          <Label htmlFor="accentHue">Accent hue</Label>
          <Input
            id="accentHue"
            type="number"
            min={0}
            max={360}
            value={form.accentHue}
            onChange={(e) => setForm((f) => ({ ...f, accentHue: Number(e.target.value) }))}
          />
        </div>
      </div>
    </div>
  );
}
