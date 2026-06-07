"use client";
import { useSite } from "@/lib/site-context";
import { Container } from "./_layout";

/* ──────────────────────────────────────────────────────────
   REGISTRATION — standalone tech-differentiator section.
   QR-code online check-in, shown via a vertical demo video.
   ────────────────────────────────────────────────────────── */
export function Registration() {
  const { t } = useSite();
  const r = t.registration;

  return (
    <section id="registration" className="relative overflow-hidden bg-brand-blue text-white">
      <div aria-hidden className="absolute inset-0 bg-linear-to-b from-brand-blue-deep via-brand-blue to-brand-blue-deep" />
      <div aria-hidden className="absolute top-0 left-0 w-24 h-px bg-brand-red" />
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 70% at 80% 10%, rgba(255,255,255,.07), transparent 60%)" }} />

      <Container className="relative py-20 md:py-28">
        <div className="grid lg:grid-cols-[360px_1fr] items-center gap-12 lg:gap-20">
          {/* Demo video — vertical 9:16 */}
          <div className="reveal mx-auto w-full max-w-[300px] md:max-w-[320px] float-soft">
            <div className="relative aspect-[9/16] overflow-hidden rounded-3xl bg-brand-ink ring-1 ring-white/15 shadow-[0_30px_70px_-20px_rgba(6,10,30,.7)]">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/registration/registration.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Copy */}
          <div className="reveal text-center lg:text-left">
            <span className="eyebrow" style={{ color: "rgba(255,255,255,.6)" }}>{r.eyebrow}</span>
            <h2 className="h-display mt-6 text-white" style={{ fontSize: "clamp(34px, 4.6vw, 60px)" }}>
              {r.title}
            </h2>
            <span aria-hidden className="block w-12 h-px bg-brand-red mt-6 mx-auto lg:mx-0" />
            <p className="mt-6 max-w-[60ch] mx-auto lg:mx-0 text-[16px] md:text-[18px] font-light leading-[1.75] text-white/85">
              {r.body}
            </p>

            <ul className="mt-8 grid sm:grid-cols-3 gap-4 list-none p-0 m-0">
              {r.proof.map((pf, i) => (
                <li key={i} className="flex items-center justify-center lg:justify-start gap-2.5 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-[13px] font-medium text-white/90">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c8102e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden><path d="M5 13l4 4L19 7" /></svg>
                  {pf}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
