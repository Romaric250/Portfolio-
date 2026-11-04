"use client";

import { useRouter } from "next/navigation";
import type { CertificateWithCategory } from "@/lib/db/queries/public";
import { CertificateViewer } from "@/components/certificates/viewer";

export function CertificateModalClient({
  cert,
  all,
}: {
  cert: CertificateWithCategory;
  all: CertificateWithCategory[];
}) {
  const router = useRouter();
  const idx = all.findIndex((c) => c.slug === cert.slug);

  return (
    <CertificateViewer
      cert={cert}
      open
      onOpenChange={(o) => {
        if (!o) router.back();
      }}
      onPrev={
        idx > 0
          ? () => {
              const prev = all[idx - 1];
              if (prev) router.push(`/certificates/${prev.slug}`, { scroll: false });
            }
          : undefined
      }
      onNext={
        idx < all.length - 1
          ? () => {
              const next = all[idx + 1];
              if (next) router.push(`/certificates/${next.slug}`, { scroll: false });
            }
          : undefined
      }
    />
  );
}
