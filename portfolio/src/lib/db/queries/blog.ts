import "server-only";
import type { Category, Post, Series, Tag } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { cached, TAGS } from "@/lib/cache";

export type PostWithRelations = Post & { category: Category | null; tags: Tag[]; series: Series | null };

const publishedWhere = () => ({
  status: "PUBLISHED" as const,
  publishedAt: { lte: new Date() },
  isTemplate: false,
});

async function safe<T>(fn: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(`[db:${label}]`, error instanceof Error ? error.message : error);
    return fallback;
  }
}

export const getPosts = cached(
  async (): Promise<PostWithRelations[]> =>
    safe(
      () =>
        prisma.post.findMany({
          where: publishedWhere(),
          orderBy: [{ publishedAt: "desc" }],
          include: { category: true, tags: true, series: true },
        }),
      [],
      "posts",
    ),
  ["posts"],
  [TAGS.posts, TAGS.categories, TAGS.tags, TAGS.series],
  600,
);

export const getPostBySlug = cached(
  async (slug: string): Promise<PostWithRelations | null> =>
    safe(
      () =>
        prisma.post.findFirst({
          where: { slug, ...publishedWhere() },
          include: { category: true, tags: true, series: true },
        }),
      null,
      "post",
    ),
  ["post"],
  [TAGS.posts],
  600,
);

export async function getRelatedPosts(post: PostWithRelations, take = 3): Promise<PostWithRelations[]> {
  const all = (await getPosts()).filter((p) => p.id !== post.id);
  const tagIds = new Set(post.tagIds);
  const scored = all
    .map((p) => ({
      p,
      score:
        (p.categoryId && p.categoryId === post.categoryId ? 2 : 0) +
        p.tagIds.filter((t) => tagIds.has(t)).length +
        (p.seriesId && p.seriesId === post.seriesId ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, take).map((s) => s.p);
}

export async function getSeriesPosts(seriesId: string): Promise<PostWithRelations[]> {
  const all = await getPosts();
  return all.filter((p) => p.seriesId === seriesId).sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
}

export const getCategories = cached(
  async (): Promise<Array<Category & { count: number }>> =>
    safe(
      async () => {
        const cats = await prisma.category.findMany({
          orderBy: { order: "asc" },
          include: { _count: { select: { posts: { where: publishedWhere() } } } },
        });
        return cats.map(({ _count, ...c }) => ({ ...c, count: _count.posts }));
      },
      [],
      "categories",
    ),
  ["categories"],
  [TAGS.categories, TAGS.posts],
);

export const getTags = cached(
  async (): Promise<Tag[]> => safe(() => prisma.tag.findMany({ orderBy: { name: "asc" } }), [], "tags"),
  ["tags"],
  [TAGS.tags],
);

export const getAllSeries = cached(
  async (): Promise<Series[]> => safe(() => prisma.series.findMany({ orderBy: { name: "asc" } }), [], "series"),
  ["series"],
  [TAGS.series],
);
