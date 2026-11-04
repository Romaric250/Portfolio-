import { BlogTable } from "@/components/admin/blog-table";
import { listPosts } from "@/server/actions/blog";

export default async function AdminBlogPage() {
  const posts = await listPosts();
  return <BlogTable posts={posts} />;
}
