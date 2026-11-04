"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { ContactMessage, InquiryStatus } from "@prisma/client";
import Link from "next/link";
import { DataTable, selectColumn } from "@/components/admin/data-table";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateLong } from "@/lib/utils";
import { bulkUpdateMessageStatus, updateMessage } from "@/server/actions/inbox";

const STATUSES: InquiryStatus[] = ["NEW", "CONTACTED", "WON", "LOST", "ARCHIVED"];

export function InboxClient({ messages }: { messages: ContactMessage[] }) {
  const [filter, setFilter] = React.useState<string>("all");

  const data = messages.filter((m) => (filter === "all" ? true : m.status === filter));

  const columns = React.useMemo<ColumnDef<ContactMessage>[]>(
    () => [
      selectColumn<ContactMessage>(),
      {
        accessorKey: "read",
        header: "Read",
        cell: ({ row }) => (row.original.read ? "Read" : "Unread"),
      },
      { accessorKey: "name", header: "From" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "subject", header: "Subject" },
      { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
      {
        accessorKey: "createdAt",
        header: "Received",
        cell: ({ row }) => formatDateLong(row.original.createdAt),
      },
      {
        id: "mark",
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="outline"
            onClick={() => void updateMessage(row.original.id, { read: !row.original.read }).then(() => window.location.reload())}
          >
            Toggle read
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <PageHeader
        title="Inbox"
        description="Contact and project inquiries."
        actions={
          <Button variant="outline" asChild>
            <Link href="/api/admin/inbox/export">Export CSV</Link>
          </Button>
        }
      />
      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="mb-3 h-8 w-40"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DataTable
        columns={columns}
        data={data}
        searchKey="email"
        emptyTitle="No messages yet"
        bulkActions={(selected) => (
          <>
            {STATUSES.map((status) => (
              <Button
                key={status}
                size="sm"
                variant="outline"
                onClick={() => void bulkUpdateMessageStatus({ ids: selected.map((s) => s.id), status }).then(() => window.location.reload())}
              >
                {status}
              </Button>
            ))}
          </>
        )}
      />
    </div>
  );
}
