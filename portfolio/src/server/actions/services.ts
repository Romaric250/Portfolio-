"use server";

import type { ContentStatus } from "@prisma/client";
import { z } from "zod";
import { invalidate, TAGS } from "@/lib/cache";
import { writeAudit } from "@/lib/admin/audit";
import { fail, ok, type ActionResult } from "@/lib/admin/types";
import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils";
import { adminContext } from "@/server/actions/helpers";

const serviceSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  tagline: z.string().optional(),
  description: z.string().min(1),
  deliverables: z.array(z.string()),
  startingFrom: z.string().optional(),
  ctaLabel: z.string(),
  icon: z.string(),
  coverUrl: z.string().optional(),
  coverKey: z.string().optional(),
  coverAlt: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  featured: z.boolean(),
  order: z.number().int(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

const faqSchema = z.object({
  serviceId: z.string(),
  question: z.string().min(1),
  answer: z.string().min(1),
  order: z.number().int(),
});

export async function listServices() {
  await adminContext();
  return prisma.service.findMany({ include: { faqs: { orderBy: { order: "asc" } } }, orderBy: [{ order: "asc" }] });
}

export async function saveService(id: string | null, input: z.infer<typeof serviceSchema>): Promise<ActionResult<{ id: string }>> {
  const { actorId } = await adminContext();
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const slug = parsed.data.slug?.trim() || slugify(parsed.data.title);
  const data = { ...parsed.data, slug, status: parsed.data.status as ContentStatus };

  if (id) {
    await prisma.service.update({ where: { id }, data });
    await writeAudit({ action: "UPDATE", entity: "Service", entityId: id, summary: `Updated ${data.title}`, actorId });
  } else {
    const created = await prisma.service.create({ data });
    id = created.id;
    await writeAudit({ action: "CREATE", entity: "Service", entityId: id, summary: `Created ${data.title}`, actorId });
  }
  invalidate([TAGS.services], ["/services"]);
  return ok({ id: id! });
}

export async function deleteService(id: string): Promise<ActionResult> {
  const { actorId } = await adminContext();
  const row = await prisma.service.delete({ where: { id } });
  await writeAudit({ action: "DELETE", entity: "Service", entityId: id, summary: `Deleted ${row.title}`, actorId });
  invalidate([TAGS.services], ["/services"]);
  return ok();
}

export async function saveServiceFaq(id: string | null, input: z.infer<typeof faqSchema>): Promise<ActionResult<{ id: string }>> {
  await adminContext();
  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");

  if (id) {
    await prisma.serviceFaq.update({ where: { id }, data: parsed.data });
  } else {
    const created = await prisma.serviceFaq.create({ data: parsed.data });
    id = created.id;
  }
  invalidate([TAGS.services], ["/services"]);
  return ok({ id: id! });
}

export async function deleteServiceFaq(id: string): Promise<ActionResult> {
  await adminContext();
  await prisma.serviceFaq.delete({ where: { id } });
  invalidate([TAGS.services], ["/services"]);
  return ok();
}
