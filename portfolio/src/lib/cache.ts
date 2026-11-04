import { unstable_cache } from "next/cache";
import { revalidatePath, revalidateTag } from "next/cache";

/** Cache tags — every public query is tagged so admin mutations invalidate precisely. */
export const TAGS = {
  settings: "settings",
  projects: "projects",
  clientWork: "client-work",
  services: "services",
  skills: "skills",
  security: "security-lab",
  experience: "experience",
  education: "education",
  certificates: "certificates",
  certificateCategories: "certificate-categories",
  awards: "awards",
  community: "community",
  testimonials: "testimonials",
  posts: "posts",
  categories: "categories",
  tags: "tags",
  series: "series",
  media: "media",
  cv: "cv",
  redirects: "redirects",
  seo: "seo",
  github: "github",
} as const;

export type CacheTag = (typeof TAGS)[keyof typeof TAGS];

const DEFAULT_REVALIDATE = 60 * 60; // 1h ISR safety net; admin mutations invalidate instantly.

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

/** `unstable_cache` JSON-serializes Date → string; restore them so `.toISOString()` / `.getFullYear()` keep working. */
function reviveDates<T>(value: T): T {
  if (typeof value === "string" && ISO_DATE.test(value)) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d as T;
    return value;
  }
  if (Array.isArray(value)) return value.map((item) => reviveDates(item)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = reviveDates(v);
    return out as T;
  }
  return value;
}

export function cached<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  keyParts: string[],
  tags: CacheTag[],
  revalidate: number | false = DEFAULT_REVALIDATE,
): (...args: TArgs) => Promise<TResult> {
  const cachedFn = unstable_cache(fn, keyParts, { tags, revalidate });
  return async (...args: TArgs) => reviveDates(await cachedFn(...args));
}

/** Invalidate tags + paths after an admin mutation so the live site updates immediately. */
export function invalidate(tags: CacheTag[], paths: string[] = []): void {
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  for (const path of paths) revalidatePath(path);
  revalidatePath("/sitemap.xml");
  revalidatePath("/llms.txt");
}
