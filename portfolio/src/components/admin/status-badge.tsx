import type { ContentStatus, PostStatus, InquiryStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { enumLabel } from "@/lib/utils";

type Status = ContentStatus | PostStatus | InquiryStatus | string;

const variantMap: Record<string, "muted" | "accent" | "success" | "warning" | "danger"> = {
  DRAFT: "muted",
  SCHEDULED: "warning",
  PUBLISHED: "success",
  NEW: "accent",
  CONTACTED: "warning",
  WON: "success",
  LOST: "danger",
  ARCHIVED: "muted",
};

export function StatusBadge({ status }: { status: Status }) {
  const key = String(status);
  return <Badge variant={variantMap[key] ?? "outline"}>{enumLabel(key)}</Badge>;
}
