import type { Metadata } from "next";
import { SITE } from "@/lib/seo/site";
import { truncate } from "@/lib/utils";

type BuildArgs = {
  title: string;
  description: string;
  path: string;
  /** Absolute or site-relative image URL. Defaults to the route's opengraph-image. */
  image?: string | null;
  type?: "website" | "article" | "profile";
  noindex?: boolean;
  keywords?: string[];
  publishedTime?: Date | string | null;
  modifiedTime?: Date | string | null;
  authors?: string[];
  /** Canonical override (e.g. filtered list pages canonicalise to the base path). */
  canonical?: string;
  tags?: string[];
};

export function buildMetadata(args: BuildArgs): Metadata {
  const canonical = args.canonical ?? args.path;
  const description = truncate(args.description.replace(/\s+/g, " ").trim(), 160);
  const images = args.image ? [{ url: args.image, width: 1200, height: 630, alt: `${args.title} — ${SITE.name}` }] : undefined;
  const iso = (d?: Date | string | null) => (d ? (typeof d === "string" ? d : d.toISOString()) : undefined);

  return {
    title: args.title,
    description,
    keywords: args.keywords?.length ? [...new Set([...args.keywords, SITE.name])] : undefined,
    alternates: { canonical },
    robots: args.noindex
      ? { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    openGraph: {
      type: args.type ?? "website",
      url: canonical,
      siteName: SITE.name,
      locale: SITE.locale,
      title: args.title,
      description,
      images,
      ...(args.type === "article"
        ? {
            publishedTime: iso(args.publishedTime),
            modifiedTime: iso(args.modifiedTime),
            authors: args.authors ?? [SITE.name],
            tags: args.tags,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: SITE.twitterHandle,
      creator: SITE.twitterHandle,
      title: args.title,
      description,
      images: images?.map((i) => i.url),
    },
  };
}

export const NOINDEX: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  noarchive: true,
  googleBot: { index: false, follow: false, noimageindex: true },
};
