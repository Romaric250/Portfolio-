"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ClientWork } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModalCrudPage } from "@/components/admin/modal-crud";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteClientWork, saveClientWork } from "@/server/actions/work";

export function WorkClient({ rows }: { rows: ClientWork[] }) {
  const columns: ColumnDef<ClientWork>[] = [
    { accessorKey: "name", header: "Client" },
    { accessorKey: "year", header: "Year" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ];

  return (
    <ModalCrudPage
      title="Client work"
      description="Organisations and SMEs you have delivered for."
      rows={rows}
      columns={columns}
      initialForm={() => ({
        name: "",
        scope: "",
        tech: [] as string[],
        status: "DRAFT",
        featured: false,
        order: 0,
      })}
      renderForm={(form, setForm) => (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={String(form.name ?? "")} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Scope</Label>
            <Input value={String(form.scope ?? "")} onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Tech (comma-separated)</Label>
            <Input
              value={Array.isArray(form.tech) ? form.tech.join(", ") : ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, tech: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))
              }
            />
          </div>
          <Select value={String(form.status ?? "DRAFT")} onValueChange={(v) => setForm((f) => ({ ...f, status: v as ClientWork["status"] }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      onSave={async (id, form) => {
        const res = await saveClientWork(id, {
          name: String(form.name ?? ""),
          scope: String(form.scope ?? ""),
          description: form.description ? String(form.description) : undefined,
          url: form.url ? String(form.url) : undefined,
          tech: (form.tech as string[]) ?? [],
          status: (form.status as ClientWork["status"]) ?? "DRAFT",
          featured: Boolean(form.featured),
          order: Number(form.order ?? 0),
          year: form.year ? Number(form.year) : undefined,
          clientType: form.clientType ? String(form.clientType) : undefined,
          coverUrl: form.coverUrl ? String(form.coverUrl) : undefined,
          coverKey: form.coverKey ? String(form.coverKey) : undefined,
          coverAlt: form.coverAlt ? String(form.coverAlt) : undefined,
          testimonial: form.testimonial ? String(form.testimonial) : undefined,
        });
        return res.ok ? { ok: true } : { ok: false, error: res.error };
      }}
      onDelete={async (id) => {
        const res = await deleteClientWork(id);
        return res.ok ? { ok: true } : { ok: false, error: res.error };
      }}
    />
  );
}
