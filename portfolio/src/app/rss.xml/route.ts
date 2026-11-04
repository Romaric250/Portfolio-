import { getPosts } from "@/lib/db/queries/blog";
import { getSettings } from "@/lib/db/queries/public";
import { SITE } from "@/lib/seo/site";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 3600;

export async function GET() {
  const [posts, settings] = await Promise.all([getPosts(), getSettings()]);
  const items = posts
    .slice(0, 40)
    .map(
      (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${absoluteUrl(`/blog/${p.slug}`)}</link>
      <guid isPermaLink="true">${absoluteUrl(`/blog/${p.slug}`)}</guid>
      <pubDate>${p.publishedAt?.toUTCString() ?? new Date().toUTCString()}</pubDate>
      <description><![CDATA[${p.excerpt}]]></description>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${settings.name} — Blog</title>
    <link>${SITE.url}/blog</link>
    <description>${settings.shortBio || SITE.description}</description>
    <language>en</language>${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
