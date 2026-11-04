import Link from "next/link";
import { ArrowLeftIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Monogram } from "@/components/site/monogram";

/** Branded 404 — also used for gated admin/login routes so they are indistinguishable from a missing page. */
export function NotFoundView() {
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <Monogram className="size-12" />
      <p className="mt-8 font-accent text-[11px] font-semibold tracking-[0.2em] text-fg-subtle uppercase">Error 404</p>
      <h1 className="display-lg mt-3">Nothing at this address.</h1>
      <div className="panel-dark mt-8 w-full max-w-md p-5 text-left font-mono text-[13px] leading-relaxed">
        <p>
          <span className="text-accent">$</span> curl -I rlonfonyuy.online{"<path>"}
        </p>
        <p className="text-white/60">HTTP/2 404</p>
        <p className="text-white/60">x-reason: route-not-found</p>
        <p className="mt-2 text-white/40"># the page may have moved during the 2026 rebuild</p>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <Button asChild>
          <Link href="/">
            <ArrowLeftIcon /> Back home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/projects">
            <SearchIcon /> Browse projects
          </Link>
        </Button>
      </div>
    </div>
  );
}
