"use client";
import { useSite } from "@/lib/site-context";
import { Container, SectionHeading } from "./_layout";

export function Process() {
  const { t } = useSite();
  return (
    <section className="py-24 md:py-36 bg-brand-blue text-white relative overflow-hidden">
      {/* Navy depth gradient — edges resolve to brand-blue-deep so the page seams blend */}
      <div aria-hidden className="absolute inset-0 bg-linear-to-b from-brand-blue-deep via-brand-blue to-brand-blue-deep" />
      {/* Red signature bar (fades out — kept minimal) + soft top-right glow */}
      <div aria-hidden className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-brand-red/70 via-brand-red/15 to-transparent" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,.08),transparent_55%)] pointer-events-none" />

      <Container className="relative">
        <div className="reveal max-w-[42ch] mb-20">
          <SectionHeading eyebrow={t.process.eyebrow} title={t.process.title} invert />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {t.process.steps.map((s, i) => (
            <div
              key={i}
              className="reveal bg-brand-blue p-9 min-h-[320px] flex flex-col transition-colors duration-500 hover:bg-brand-blue-deep relative group"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="h-display text-brand-red text-[28px] mb-7">{s.n}</div>
              <h3 className="h-display text-[24px] md:text-[28px] mb-4">{s.title}</h3>
              <p className="text-[14px] leading-[1.75] font-light" style={{ color: "rgba(255,255,255,.7)" }}>
                {s.body}
              </p>
              <div aria-hidden className="absolute top-0 left-0 h-0.5 w-0 bg-brand-red transition-[width] duration-700 ease-out group-hover:w-full" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
