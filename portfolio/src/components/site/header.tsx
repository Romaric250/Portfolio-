"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { CommandIcon, DownloadIcon, MenuIcon, ArrowUpRightIcon } from "lucide-react";
import { NAV_LINKS } from "@/lib/seo/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Monogram } from "@/components/site/monogram";
import { useCommandPalette } from "@/components/site/command-palette";
import { useStartProject } from "@/components/site/start-project-modal";

export function SiteHeader({ availability }: { availability?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const reduce = useReducedMotion();
  const palette = useCommandPalette();
  const startProject = useStartProject();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      data-site-header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        scrolled ? "bg-bg/80 shadow-[0_1px_0_0_var(--border)] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[70] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:text-bg"
      >
        Skip to content
      </a>
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          aria-label="Romaric Lonfonyuy — home"
        >
          <Monogram className="size-8" />
          <span className="hidden font-sans text-[15px] font-semibold tracking-tight sm:inline">Romaric Lonfonyuy</span>
          {availability ? (
            <span className="ml-1 hidden items-center gap-1.5 rounded-full bg-accent-soft px-2 py-0.5 font-accent text-[10px] font-semibold tracking-[0.12em] text-accent uppercase lg:inline-flex">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              {availability}
            </span>
          ) : null}
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-9 items-center rounded-full px-3 text-[13.5px] font-medium transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                      active ? "text-fg" : "text-fg-muted",
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full bg-bg-sunken"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 34 }}
                      />
                    ) : null}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => palette.setOpen(true)}
            className="hidden h-9 items-center gap-2 rounded-full px-3 text-xs text-fg-muted transition-colors hover:bg-bg-sunken hover:text-fg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:inline-flex"
            aria-label="Open command palette"
          >
            <CommandIcon className="size-3.5" />
            <span>Search</span>
            <kbd className="rounded-md bg-bg-sunken px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle hairline">⌘K</kbd>
          </button>
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/cv/download" prefetch={false}>
              <DownloadIcon /> CV
            </Link>
          </Button>
          <Button size="sm" className="hidden sm:inline-flex" onClick={() => startProject.open("header")}>
            Start a project <ArrowUpRightIcon />
          </Button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex size-10 items-center justify-center rounded-full text-fg hover:bg-bg-sunken focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <MenuIcon className="size-5" />
          </button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex flex-col">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Site sections and quick actions</SheetDescription>
          <div className="flex items-center gap-2.5">
            <Monogram className="size-8" />
            <span className="font-semibold tracking-tight">Romaric Lonfonyuy</span>
          </div>
          <nav aria-label="Mobile" className="mt-6">
            <ul className="flex flex-col">
              {[{ href: "/", label: "Home" }, ...NAV_LINKS, { href: "/work", label: "Work" }, { href: "/impact", label: "Beyond the Code" }, { href: "/cv", label: "CV" }, { href: "/contact", label: "Contact" }].map(
                (link, i) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-3 text-lg font-medium transition-colors hover:bg-bg-sunken",
                        isActive(link.href) && link.href !== "/" && "text-accent",
                      )}
                    >
                      <span>{link.label}</span>
                      <span className="font-accent text-[10px] tracking-[0.18em] text-fg-subtle">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
          <div className="mt-auto flex flex-col gap-2 pt-6">
            <Button
              onClick={() => {
                setOpen(false);
                startProject.open("mobile-menu");
              }}
            >
              Start a project <ArrowUpRightIcon />
            </Button>
            <Button asChild variant="outline">
              <Link href="/cv/download" prefetch={false}>
                <DownloadIcon /> Download CV
              </Link>
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setOpen(false);
                palette.setOpen(true);
              }}
            >
              <CommandIcon /> Command palette
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
