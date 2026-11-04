"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Service, ServiceFaq } from "@prisma/client";
import { ModalCrudPage } from "@/components/admin/modal-crud";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { deleteService, deleteServiceFaq, listServices, saveService, saveServiceFaq } from "@/server/actions/services";

type Row = Service & { faqs: ServiceFaq[] };

export function ServicesClient({ initial }: { initial: Row[] }) {
  const [rows, setRows] = React.useState(initial);
  const [faqService, setFaqService] = React.useState<Row | null>(null);
  const [faqForm, setFaqForm] = React.useState({ question: "", answer: "", order: 0 });

  const columns: ColumnDef<Row>[] = [
    { accessorKey: "title", header: "Service" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    {
      id: "faqs",
      header: "FAQs",
      cell: ({ row }) => (
        <Button size="sm" variant="outline" onClick={() => setFaqService(row.original)}>
          {row.original.faqs.length} FAQs
        </Button>
      ),
    },
  ];

  return (
    <>
      <ModalCrudPage
        title="Services"
        description="Offerings and FAQs."
        rows={rows}
        columns={columns}
        initialForm={() => ({
          title: "",
          description: "",
          deliverables: [] as string[],
          ctaLabel: "Start a project",
          icon: "Globe",
          status: "DRAFT",
          featured: false,
          order: 0,
        })}
        renderForm={(form, setForm) => (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={String(form.title ?? "")} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={String(form.description ?? "")} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} />
            </div>
          </div>
        )}
        onSave={async (id, form) => {
          const res = await saveService(id, {
            title: String(form.title ?? ""),
            description: String(form.description ?? ""),
            tagline: form.tagline ? String(form.tagline) : undefined,
            deliverables: (form.deliverables as string[]) ?? [],
            startingFrom: form.startingFrom ? String(form.startingFrom) : undefined,
            ctaLabel: String(form.ctaLabel ?? "Start a project"),
            icon: String(form.icon ?? "Globe"),
            status: (form.status as Service["status"]) ?? "DRAFT",
            featured: Boolean(form.featured),
            order: Number(form.order ?? 0),
          });
          if (res.ok) setRows(await listServices());
          return res.ok ? { ok: true } : { ok: false, error: res.error };
        }}
        onDelete={async (id) => {
          const res = await deleteService(id);
          if (res.ok) setRows(await listServices());
          return res.ok ? { ok: true } : { ok: false, error: res.error };
        }}
      />

      <Dialog open={Boolean(faqService)} onOpenChange={(o) => !o && setFaqService(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>FAQs — {faqService?.title}</DialogTitle>
          </DialogHeader>
          <ul className="max-h-40 space-y-2 overflow-y-auto text-sm">
            {faqService?.faqs.map((f) => (
              <li key={f.id} className="hairline rounded-md p-2">
                <p className="font-medium">{f.question}</p>
                <p className="text-fg-muted">{f.answer}</p>
                <Button size="sm" variant="ghost" className="mt-1 text-danger" onClick={() => void deleteServiceFaq(f.id).then(() => setFaqService({ ...faqService!, faqs: faqService!.faqs.filter((x) => x.id !== f.id) }))}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
          <div className="space-y-2">
            <Input placeholder="Question" value={faqForm.question} onChange={(e) => setFaqForm((f) => ({ ...f, question: e.target.value }))} />
            <Textarea placeholder="Answer" value={faqForm.answer} onChange={(e) => setFaqForm((f) => ({ ...f, answer: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                if (!faqService) return;
                await saveServiceFaq(null, { serviceId: faqService.id, ...faqForm });
                const next = await listServices();
                setRows(next);
                setFaqService(next.find((s) => s.id === faqService.id) ?? null);
                setFaqForm({ question: "", answer: "", order: 0 });
              }}
            >
              Add FAQ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
