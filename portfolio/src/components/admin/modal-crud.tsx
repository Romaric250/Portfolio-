"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataTable } from "@/components/admin/data-table";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ModalCrudPage<T extends { id: string }>({
  title,
  description,
  rows,
  columns,
  renderForm,
  emptyTitle,
  onSave,
  onDelete,
  initialForm,
}: {
  title: string;
  description?: string;
  rows: T[];
  columns: ColumnDef<T>[];
  emptyTitle?: string;
  initialForm: () => Record<string, unknown>;
  renderForm: (
    form: Record<string, unknown>,
    setForm: React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
  ) => React.ReactNode;
  onSave: (id: string | null, form: Record<string, unknown>) => Promise<{ ok: boolean; error?: string }>;
  onDelete: (id: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<Record<string, unknown>>(initialForm());
  const [editId, setEditId] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  const actionCols = React.useMemo<ColumnDef<T>[]>(
    () => [
      ...columns,
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditId(row.original.id);
                setForm(row.original as unknown as Record<string, unknown>);
                setOpen(true);
              }}
            >
              Edit
            </Button>
            <Button size="sm" variant="ghost" className="text-danger" onClick={() => setDeleteId(row.original.id)}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [columns],
  );

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button
            onClick={() => {
              setEditId(null);
              setForm(initialForm());
              setOpen(true);
            }}
          >
            <Plus className="size-4" /> Add
          </Button>
        }
      />
      <DataTable columns={actionCols} data={rows} emptyTitle={emptyTitle ?? `No ${title.toLowerCase()} yet`} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit" : "Add"}</DialogTitle>
          </DialogHeader>
          {renderForm(form, setForm)}
          <DialogFooter>
            <Button
              disabled={pending}
              onClick={async () => {
                setPending(true);
                const res = await onSave(editId, form);
                setPending(false);
                if (!res.ok) toast.error(res.error ?? "Failed");
                else {
                  toast.success("Saved");
                  setOpen(false);
                  window.location.reload();
                }
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete?"
        description="This cannot be undone."
        loading={pending}
        onConfirm={async () => {
          if (!deleteId) return;
          setPending(true);
          const res = await onDelete(deleteId);
          setPending(false);
          if (!res.ok) toast.error(res.error ?? "Failed");
          else window.location.reload();
        }}
      />
    </div>
  );
}
