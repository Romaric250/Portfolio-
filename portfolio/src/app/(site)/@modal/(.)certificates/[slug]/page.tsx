import { notFound } from "next/navigation";
import { getCertificateBySlug, getCertificates } from "@/lib/db/queries/public";
import { CertificateModalClient } from "@/components/certificates/modal-route";

type Props = { params: Promise<{ slug: string }> };

export default async function CertificateModalPage({ params }: Props) {
  const { slug } = await params;
  const cert = await getCertificateBySlug(slug);
  if (!cert) notFound();
  const all = await getCertificates();
  return <CertificateModalClient cert={cert} all={all} />;
}
