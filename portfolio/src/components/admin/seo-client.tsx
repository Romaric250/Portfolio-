"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { PageSeo } from "@prisma/client";
import { ModalCrudPage } from "@/components/admin/modal-crud";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { deletePageSeo, savePageSeo } from "@/server/actions/seo";

export function SeoClient({ rows }: { rows: PageSeo[] }) {
  const columns: ColumnDef<PageSeo>[] = [
    { accessorKey: "path", header: "Path" },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "noindex", header: "Noindex", cell: ({ row }) => (row.original.noindex ? "Yes" : "—") },
  ];

  return (
    <ModalCrudPage
      title="SEO overrides"
      description="Per-path metadata overrides."
      rows={rows}
      columns={columns}
      initialForm={() => ({ path: "", noindex: false })}
      renderForm={(form, setForm) => (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Path</Label>
            <Input value={String(form.path ?? "")} onChange={(e) => setForm((f) => ({ ...f, path: e.target.value }))} placeholder="/about" />
          </div>
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={String(form.title ?? "")} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={String(form.description ?? "")} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Noindex</Label>
            <Switch checked={Boolean(form.noindex)} onCheckedChange={(v) => setForm((f) => ({ ...f, noindex: v }))} />
          </div>
        </div>
      )}
      onSave={async (id, form) => {
        const res = await savePageSeo(id, {
          path: String(form.path ?? ""),
          title: form.title ? String(form.title) : undefined,
          description: form.description ? String(form.description) : undefined,
          canonical: form.canonical ? String(form.canonical) : undefined,
          noindex: Boolean(form.noindex),
          ogImageUrl: form.ogImageUrl ? String(form.ogImageUrl) : undefined,
        });
        return res.ok ? { ok: true } : { ok: false, error: res.error };
      }}
      onDelete={async (id) => {
        const res = await deletePageSeo(id);
        return res.ok ? { ok: true } : { ok: false, error: res.error };
      }}
    />
  );
}
