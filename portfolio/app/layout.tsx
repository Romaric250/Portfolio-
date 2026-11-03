import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navigations/Navbar";
import Footer from "@/components/Navigations/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Romaric Lonfonyuy | portfolio",
  description: "My developer portfolio",
  keywords: [
    "developer",
    "portfolio",
    "web developer",
    "software developer",
    "backend engineer",
    "full stack developer",
  ],
  openGraph: {
    title: "Romaric Lonfonyuy | portfolio",
    description: "My developer portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen pb-28`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
