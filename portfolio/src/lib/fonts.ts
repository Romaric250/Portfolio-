import { Inter, Geist, Syne } from "next/font/google";

/**
 * Same families as the typography reference (ghanyelisha.me):
 * Inter (body/H1/nav/buttons), Geist (section headings), Syne (accent labels).
 */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  axes: ["opsz"],
});

export const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

export const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

export const fontClassNames = `${inter.variable} ${geist.variable} ${syne.variable}`;
