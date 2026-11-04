"use client";

import dynamic from "next/dynamic";
import { EditorSkeleton } from "@/components/admin/editor";
import type { EditorProps } from "@/components/admin/editor";

const RichEditor = dynamic(() => import("@/components/admin/editor").then((m) => m.RichEditor), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

export function LazyRichEditor(props: EditorProps) {
  return <RichEditor {...props} />;
}
