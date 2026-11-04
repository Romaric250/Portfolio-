"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-accent text-[11px] font-semibold tracking-[0.2em] text-fg-subtle uppercase">Unexpected error</p>
      <h1 className="display-lg mt-3">Something broke on my side.</h1>
      <p className="mt-4 max-w-md text-fg-muted">The error has been logged. You can retry, or head home.</p>
      {error.digest ? <p className="mt-2 font-mono text-xs text-fg-subtle">ref: {error.digest}</p> : null}
      <div className="mt-8 flex gap-2">
        <button type="button" onClick={reset} className="inline-flex h-10 items-center rounded-full bg-fg px-5 text-sm font-medium text-bg">
          Try again
        </button>
        <a href="/" className="inline-flex h-10 items-center rounded-full px-5 text-sm font-medium hairline">
          Home
        </a>
      </div>
    </div>
  );
}
