"use server";

import type { ContentStatus, SkillDomain, SkillLevel } from "@prisma/client";
import { z } from "zod";
import { invalidate, TAGS } from "@/lib/cache";
import { writeAudit } from "@/lib/admin/audit";
import { fail, ok, type ActionResult } from "@/lib/admin/types";
import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils";
import { adminContext } from "@/server/actions/helpers";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  domain: z.string(),
  level: z.string(),
  description: z.string().optional(),
  builtWith: z.string().optional(),
  icon: z.string().optional(),
  relatedProjectSlugs: z.array(z.string()),
  featured: z.boolean(),
  order: z.number().int(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export async function listSkills() {
  await adminContext();
  return prisma.skill.findMany({ orderBy: [{ domain: "asc" }, { order: "asc" }] });
}

export async function saveSkill(id: string | null, input: z.infer<typeof schema>): Promise<ActionResult<{ id: string }>> {
  const { actorId } = await adminContext();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const slug = parsed.data.slug?.trim() || slugify(parsed.data.name);
  const data = {
    ...parsed.data,
    slug,
    domain: parsed.data.domain as SkillDomain,
    level: parsed.data.level as SkillLevel,
    status: parsed.data.status as ContentStatus,
  };

  if (id) {
    await prisma.skill.update({ where: { id }, data });
    await writeAudit({ action: "UPDATE", entity: "Skill", entityId: id, summary: `Updated ${data.name}`, actorId });
  } else {
    const c = await prisma.skill.create({ data });
    id = c.id;
    await writeAudit({ action: "CREATE", entity: "Skill", entityId: id, summary: `Created ${data.name}`, actorId });
  }
  invalidate([TAGS.skills], ["/stack"]);
  return ok({ id: id! });
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  const { actorId } = await adminContext();
  const row = await prisma.skill.delete({ where: { id } });
  await writeAudit({ action: "DELETE", entity: "Skill", entityId: id, summary: `Deleted ${row.name}`, actorId });
  invalidate([TAGS.skills], ["/stack"]);
  return ok();
}
