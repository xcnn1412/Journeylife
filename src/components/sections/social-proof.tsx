"use client";
import type { ReactNode } from "react";
import { useSite } from "@/lib/site-context";
import { Container } from "./_layout";

/* Mock brand-style logos — placeholder marks for layout/positioning.
   Each lockup uses currentColor so cell hover state can recolor uniformly. */
const MOCK_LOGOS: { name: string; logo: ReactNode }[] = [
  {
    // 1 · Stacked chevron mark + bold wordmark
    name: "NORTHWIND",
    logo: (
      <div className="flex flex-col items-center gap-3.5">
        <svg width="42" height="34" viewBox="0 0 42 34" fill="none">
          <path d="M3 30 L21 4 L39 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11 30 L21 16 L31 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-[12px] tracking-[0.32em] font-bold">NORTHWIND</span>
      </div>
    ),
  },
  {
    // 2 · Circular "A" monogram (heritage feel)
    name: "ARIA·CO",
    logo: (
      <div className="flex flex-col items-center gap-3.5">
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="absolute inset-0">
            <circle cx="28" cy="28" r="26" stroke="currentColor" strokeWidth="1.6"/>
          </svg>
          <span className="text-[24px] font-serif italic font-semibold leading-none">A</span>
        </div>
        <span className="text-[10px] tracking-[0.42em] font-medium">ARIA · CO</span>
      </div>
    ),
  },
  {
    // 3 · Inline peak + serif wordmark
    name: "ZENITH",
    logo: (
      <div className="flex items-center gap-3">
        <svg width="26" height="22" viewBox="0 0 26 22" fill="none">
          <path d="M2 20 L13 2 L24 20 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        </svg>
        <span className="text-[18px] font-serif tracking-[0.04em]">Zenith</span>
      </div>
    ),
  },
  {
    // 4 · Diamond above thin wordmark
    name: "PRISMA",
    logo: (
      <div className="flex flex-col items-center gap-3">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <path d="M17 2 L32 17 L17 32 L2 17 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M2 17 L32 17" stroke="currentColor" strokeWidth="1"/>
        </svg>
        <span className="text-[11px] tracking-[0.5em] font-light">PRISMA</span>
      </div>
    ),
  },
  {
    // 5 · Italic wordmark with constellation dots
    name: "ORION",
    logo: (
      <div className="flex items-center gap-2.5">
        <span className="text-[24px] font-serif italic">Orion</span>
        <span className="flex flex-col gap-1">
          <span className="block w-1 h-1 rounded-full bg-current" />
          <span className="block w-1.5 h-1.5 rounded-full bg-current" />
          <span className="block w-1 h-1 rounded-full bg-current" />
        </span>
      </div>
    ),
  },
  {
    // 6 · Linked nodes above tech-style caps
    name: "NEXUS·LAB",
    logo: (
      <div className="flex flex-col items-center gap-3.5">
        <svg width="48" height="22" viewBox="0 0 48 22" fill="none">
          <circle cx="6" cy="11" r="3" fill="currentColor"/>
          <circle cx="24" cy="11" r="3" fill="currentColor"/>
          <circle cx="42" cy="11" r="3" fill="currentColor"/>
          <path d="M9 11 L21 11 M27 11 L39 11" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <span className="text-[10px] tracking-[0.42em] font-semibold">NEXUS · LAB</span>
      </div>
    ),
  },
  {
    // 7 · Big serif K monogram (single mark)
    name: "KANTANA",
    logo: (
      <div className="flex flex-col items-center gap-2.5">
        <span className="text-[52px] font-serif font-bold leading-none tracking-[-0.04em]">K</span>
        <span className="block w-8 h-px bg-current" />
        <span className="text-[9px] tracking-[0.5em] font-medium">KANTANA</span>
      </div>
    ),
  },
  {
    // 8 · Condensed bold wordmark with small marker
    name: "STELLAR·GRP",
    logo: (
      <div className="flex flex-col items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1 L8.5 5.4 L13 5.6 L9.4 8.4 L10.5 13 L7 10.4 L3.5 13 L4.6 8.4 L1 5.6 L5.5 5.4 Z" fill="currentColor"/>
        </svg>
        <span className="text-[16px] font-bold tracking-[0.08em] uppercase italic">Stellar</span>
        <span className="text-[9px] tracking-[0.45em] font-medium">GROUP</span>
      </div>
    ),
  },
];

export function SocialProof() {
  const { t } = useSite();
  return (
    <section className="bg-brand-paper border-y border-brand-line relative overflow-hidden">
      {/* Subtle red signature accent — top-right */}
      <div aria-hidden className="absolute top-0 right-0 w-1 h-24 bg-linear-to-b from-brand-red to-transparent" />

      {/* Header (constrained width) */}
      <Container className="pt-16 md:pt-24 relative">
        <div className="reveal">
          <span className="eyebrow">{t.socialProof.eyebrow}</span>
          <h2 className="h-display mt-5 text-[36px] md:text-[52px] leading-[1.05] text-brand-ink whitespace-nowrap">
            <span>our </span>
            <span className="h-italic text-brand-blue">{t.socialProof.title.replace(/^our\s+/i, "")}</span>
          </h2>
          <span className="block w-12 h-px bg-brand-red mt-6" />
        </div>
      </Container>

      {/* Logo marquee — full-bleed, single row, infinite scroll · pauses on hover */}
      <div className="reveal relative overflow-hidden mt-12 md:mt-16 pb-16 md:pb-24 group">
        {/* Edge fade overlays — dissolve logos at section edges */}
        <div aria-hidden className="absolute inset-y-0 left-0 w-24 md:w-40 bg-linear-to-r from-brand-paper to-transparent z-10 pointer-events-none" />
        <div aria-hidden className="absolute inset-y-0 right-0 w-24 md:w-40 bg-linear-to-l from-brand-paper to-transparent z-10 pointer-events-none" />

        <div
          className="flex items-center gap-14 md:gap-24 w-max group-hover:[animation-play-state:paused]"
          style={{ animation: "scroll-x 45s linear infinite" }}
        >
          {[...MOCK_LOGOS, ...MOCK_LOGOS].map((l, i) => (
            <div
              key={i}
              aria-label={l.name}
              className="shrink-0 w-[170px] md:w-[210px] h-[110px] md:h-[130px] flex items-center justify-center text-brand-ink/55 hover:text-brand-blue transition-colors duration-500 cursor-default"
            >
              {l.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
