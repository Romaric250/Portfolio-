"use client";

import * as React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CharacterCount from "@tiptap/extension-character-count";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table/row";
import { TableHeader } from "@tiptap/extension-table/header";
import { TableCell } from "@tiptap/extension-table/cell";
import Youtube from "@tiptap/extension-youtube";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Table2,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { readingTime } from "@/lib/utils";

const lowlight = createLowlight(common);

export type EditorProps = {
  initialJson?: Record<string, unknown> | null;
  placeholder?: string;
  onChange?: (payload: { json: Record<string, unknown>; html: string; words: number; minutes: number }) => void;
  className?: string;
  onImageRequest?: () => void;
};

function ToolbarButton({
  active,
  onClick,
  children,
  label,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant={active ? "subtle" : "ghost"}
      size="icon-sm"
      aria-label={label}
      onClick={onClick}
      className="size-7 rounded-md"
    >
      {children}
    </Button>
  );
}

export function RichEditor({ initialJson, placeholder = "Write…", onChange, className, onImageRequest }: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false }),
      CharacterCount,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({ modestBranding: true, nocookie: true }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: initialJson ?? undefined,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[280px] px-3 py-2 focus:outline-none [&_p]:my-2 [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:mt-4",
      },
    },
    onUpdate: ({ editor: ed }) => {
      const json = ed.getJSON() as Record<string, unknown>;
      const html = ed.getHTML();
      const text = ed.getText();
      const { minutes, words } = readingTime(text);
      onChange?.({ json, html, words, minutes });
    },
  });

  React.useEffect(() => {
    if (!editor || !initialJson) return;
    const current = JSON.stringify(editor.getJSON());
    const next = JSON.stringify(initialJson);
    if (current !== next) editor.commands.setContent(initialJson);
  }, [editor, initialJson]);

  const setLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  if (!editor) {
    return <div className={cn("hairline min-h-[320px] animate-pulse rounded-lg bg-bg-sunken", className)} />;
  }

  const words = editor.storage.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length;

  return (
    <div className={cn("hairline overflow-hidden rounded-lg bg-bg-elevated", className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-bg-sunken/50 p-1">
        <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} label="Bold">
          <Bold className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} label="Italic">
          <Italic className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} label="H2">
          <Heading2 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} label="H3">
          <Heading3 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} label="List">
          <List className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} label="Ordered list">
          <ListOrdered className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} label="Quote">
          <Quote className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} label="Divider">
          <Minus className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} label="Code">
          <Code className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("link")} onClick={setLink} label="Link">
          <Link2 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            if (onImageRequest) {
              onImageRequest();
              return;
            }
            const url = window.prompt("Image URL");
            const alt = window.prompt("Alt text (required)") ?? "";
            if (url && alt.trim()) editor.chain().focus().setImage({ src: url, alt: alt.trim() }).run();
          }}
          label="Image"
        >
          <ImageIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const url = window.prompt("YouTube URL");
            if (url) editor.commands.setYoutubeVideo({ src: url });
          }}
          label="YouTube"
        >
          <Video className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          label="Table"
        >
          <Table2 className="size-3.5" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
      <div className="flex items-center justify-between border-t border-border px-3 py-1.5 text-xs text-fg-muted">
        <span>{words} words</span>
        <span>{Math.max(1, Math.round(words / 220))} min read</span>
      </div>
    </div>
  );
}

export function EditorSkeleton() {
  return <div className="hairline h-[320px] animate-pulse rounded-lg bg-bg-sunken" />;
}

export function CodeMetaFields({
  language,
  filename,
  onLanguage,
  onFilename,
}: {
  language: string;
  filename: string;
  onLanguage: (v: string) => void;
  onFilename: (v: string) => void;
}) {
  return (
    <div className="flex gap-2">
      <Input value={language} onChange={(e) => onLanguage(e.target.value)} placeholder="Language" className="h-8 text-xs" />
      <Input value={filename} onChange={(e) => onFilename(e.target.value)} placeholder="Filename" className="h-8 text-xs" />
    </div>
  );
}
