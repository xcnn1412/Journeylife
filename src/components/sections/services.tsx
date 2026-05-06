"use client";
import { useSite } from "@/lib/site-context";
import { Container, SectionHeading } from "./_layout";

export function Services() {
  const { t } = useSite();
  return (
    <section id="services" className="py-24 md:py-36 bg-brand-paper relative">
      <Container>
        <div className="reveal text-center max-w-[60ch] mx-auto mb-16">
          <SectionHeading eyebrow={t.services.eyebrow} title={t.services.title} />
          <p className="text-[18px] text-brand-mute mt-6 leading-[1.65] font-light">{t.services.lede}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-brand-line border border-brand-line">
          {t.services.items.map((it, i) => (
            <div
              key={i}
              className="reveal group relative bg-white p-10 md:p-12 min-h-[300px] flex flex-col cursor-pointer transition-colors duration-500 hover:bg-brand-blue hover:text-white overflow-hidden"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex justify-between items-start gap-4">
                <span className="text-[10px] tracking-wide-cap uppercase font-semibold text-brand-red group-hover:text-white transition-colors">{it.tag}</span>
                <span className="text-[10px] text-brand-mute group-hover:text-white/50 transition-colors tracking-[0.15em] font-medium">
                  {String(i + 1).padStart(2, "0")} / 04
                </span>
              </div>
              <h3 className="h-display text-[30px] md:text-[38px] mt-8 mb-5">{it.title}</h3>
              <p className="text-[15px] text-brand-mute leading-[1.75] flex-1 max-w-[42ch] group-hover:text-white/75 transition-colors font-light">
                {it.body}
              </p>
              <div className="mt-7 self-end transition-transform duration-500 group-hover:translate-x-2">
                <svg width="38" height="14" viewBox="0 0 38 14" fill="none">
                  <path d="M0 7 L36 7 M30 1 L36 7 L30 13" stroke="currentColor" strokeWidth="1"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
