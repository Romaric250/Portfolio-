"use server";

import type { PostStatus } from "@prisma/client";
import { z } from "zod";
import { invalidate, TAGS } from "@/lib/cache";
import { writeAudit } from "@/lib/admin/audit";
import { fail, ok, type ActionResult } from "@/lib/admin/types";
import { asInputJson } from "@/lib/admin/json";
import { prisma } from "@/lib/db/prisma";
import { sanitize } from "@/lib/sanitize";
import { slugify } from "@/lib/utils";
import { adminContext } from "@/server/actions/helpers";

const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().min(1),
  contentJson: z.record(z.string(), z.unknown()).optional().nullable(),
  contentHtml: z.string(),
  coverUrl: z.string().optional(),
  coverKey: z.string().optional(),
  coverAlt: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()),
  seriesId: z.string().optional().nullable(),
  seriesOrder: z.number().int().optional().nullable(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED"]),
  publishedAt: z.string().optional().nullable(),
  featured: z.boolean(),
  readingTime: z.number().int(),
  wordCount: z.number().int(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

const taxSchema = z.object({ name: z.string().min(1), slug: z.string().optional(), description: z.string().optional(), color: z.string().optional() });
type TaxInput = z.infer<typeof taxSchema>;

function parseTax(input: unknown): ActionResult<TaxInput> {
  const parsed = taxSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid fields.");
  return ok(parsed.data);
}

export async function listPosts() {
  await adminContext();
  return prisma.post.findMany({
    include: { category: true, series: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPost(id: string) {
  await adminContext();
  return prisma.post.findUnique({ where: { id }, include: { tags: true } });
}

export async function savePost(id: string | null, input: z.infer<typeof postSchema>): Promise<ActionResult<{ id: string }>> {
  const { actorId } = await adminContext();
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");

  const slug = parsed.data.slug?.trim() || slugify(parsed.data.title);
  const html = sanitize(parsed.data.contentHtml);
  const publishedAt =
    parsed.data.status === "PUBLISHED" || parsed.data.status === "SCHEDULED"
      ? parsed.data.publishedAt
        ? new Date(parsed.data.publishedAt)
        : new Date()
      : null;

  const { tagIds, ...rest } = parsed.data;
  const data = {
    ...rest,
    slug,
    contentHtml: html,
    contentJson: asInputJson(parsed.data.contentJson ?? undefined),
    status: parsed.data.status as PostStatus,
    publishedAt,
    categoryId: parsed.data.categoryId || null,
    seriesId: parsed.data.seriesId || null,
    tagIds,
  };

  if (id) {
    await prisma.post.update({
      where: { id },
      data: {
        ...data,
        tags: { set: tagIds.map((tid) => ({ id: tid })) },
      },
    });
    await writeAudit({ action: "UPDATE", entity: "Post", entityId: id, summary: `Updated post ${data.title}`, actorId });
  } else {
    const created = await prisma.post.create({
      data: {
        ...data,
        tags: { connect: tagIds.map((tid) => ({ id: tid })) },
      },
    });
    id = created.id;
    await writeAudit({ action: "CREATE", entity: "Post", entityId: id, summary: `Created post ${data.title}`, actorId });
  }
  invalidate([TAGS.posts], ["/blog", `/blog/${slug}`]);
  return ok({ id: id! });
}

export async function deletePost(id: string): Promise<ActionResult> {
  const { actorId } = await adminContext();
  const row = await prisma.post.delete({ where: { id } });
  await writeAudit({ action: "DELETE", entity: "Post", entityId: id, summary: `Deleted post ${row.title}`, actorId });
  invalidate([TAGS.posts], ["/blog"]);
  return ok();
}

export async function listCategories() {
  await adminContext();
  return prisma.category.findMany({ orderBy: { order: "asc" } });
}

export async function saveCategory(id: string | null, input: TaxInput & { order?: number }): Promise<ActionResult<{ id: string }>> {
  await adminContext();
  const parsed = parseTax(input);
  if (!parsed.ok) return parsed;
  input = parsed.data;
  const slug = input.slug?.trim() || slugify(input.name);
  if (id) await prisma.category.update({ where: { id }, data: { ...input, slug } });
  else {
    const c = await prisma.category.create({ data: { name: input.name, slug, description: input.description, color: input.color, order: input.order ?? 0 } });
    id = c.id;
  }
  invalidate([TAGS.categories, TAGS.posts], ["/blog"]);
  return ok({ id: id! });
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await adminContext();
  await prisma.category.delete({ where: { id } });
  invalidate([TAGS.categories, TAGS.posts], ["/blog"]);
  return ok();
}

export async function listTags() {
  await adminContext();
  return prisma.tag.findMany({ orderBy: { name: "asc" } });
}

export async function saveTag(id: string | null, input: TaxInput): Promise<ActionResult<{ id: string }>> {
  await adminContext();
  const parsed = parseTax(input);
  if (!parsed.ok) return parsed;
  input = parsed.data;
  const slug = input.slug?.trim() || slugify(input.name);
  if (id) await prisma.tag.update({ where: { id }, data: { name: input.name, slug } });
  else {
    const t = await prisma.tag.create({ data: { name: input.name, slug } });
    id = t.id;
  }
  invalidate([TAGS.tags, TAGS.posts], ["/blog"]);
  return ok({ id: id! });
}

export async function deleteTag(id: string): Promise<ActionResult> {
  await adminContext();
  await prisma.tag.delete({ where: { id } });
  invalidate([TAGS.tags, TAGS.posts], ["/blog"]);
  return ok();
}

export async function listSeries() {
  await adminContext();
  return prisma.series.findMany({ orderBy: { name: "asc" } });
}

export async function saveSeries(id: string | null, input: TaxInput): Promise<ActionResult<{ id: string }>> {
  await adminContext();
  const parsed = parseTax(input);
  if (!parsed.ok) return parsed;
  input = parsed.data;
  const slug = input.slug?.trim() || slugify(input.name);
  if (id) await prisma.series.update({ where: { id }, data: { name: input.name, slug, description: input.description } });
  else {
    const s = await prisma.series.create({ data: { name: input.name, slug, description: input.description } });
    id = s.id;
  }
  invalidate([TAGS.series, TAGS.posts], ["/blog"]);
  return ok({ id: id! });
}

export async function deleteSeries(id: string): Promise<ActionResult> {
  await adminContext();
  await prisma.series.delete({ where: { id } });
  invalidate([TAGS.series, TAGS.posts], ["/blog"]);
  return ok();
}
