import { renderToBuffer } from "@react-pdf/renderer";
import { getCvSettings } from "@/lib/db/queries/public";
import { buildCvPdfData } from "@/lib/cv/build-pdf-data";
import { CvPdfDocument } from "@/lib/cv/pdf-document";

export const dynamic = "force-dynamic";

export async function GET() {
  const cvSettings = await getCvSettings();
  const fileName = cvSettings.fileName || "Romaric-Lonfonyuy-CV.pdf";

  if (cvSettings.useUploadedCv && cvSettings.uploadedUrl) {
    return Response.redirect(cvSettings.uploadedUrl, 302);
  }

  const data = await buildCvPdfData();
  const buffer = await renderToBuffer(<CvPdfDocument data={data} />);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
