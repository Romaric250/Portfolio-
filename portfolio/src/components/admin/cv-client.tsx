"use client";

import * as React from "react";
import Link from "next/link";
import type { CvSettings } from "@prisma/client";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton, uploadButtonClassNames } from "@/lib/uploadthing/client";
import { saveCvSettings } from "@/server/actions/cv";

export function CvClient({ settings }: { settings: CvSettings | null }) {
  const [form, setForm] = React.useState({
    fileName: settings?.fileName ?? "Romaric-Lonfonyuy-CV.pdf",
    useUploadedCv: settings?.useUploadedCv ?? false,
    uploadedUrl: settings?.uploadedUrl ?? "",
    uploadedKey: settings?.uploadedKey ?? "",
    summary: settings?.summary ?? "",
    referencesNote: settings?.referencesNote ?? "References available on request.",
    includeCommunity: settings?.includeCommunity ?? true,
    includeAwards: settings?.includeAwards ?? true,
  });

  return (
    <div>
      <PageHeader
        title="CV"
        description="Generated CV settings and PDF override."
        actions={
          <Button variant="outline" asChild>
            <Link href="/cv" target="_blank">Preview /cv</Link>
          </Button>
        }
      />
      <div className="max-w-xl space-y-4">
        <div className="space-y-1.5">
          <Label>Download filename</Label>
          <Input value={form.fileName} onChange={(e) => setForm((f) => ({ ...f, fileName: e.target.value }))} />
        </div>
        <div className="flex items-center justify-between hairline rounded-lg p-3">
          <Label>Use uploaded PDF</Label>
          <Switch checked={form.useUploadedCv} onCheckedChange={(v) => setForm((f) => ({ ...f, useUploadedCv: v }))} />
        </div>
        <UploadButton
          endpoint="pdfUploader"
          appearance={uploadButtonClassNames}
          onClientUploadComplete={(files) => {
            const f = files[0];
            if (!f) return;
            setForm((prev) => ({ ...prev, uploadedUrl: f.ufsUrl, uploadedKey: f.key, useUploadedCv: true }));
            toast.success("PDF uploaded");
          }}
        />
        <Textarea value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} placeholder="CV summary override" />
        <Button
          onClick={async () => {
            const res = await saveCvSettings(form);
            if (!res.ok) toast.error(res.error);
            else toast.success("Saved");
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
