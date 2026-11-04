import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/login", "/api/admin", "/api/auth"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
