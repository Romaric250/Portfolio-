"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import type { Category, Post, Series } from "@prisma/client";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { formatDateLong } from "@/lib/utils";

type PostRow = Post & { category: Category | null; series: Series | null };

export function BlogTable({ posts }: { posts: PostRow[] }) {
  const columns = React.useMemo<ColumnDef<PostRow>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <Link href={`/admin/blog/${row.original.id}`} className="font-medium hover:text-accent">
            {row.original.title}
          </Link>
        ),
      },
      { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
      {
        id: "category",
        header: "Category",
        cell: ({ row }) => row.original.category?.name ?? "—",
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ row }) => formatDateLong(row.original.updatedAt),
      },
      { accessorKey: "wordCount", header: "Words" },
    ],
    [],
  );

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Posts, drafts, and scheduled publishing."
        actions={
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="size-4" /> New post
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} data={posts} searchKey="title" emptyTitle="No posts yet" />
    </div>
  );
}
