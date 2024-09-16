import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";
import "./globals.css";
import Navbar from "@/components/Navigations/Navbar";
import Footer from "@/components/Navigations/Footer";
import Wrapper from "@/components/wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Romaric Lonfonyuy | portfolio",
  description: "My developer portfolio",
  keywords: ["developer", "portfolio", "web developer", "software developer", "backend engineer","full stack developer"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <Head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />
        <meta name="keywords" content={metadata.keywords as string} />
        <meta property="og:title" content={metadata.title as string} />
        <meta property="og:description" content={metadata.description as string} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-portfolio-url.com" />
        <meta property="og:image" content="https://your-portfolio-url.com/og-image.jpg" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person | male",
            "name": "Romaric Lonfonyuy",
            "url": "https://your-portfolio-url.com",
            "sameAs": [
              "https://www.linkedin.com/in/your-profile",
              "https://github.com/your-profile"
            ],
            "jobTitle": "Backend Engineer",
            "worksFor": {
              "@type": "Organization",
              "name": "Skaleway"
            }
          })}
        </script>
</Head>
    <Wrapper>

      <body className={inter.className}>

      <Navbar/>
        {children}
        <Footer/>
      
        </body>
    </Wrapper>
  
    </html>
  );
}
