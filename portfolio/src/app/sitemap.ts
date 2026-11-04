import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";
import { getProjects, getServices, getCertificates } from "@/lib/db/queries/public";
import { getPosts, getCategories, getTags } from "@/lib/db/queries/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const staticPaths = [
    "",
    "/about",
    "/projects",
    "/stack",
    "/security",
    "/certificates",
    "/services",
    "/work",
    "/impact",
    "/blog",
    "/contact",
    "/cv",
    "/now",
    "/uses",
  ];

  const [projects, services, certificates, posts, categories, tags] = await Promise.all([
    getProjects(),
    getServices(),
    getCertificates(),
    getPosts(),
    getCategories(),
    getTags(),
  ]);

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  for (const p of projects) {
    entries.push({
      url: `${base}/projects/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
      images: p.coverUrl ? [p.coverUrl] : undefined,
    });
  }
  for (const s of services) {
    entries.push({ url: `${base}/services/${s.slug}`, lastModified: s.updatedAt, changeFrequency: "monthly", priority: 0.7 });
  }
  for (const c of certificates) {
    entries.push({
      url: `${base}/certificates/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "yearly",
      priority: 0.6,
      images: c.thumbnailUrl ?? c.fileUrl ? [c.thumbnailUrl ?? c.fileUrl!] : undefined,
    });
  }
  for (const post of posts) {
    entries.push({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
      images: post.coverUrl ? [post.coverUrl] : undefined,
    });
  }
  for (const cat of categories) {
    if (cat.count > 0) entries.push({ url: `${base}/blog/category/${cat.slug}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 });
  }
  for (const tag of tags) {
    entries.push({ url: `${base}/blog/tag/${tag.slug}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.4 });
  }

  return entries;
}
