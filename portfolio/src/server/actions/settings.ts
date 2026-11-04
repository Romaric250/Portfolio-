"use server";

import { z } from "zod";
import { invalidate, TAGS } from "@/lib/cache";
import { writeAudit } from "@/lib/admin/audit";
import { fail, ok, type ActionResult } from "@/lib/admin/types";
import { prisma } from "@/lib/db/prisma";
import { adminContext } from "@/server/actions/helpers";

const settingsSchema = z.object({
  name: z.string().min(1),
  headline: z.string(),
  tagline: z.string(),
  bio: z.string(),
  shortBio: z.string(),
  location: z.string(),
  availability: z.string(),
  availabilityOpen: z.boolean(),
  email: z.string().email().or(z.literal("")),
  phone: z.string().optional(),
  bookingUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  xUrl: z.string().optional(),
  whatsappUrl: z.string().optional(),
  siteUrl: z.string().url(),
  defaultSeoTitle: z.string(),
  defaultSeoDescription: z.string(),
  defaultKeywords: z.array(z.string()),
  googleVerification: z.string().optional(),
  bingVerification: z.string().optional(),
  jobTitle: z.string(),
  worksFor: z.string().optional(),
  nowText: z.string(),
  usesText: z.string(),
  accentHue: z.number().int().min(0).max(360),
});

export async function getSiteSettings() {
  await adminContext();
  return prisma.siteSettings.findFirst({ where: { key: "default" } });
}

export async function updateSiteSettings(input: z.infer<typeof settingsSchema>): Promise<ActionResult> {
  const { actorId } = await adminContext();
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");

  const existing = await prisma.siteSettings.findFirst({ where: { key: "default" } });
  const data = parsed.data;

  if (existing) {
    await prisma.siteSettings.update({ where: { id: existing.id }, data });
  } else {
    await prisma.siteSettings.create({ data: { key: "default", ...data } });
  }

  await writeAudit({ action: "SETTINGS", entity: "SiteSettings", summary: "Updated site settings", actorId });
  invalidate([TAGS.settings], ["/"]);
  return ok();
}
