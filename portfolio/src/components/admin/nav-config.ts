import type { LucideIcon } from "lucide-react";
import {
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  FileText,
  GraduationCap,
  HeartHandshake,
  Inbox,
  LayoutDashboard,
  Layers,
  Link2,
  Lock,
  Megaphone,
  MessageSquareQuote,
  Newspaper,
  Search,
  Settings,
  Shield,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";

export type AdminNavItem = { href: string; label: string; icon: LucideIcon };

export type AdminNavGroup = { label: string; items: AdminNavItem[] };

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/projects", label: "Projects", icon: Layers },
      { href: "/admin/work", label: "Work", icon: Briefcase },
      { href: "/admin/services", label: "Services", icon: Wrench },
      { href: "/admin/blog", label: "Blog", icon: Newspaper },
      { href: "/admin/certificates", label: "Certificates", icon: BadgeCheck },
      { href: "/admin/stack", label: "Stack", icon: Sparkles },
      { href: "/admin/security-lab", label: "Security Lab", icon: Shield },
    ],
  },
  {
    label: "Story",
    items: [
      { href: "/admin/experience", label: "Experience", icon: BookOpen },
      { href: "/admin/education", label: "Education", icon: GraduationCap },
      { href: "/admin/awards", label: "Awards", icon: Award },
      { href: "/admin/community", label: "Community", icon: HeartHandshake },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
    ],
  },
  {
    label: "Leads",
    items: [
      { href: "/admin/inbox", label: "Inbox", icon: Inbox },
      { href: "/admin/subscribers", label: "Subscribers", icon: Users },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
      { href: "/admin/media", label: "Media", icon: Megaphone },
      { href: "/admin/cv", label: "CV", icon: FileText },
      { href: "/admin/redirects", label: "Redirects", icon: Link2 },
      { href: "/admin/seo", label: "SEO", icon: Search },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/audit", label: "Audit", icon: FileText },
      { href: "/admin/security", label: "Security", icon: Lock },
    ],
  },
];
