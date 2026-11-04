import { ogBrandImage } from "@/lib/og/brand";
import { getProjectBySlug } from "@/lib/db/queries/public";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function ProjectOg({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return ogBrandImage({
    title: project?.title ?? "Project",
    subtitle: project?.summary?.slice(0, 120),
    label: "Case study",
  });
}
