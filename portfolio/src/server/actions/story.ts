"use server";

import type { CommunityKind, ContentStatus } from "@prisma/client";
import { z } from "zod";
import { invalidate, TAGS } from "@/lib/cache";
import { writeAudit } from "@/lib/admin/audit";
import { fail, ok, type ActionResult } from "@/lib/admin/types";
import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils";
import { adminContext } from "@/server/actions/helpers";

const experienceSchema = z.object({
  role: z.string().min(1),
  organisation: z.string().min(1),
  organisationUrl: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  current: z.boolean(),
  summary: z.string().optional(),
  highlights: z.array(z.string()),
  stack: z.array(z.string()),
  logoUrl: z.string().optional(),
  logoKey: z.string().optional(),
  showOnCv: z.boolean(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  order: z.number().int(),
});

const educationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().optional(),
  location: z.string().optional(),
  startYear: z.number().int(),
  endYear: z.number().int().optional().nullable(),
  expected: z.boolean(),
  details: z.array(z.string()),
  url: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  order: z.number().int(),
});

const awardSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  year: z.number().int().optional().nullable(),
  date: z.string().optional().nullable(),
  description: z.string().optional(),
  url: z.string().optional(),
  showOnCv: z.boolean(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  order: z.number().int(),
});

const communitySchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  organisation: z.string().min(1),
  organisationUrl: z.string().optional(),
  kind: z.string(),
  role: z.string().optional(),
  period: z.string().optional(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  summary: z.string().min(1),
  highlights: z.array(z.string()),
  metricLabel: z.string().optional(),
  metricValue: z.string().optional(),
  coverUrl: z.string().optional(),
  coverKey: z.string().optional(),
  coverAlt: z.string().optional(),
  showOnCv: z.boolean(),
  featured: z.boolean(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  order: z.number().int(),
});

const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
  company: z.string().optional(),
  quote: z.string().min(1),
  avatarUrl: z.string().optional(),
  avatarKey: z.string().optional(),
  url: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  order: z.number().int(),
});

export async function listExperience() {
  await adminContext();
  return prisma.experience.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] });
}

export async function saveExperience(id: string | null, input: z.infer<typeof experienceSchema>): Promise<ActionResult<{ id: string }>> {
  const { actorId } = await adminContext();
  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = {
    ...parsed.data,
    startDate: new Date(parsed.data.startDate),
    endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
    status: parsed.data.status as ContentStatus,
  };
  if (id) {
    await prisma.experience.update({ where: { id }, data });
    await writeAudit({ action: "UPDATE", entity: "Experience", entityId: id, summary: `Updated ${data.role}`, actorId });
  } else {
    const c = await prisma.experience.create({ data });
    id = c.id;
    await writeAudit({ action: "CREATE", entity: "Experience", entityId: id, summary: `Created ${data.role}`, actorId });
  }
  invalidate([TAGS.experience], ["/about"]);
  return ok({ id: id! });
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  const { actorId } = await adminContext();
  await prisma.experience.delete({ where: { id } });
  await writeAudit({ action: "DELETE", entity: "Experience", entityId: id, summary: "Deleted experience", actorId });
  invalidate([TAGS.experience], ["/about"]);
  return ok();
}

export async function listEducation() {
  await adminContext();
  return prisma.education.findMany({ orderBy: [{ order: "asc" }] });
}

export async function saveEducation(id: string | null, input: z.infer<typeof educationSchema>): Promise<ActionResult<{ id: string }>> {
  const { actorId } = await adminContext();
  const parsed = educationSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = { ...parsed.data, status: parsed.data.status as ContentStatus };
  if (id) await prisma.education.update({ where: { id }, data });
  else {
    const c = await prisma.education.create({ data });
    id = c.id;
  }
  await writeAudit({ action: id ? "UPDATE" : "CREATE", entity: "Education", entityId: id, summary: `Saved education ${data.institution}`, actorId });
  invalidate([TAGS.education], ["/about"]);
  return ok({ id: id! });
}

export async function deleteEducation(id: string): Promise<ActionResult> {
  await adminContext();
  await prisma.education.delete({ where: { id } });
  invalidate([TAGS.education], ["/about"]);
  return ok();
}

export async function listAwards() {
  await adminContext();
  return prisma.award.findMany({ orderBy: [{ order: "asc" }] });
}

export async function saveAward(id: string | null, input: z.infer<typeof awardSchema>): Promise<ActionResult<{ id: string }>> {
  const { actorId } = await adminContext();
  const parsed = awardSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = {
    ...parsed.data,
    date: parsed.data.date ? new Date(parsed.data.date) : null,
    status: parsed.data.status as ContentStatus,
  };
  if (id) await prisma.award.update({ where: { id }, data });
  else {
    const c = await prisma.award.create({ data });
    id = c.id;
  }
  await writeAudit({ action: "UPDATE", entity: "Award", entityId: id, summary: `Saved award ${data.title}`, actorId });
  invalidate([TAGS.awards], ["/about"]);
  return ok({ id: id! });
}

export async function deleteAward(id: string): Promise<ActionResult> {
  await adminContext();
  await prisma.award.delete({ where: { id } });
  invalidate([TAGS.awards], ["/about"]);
  return ok();
}

export async function listCommunity() {
  await adminContext();
  return prisma.communityEntry.findMany({ orderBy: [{ order: "asc" }] });
}

export async function saveCommunity(id: string | null, input: z.infer<typeof communitySchema>): Promise<ActionResult<{ id: string }>> {
  const { actorId } = await adminContext();
  const parsed = communitySchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const slug = parsed.data.slug?.trim() || slugify(parsed.data.title);
  const data = {
    ...parsed.data,
    slug,
    kind: parsed.data.kind as CommunityKind,
    status: parsed.data.status as ContentStatus,
    startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
    endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
  };
  if (id) await prisma.communityEntry.update({ where: { id }, data });
  else {
    const c = await prisma.communityEntry.create({ data });
    id = c.id;
  }
  await writeAudit({ action: "UPDATE", entity: "CommunityEntry", entityId: id, summary: `Saved ${data.title}`, actorId });
  invalidate([TAGS.community], ["/community"]);
  return ok({ id: id! });
}

export async function deleteCommunity(id: string): Promise<ActionResult> {
  await adminContext();
  await prisma.communityEntry.delete({ where: { id } });
  invalidate([TAGS.community], ["/community"]);
  return ok();
}

export async function listTestimonials() {
  await adminContext();
  return prisma.testimonial.findMany({ orderBy: [{ order: "asc" }] });
}

export async function saveTestimonial(id: string | null, input: z.infer<typeof testimonialSchema>): Promise<ActionResult<{ id: string }>> {
  const { actorId } = await adminContext();
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = { ...parsed.data, status: parsed.data.status as ContentStatus };
  if (id) await prisma.testimonial.update({ where: { id }, data });
  else {
    const c = await prisma.testimonial.create({ data });
    id = c.id;
  }
  await writeAudit({ action: "UPDATE", entity: "Testimonial", entityId: id, summary: `Saved testimonial ${data.name}`, actorId });
  invalidate([TAGS.testimonials], ["/"]);
  return ok({ id: id! });
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  await adminContext();
  await prisma.testimonial.delete({ where: { id } });
  invalidate([TAGS.testimonials], ["/"]);
  return ok();
}
