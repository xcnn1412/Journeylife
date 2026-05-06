"use client";
import { useSite } from "@/lib/site-context";
import { Container, SectionHeading } from "./_layout";

export function Clients() {
  const { t } = useSite();
  return (
    <section id="clients" className="py-24 md:py-36 bg-brand-paper">
      <Container>
        <div className="reveal text-center max-w-[60ch] mx-auto mb-16">
          <SectionHeading eyebrow={t.clients.eyebrow} title={t.clients.title} />
          <p className="text-[16px] text-brand-mute mt-6 italic font-light">{t.clients.lede}</p>
        </div>

        <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-px bg-brand-line border border-brand-line">
          {t.clients.list.map((c, i) => (
            <div
              key={i}
              className="bg-white py-10 flex items-center justify-center text-[12px] tracking-wide-cap font-semibold text-brand-ink hover:bg-brand-blue hover:text-white transition-colors duration-500 cursor-default"
            >
              {c}
            </div>
          ))}
        </div>

        <div className="reveal mt-24 max-w-[64ch] mx-auto text-center">
          <svg width="36" height="28" viewBox="0 0 36 28" fill="none" className="mx-auto mb-7">
            <path d="M0 28 L0 16 C 0 8, 5 2, 14 0 L 14 4 C 8 6, 6 10, 6 14 L 14 14 L 14 28 Z M22 28 L22 16 C 22 8, 27 2, 36 0 L 36 4 C 30 6, 28 10, 28 14 L 36 14 L 36 28 Z" fill="#c8102e"/>
          </svg>
          <blockquote className="h-display text-[24px] md:text-[32px] leading-[1.4] text-brand-ink m-0">
            &ldquo;{t.testimonial.quote}&rdquo;
          </blockquote>
          <footer className="text-[11px] tracking-wide-cap uppercase font-medium text-brand-mute mt-7">
            — {t.testimonial.who}
          </footer>
        </div>
      </Container>
    </section>
  );
}
