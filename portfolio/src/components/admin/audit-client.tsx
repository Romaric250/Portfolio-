"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { AuditLog } from "@prisma/client";
import { DataTable } from "@/components/admin/data-table";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { enumLabel, formatDateLong } from "@/lib/utils";

export function AuditClient({ rows }: { rows: AuditLog[] }) {
  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: "createdAt",
      header: "When",
      cell: ({ row }) => formatDateLong(row.original.createdAt),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => <Badge variant="outline">{enumLabel(row.original.action)}</Badge>,
    },
    { accessorKey: "entity", header: "Entity" },
    { accessorKey: "summary", header: "Summary" },
    { accessorKey: "ip", header: "IP" },
  ];

  return (
    <div>
      <PageHeader title="Audit log" description="Security and content change history." />
      <DataTable columns={columns} data={rows} emptyTitle="No audit entries yet" />
    </div>
  );
}
