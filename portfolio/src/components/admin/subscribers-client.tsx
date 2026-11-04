"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Subscriber } from "@prisma/client";
import Link from "next/link";
import { DataTable } from "@/components/admin/data-table";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateLong } from "@/lib/utils";

export function SubscribersClient({ rows }: { rows: Subscriber[] }) {
  const columns: ColumnDef<Subscriber>[] = [
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "confirmed",
      header: "Confirmed",
      cell: ({ row }) => (row.original.confirmed ? <Badge variant="success">Yes</Badge> : <Badge variant="muted">No</Badge>),
    },
    { accessorKey: "source", header: "Source" },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => formatDateLong(row.original.createdAt),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Subscribers"
        actions={
          <Button variant="outline" asChild>
            <Link href="/api/admin/subscribers/export">Export CSV</Link>
          </Button>
        }
      />
      <DataTable columns={columns} data={rows} searchKey="email" emptyTitle="No subscribers yet" />
    </div>
  );
}
