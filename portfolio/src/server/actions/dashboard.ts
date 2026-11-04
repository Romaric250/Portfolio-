"use server";

import { prisma } from "@/lib/db/prisma";
import { adminContext } from "@/server/actions/helpers";

export async function getDashboardStats() {
  await adminContext();

  const [
    projects,
    posts,
    certificates,
    messages,
    subscribers,
    unread,
    draftPosts,
    draftProjects,
    topPages,
    recentAudit,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.post.count(),
    prisma.certificate.count(),
    prisma.contactMessage.count({ where: { archived: false } }),
    prisma.subscriber.count({ where: { unsubscribedAt: null } }),
    prisma.contactMessage.count({ where: { read: false, archived: false } }),
    prisma.post.findMany({
      where: { status: "DRAFT" },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, slug: true, updatedAt: true },
    }),
    prisma.project.findMany({
      where: { status: "DRAFT" },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, slug: true, updatedAt: true },
    }),
    prisma.pageView.groupBy({
      by: ["path"],
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 8,
    }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  return {
    counts: { projects, posts, certificates, messages, subscribers, unread },
    drafts: [
      ...draftPosts.map((p) => ({ kind: "post" as const, ...p })),
      ...draftProjects.map((p) => ({ kind: "project" as const, ...p })),
    ].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
    topPages: topPages.map((p) => ({ path: p.path, views: p._count.path })),
    recentAudit,
  };
}
