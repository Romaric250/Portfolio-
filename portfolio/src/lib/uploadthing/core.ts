import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { prisma } from "@/lib/db/prisma";

const f = createUploadthing();

async function requireAdminSession(): Promise<{ userId: string }> {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new UploadThingError("Unauthorized");
    return { userId };
  } catch (error) {
    if (error instanceof UploadThingError) throw error;
    throw new UploadThingError("Unauthorized");
  }
}

async function persistMedia(file: {
  ufsUrl: string;
  key: string;
  name: string;
  size: number;
  type: string;
}): Promise<void> {
  await prisma.mediaAsset.upsert({
    where: { key: file.key },
    create: {
      url: file.ufsUrl,
      key: file.key,
      name: file.name,
      size: file.size,
      type: file.type,
    },
    update: {
      url: file.ufsUrl,
      name: file.name,
      size: file.size,
      type: file.type,
    },
  });
}

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      await requireAdminSession();
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      await persistMedia(file);
      return { url: file.ufsUrl };
    }),

  pdfUploader: f({
    pdf: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      await requireAdminSession();
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      await persistMedia(file);
      return { url: file.ufsUrl };
    }),

  postImageUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 10 },
  })
    .middleware(async () => {
      await requireAdminSession();
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      await persistMedia(file);
      return { url: file.ufsUrl };
    }),

  certificateUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 20 },
    pdf: { maxFileSize: "16MB", maxFileCount: 20 },
  })
    .middleware(async () => {
      await requireAdminSession();
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      await persistMedia(file);
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
