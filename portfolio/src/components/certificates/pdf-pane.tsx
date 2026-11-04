"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export function PdfPane({ url }: { url: string }) {
  return (
    <Document file={url} loading={<p className="font-mono text-xs text-fg-muted">Rendering PDF…</p>}>
      <Page pageNumber={1} width={560} renderTextLayer renderAnnotationLayer />
    </Document>
  );
}
