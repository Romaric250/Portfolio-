"use client";

import * as React from "react";

export function ReadingProgress() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop;
      const height = el.scrollHeight - el.clientHeight;
      setProgress(height > 0 ? scrollTop / height : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="no-print fixed inset-x-0 top-0 z-50 h-0.5 bg-border" aria-hidden>
      <div className="h-full bg-accent transition-[width]" style={{ width: `${progress * 100}%` }} />
    </div>
  );
}
