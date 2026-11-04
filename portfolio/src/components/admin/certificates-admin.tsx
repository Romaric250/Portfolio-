"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ColumnDef } from "@tanstack/react-table";
import type { Certificate, CertificateCategory, CertificateFileType } from "@prisma/client";
import { GripVertical, Layers, Plus, Settings2, Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataTable, selectColumn } from "@/components/admin/data-table";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone, uploadDropzoneClassNames } from "@/lib/uploadthing/client";
import { formatDateLong } from "@/lib/utils";
import {
  bulkDeleteCertificates,
  bulkUpdateCertificates,
  createDraftFromUpload,
  deleteCertificate,
  deleteCertificateCategory,
  listCertificates,
  reorderCertificates,
  saveCertificate,
  saveCertificateCategory,
} from "@/server/actions/certificates";

type CertRow = Certificate & { category: CertificateCategory };

function SortableRow({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 hairline rounded-md bg-bg-elevated px-2 py-1.5">
      <button type="button" className="cursor-grab text-fg-subtle" {...attributes} {...listeners}>
        <GripVertical className="size-4" />
      </button>
      {children}
    </div>
  );
}

export function CertificatesAdmin({
  initialCategories,
  initialCerts,
  defaultCategoryId,
}: {
  initialCategories: CertificateCategory[];
  initialCerts: CertRow[];
  defaultCategoryId: string;
}) {
  const [categories, setCategories] = React.useState(initialCategories);
  const [categoryId, setCategoryId] = React.useState(defaultCategoryId);
  const [certs, setCerts] = React.useState(initialCerts);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [yearFilter, setYearFilter] = React.useState("");
  const [issuerFilter, setIssuerFilter] = React.useState("");
  const [editCert, setEditCert] = React.useState<CertRow | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [catModal, setCatModal] = React.useState(false);
  const [bulkReview, setBulkReview] = React.useState<string[]>([]);
  const [reviewIndex, setReviewIndex] = React.useState(0);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const refreshCerts = async (cat: string) => {
    const rows = await listCertificates(cat);
    setCerts(rows as CertRow[]);
  };

  const filtered = certs.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (issuerFilter && !c.issuer.toLowerCase().includes(issuerFilter.toLowerCase())) return false;
    if (yearFilter && c.issueDate.getFullYear() !== Number(yearFilter)) return false;
    return c.categoryId === categoryId;
  });

  const columns = React.useMemo<ColumnDef<CertRow>[]>(
    () => [
      selectColumn<CertRow>(),
      {
        id: "thumb",
        header: "",
        cell: ({ row }) =>
          row.original.thumbnailUrl ? (
            <Image src={row.original.thumbnailUrl} alt="" width={40} height={28} className="rounded object-cover" />
          ) : (
            <div className="size-10 rounded bg-bg-sunken" />
          ),
      },
      { accessorKey: "title", header: "Title" },
      { accessorKey: "issuer", header: "Issuer" },
      {
        id: "category",
        header: "Category",
        cell: ({ row }) => (
          <Badge variant="accent" style={{ backgroundColor: `${row.original.category.color}22`, color: row.original.category.color }}>
            {row.original.category.name}
          </Badge>
        ),
      },
      {
        accessorKey: "issueDate",
        header: "Issued",
        cell: ({ row }) => formatDateLong(row.original.issueDate),
      },
      { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
      {
        accessorKey: "featured",
        header: "Featured",
        cell: ({ row }) => (row.original.featured ? "Yes" : "—"),
      },
      { accessorKey: "fileType", header: "Type", cell: ({ row }) => row.original.fileType ?? "—" },
      { accessorKey: "showOnCv", header: "CV", cell: ({ row }) => (row.original.showOnCv ? "Yes" : "—") },
      {
        id: "edit",
        cell: ({ row }) => (
          <Button size="sm" variant="outline" onClick={() => openEdit(row.original)}>
            Edit
          </Button>
        ),
      },
    ],
    [],
  );

  const emptyForm = (): Partial<CertRow> & { altText: string } => ({
    title: "",
    issuer: "",
    categoryId,
    issueDate: new Date(),
    noExpiry: true,
    altText: "",
    skills: [],
    featured: false,
    showOnCv: false,
    allowDownload: false,
    status: "DRAFT",
    order: 0,
  });

  const [form, setForm] = React.useState(emptyForm());

  const openEdit = (c: CertRow | null) => {
    if (!c) {
      setForm(emptyForm());
      setEditCert(null);
    } else {
      setEditCert(c);
      setForm({ ...c });
    }
    setSheetOpen(true);
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = filtered.map((c) => c.id);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    const next = arrayMove(ids, oldIndex, newIndex);
    setCerts((prev) => {
      const map = new Map(prev.map((c) => [c.id, c]));
      return next.map((id, order) => ({ ...map.get(id)!, order }));
    });
    await reorderCertificates(categoryId, next);
  };

  return (
    <div>
      <PageHeader
        title="Certificates"
        description="Manage credentials, categories, bulk upload, and ordering."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setCatModal(true)}>
              <Settings2 className="size-4" /> Categories
            </Button>
            <Button onClick={() => openEdit(null)}>
              <Plus className="size-4" /> Add
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Select
          value={categoryId}
          onValueChange={(v) => {
            setCategoryId(v);
            void refreshCerts(v);
          }}
        >
          <SelectTrigger className="h-8 w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
          </SelectContent>
        </Select>
        <Input className="h-8 w-28" placeholder="Year" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} />
        <Input className="h-8 w-40" placeholder="Issuer" value={issuerFilter} onChange={(e) => setIssuerFilter(e.target.value)} />
      </div>

      <div className="mb-6 hairline rounded-lg bg-bg-sunken/40 p-4">
        <p className="mb-2 text-sm font-medium">Bulk upload</p>
        <UploadDropzone
          endpoint="certificateUploader"
          className={uploadDropzoneClassNames.container}
          appearance={uploadDropzoneClassNames}
          onClientUploadComplete={async (files) => {
            const alt = window.prompt("Alt text for all uploads (required)")?.trim();
            if (!alt) {
              toast.error("Alt text is required");
              return;
            }
            const ids: string[] = [];
            for (const file of files) {
              const type: CertificateFileType = file.type?.includes("pdf") ? "PDF" : "IMAGE";
              const res = await createDraftFromUpload({
                categoryId,
                fileName: file.name,
                fileUrl: file.ufsUrl,
                fileKey: file.key,
                fileType: type,
                fileSize: file.size,
                altText: alt,
              });
              if (res.ok) ids.push(res.data.id);
            }
            await refreshCerts(categoryId);
            if (ids.length) {
              setBulkReview(ids);
              setReviewIndex(0);
              toast.success(`${ids.length} drafts created`);
            }
          }}
          onUploadError={(e) => {
            toast.error(e.message);
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-fg-muted">No certificates in this category yet. Upload one.</p>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={filtered}
            searchKey="title"
            emptyTitle="No certificates in this category yet. Upload one"
            bulkActions={(selected) => (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    const ids = selected.map((s) => s.id);
                    await bulkUpdateCertificates(ids, { status: "PUBLISHED" });
                    await refreshCerts(categoryId);
                    toast.success("Published");
                  }}
                >
                  Publish
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    const ids = selected.map((s) => s.id);
                    await bulkUpdateCertificates(ids, { status: "DRAFT" });
                    await refreshCerts(categoryId);
                  }}
                >
                  Unpublish
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    await bulkDeleteCertificates(selected.map((s) => s.id));
                    await refreshCerts(categoryId);
                  }}
                >
                  Delete
                </Button>
              </>
            )}
          />

          <div className="mt-6">
            <p className="mb-2 flex items-center gap-2 text-xs font-medium text-fg-muted uppercase">
              <Layers className="size-3.5" /> Drag to reorder within category
            </p>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => void onDragEnd(e)}>
              <SortableContext items={filtered.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-1">
                  {filtered.map((c) => (
                    <SortableRow key={c.id} id={c.id}>
                      <span className="flex-1 truncate text-sm">{c.title}</span>
                      <StatusBadge status={c.status} />
                    </SortableRow>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editCert ? "Edit certificate" : "Add certificate"}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={form.title ?? ""} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Issuer</Label>
              <Input value={form.issuer ?? ""} onChange={(e) => setForm((f) => ({ ...f, issuer: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Alt text</Label>
              <Input value={form.altText ?? ""} onChange={(e) => setForm((f) => ({ ...f, altText: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Issue date</Label>
              <Input
                type="date"
                value={form.issueDate ? new Date(form.issueDate).toISOString().slice(0, 10) : ""}
                onChange={(e) => setForm((f) => ({ ...f, issueDate: new Date(e.target.value) }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>No expiry</Label>
              <Switch checked={form.noExpiry ?? true} onCheckedChange={(v) => setForm((f) => ({ ...f, noExpiry: v }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Skills (comma-separated)</Label>
              <Input
                value={(form.skills ?? []).join(", ")}
                onChange={(e) =>
                  setForm((f) => ({ ...f, skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))
                }
              />
            </div>
            <UploadDropzone
              endpoint="certificateUploader"
              appearance={uploadDropzoneClassNames}
              onClientUploadComplete={(files) => {
                const f = files[0];
                if (!f) return;
                const type: CertificateFileType = f.type?.includes("pdf") ? "PDF" : "IMAGE";
                setForm((prev) => ({
                  ...prev,
                  fileUrl: f.ufsUrl,
                  fileKey: f.key,
                  fileType: type,
                  fileSize: f.size,
                  thumbnailUrl: type === "IMAGE" ? f.ufsUrl : prev.thumbnailUrl,
                  thumbnailKey: type === "IMAGE" ? f.key : prev.thumbnailKey,
                }));
              }}
            />
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.featured ?? false} onCheckedChange={(v) => setForm((f) => ({ ...f, featured: Boolean(v) }))} />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.showOnCv ?? false} onCheckedChange={(v) => setForm((f) => ({ ...f, showOnCv: Boolean(v) }))} />
                Show on CV
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.allowDownload ?? false}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, allowDownload: Boolean(v) }))}
                />
                Allow download
              </label>
            </div>
            <Select value={form.status ?? "DRAFT"} onValueChange={(v) => setForm((f) => ({ ...f, status: v as Certificate["status"] }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Description"
              value={form.description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            <Button
              className="w-full"
              disabled={pending}
              onClick={async () => {
                if (!form.altText?.trim()) {
                  toast.error("Alt text required");
                  return;
                }
                setPending(true);
                const res = await saveCertificate(editCert?.id ?? null, {
                  title: form.title ?? "",
                  issuer: form.issuer ?? "",
                  categoryId: form.categoryId ?? categoryId,
                  issueDate: new Date(form.issueDate ?? Date.now()).toISOString(),
                  expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : null,
                  noExpiry: form.noExpiry ?? true,
                  altText: form.altText,
                  skills: form.skills ?? [],
                  featured: form.featured ?? false,
                  showOnCv: form.showOnCv ?? false,
                  allowDownload: form.allowDownload ?? false,
                  status: (form.status ?? "DRAFT") as "DRAFT" | "PUBLISHED",
                  order: form.order ?? 0,
                  fileUrl: form.fileUrl ?? undefined,
                  fileKey: form.fileKey ?? undefined,
                  fileType: form.fileType ?? undefined,
                  fileSize: form.fileSize ?? undefined,
                  thumbnailUrl: form.thumbnailUrl ?? undefined,
                  thumbnailKey: form.thumbnailKey ?? undefined,
                  description: form.description ?? undefined,
                  credentialId: form.credentialId ?? undefined,
                  credentialUrl: form.credentialUrl ?? undefined,
                  issuerUrl: form.issuerUrl ?? undefined,
                  hours: form.hours ?? undefined,
                });
                setPending(false);
                if (!res.ok) toast.error(res.error);
                else {
                  toast.success("Saved");
                  setSheetOpen(false);
                  await refreshCerts(categoryId);
                }
              }}
            >
              Save
            </Button>
            {editCert ? (
              <Button variant="destructive" className="w-full" onClick={() => setDeleteId(editCert.id)}>
                Delete
              </Button>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>

      <CategoryManagerModal
        open={catModal}
        onOpenChange={setCatModal}
        categories={categories}
        onChange={setCategories}
        defaultCategoryId={defaultCategoryId}
      />

      <BulkReviewModal
        ids={bulkReview}
        index={reviewIndex}
        onIndex={setReviewIndex}
        onClose={() => setBulkReview([])}
        certs={certs}
        onSaved={() => void refreshCerts(categoryId)}
      />

      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete certificate?"
        description="Removes DB record and storage file."
        loading={pending}
        onConfirm={async () => {
          if (!deleteId) return;
          setPending(true);
          await deleteCertificate(deleteId);
          setPending(false);
          setDeleteId(null);
          setSheetOpen(false);
          await refreshCerts(categoryId);
        }}
      />
    </div>
  );
}

function CategoryManagerModal({
  open,
  onOpenChange,
  categories,
  onChange,
  defaultCategoryId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  categories: CertificateCategory[];
  onChange: (c: CertificateCategory[]) => void;
  defaultCategoryId: string;
}) {
  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState("#10b981");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Certificate categories</DialogTitle>
        </DialogHeader>
        <ul className="max-h-48 space-y-1 overflow-y-auto text-sm">
          {categories.map((c) => (
            <li key={c.id} className="flex items-center justify-between hairline rounded-md px-2 py-1.5">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: c.color }} />
                {c.name}
                {c.isDefault ? <Badge variant="mono">Default</Badge> : null}
              </span>
              {!c.isDefault ? (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-danger"
                  onClick={async () => {
                    const res = await deleteCertificateCategory(c.id, defaultCategoryId);
                    if (!res.ok) toast.error(res.error);
                    else onChange(categories.filter((x) => x.id !== c.id));
                  }}
                >
                  Delete
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
        <div className="grid gap-2">
          <Input placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <DialogFooter>
          <Button
            onClick={async () => {
              if (!name.trim()) return;
              const res = await saveCertificateCategory(null, {
                name: name.trim(),
                color,
                order: categories.length,
                isDefault: false,
              });
              if (!res.ok) toast.error(res.error);
              else {
                setName("");
                onChange([...categories, { id: res.data.id, name: name.trim(), slug: "", color, order: categories.length, isDefault: false, createdAt: new Date(), updatedAt: new Date() }]);
              }
            }}
          >
            <Upload className="size-4" /> Add category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BulkReviewModal({
  ids,
  index,
  onIndex,
  onClose,
  certs,
  onSaved,
}: {
  ids: string[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  certs: CertRow[];
  onSaved: () => void;
}) {
  const id = ids[index];
  const cert = certs.find((c) => c.id === id);
  if (!ids.length || !id) return null;

  return (
    <Dialog open={ids.length > 0} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Review upload {index + 1} / {ids.length}
          </DialogTitle>
        </DialogHeader>
        {cert ? (
          <div className="space-y-2 text-sm">
            <p className="font-medium">{cert.title}</p>
            <p className="text-fg-muted">Complete details in the sheet, then continue.</p>
          </div>
        ) : (
          <p className="text-sm text-fg-muted">Loading…</p>
        )}
        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="outline" disabled={index === 0} onClick={() => onIndex(index - 1)}>
            Previous
          </Button>
          <Button
            onClick={() => {
              if (index >= ids.length - 1) onClose();
              else onIndex(index + 1);
              onSaved();
            }}
          >
            Next
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
