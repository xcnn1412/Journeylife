"use client";
import type { ReactNode } from "react";
import { useSite } from "@/lib/site-context";
import { Container } from "./_layout";

const RELIEF_ICONS: ReactNode[] = [
  // 1 · Pitch / presentation chart
  <svg key="pitch" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="3" y="3" width="16" height="12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M11 15 V19 M8 19 H14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M6 11 L9 8 L12 10 L16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  // 2 · Budget / coin
  <svg key="budget" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M11 6 V16 M8.5 8.5 C 8.5 7.5, 9.5 7, 11 7 C 12.5 7, 13.5 7.7, 13.5 9 C 13.5 10.2, 12.5 10.7, 11 10.8 C 9.5 11, 8.5 11.6, 8.5 13 C 8.5 14.3, 9.5 15, 11 15 C 12.5 15, 13.5 14.5, 13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  // 3 · People / registration
  <svg key="people" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="8" cy="7" r="2.6" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 18 C 3 14, 5 12, 8 12 C 11 12, 13 14, 13 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="15.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M14 18 C 14 15, 16 13.5, 18.5 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>,
  // 4 · Bed / room arrangement
  <svg key="bed" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M3 16 V8 M3 13 H19 V16 M19 13 V11 C 19 10, 18 9, 17 9 H10 V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7" cy="11" r="1.6" stroke="currentColor" strokeWidth="1.4"/>
  </svg>,
  // 5 · Phone / 24-7 standby
  <svg key="phone" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M5 4 C 5 3, 6 2, 7 2 H9 L11 6 L9 8 C 10 11, 11 12, 14 13 L 16 11 L 20 13 V15 C 20 16, 19 17, 18 17 C 11 17, 5 11, 5 4 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>,
  // 6 · Camera / post-trip content
  <svg key="cam" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="3" y="6" width="16" height="12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M8 6 L9.5 4 H12.5 L14 6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <circle cx="11" cy="12" r="3" stroke="currentColor" strokeWidth="1.4"/>
  </svg>,
];

export function Relief() {
  const { t } = useSite();
  return (
    <section className="bg-brand-blue-soft border-y border-brand-line relative overflow-hidden">
      {/* Subtle red signature accent */}
      <div aria-hidden className="absolute top-0 left-0 w-1 h-24 bg-linear-to-b from-brand-red to-transparent" />

      <Container className="py-20 md:py-28 relative">
        {/* Header */}
        <div className="reveal text-center max-w-[64ch] mx-auto mb-14 md:mb-20">
          <span className="eyebrow">{t.relief.eyebrow}</span>
          <h2 className="h-display mt-6 text-brand-ink" style={{ fontSize: "clamp(38px, 5.2vw, 72px)" }}>
            {t.relief.title}
          </h2>
          <p className="text-[16px] md:text-[18px] text-brand-mute mt-6 leading-[1.7] font-light">
            {t.relief.sub}
          </p>
        </div>

        {/* Card grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {t.relief.items.map((it, i) => (
            <ReliefCard
              key={i}
              index={i}
              topic={it.topic}
              pain={it.pain}
              solution={it.solution}
              divider={t.relief.divider}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function ReliefCard({
  index,
  topic,
  pain,
  solution,
  divider,
}: {
  index: number;
  topic: string;
  pain: string;
  solution: string;
  divider: string;
}) {
  return (
    <div
      className="reveal card-lift bg-white border border-brand-line p-7 md:p-8 flex flex-col gap-5 group relative overflow-hidden"
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      {/* Icon plate + numbering */}
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-full bg-brand-blue-soft flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors duration-500">
          {RELIEF_ICONS[index]}
        </div>
        <span className="text-[10px] tracking-[0.18em] font-semibold text-brand-mute/70">
          {String(index + 1).padStart(2, "0")} / 06 — {topic}
        </span>
      </div>

      {/* Topic — card heading */}
      <h3 className="h-display text-[22px] md:text-[26px] text-brand-ink leading-[1.2]">
        {topic}
      </h3>

      {/* Pain — muted strikethrough, with red × */}
      <div className="flex items-start gap-3">
        <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-red/10 text-brand-red text-[11px] font-bold leading-none mt-0.5">×</span>
        <span className="text-[13px] md:text-[14px] text-brand-mute line-through decoration-brand-red/45 decoration-1 leading-[1.55]">
          {pain}
        </span>
      </div>

      {/* Divider with label */}
      <div className="flex items-center gap-3 text-[10px] tracking-wide-cap uppercase font-semibold text-brand-blue">
        <span className="w-5 h-px bg-brand-blue/40" />
        <span className="whitespace-nowrap">{divider}</span>
        <span className="flex-1 h-px bg-brand-blue/20" />
      </div>

      {/* Solution — bold, ink */}
      <div className="flex items-start gap-3">
        <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-blue text-white text-[11px] font-bold leading-none mt-0.5">✓</span>
        <span className="text-[14px] md:text-[15px] text-brand-ink leading-[1.65] font-medium">
          {solution}
        </span>
      </div>

      {/* Hairline accent on hover */}
      <div aria-hidden className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-cream group-hover:w-full transition-[width] duration-700" />
    </div>
  );
}
