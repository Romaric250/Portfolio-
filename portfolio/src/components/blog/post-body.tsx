import { sanitizePostHtml } from "@/lib/blog/sanitize";

export function PostBody({ html }: { html: string }) {
  const safe = sanitizePostHtml(html);
  return <div className="prose prose-neutral dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: safe }} />;
}
