import { ogBrandImage } from "@/lib/og/brand";
import { getCertificateBySlug } from "@/lib/db/queries/public";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function CertificateOg({ params }: Props) {
  const { slug } = await params;
  const cert = await getCertificateBySlug(slug);
  return ogBrandImage({
    title: cert?.title ?? "Certificate",
    subtitle: cert?.issuer,
    label: "Credential",
  });
}
