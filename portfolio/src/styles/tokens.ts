/**
 * Design tokens — single source of truth, mirrored as CSS variables in globals.css.
 *
 * Typography is extracted from https://www.ghanyelisha.me (reference for type + polish only):
 *   • Inter  — variable 100–900. Body copy, H1, navigation, buttons, forms.      (ref: --font-inter / font-sans)
 *   • Geist  — variable 100–900. Section headings (H2/H3), display numerals.    (ref: --font-geist / font-serif)
 *   • Syne   — variable 400–800. Eyebrow labels, section markers, accents.      (ref: --font-syne)
 *   • Mono   — system stack ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas… (ref: --font-mono)
 * Weights observed on the reference: 400 (body), 500 (nav/labels), 600 (headings), 700 (H1).
 */
export const fonts = {
  sans: {
    family: "Inter",
    cssVar: "--font-inter",
    weights: "100 900",
    roles: ["body", "h1", "nav", "buttons", "forms"],
  },
  display: {
    family: "Geist",
    cssVar: "--font-geist",
    weights: "100 900",
    roles: ["h2", "h3", "display numerals", "stats"],
  },
  accent: {
    family: "Syne",
    cssVar: "--font-syne",
    weights: "400 800",
    roles: ["eyebrows", "section markers 01/02/03", "badges"],
  },
  mono: {
    family: "ui-monospace",
    cssVar: "--font-mono",
    stack: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    roles: ["terminal", "code", "metadata"],
  },
} as const;

export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

/** Colour tokens. Hex values are the design intent; globals.css stores them as CSS vars. */
export const colors = {
  light: {
    bg: "#FAFAF7", // warm paper
    bgElevated: "#FFFFFF",
    bgSunken: "#F3F3EE",
    fg: "#0B0F14", // ink
    fgMuted: "#5B6470",
    fgSubtle: "#8A939E",
    border: "rgba(11, 15, 20, 0.09)",
    borderStrong: "rgba(11, 15, 20, 0.18)",
    accent: "#047857", // emerald-700, AA on paper (6.4:1)
    accentFg: "#FFFFFF",
    accentSoft: "rgba(4, 120, 87, 0.10)",
    signal: "#10B981", // emerald-500, decorative glows only
    secondary: "#8B6F47", // muted clay
    secondarySoft: "rgba(139, 111, 71, 0.10)",
    terminalBg: "#0B0F14",
    terminalFg: "#D7DEE7",
    danger: "#B42318",
    warning: "#B54708",
    success: "#047857",
  },
  dark: {
    bg: "#0B0F14", // deep ink
    bgElevated: "#11161D",
    bgSunken: "#070A0E",
    fg: "#E8EAED",
    fgMuted: "#9AA4B2",
    fgSubtle: "#6B7682",
    border: "rgba(255, 255, 255, 0.08)",
    borderStrong: "rgba(255, 255, 255, 0.16)",
    accent: "#34D399", // emerald-400, AA on ink (10.9:1)
    accentFg: "#06281D",
    accentSoft: "rgba(52, 211, 153, 0.12)",
    signal: "#2DD4BF",
    secondary: "#C8A97E",
    secondarySoft: "rgba(200, 169, 126, 0.12)",
    terminalBg: "#070A0E",
    terminalFg: "#D7DEE7",
    danger: "#F97066",
    warning: "#FDB022",
    success: "#34D399",
  },
} as const;

export const radii = {
  sm: "0.375rem",
  md: "0.625rem",
  lg: "0.875rem",
  xl: "1.25rem",
  "2xl": "1.75rem",
  full: "9999px",
} as const;

export const shadows = {
  sm: "0 1px 2px rgba(11,15,20,0.04), 0 1px 1px rgba(11,15,20,0.03)",
  md: "0 2px 6px rgba(11,15,20,0.05), 0 8px 24px -8px rgba(11,15,20,0.10)",
  lg: "0 4px 12px rgba(11,15,20,0.06), 0 24px 48px -16px rgba(11,15,20,0.16)",
  glow: "0 0 0 1px var(--accent-soft), 0 12px 40px -12px color-mix(in oklab, var(--signal) 45%, transparent)",
} as const;

export const motion = {
  ease: [0.22, 1, 0.36, 1] as const, // "out-expo-ish"
  easeInOut: [0.65, 0, 0.35, 1] as const,
  durations: { fast: 0.18, base: 0.32, slow: 0.6, reveal: 0.75 },
  stagger: 0.06,
} as const;

export const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 } as const;

export const layout = {
  maxWidth: "80rem", // 1280
  gutter: "clamp(1rem, 4vw, 3rem)",
  sectionY: "clamp(4rem, 10vw, 8rem)",
} as const;
