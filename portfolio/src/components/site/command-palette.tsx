"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  AwardIcon,
  BookOpenIcon,
  BriefcaseIcon,
  CopyIcon,
  DownloadIcon,
  FileTextIcon,
  FolderKanbanIcon,
  HomeIcon,
  LayersIcon,
  MailIcon,
  MoonStarIcon,
  RocketIcon,
  ShieldIcon,
  SparklesIcon,
  SunIcon,
  UserIcon,
  HeartHandshakeIcon,
  TerminalIcon,
  WrenchIcon,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useStartProject } from "@/components/site/start-project-modal";

export type PaletteItem = { label: string; href: string; hint?: string };
export type PaletteIndex = {
  projects: PaletteItem[];
  certificates: PaletteItem[];
  posts: PaletteItem[];
  services: PaletteItem[];
  email: string;
};

type Ctx = { open: boolean; setOpen: (v: boolean) => void };
const PaletteContext = React.createContext<Ctx>({ open: false, setOpen: () => {} });
export const useCommandPalette = () => React.useContext(PaletteContext);

const PAGES: Array<PaletteItem & { icon: React.ComponentType<{ className?: string }> }> = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Projects", href: "/projects", icon: FolderKanbanIcon },
  { label: "Stack Explorer", href: "/stack", icon: LayersIcon },
  { label: "Security Lab", href: "/security", icon: ShieldIcon },
  { label: "Services", href: "/services", icon: BriefcaseIcon },
  { label: "Websites I've built", href: "/work", icon: SparklesIcon },
  { label: "Certificates", href: "/certificates", icon: AwardIcon },
  { label: "Blog", href: "/blog", icon: BookOpenIcon },
  { label: "About", href: "/about", icon: UserIcon },
  { label: "Beyond the Code", href: "/impact", icon: HeartHandshakeIcon },
  { label: "CV", href: "/cv", icon: FileTextIcon },
  { label: "Now", href: "/now", icon: TerminalIcon },
  { label: "Uses", href: "/uses", icon: WrenchIcon },
  { label: "Contact", href: "/contact", icon: MailIcon },
];

export function CommandPaletteProvider({ index, children }: { index: PaletteIndex; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const startProject = useStartProject();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = React.useCallback(
    (href: string) => {
      setOpen(false);
      if (href.startsWith("http")) window.open(href, "_blank", "noopener,noreferrer");
      else router.push(href);
    },
    [router],
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(index.email);
      toast.success("Email copied", { description: index.email });
    } catch {
      toast.error("Could not copy. Email: " + index.email);
    }
    setOpen(false);
  };

  const value = React.useMemo(() => ({ open, setOpen }), [open]);

  return (
    <PaletteContext.Provider value={value}>
      {children}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Jump to a page, project, certificate, or run an action…" />
        <CommandList>
          <CommandEmpty>Nothing found. Try “projects”, “certificates”, or “cv”.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => { setOpen(false); startProject.open("palette"); }}>
              <RocketIcon /> Start a project
            </CommandItem>
            <CommandItem onSelect={() => go("/cv/download")}>
              <DownloadIcon /> Download CV
              <CommandShortcut>PDF</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={copyEmail}>
              <CopyIcon /> Copy email address
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setTheme(resolvedTheme === "dark" ? "light" : "dark");
                setOpen(false);
              }}
            >
              {resolvedTheme === "dark" ? <SunIcon /> : <MoonStarIcon />}
              Switch to {resolvedTheme === "dark" ? "light" : "dark"} theme
              <CommandShortcut>T</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Pages">
            {PAGES.map((p) => (
              <CommandItem key={p.href} value={`page ${p.label}`} onSelect={() => go(p.href)}>
                <p.icon /> {p.label}
              </CommandItem>
            ))}
          </CommandGroup>
          {index.projects.length > 0 ? (
            <>
              <CommandSeparator />
              <CommandGroup heading="Projects">
                {index.projects.map((p) => (
                  <CommandItem key={p.href} value={`project ${p.label} ${p.hint ?? ""}`} onSelect={() => go(p.href)}>
                    <FolderKanbanIcon /> {p.label}
                    {p.hint ? <CommandShortcut className="tracking-normal normal-case">{p.hint}</CommandShortcut> : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          ) : null}
          {index.services.length > 0 ? (
            <>
              <CommandSeparator />
              <CommandGroup heading="Services">
                {index.services.map((p) => (
                  <CommandItem key={p.href} value={`service ${p.label}`} onSelect={() => go(p.href)}>
                    <BriefcaseIcon /> {p.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          ) : null}
          {index.certificates.length > 0 ? (
            <>
              <CommandSeparator />
              <CommandGroup heading="Certificates">
                {index.certificates.map((p) => (
                  <CommandItem key={p.href} value={`certificate ${p.label} ${p.hint ?? ""}`} onSelect={() => go(p.href)}>
                    <AwardIcon /> {p.label}
                    {p.hint ? <CommandShortcut className="tracking-normal normal-case">{p.hint}</CommandShortcut> : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          ) : null}
          {index.posts.length > 0 ? (
            <>
              <CommandSeparator />
              <CommandGroup heading="Writing">
                {index.posts.map((p) => (
                  <CommandItem key={p.href} value={`post ${p.label}`} onSelect={() => go(p.href)}>
                    <BookOpenIcon /> {p.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          ) : null}
        </CommandList>
      </CommandDialog>
    </PaletteContext.Provider>
  );
}
