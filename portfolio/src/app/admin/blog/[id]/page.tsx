import { notFound } from "next/navigation";
import { BlogEditor } from "@/components/admin/blog-editor";
import { getPost, listCategories, listSeries, listTags } from "@/server/actions/blog";

export default async function AdminBlogEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [categories, tags, seriesList] = await Promise.all([listCategories(), listTags(), listSeries()]);
  if (id === "new") return <BlogEditor post={null} categories={categories} tags={tags} seriesList={seriesList} />;
  const post = await getPost(id);
  if (!post) notFound();
  return <BlogEditor post={post} categories={categories} tags={tags} seriesList={seriesList} />;
}
