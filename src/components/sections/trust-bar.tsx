"use client";
import { useSite } from "@/lib/site-context";
import { AnimNum } from "@/components/Nav";
import { Container } from "./_layout";

/* ──────────────────────────────────────────────────────────
   TRUST BAR — navy credentials band, sits straight after Hero.
   Carries the 60% navy of the palette; numbers (white) = 30%,
   red hairlines / shield marks = the 10% accent.
   ────────────────────────────────────────────────────────── */
export function TrustBar() {
  const { t } = useSite();
  const tb = t.trustBar;

  return (
    <section className="relative overflow-hidden bg-brand-blue text-white">
      {/* Navy depth gradient */}
      <div aria-hidden className="absolute inset-0 bg-linear-to-b from-brand-blue-deep via-brand-blue to-brand-blue-deep" />
      {/* Soft top sheen */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,255,255,.07), transparent 60%)" }}
      />
      {/* Red signature hairline — top center */}
      <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-brand-red" />

      <Container className="relative py-16 md:py-24">
        {/* Header */}
        <div className="reveal text-center max-w-[60ch] mx-auto">
          <span className="eyebrow" style={{ color: "rgba(255,255,255,.55)" }}>
            {tb.eyebrow}
          </span>
          <h2 className="h-display mt-6 text-white" style={{ fontSize: "clamp(28px, 4.4vw, 56px)" }}>
            {tb.title}
          </h2>
          <span aria-hidden className="block w-12 h-px bg-brand-red mx-auto mt-6" />
          <p className="mt-6 text-[15px] md:text-[17px] text-white/70 font-light leading-[1.7]">
            {tb.sub}
          </p>
        </div>

        {/* Credential pills — licence + registration (registration links to DBD) */}
        <div className="reveal mt-9 flex flex-wrap items-center justify-center gap-3">
          {tb.credentials.map((c, i) => {
            const inner = (
              <>
                <ShieldCheck />
                <span className="text-[11px] md:text-[12px] tracking-[0.05em] font-light text-white/60">{c.label}</span>
                <span className="text-[11px] md:text-[12px] tracking-[0.08em] font-semibold text-white">{c.value}</span>
              </>
            );
            return c.href ? (
              <a
                key={i}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pill-glow group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 backdrop-blur-sm transition-colors hover:border-white/45 hover:bg-white/12 hover:[animation-play-state:paused]"
              >
                {inner}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="arrow-nudge text-brand-red/80 transition-colors group-hover:text-brand-red group-hover:[animation-play-state:paused]" aria-hidden>
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
            ) : (
              <span
                key={i}
                className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 backdrop-blur-sm"
              >
                {inner}
              </span>
            );
          })}
        </div>

        {/* Stat bar — animated counters, divided */}
        <dl className="reveal mt-14 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-y-10">
          {tb.stats.map((s, i) => (
            <div
              key={i}
              className="px-4 text-center md:border-l md:border-white/15 md:first:border-l-0"
            >
              <dt className="h-display leading-none text-white" style={{ fontSize: "clamp(40px, 5.2vw, 64px)" }}>
                <AnimNum value={s.num} />
              </dt>
              <dd className="mt-3 text-[11px] md:text-[12px] tracking-wide-cap uppercase font-medium text-white/55">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

function ShieldCheck() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c8102e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
