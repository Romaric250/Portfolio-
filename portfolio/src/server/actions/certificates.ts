"use server";

import type { CertificateFileType, ContentStatus } from "@prisma/client";
import { z } from "zod";
import { invalidate, TAGS } from "@/lib/cache";
import { writeAudit } from "@/lib/admin/audit";
import { fail, ok, type ActionResult } from "@/lib/admin/types";
import { prisma } from "@/lib/db/prisma";
import { deleteUploadThingFiles } from "@/lib/uploadthing/delete";
import { slugify, titleFromFilename } from "@/lib/utils";
import { adminContext } from "@/server/actions/helpers";

const certSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  issuer: z.string().min(1),
  issuerUrl: z.string().optional(),
  categoryId: z.string(),
  issueDate: z.string(),
  expiryDate: z.string().optional().nullable(),
  noExpiry: z.boolean(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().optional(),
  description: z.string().optional(),
  skills: z.array(z.string()),
  hours: z.number().int().optional().nullable(),
  fileUrl: z.string().optional(),
  fileKey: z.string().optional(),
  fileType: z.enum(["IMAGE", "PDF"]).optional().nullable(),
  fileSize: z.number().int().optional().nullable(),
  thumbnailUrl: z.string().optional(),
  thumbnailKey: z.string().optional(),
  altText: z.string().min(1),
  featured: z.boolean(),
  showOnCv: z.boolean(),
  allowDownload: z.boolean(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  order: z.number().int(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  color: z.string(),
  order: z.number().int(),
  isDefault: z.boolean(),
});

export async function listCertificateCategories() {
  await adminContext();
  return prisma.certificateCategory.findMany({ orderBy: { order: "asc" } });
}

export async function listCertificates(categoryId?: string) {
  await adminContext();
  return prisma.certificate.findMany({
    where: categoryId ? { categoryId } : undefined,
    include: { category: true },
    orderBy: [{ order: "asc" }, { issueDate: "desc" }],
  });
}

export async function saveCertificate(id: string | null, input: z.infer<typeof certSchema>): Promise<ActionResult<{ id: string }>> {
  const { actorId } = await adminContext();
  const parsed = certSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");

  const slug = parsed.data.slug?.trim() || slugify(parsed.data.title);
  const issueDate = new Date(parsed.data.issueDate);
  const expiryDate = parsed.data.expiryDate ? new Date(parsed.data.expiryDate) : null;

  const data = {
    ...parsed.data,
    slug,
    issueDate,
    expiryDate,
    fileType: parsed.data.fileType as CertificateFileType | null | undefined,
    status: parsed.data.status as ContentStatus,
  };

  if (id) {
    const prev = await prisma.certificate.findUnique({ where: { id } });
    if (prev?.fileKey && data.fileKey && prev.fileKey !== data.fileKey) await deleteUploadThingFiles([prev.fileKey]);
    if (prev?.thumbnailKey && data.thumbnailKey && prev.thumbnailKey !== data.thumbnailKey)
      await deleteUploadThingFiles([prev.thumbnailKey]);
    await prisma.certificate.update({ where: { id }, data });
    await writeAudit({ action: "UPDATE", entity: "Certificate", entityId: id, summary: `Updated ${data.title}`, actorId });
  } else {
    const maxOrder = await prisma.certificate.aggregate({ where: { categoryId: data.categoryId }, _max: { order: true } });
    const created = await prisma.certificate.create({
      data: { ...data, order: data.order ?? (maxOrder._max.order ?? 0) + 1 },
    });
    id = created.id;
    await writeAudit({ action: "CREATE", entity: "Certificate", entityId: id, summary: `Created ${data.title}`, actorId });
  }
  invalidate([TAGS.certificates, TAGS.certificateCategories], ["/certificates"]);
  return ok({ id: id! });
}

export async function deleteCertificate(id: string): Promise<ActionResult> {
  const { actorId } = await adminContext();
  const row = await prisma.certificate.delete({ where: { id } });
  const keys = [row.fileKey, row.thumbnailKey].filter((k): k is string => Boolean(k));
  await deleteUploadThingFiles(keys);
  await writeAudit({ action: "DELETE", entity: "Certificate", entityId: id, summary: `Deleted ${row.title}`, actorId });
  invalidate([TAGS.certificates], ["/certificates"]);
  return ok();
}

export async function bulkUpdateCertificates(
  ids: string[],
  patch: { status?: ContentStatus; categoryId?: string },
): Promise<ActionResult> {
  const { actorId } = await adminContext();
  if (ids.length === 0) return fail("No items selected");
  await prisma.certificate.updateMany({ where: { id: { in: ids } }, data: patch });
  await writeAudit({
    action: patch.status === "PUBLISHED" ? "PUBLISH" : patch.status === "DRAFT" ? "UNPUBLISH" : "UPDATE",
    entity: "Certificate",
    summary: `Bulk updated ${ids.length} certificates`,
    actorId,
  });
  invalidate([TAGS.certificates], ["/certificates"]);
  return ok();
}

export async function bulkDeleteCertificates(ids: string[]): Promise<ActionResult> {
  const { actorId } = await adminContext();
  const rows = await prisma.certificate.findMany({ where: { id: { in: ids } } });
  await prisma.certificate.deleteMany({ where: { id: { in: ids } } });
  await deleteUploadThingFiles(rows.flatMap((r) => [r.fileKey, r.thumbnailKey].filter(Boolean) as string[]));
  await writeAudit({ action: "DELETE", entity: "Certificate", summary: `Bulk deleted ${ids.length} certificates`, actorId });
  invalidate([TAGS.certificates], ["/certificates"]);
  return ok();
}

export async function reorderCertificates(categoryId: string, orderedIds: string[]): Promise<ActionResult> {
  await adminContext();
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.certificate.update({ where: { id }, data: { order: index, categoryId } })),
  );
  invalidate([TAGS.certificates], ["/certificates"]);
  return ok();
}

export async function createDraftFromUpload(input: {
  categoryId: string;
  fileName: string;
  fileUrl: string;
  fileKey: string;
  fileType: CertificateFileType;
  fileSize: number;
  altText: string;
}): Promise<ActionResult<{ id: string }>> {
  const { actorId } = await adminContext();
  const title = titleFromFilename(input.fileName);
  const slug = `${slugify(title)}-${Date.now().toString(36)}`;
  const maxOrder = await prisma.certificate.aggregate({ where: { categoryId: input.categoryId }, _max: { order: true } });
  const created = await prisma.certificate.create({
    data: {
      title,
      slug,
      issuer: "Unknown",
      categoryId: input.categoryId,
      issueDate: new Date(),
      altText: input.altText,
      fileUrl: input.fileUrl,
      fileKey: input.fileKey,
      fileType: input.fileType,
      fileSize: input.fileSize,
      thumbnailUrl: input.fileType === "IMAGE" ? input.fileUrl : undefined,
      thumbnailKey: input.fileType === "IMAGE" ? input.fileKey : undefined,
      status: "DRAFT",
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });
  await writeAudit({ action: "CREATE", entity: "Certificate", entityId: created.id, summary: `Bulk upload draft ${title}`, actorId });
  invalidate([TAGS.certificates], ["/certificates"]);
  return ok({ id: created.id });
}

export async function saveCertificateCategory(
  id: string | null,
  input: z.infer<typeof categorySchema>,
): Promise<ActionResult<{ id: string }>> {
  const { actorId } = await adminContext();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const slug = parsed.data.slug?.trim() || slugify(parsed.data.name);

  if (parsed.data.isDefault) {
    await prisma.certificateCategory.updateMany({ data: { isDefault: false } });
  }

  if (id) {
    await prisma.certificateCategory.update({ where: { id }, data: { ...parsed.data, slug } });
    await writeAudit({ action: "UPDATE", entity: "CertificateCategory", entityId: id, summary: `Updated category ${parsed.data.name}`, actorId });
  } else {
    const c = await prisma.certificateCategory.create({ data: { ...parsed.data, slug } });
    id = c.id;
    await writeAudit({ action: "CREATE", entity: "CertificateCategory", entityId: id, summary: `Created category ${parsed.data.name}`, actorId });
  }
  invalidate([TAGS.certificateCategories, TAGS.certificates], ["/certificates"]);
  return ok({ id: id! });
}

export async function deleteCertificateCategory(id: string, reassignToId: string): Promise<ActionResult> {
  const { actorId } = await adminContext();
  const cat = await prisma.certificateCategory.findUnique({ where: { id }, include: { _count: { select: { certificates: true } } } });
  if (!cat) return fail("Category not found");
  if (cat.isDefault) return fail("Cannot delete the default category");
  if (cat._count.certificates > 0) {
    await prisma.certificate.updateMany({ where: { categoryId: id }, data: { categoryId: reassignToId } });
  }
  await prisma.certificateCategory.delete({ where: { id } });
  await writeAudit({ action: "DELETE", entity: "CertificateCategory", entityId: id, summary: `Deleted category ${cat.name}`, actorId });
  invalidate([TAGS.certificateCategories, TAGS.certificates], ["/certificates"]);
  return ok();
}
