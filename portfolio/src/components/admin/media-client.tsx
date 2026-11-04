"use client";

import * as React from "react";
import type { MediaAsset, MediaSlot } from "@prisma/client";
import { Copy, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadDropzone, uploadDropzoneClassNames } from "@/lib/uploadthing/client";
import { deleteMediaAsset, registerMediaAsset, updateMediaAsset } from "@/server/actions/media";

const SLOTS: { slot: MediaSlot; label: string; size: string }[] = [
  { slot: "HERO_PORTRAIT", label: "Hero portrait", size: "1200×1500" },
  { slot: "ABOUT_PORTRAIT", label: "About portrait", size: "1600×1200" },
  { slot: "OG_FALLBACK", label: "OG fallback", size: "1200×630" },
  { slot: "PROJECT_COVER", label: "Project cover", size: "1600×1000" },
  { slot: "COMMUNITY", label: "Community", size: "1600×1200" },
  { slot: "GALLERY", label: "Gallery", size: "1600×1066" },
  { slot: "SERVICE_VISUAL", label: "Service visual", size: "1200×800" },
  { slot: "CV_PDF", label: "CV PDF", size: "PDF" },
];

export function MediaClient({ assets }: { assets: MediaAsset[] }) {
  const [rows, setRows] = React.useState(assets);

  return (
    <div>
      <PageHeader title="Media" description="UploadThing library, alt text, slots, and recommended sizes." />
      <div className="mb-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {SLOTS.map((s) => (
          <div key={s.slot} className="hairline rounded-lg p-3 text-xs">
            <p className="font-medium text-fg">{s.label}</p>
            <p className="text-fg-muted">{s.size}</p>
          </div>
        ))}
      </div>
      <UploadDropzone
        endpoint="imageUploader"
        appearance={uploadDropzoneClassNames}
        onClientUploadComplete={async (files) => {
          for (const f of files) {
            await registerMediaAsset({
              url: f.ufsUrl,
              key: f.key,
              name: f.name,
              size: f.size,
              type: f.type ?? "image",
              alt: "",
              slot: "NONE",
              slotIndex: 0,
            });
          }
          toast.success("Uploaded");
          window.location.reload();
        }}
      />
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((a) => (
          <div key={a.id} className="hairline overflow-hidden rounded-lg bg-bg-elevated">
            {a.type.startsWith("image") ? (
              <Image src={a.url} alt={a.alt ?? ""} width={400} height={240} className="h-40 w-full object-cover" />
            ) : (
              <div className="flex h-40 items-center justify-center bg-bg-sunken text-sm text-fg-muted">{a.name}</div>
            )}
            <div className="space-y-2 p-3">
              <p className="truncate text-sm font-medium">{a.name}</p>
              <div className="space-y-1.5">
                <Label>Alt</Label>
                <Input
                  defaultValue={a.alt ?? ""}
                  onBlur={(e) => void updateMediaAsset(a.id, { alt: e.target.value }).then(() => toast.success("Alt saved"))}
                />
              </div>
              <Select
                defaultValue={a.slot}
                onValueChange={(v) => void updateMediaAsset(a.id, { slot: v as MediaSlot }).then(() => toast.success("Slot updated"))}
              >
                <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SLOTS.map((s) => (
                    <SelectItem key={s.slot} value={s.slot}>{s.label}</SelectItem>
                  ))}
                  <SelectItem value="NONE">None</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => { void navigator.clipboard.writeText(a.url); toast.success("URL copied"); }}>
                  <Copy className="size-3.5" /> Copy URL
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-danger"
                  onClick={async () => {
                    await deleteMediaAsset(a.id);
                    setRows((r) => r.filter((x) => x.id !== a.id));
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
