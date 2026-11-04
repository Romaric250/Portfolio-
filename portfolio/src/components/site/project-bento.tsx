import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@prisma/client";
import { ArchitectureDiagramView } from "@/components/diagrams/architecture";
import { MediaSlotImage } from "@/components/site/media-slot";
import { enumLabel } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

export function ProjectBento({ projects }: { projects: Project[] }) {
  if (!projects.length) {
    return <p className="text-sm text-fg-muted">Flagship projects will appear here when published.</p>;
  }

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-12">
      {projects.map((p, i) => {
        const span =
          i === 0 ? "md:col-span-7 md:row-span-2" : i === 1 ? "md:col-span-5" : i === 2 ? "md:col-span-5" : "md:col-span-7";
        return (
          <Reveal key={p.id} className={`group relative ${span}`}>
            <Link
              href={`/projects/${p.slug}`}
              className="flex h-full min-h-[220px] flex-col overflow-hidden rounded-2xl border border-border bg-bg-elevated transition-colors hover:border-border-strong"
            >
              <div className="relative aspect-[16/10] min-h-[140px] flex-1 md:aspect-auto">
                <MediaSlotImage url={p.coverUrl} alt={p.coverAlt ?? p.title} className="absolute inset-0 h-full w-full" sizes="(max-width:768px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-terminal/80 via-terminal/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 md:p-6">
                  <p className="font-accent text-[0.65rem] uppercase tracking-widest text-accent">{p.domains.map(enumLabel).join(" · ")}</p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-white md:text-2xl">{p.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-terminal-fg/80">{p.summary}</p>
                </div>
                <ArrowUpRight className="absolute right-4 top-4 size-5 text-white/80 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
              </div>
              {p.diagram !== "NONE" ? (
                <div className="border-t border-border bg-bg-sunken p-3">
                  <ArchitectureDiagramView diagram={p.diagram} className="border-0 bg-transparent p-0" />
                </div>
              ) : null}
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
