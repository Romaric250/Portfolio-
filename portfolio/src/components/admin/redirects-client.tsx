"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Redirect } from "@prisma/client";
import { ModalCrudPage } from "@/components/admin/modal-crud";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { deleteRedirect, saveRedirect } from "@/server/actions/redirects";

export function RedirectsClient({ rows }: { rows: Redirect[] }) {
  const columns: ColumnDef<Redirect>[] = [
    { accessorKey: "source", header: "Source" },
    { accessorKey: "destination", header: "Destination" },
    { accessorKey: "hits", header: "Hits" },
  ];

  return (
    <ModalCrudPage
      title="Redirects"
      description="Dynamic redirects stored in the database."
      rows={rows}
      columns={columns}
      initialForm={() => ({ source: "", destination: "", permanent: true, enabled: true })}
      renderForm={(form, setForm) => (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Source path</Label>
            <Input value={String(form.source ?? "")} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))} placeholder="/old-path" />
          </div>
          <div className="space-y-1.5">
            <Label>Destination</Label>
            <Input value={String(form.destination ?? "")} onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Permanent (308)</Label>
            <Switch checked={Boolean(form.permanent ?? true)} onCheckedChange={(v) => setForm((f) => ({ ...f, permanent: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Enabled</Label>
            <Switch checked={Boolean(form.enabled ?? true)} onCheckedChange={(v) => setForm((f) => ({ ...f, enabled: v }))} />
          </div>
        </div>
      )}
      onSave={async (id, form) => {
        const res = await saveRedirect(id, {
          source: String(form.source ?? ""),
          destination: String(form.destination ?? ""),
          permanent: Boolean(form.permanent ?? true),
          enabled: Boolean(form.enabled ?? true),
          note: form.note ? String(form.note) : undefined,
        });
        return res.ok ? { ok: true } : { ok: false, error: res.error };
      }}
      onDelete={async (id) => {
        const res = await deleteRedirect(id);
        return res.ok ? { ok: true } : { ok: false, error: res.error };
      }}
    />
  );
}
