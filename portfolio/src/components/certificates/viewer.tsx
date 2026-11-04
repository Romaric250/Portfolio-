"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Download, ExternalLink, X, ZoomIn, ZoomOut } from "lucide-react";
import type { CertificateWithCategory } from "@/lib/db/queries/public";
import { cn, formatDateLong } from "@/lib/utils";
import { CertificatePlaceholder } from "@/components/site/media-slot";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const PdfViewer = dynamic(() => import("@/components/certificates/pdf-pane").then((m) => m.PdfPane), {
  ssr: false,
  loading: () => <p className="p-4 font-mono text-xs text-fg-muted">Loading PDF…</p>,
});

type CertificateViewerProps = {
  cert: CertificateWithCategory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrev?: () => void;
  onNext?: () => void;
};

export function CertificateViewer({ cert, open, onOpenChange, onPrev, onNext }: CertificateViewerProps) {
  const [zoom, setZoom] = React.useState(1);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange, onPrev, onNext]);

  const imageUrl = cert.fileType === "IMAGE" ? cert.fileUrl : cert.thumbnailUrl;
  const isPdf = cert.fileType === "PDF" && cert.fileUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95vh] max-w-6xl flex-col gap-0 overflow-hidden p-0 sm:max-w-[min(96vw,72rem)]">
        <DialogTitle className="sr-only">{cert.title}</DialogTitle>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="min-w-0 pr-4">
            <p className="truncate font-display text-sm font-semibold">{cert.title}</p>
            <p className="truncate text-xs text-fg-muted">{cert.issuer}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {onPrev ? (
              <Button variant="ghost" size="icon-sm" onClick={onPrev} aria-label="Previous certificate">
                <ChevronLeft className="size-4" />
              </Button>
            ) : null}
            {onNext ? (
              <Button variant="ghost" size="icon-sm" onClick={onNext} aria-label="Next certificate">
                <ChevronRight className="size-4" />
              </Button>
            ) : null}
            <Button variant="ghost" size="icon-sm" onClick={() => onOpenChange(false)} aria-label="Close">
              <X className="size-4" />
            </Button>
          </div>
        </div>
        <div className="grid max-h-[calc(95vh-4rem)] min-h-0 flex-1 lg:grid-cols-[1fr_320px]">
          <div className="relative min-h-[240px] overflow-auto bg-bg-sunken">
            <div className="sticky top-0 z-10 flex gap-2 border-b border-border bg-bg-elevated/95 p-2 backdrop-blur">
              <Button variant="ghost" size="icon-sm" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} aria-label="Zoom out">
                <ZoomOut className="size-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => setZoom((z) => Math.min(3, z + 0.25))} aria-label="Zoom in">
                <ZoomIn className="size-4" />
              </Button>
            </div>
            <div className="flex min-h-[280px] items-center justify-center p-4" style={{ transform: `scale(${zoom})`, transformOrigin: "center top" }}>
              {isPdf && cert.fileUrl ? (
                <PdfViewer url={cert.fileUrl} />
              ) : imageUrl ? (
                <div className="relative h-[min(60vh,480px)] w-full max-w-2xl">
                  <Image src={imageUrl} alt={cert.altText} fill className="object-contain" sizes="(max-width:1024px) 90vw, 60vw" />
                </div>
              ) : (
                <CertificatePlaceholder title={cert.title} issuer={cert.issuer} className="max-w-md w-full" />
              )}
            </div>
          </div>
          <aside className="overflow-y-auto border-t border-border p-4 lg:border-l lg:border-t-0">
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-mono text-xs text-fg-subtle">Issued</dt>
                <dd>{formatDateLong(cert.issueDate)}</dd>
              </div>
              {cert.credentialId ? (
                <div>
                  <dt className="font-mono text-xs text-fg-subtle">Credential ID</dt>
                  <dd className="break-all font-mono text-xs">{cert.credentialId}</dd>
                </div>
              ) : null}
              {cert.category ? (
                <div>
                  <dt className="font-mono text-xs text-fg-subtle">Category</dt>
                  <dd>{cert.category.name}</dd>
                </div>
              ) : null}
            </dl>
            {cert.skills.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {cert.skills.map((s) => (
                  <li key={s} className="rounded-full bg-bg-sunken px-2 py-0.5 font-mono text-xs text-fg-muted">
                    {s}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className={cn("mt-6 flex flex-col gap-2")}>
              {cert.credentialUrl ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                    Verify credential
                    <ExternalLink className="size-3.5" />
                  </Link>
                </Button>
              ) : null}
              {cert.allowDownload && cert.fileUrl ? (
                <Button variant="accent" size="sm" asChild>
                  <a href={cert.fileUrl} download>
                    Download
                    <Download className="size-3.5" />
                  </a>
                </Button>
              ) : null}
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/certificates/${cert.slug}`}>Open full page</Link>
              </Button>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
