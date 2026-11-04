import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteUploadThingFiles(keys: string[]): Promise<void> {
  const filtered = keys.filter(Boolean);
  if (filtered.length === 0) return;
  await utapi.deleteFiles(filtered);
}
