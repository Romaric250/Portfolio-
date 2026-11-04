import type { Metadata } from "next";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex min-h-full flex-1 items-center justify-center bg-bg px-4 py-16">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </Providers>
  );
}
