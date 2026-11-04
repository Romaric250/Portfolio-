"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import type { Project } from "@prisma/client";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataTable, selectColumn } from "@/components/admin/data-table";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProject } from "@/server/actions/projects";

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const columns = React.useMemo<ColumnDef<Project>[]>(
    () => [
      selectColumn<Project>(),
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <Link href={`/admin/projects/${row.original.id}`} className="font-medium hover:text-accent">
            {row.original.title}
          </Link>
        ),
      },
      { accessorKey: "slug", header: "Slug", cell: ({ row }) => <code className="text-xs">{row.original.slug}</code> },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      { accessorKey: "projectStatus", header: "Project", cell: ({ row }) => row.original.projectStatus },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/projects/${row.original.id}`}>
                  <Pencil className="size-4" /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-danger" onClick={() => setDeleteId(row.original.id)}>
                <Trash2 className="size-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Case studies and portfolio projects."
        actions={
          <Button asChild>
            <Link href="/admin/projects/new">
              <Plus className="size-4" /> Add project
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} data={projects} searchKey="title" emptyTitle="No projects yet" />
      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete project?"
        description="This cannot be undone."
        loading={loading}
        onConfirm={async () => {
          if (!deleteId) return;
          setLoading(true);
          const res = await deleteProject(deleteId);
          setLoading(false);
          if (!res.ok) toast.error(res.error);
          else {
            toast.success("Deleted");
            setDeleteId(null);
            window.location.reload();
          }
        }}
      />
    </div>
  );
}
