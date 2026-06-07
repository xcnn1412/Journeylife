"use client";
import { useSite } from "@/lib/site-context";
import { Container } from "./_layout";

/* ──────────────────────────────────────────────────────────
   LUCKY DRAW — live on-screen prize draw, fed by the real
   registration list. Shares the SAME navy treatment as the
   Registration section above so the two read as one event-tech pair.
   ────────────────────────────────────────────────────────── */
const REEL = ["A-014", "B-207", "C-318", "A-095", "D-122", "B-451"];

export function LuckyDraw() {
  const { t } = useSite();
  const l = t.lucky;

  return (
    <section id="lucky-draw" className="relative overflow-hidden bg-brand-blue text-white">
      {/* Same navy treatment as the Registration section above — they read as one event-tech pair */}
      <div aria-hidden className="absolute inset-0 bg-linear-to-b from-brand-blue-deep via-brand-blue to-brand-blue-deep" />
      <div aria-hidden className="absolute top-0 left-0 w-24 h-px bg-brand-red" />
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 70% at 20% 10%, rgba(255,255,255,.07), transparent 60%)" }} />

      <Container className="relative py-20 md:py-28">
        <div className="grid lg:grid-cols-[1fr_400px] items-center gap-12 lg:gap-20">
          {/* Copy */}
          <div className="reveal order-2 lg:order-1 text-center lg:text-left">
            <span className="eyebrow" style={{ color: "rgba(255,255,255,.6)" }}>{l.eyebrow}</span>
            <h2 className="h-display mt-6 text-white" style={{ fontSize: "clamp(34px, 4.6vw, 60px)" }}>
              {l.title}
            </h2>
            <span aria-hidden className="block w-12 h-px bg-brand-red mt-6 mx-auto lg:mx-0" />
            <p className="mt-6 max-w-[60ch] mx-auto lg:mx-0 text-[16px] md:text-[18px] font-light leading-[1.75] text-white/85">
              {l.body}
            </p>

            <ul className="mt-8 grid sm:grid-cols-3 gap-4 list-none p-0 m-0">
              {l.proof.map((pf, i) => (
                <li key={i} className="flex items-center justify-center lg:justify-start gap-2.5 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-[13px] font-medium text-white/90">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c8102e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden><path d="M5 13l4 4L19 7" /></svg>
                  {pf}
                </li>
              ))}
            </ul>
          </div>

          {/* Draw card — dark, spinning name reel */}
          <div className="reveal order-1 lg:order-2 mx-auto w-full max-w-[360px] float-soft">
            <div className="rounded-3xl bg-brand-ink text-white p-6 ring-1 ring-white/10 shadow-[0_30px_70px_-20px_rgba(6,10,30,.6)]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/80">{l.badge}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse" />
              </div>

              {/* Reel */}
              <div className="relative mt-5 h-[180px] overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-white/10">
                {/* center highlight */}
                <div aria-hidden className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-12 rounded-lg border border-white/45 bg-white/10 z-10" />
                {/* spinning strip (duplicated for seamless loop) */}
                <div className="reel-spin flex flex-col">
                  {[...REEL, ...REEL].map((n, i) => (
                    <div key={i} className="h-12 grid place-items-center text-[20px] font-semibold tracking-[0.12em] text-white/85">
                      {n}
                    </div>
                  ))}
                </div>
                {/* fade masks */}
                <div aria-hidden className="absolute inset-x-0 top-0 h-14 bg-linear-to-b from-brand-ink to-transparent z-20" />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-brand-ink to-transparent z-20" />
              </div>

              <div className="mt-5 flex items-center gap-2.5 text-[13px] text-white/70">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8102e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="3" y="8" width="18" height="4" rx="1" />
                  <path d="M5 12v8h14v-8M12 8v12" />
                  <path d="M12 8C12 5.5 10.5 4 8.5 4 7 4 6 5 6 6c0 1.5 2 2 6 2M12 8c0-2.5 1.5-4 3.5-4C17 4 18 5 18 6c0 1.5-2 2-6 2" />
                </svg>
                {l.caption}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
