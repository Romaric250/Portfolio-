"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Category, Post, Series, Tag } from "@prisma/client";
import { toast } from "sonner";
import { LazyRichEditor } from "@/components/admin/lazy-editor";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { savePost } from "@/server/actions/blog";

type PostWithTags = Post & { tags: Tag[] };

export function BlogEditor({
  post,
  categories,
  tags,
  seriesList,
}: {
  post: PostWithTags | null;
  categories: Category[];
  tags: Tag[];
  seriesList: Series[];
}) {
  const router = useRouter();
  const isNew = !post;
  const [dirty, setDirty] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [autosaveAt, setAutosaveAt] = React.useState<Date | null>(null);
  const [form, setForm] = React.useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    status: post?.status ?? "DRAFT",
    categoryId: post?.categoryId ?? "",
    seriesId: post?.seriesId ?? "",
    tagIds: post?.tags.map((t) => t.id) ?? ([] as string[]),
    featured: post?.featured ?? false,
    publishedAt: post?.publishedAt?.toISOString().slice(0, 16) ?? "",
    seoTitle: post?.seoTitle ?? "",
    seoDescription: post?.seoDescription ?? "",
  });
  const [contentJson, setContentJson] = React.useState<Record<string, unknown> | null>(
    (post?.contentJson as Record<string, unknown> | null) ?? null,
  );
  const [contentHtml, setContentHtml] = React.useState(post?.contentHtml ?? "");
  const [wordCount, setWordCount] = React.useState(post?.wordCount ?? 0);
  const [readingTime, setReadingTime] = React.useState(post?.readingTime ?? 1);

  const persist = React.useCallback(
    async (silent?: boolean) => {
      setPending(true);
      const result = await savePost(post?.id ?? null, {
        ...form,
        categoryId: form.categoryId || null,
        seriesId: form.seriesId || null,
        seriesOrder: null,
        contentJson,
        contentHtml,
        readingTime,
        wordCount,
        publishedAt: form.publishedAt || null,
      });
      setPending(false);
      if (!result.ok) {
        if (!silent) toast.error(result.error);
        return;
      }
      setDirty(false);
      setAutosaveAt(new Date());
      if (!silent) toast.success("Saved");
      if (isNew) router.replace(`/admin/blog/${result.data.id}`);
      else router.refresh();
    },
    [post?.id, form, contentJson, contentHtml, readingTime, wordCount, isNew, router],
  );

  React.useEffect(() => {
    if (!dirty || isNew) return;
    const t = setTimeout(() => void persist(true), 8000);
    return () => clearTimeout(t);
  }, [dirty, isNew, persist]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void persist();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [persist]);

  return (
    <div className="pb-20">
      <PageHeader
        title={isNew ? "New post" : form.title}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/blog">Back</Link>
            </Button>
            <Button onClick={() => void persist()} disabled={pending}>
              Save
            </Button>
          </div>
        }
      />
      <div className="sticky top-0 z-10 -mx-4 mb-4 border-b border-border bg-bg/95 px-4 py-2 text-xs text-fg-muted backdrop-blur md:-mx-6 md:px-6">
        {wordCount} words · {readingTime} min read
        {autosaveAt ? ` · Autosaved ${autosaveAt.toLocaleTimeString()}` : dirty ? " · Unsaved" : ""}
      </div>
      <div className="grid max-w-4xl gap-4">
        <Input value={form.title} onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value })); setDirty(true); }} placeholder="Title" />
        <Textarea value={form.excerpt} onChange={(e) => { setForm((f) => ({ ...f, excerpt: e.target.value })); setDirty(true); }} placeholder="Excerpt" rows={2} />
        <div className="grid gap-3 sm:grid-cols-3">
        <Select value={form.status} onValueChange={(v) => { setForm((f) => ({ ...f, status: v as typeof form.status })); setDirty(true); }}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
          </SelectContent>
        </Select>
        <Select value={form.categoryId || "__none"} onValueChange={(v) => { setForm((f) => ({ ...f, categoryId: v === "__none" ? "" : v })); setDirty(true); }}>
          <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none">No category</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={form.seriesId || "__none"} onValueChange={(v) => { setForm((f) => ({ ...f, seriesId: v === "__none" ? "" : v })); setDirty(true); }}>
          <SelectTrigger><SelectValue placeholder="Series" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none">No series</SelectItem>
            {seriesList.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        </div>
        {tags.length ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => {
              const on = form.tagIds.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setForm((f) => ({
                      ...f,
                      tagIds: on ? f.tagIds.filter((id) => id !== t.id) : [...f.tagIds, t.id],
                    }));
                    setDirty(true);
                  }}
                  className={`rounded-full px-2.5 py-1 text-xs ${on ? "bg-fg text-bg" : "bg-bg-sunken text-fg-muted"}`}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        ) : null}
        {form.status === "SCHEDULED" ? (
          <div className="space-y-1.5">
            <Label>Publish at</Label>
            <Input type="datetime-local" value={form.publishedAt} onChange={(e) => { setForm((f) => ({ ...f, publishedAt: e.target.value })); setDirty(true); }} />
          </div>
        ) : null}
        <LazyRichEditor
          initialJson={contentJson}
          onChange={({ json, html, words, minutes }) => {
            setContentJson(json);
            setContentHtml(html);
            setWordCount(words);
            setReadingTime(minutes);
            setDirty(true);
          }}
        />
        <div className="flex items-center gap-2">
          <Switch checked={form.featured} onCheckedChange={(v) => { setForm((f) => ({ ...f, featured: v })); setDirty(true); }} id="feat" />
          <Label htmlFor="feat">Featured</Label>
        </div>
      </div>
    </div>
  );
}
