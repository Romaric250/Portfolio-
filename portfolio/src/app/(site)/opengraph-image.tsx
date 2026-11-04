import { ogBrandImage } from "@/lib/og/brand";
import { SITE } from "@/lib/seo/site";

export const runtime = "nodejs";
export const alt = SITE.defaultTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function SiteOgImage() {
  return ogBrandImage({
    title: SITE.name,
    subtitle: SITE.tagline,
    label: "Secure by design",
  });
}
