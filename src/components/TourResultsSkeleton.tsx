import { Container } from "@/components/sections/_layout";

/**
 * Placeholder shown while the upstream tour search streams in. Mirrors the
 * <TourResults> grid (square banner + body) so the layout doesn't shift when the
 * real cards swap in. Pure server component — no JS shipped.
 */
export function TourResultsSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <Container className="py-12 md:py-16">
      {/* count / sort row */}
      <div className="mb-7 flex items-center justify-between">
        <div className="h-4 w-40 rounded bg-brand-line/70 animate-pulse" />
        <div className="h-9 w-44 rounded-lg bg-brand-line/70 animate-pulse" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
        {Array.from({ length: cards }, (_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-2xl bg-white border border-brand-line">
            <div className="aspect-square w-full bg-brand-line/60 animate-pulse" />
            <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
              <div className="h-3 w-24 rounded bg-brand-line/70 animate-pulse" />
              <div className="h-4 w-full rounded bg-brand-line/70 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-brand-line/70 animate-pulse" />
              <div className="mt-auto pt-4">
                <div className="h-6 w-28 rounded bg-brand-line/70 animate-pulse" />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="h-9 rounded bg-brand-line/70 animate-pulse" />
                  <div className="h-9 rounded bg-brand-line/70 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <span className="sr-only">Loading tours…</span>
    </Container>
  );
}
