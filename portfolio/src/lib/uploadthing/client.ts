import { generateUploadButton, generateUploadDropzone, generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export const uploadButtonClassNames = {
  button:
    "ut-ready:bg-fg ut-uploading:cursor-not-allowed ut-uploading:bg-fg/70 bg-fg text-bg text-sm font-medium rounded-lg px-4 py-2 transition-colors",
  allowedContent: "text-fg-muted text-xs",
  container: "w-full",
} as const;

export const uploadDropzoneClassNames = {
  container: "w-full",
  label: "text-fg text-sm font-medium",
  allowedContent: "text-fg-muted text-xs",
  button:
    "ut-ready:bg-accent ut-uploading:cursor-not-allowed bg-accent text-accent-fg text-sm font-medium rounded-lg px-4 py-2",
} as const;
