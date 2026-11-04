"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/seo/site";
import { EASE } from "@/components/motion/reveal";

type TerminalHeroProps = {
  headline: string;
  tagline: string;
  bio: string;
  availability?: string;
  className?: string;
};

type CommandDef = {
  cmd: string;
  desc: string;
  href?: string;
  output?: React.ReactNode;
};

const COMMANDS: CommandDef[] = [
  { cmd: "whoami", desc: "Identity & focus", output: null },
  { cmd: "stack", desc: "Tech stack", href: "/stack" },
  { cmd: "projects", desc: "Flagship work", href: "/projects" },
  { cmd: "security", desc: "Security Lab", href: "/security" },
  { cmd: "services", desc: "What I offer", href: "/services" },
  { cmd: "certs", desc: "Certificate vault", href: "/certificates" },
  { cmd: "blog", desc: "Latest writing", href: "/blog" },
  { cmd: "contact", desc: "Get in touch", href: "/contact" },
  { cmd: "cv", desc: "Web CV", href: "/cv" },
  { cmd: "help", desc: "Command list", output: null },
];

export function TerminalFallback({ headline, tagline, bio, className }: TerminalHeroProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className="font-accent text-xs font-semibold uppercase tracking-[0.2em] text-accent">Secure by design</p>
      <h1 className="display-lg mt-4">{SITE.name}</h1>
      <p className="mt-3 text-xl font-medium text-fg md:text-2xl">{headline}</p>
      <p className="mt-4 text-lg text-fg-muted">{tagline}</p>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg-muted">{bio || SITE.description}</p>
    </div>
  );
}

export function TerminalHero({ headline, tagline, bio, availability, className }: TerminalHeroProps) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [input, setInput] = React.useState("");
  const [history, setHistory] = React.useState<Array<{ type: "in" | "out"; text: React.ReactNode }>>([
    { type: "out", text: "Type a command or pick a chip. Tab through help." },
  ]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const runCommand = React.useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase();
      if (!cmd) return;
      setHistory((h) => [...h, { type: "in", text: `$ ${cmd}` }]);

      const def = COMMANDS.find((c) => c.cmd === cmd);
      if (def?.href) {
        setHistory((h) => [...h, { type: "out", text: `→ navigating to ${def.href}` }]);
        router.push(def.href);
        return;
      }

      if (cmd === "whoami") {
        setHistory((h) => [
          ...h,
          {
            type: "out",
            text: (
              <div className="space-y-1">
                <p>{SITE.name}</p>
                <p className="text-terminal-fg/70">{headline}</p>
                <p className="text-terminal-fg/60">{bio || SITE.description}</p>
                {availability ? <p className="text-accent">status: {availability}</p> : null}
              </div>
            ),
          },
        ]);
        return;
      }

      if (cmd === "help") {
        setHistory((h) => [
          ...h,
          {
            type: "out",
            text: (
              <ul className="space-y-1 font-mono text-xs">
                {COMMANDS.map((c) => (
                  <li key={c.cmd}>
                    <span className="text-accent">{c.cmd.padEnd(12)}</span>
                    <span className="text-terminal-fg/70">{c.desc}</span>
                  </li>
                ))}
              </ul>
            ),
          },
        ]);
        return;
      }

      setHistory((h) => [...h, { type: "out", text: `command not found: ${cmd}. try help.` }]);
    },
    [bio, headline, availability, router],
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(input);
    setInput("");
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={cn("relative", className)}>
      <motion.div
        className="overflow-hidden rounded-2xl border border-border-strong bg-terminal shadow-lg"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <Terminal className="size-4 text-accent" aria-hidden />
          <span className="font-mono text-xs text-terminal-fg/60">rlonfonyuy@portfolio — zsh</span>
        </div>
        <div className="max-h-[min(420px,50vh)] overflow-y-auto p-4 font-mono text-sm text-terminal-fg" aria-live="polite">
          {history.map((line, i) => (
            <div key={i} className={cn("mb-2 whitespace-pre-wrap", line.type === "in" ? "text-accent" : "text-terminal-fg/90")}>
              {line.text}
            </div>
          ))}
          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <label htmlFor="terminal-input" className="text-accent">
              $
            </label>
            <input
              id="terminal-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-terminal-fg/40"
              placeholder="whoami"
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-white/10 p-3">
          {COMMANDS.filter((c) => c.cmd !== "help").map((c) => (
            <button
              key={c.cmd}
              type="button"
              onClick={() => runCommand(c.cmd)}
              className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[0.65rem] text-terminal-fg/80 transition-colors hover:border-accent hover:text-accent"
            >
              {c.cmd}
            </button>
          ))}
        </div>
      </motion.div>
      <p className="mt-6 max-w-xl text-sm text-fg-muted">
        {tagline}{" "}
        <Link href="/about" className="text-accent underline-offset-2 hover:underline">
          Read the story
        </Link>
      </p>
    </div>
  );
}
