"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, Loader2Icon, RocketIcon } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { BUDGET_RANGES, PROJECT_TYPES, TIMELINES } from "@/lib/validators/contact";
import { submitInquiry } from "@/server/actions/contact";
import { EASE } from "@/components/motion/reveal";

type Ctx = { open: (source?: string) => void; close: () => void; isOpen: boolean };
const StartProjectContext = React.createContext<Ctx>({ open: () => {}, close: () => {}, isOpen: false });
export const useStartProject = () => React.useContext(StartProjectContext);

type FormState = {
  projectType: string;
  goals: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  company: string;
  website: string;
};

const initial: FormState = { projectType: "", goals: "", budget: "", timeline: "", name: "", email: "", company: "", website: "" };

const STEPS = ["Project", "Goals", "Budget & timeline", "Contact"] as const;

export function StartProjectProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [source, setSource] = React.useState<string | undefined>();
  const value = React.useMemo<Ctx>(
    () => ({
      open: (s) => {
        setSource(s);
        setIsOpen(true);
      },
      close: () => setIsOpen(false),
      isOpen,
    }),
    [isOpen],
  );
  return (
    <StartProjectContext.Provider value={value}>
      {children}
      <StartProjectModal open={isOpen} onOpenChange={setIsOpen} source={source} />
    </StartProjectContext.Provider>
  );
}

function ChoiceGrid({
  options,
  value,
  onChange,
  name,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  name: string;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="grid gap-2 sm:grid-cols-2">
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt)}
            className={cn(
              "flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-[box-shadow,background-color] hairline hover:bg-bg-sunken focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              selected && "bg-accent-soft text-accent shadow-[inset_0_0_0_1.5px_var(--accent)]",
            )}
          >
            {opt}
            {selected ? <CheckIcon className="size-4" /> : null}
          </button>
        );
      })}
    </div>
  );
}

function StartProjectModal({
  open,
  onOpenChange,
  source,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  source?: string;
}) {
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState<FormState>(initial);
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});
  const [pending, startTransition] = React.useTransition();
  const [done, setDone] = React.useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [dir, setDir] = React.useState(1);

  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep(0);
        setDone(false);
        setErrors({});
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 0) return form.projectType.length > 0;
    if (step === 1) return form.goals.trim().length >= 10;
    if (step === 2) return form.budget.length > 0 && form.timeline.length > 0;
    return form.name.trim().length >= 2 && /\S+@\S+\.\S+/.test(form.email);
  };

  const next = () => {
    setDir(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => {
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = () => {
    startTransition(async () => {
      const res = await submitInquiry({ ...form, sourcePath: `${pathname}${source ? `#${source}` : ""}` });
      if (res.ok) {
        setDone(true);
        setForm(initial);
      } else {
        setErrors(res.fieldErrors ?? {});
        toast.error(res.error);
      }
    });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (step < STEPS.length - 1 && canNext()) next();
      else if (canNext()) submit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="p-0" onKeyDown={onKeyDown}>
        <div className="grid md:grid-cols-[220px_1fr]">
          <aside className="hidden flex-col justify-between rounded-l-2xl bg-terminal p-6 text-terminal-fg md:flex">
            <div>
              <p className="eyebrow text-terminal-fg/60">Start a project</p>
              <ol className="mt-6 space-y-4">
                {STEPS.map((label, i) => (
                  <li key={label} className="flex items-center gap-3 text-sm">
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full font-accent text-[11px] font-semibold",
                        i < step ? "bg-accent text-accent-fg" : i === step ? "bg-white/15 text-white" : "bg-white/5 text-white/40",
                      )}
                    >
                      {i < step ? <CheckIcon className="size-3" /> : i + 1}
                    </span>
                    <span className={cn(i === step ? "text-white" : "text-white/50")}>{label}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="font-mono text-[11px] leading-relaxed text-white/40">
              Reply within 48h. No spam, no retainers unless you want one.
            </p>
          </aside>

          <div className="p-6 sm:p-8">
            {done ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <motion.div
                  initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="flex size-16 items-center justify-center rounded-full bg-accent-soft text-accent"
                >
                  <CheckIcon className="size-8" />
                </motion.div>
                <DialogTitle className="mt-5 text-2xl">Got it — thank you.</DialogTitle>
                <DialogDescription className="mt-2 max-w-sm">
                  I’ll review the brief and reply within two working days with next steps or clarifying questions.
                </DialogDescription>
                <Button className="mt-6" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <p className="font-accent text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
                    Step {step + 1} of {STEPS.length}
                  </p>
                  <DialogTitle className="text-xl">
                    {step === 0 && "What are we building?"}
                    {step === 1 && "What does success look like?"}
                    {step === 2 && "Budget and timeline"}
                    {step === 3 && "How can I reach you?"}
                  </DialogTitle>
                  <DialogDescription>
                    {step === 0 && "Pick the closest match. We’ll refine the scope together."}
                    {step === 1 && "Who is it for, what should it do, and what problem does it solve?"}
                    {step === 2 && "Honest ranges help me propose the right approach. Nothing is binding."}
                    {step === 3 && "I’ll reply from romaric.lonfonyuy@ashesi.edu.gh."}
                  </DialogDescription>
                </DialogHeader>

                <div className="relative mt-6 min-h-[220px] overflow-hidden">
                  <AnimatePresence mode="wait" initial={false} custom={dir}>
                    <motion.div
                      key={step}
                      custom={dir}
                      initial={reduce ? false : { opacity: 0, x: dir * 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={reduce ? undefined : { opacity: 0, x: dir * -24 }}
                      transition={{ duration: 0.25, ease: EASE }}
                    >
                      {step === 0 ? (
                        <ChoiceGrid name="Project type" options={PROJECT_TYPES} value={form.projectType} onChange={(v) => set("projectType", v)} />
                      ) : null}
                      {step === 1 ? (
                        <div className="space-y-2">
                          <Label htmlFor="sp-goals">Goals</Label>
                          <Textarea
                            id="sp-goals"
                            autoFocus
                            rows={6}
                            value={form.goals}
                            onChange={(e) => set("goals", e.target.value)}
                            placeholder="e.g. A website for our NGO that explains our programmes, accepts donations and is easy to update from a phone…"
                            aria-invalid={Boolean(errors.goals)}
                          />
                          <p className="text-xs text-fg-subtle">{form.goals.trim().length} characters · at least 10</p>
                        </div>
                      ) : null}
                      {step === 2 ? (
                        <div className="space-y-6">
                          <div>
                            <p className="mb-2 text-sm font-medium">Budget range</p>
                            <ChoiceGrid name="Budget" options={BUDGET_RANGES} value={form.budget} onChange={(v) => set("budget", v)} />
                          </div>
                          <div>
                            <p className="mb-2 text-sm font-medium">Timeline</p>
                            <ChoiceGrid name="Timeline" options={TIMELINES} value={form.timeline} onChange={(v) => set("timeline", v)} />
                          </div>
                        </div>
                      ) : null}
                      {step === 3 ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="sp-name">Your name</Label>
                            <Input id="sp-name" autoFocus autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} aria-invalid={Boolean(errors.name)} />
                            {errors.name ? <p className="text-xs text-danger">{errors.name[0]}</p> : null}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sp-email">Email</Label>
                            <Input id="sp-email" type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} aria-invalid={Boolean(errors.email)} />
                            {errors.email ? <p className="text-xs text-danger">{errors.email[0]}</p> : null}
                          </div>
                          <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="sp-company">Organisation (optional)</Label>
                            <Input id="sp-company" autoComplete="organization" value={form.company} onChange={(e) => set("company", e.target.value)} />
                          </div>
                          <div className="hidden" aria-hidden>
                            <label htmlFor="sp-website">Website</label>
                            <input id="sp-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
                          </div>
                        </div>
                      ) : null}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <Button variant="ghost" onClick={back} disabled={step === 0 || pending}>
                    <ArrowLeftIcon /> Back
                  </Button>
                  {step < STEPS.length - 1 ? (
                    <Button onClick={next} disabled={!canNext()}>
                      Continue <ArrowRightIcon />
                    </Button>
                  ) : (
                    <Button variant="accent" onClick={submit} disabled={!canNext() || pending}>
                      {pending ? <Loader2Icon className="animate-spin" /> : <RocketIcon />} Send brief
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
