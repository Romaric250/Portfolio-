import { Skeleton } from "@/components/ui/misc";

export default function Loading() {
  return (
    <div className="container-x py-16" aria-busy="true" aria-live="polite">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-5 h-14 w-3/4 max-w-2xl" />
      <Skeleton className="mt-3 h-14 w-1/2 max-w-xl" />
      <Skeleton className="mt-6 h-5 w-full max-w-lg" />
      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
