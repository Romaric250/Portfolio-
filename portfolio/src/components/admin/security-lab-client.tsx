"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { SecurityLabEntry } from "@prisma/client";
import { ModalCrudPage } from "@/components/admin/modal-crud";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteSecurityLabEntry, saveSecurityLabEntry } from "@/server/actions/security-lab";

export function SecurityLabClient({ rows }: { rows: SecurityLabEntry[] }) {
  const columns: ColumnDef<SecurityLabEntry>[] = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "kind", header: "Kind" },
    { accessorKey: "state", header: "State" },
  ];

  return (
    <ModalCrudPage
      title="Security lab"
      description="Roadmap, logs, labs, and writeups."
      rows={rows}
      columns={columns}
      initialForm={() => ({ title: "", kind: "LAB", state: "PLANNED", topics: [] as string[], status: "PUBLISHED", order: 0 })}
      renderForm={(form, setForm) => (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={String(form.title ?? "")} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <Select value={String(form.kind ?? "LAB")} onValueChange={(v) => setForm((f) => ({ ...f, kind: v as SecurityLabEntry["kind"] }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["ROADMAP", "LOG", "WRITEUP", "LAB"].map((k) => (
                <SelectItem key={k} value={k}>{k}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      onSave={async (id, form) => {
        const res = await saveSecurityLabEntry(id, {
          title: String(form.title ?? ""),
          kind: String(form.kind ?? "LAB"),
          state: String(form.state ?? "PLANNED"),
          summary: form.summary ? String(form.summary) : undefined,
          topics: (form.topics as string[]) ?? [],
          status: (form.status as SecurityLabEntry["status"]) ?? "PUBLISHED",
          order: Number(form.order ?? 0),
        });
        return res.ok ? { ok: true } : { ok: false, error: res.error };
      }}
      onDelete={async (id) => {
        const res = await deleteSecurityLabEntry(id);
        return res.ok ? { ok: true } : { ok: false, error: res.error };
      }}
    />
  );
}
