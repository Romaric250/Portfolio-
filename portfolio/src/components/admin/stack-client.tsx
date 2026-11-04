"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Skill } from "@prisma/client";
import { ModalCrudPage } from "@/components/admin/modal-crud";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteSkill, saveSkill } from "@/server/actions/stack";

const DOMAINS = ["LANGUAGES", "BACKEND", "FRONTEND", "DATABASES", "HEALTH_INFORMATICS", "SECURITY", "TOOLS", "SOFT_SKILLS"] as const;
const LEVELS = ["PRODUCTION", "PROFICIENT", "LEARNING", "EXPLORING"] as const;

export function StackClient({ rows }: { rows: Skill[] }) {
  const columns: ColumnDef<Skill>[] = [
    { accessorKey: "name", header: "Skill" },
    { accessorKey: "domain", header: "Domain" },
    { accessorKey: "level", header: "Level" },
  ];

  return (
    <ModalCrudPage
      title="Stack"
      description="Skills grouped by domain."
      rows={rows}
      columns={columns}
      initialForm={() => ({
        name: "",
        domain: "BACKEND",
        level: "PROFICIENT",
        status: "PUBLISHED",
        featured: false,
        order: 0,
        relatedProjectSlugs: [] as string[],
      })}
      renderForm={(form, setForm) => (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={String(form.name ?? "")} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <Select value={String(form.domain ?? "BACKEND")} onValueChange={(v) => setForm((f) => ({ ...f, domain: v as Skill["domain"] }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {DOMAINS.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(form.level ?? "PROFICIENT")} onValueChange={(v) => setForm((f) => ({ ...f, level: v as Skill["level"] }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {LEVELS.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      onSave={async (id, form) => {
        const res = await saveSkill(id, {
          name: String(form.name ?? ""),
          domain: String(form.domain ?? "BACKEND"),
          level: String(form.level ?? "PROFICIENT"),
          description: form.description ? String(form.description) : undefined,
          builtWith: form.builtWith ? String(form.builtWith) : undefined,
          icon: form.icon ? String(form.icon) : undefined,
          relatedProjectSlugs: (form.relatedProjectSlugs as string[]) ?? [],
          featured: Boolean(form.featured),
          order: Number(form.order ?? 0),
          status: (form.status as Skill["status"]) ?? "PUBLISHED",
        });
        return res.ok ? { ok: true } : { ok: false, error: res.error };
      }}
      onDelete={async (id) => {
        const res = await deleteSkill(id);
        return res.ok ? { ok: true } : { ok: false, error: res.error };
      }}
    />
  );
}
