"use client";
import type { ReactNode } from "react";
import { useSite } from "@/lib/site-context";
import { Container } from "./_layout";

const MOCK_LOGOS: { name: string; mark: ReactNode }[] = [
  {
    name: "NORTHWIND",
    mark: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 16 L11 4 L19 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 16 L11 10 L15 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: "ARIA·CO",
    mark: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.6"/>
        <circle cx="11" cy="11" r="2.2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: "ZENITH",
    mark: (
      <svg width="24" height="22" viewBox="0 0 24 22" fill="none">
        <path d="M2 18 L12 4 L22 18 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M8 18 L12 12 L16 18" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: "PRISMA",
    mark: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2 L20 11 L11 20 L2 11 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M2 11 L20 11" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    name: "ORION",
    mark: (
      <svg width="24" height="22" viewBox="0 0 24 22" fill="none">
        <path d="M3 17 C 3 9, 9 3, 17 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="3" cy="17" r="1.6" fill="currentColor"/>
        <circle cx="17" cy="3" r="1.6" fill="currentColor"/>
        <circle cx="11" cy="9" r="1.4" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: "NEXUS·LAB",
    mark: (
      <svg width="26" height="22" viewBox="0 0 26 22" fill="none">
        <circle cx="5" cy="11" r="2.2" fill="currentColor"/>
        <circle cx="13" cy="5" r="2.2" fill="currentColor"/>
        <circle cx="13" cy="17" r="2.2" fill="currentColor"/>
        <circle cx="21" cy="11" r="2.2" fill="currentColor"/>
        <path d="M7 10 L11 6 M15 6 L19 10 M15 16 L19 12 M7 12 L11 16" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    name: "KANTANA",
    mark: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="3" width="16" height="16" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M3 11 L19 11 M11 3 L11 19" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    name: "STELLAR·GRP",
    mark: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2 L13.4 8.6 L20 9.2 L15 13.6 L16.6 20 L11 16.4 L5.4 20 L7 13.6 L2 9.2 L8.6 8.6 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export function SocialProof() {
  const { t } = useSite();
  return (
    <section className="bg-brand-paper border-b border-brand-line">
      <Container className="py-14 md:py-20">
        <div className="reveal grid lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-16 items-end mb-10 md:mb-14">
          <div>
            <span className="eyebrow">{t.socialProof.eyebrow}</span>
            <h2 className="h-display mt-5 text-[28px] md:text-[36px] leading-[1.15] text-brand-ink max-w-[26ch]">
              {t.socialProof.title}
            </h2>
          </div>
          <p className="text-[11px] md:text-[12px] tracking-wide-cap uppercase text-brand-mute leading-[1.85] font-light max-w-[52ch] lg:justify-self-end lg:text-right">
            {t.socialProof.note}
          </p>
        </div>

        {/* Logo grid — grayscale at rest, color on hover */}
        <div className="reveal grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px bg-brand-line border border-brand-line">
          {MOCK_LOGOS.map((l, i) => (
            <div
              key={i}
              className="bg-white flex flex-col items-center justify-center gap-2.5 py-7 md:py-9 px-3 text-brand-mute opacity-70 hover:opacity-100 hover:text-brand-ink hover:bg-brand-paper transition-all duration-500 cursor-default group"
              aria-label={l.name}
            >
              <span className="block transition-transform duration-500 group-hover:-translate-y-0.5">{l.mark}</span>
              <span className="text-[10px] md:text-[11px] tracking-[0.2em] font-semibold uppercase whitespace-nowrap">{l.name}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
