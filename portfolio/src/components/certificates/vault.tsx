"use client";

import Link from "next/link";
import type { CertificateWithCategory } from "@/lib/db/queries/public";
import { CertificateCard } from "@/components/certificates/card";

type CertificateVaultProps = {
  certificates: CertificateWithCategory[];
};

export function CertificateVault({ certificates }: CertificateVaultProps) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {certificates.map((cert) => (
        <Link
          key={cert.id}
          href={`/certificates/${cert.slug}`}
          scroll={false}
          className="mb-4 block break-inside-avoid"
        >
          <CertificateCard cert={cert} />
        </Link>
      ))}
    </div>
  );
}
