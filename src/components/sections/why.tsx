"use client";
import { useSite } from "@/lib/site-context";
import { Container } from "./_layout";

export function Why() {
  const { t } = useSite();
  const total = t.why.items.length;

  return (
    <section id="why" className="py-24 md:py-36 bg-white relative overflow-hidden">
      {/* Subtle red signature accent — top-left */}
      <div aria-hidden className="absolute top-0 left-0 w-1 h-28 bg-linear-to-b from-brand-red to-transparent" />

      <Container>
        {/* Header — 2-line stacked title (regular + italic accent) on the left, lede on the right */}
        <div className="reveal grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-20 items-end mb-16 md:mb-20">
          <div>
            <span className="eyebrow">{t.why.eyebrow}</span>
            <h2
              className="h-display mt-6 leading-[1.02]"
              style={{ fontSize: "clamp(38px, 5.6vw, 76px)" }}
            >
              <span className="block text-brand-ink">{t.why.title1}</span>
              <span className="block h-italic text-brand-blue mt-1 md:mt-2">
                {t.why.title2}
              </span>
            </h2>
          </div>
          <p className="text-[17px] md:text-[19px] text-brand-mute leading-[1.7] max-w-[54ch] font-light">
            {t.why.lede}
          </p>
        </div>

        {/* Card grid — 5 reason cards + 1 CTA card filling the 3-col layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-line border border-brand-line">
          {t.why.items.map((it, i) => (
            <ReasonCard key={i} index={i} total={total} item={it} />
          ))}
          <CtaCard
            eyebrow={t.why.cta.eyebrow}
            headline={t.why.cta.headline}
            buttonLabel={t.cta.quote}
            delay={total * 80}
          />
        </div>
      </Container>
    </section>
  );
}

interface ReasonCardProps {
  index: number;
  total: number;
  item: { num: string; tag: string; title: string; body: string };
}

function ReasonCard({ index, total, item }: ReasonCardProps) {
  return (
    <div
      className="reveal card-lift bg-white p-9 md:p-11 min-h-[320px] flex flex-col relative overflow-hidden group transition-colors duration-500 hover:bg-brand-blue hover:text-white"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Top row: roman numeral + tag (left) · index badge (right) */}
      <div className="flex items-baseline justify-between mb-7">
        <div className="flex items-baseline gap-3.5">
          <span className="h-display text-[32px] md:text-[40px] text-brand-red leading-none transition-colors duration-500 group-hover:text-brand-cream">
            {item.num}
          </span>
          <span className="text-[10px] md:text-[11px] tracking-[0.28em] uppercase font-semibold text-brand-ink/75 transition-colors duration-500 group-hover:text-white/70">
            {item.tag}
          </span>
        </div>
        <span className="text-[10px] tracking-[0.18em] font-semibold text-brand-mute/60 transition-colors duration-500 group-hover:text-white/40">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* Title — the contrarian reframe */}
      <h3 className="h-display text-[26px] md:text-[32px] leading-[1.2] text-brand-ink transition-colors duration-500 group-hover:text-white">
        {item.title}
      </h3>

      {/* Accent line — sits between reframe and the truth */}
      <span
        aria-hidden
        className="block w-8 h-px bg-brand-red mt-5 mb-5 transition-all duration-500 group-hover:w-14 group-hover:bg-brand-cream"
      />

      {/* Body — the real meaning */}
      <p className="text-[14px] md:text-[15px] leading-[1.7] text-brand-mute font-light flex-1 transition-colors duration-500 group-hover:text-white/85">
        {item.body}
      </p>

      {/* Bottom hairline that grows on hover */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-cream transition-[width] duration-700 ease-out group-hover:w-full"
      />
    </div>
  );
}

function CtaCard({
  eyebrow,
  headline,
  buttonLabel,
  delay,
}: {
  eyebrow: string;
  headline: string;
  buttonLabel: string;
  delay: number;
}) {
  return (
    <a
      href="#contact"
      className="reveal card-lift bg-brand-ink text-white p-9 md:p-11 min-h-[320px] flex flex-col justify-between relative overflow-hidden group no-underline"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Diagonal red accent — corner */}
      <div
        aria-hidden
        className="absolute -top-10 -right-10 w-32 h-32 rotate-45 bg-brand-red/15 transition-all duration-500 group-hover:bg-brand-red/30"
      />

      <div className="relative">
        <div className="text-[10px] tracking-wide-cap uppercase font-semibold text-brand-cream">
          {eyebrow}
        </div>
        <h3 className="h-display text-[24px] md:text-[30px] mt-6 leading-[1.2]">
          {headline}
        </h3>
      </div>

      <div className="relative flex items-center gap-3 text-[11px] tracking-wide-cap uppercase font-semibold transition-transform duration-500 group-hover:translate-x-1">
        <span className="w-8 h-px bg-brand-cream/60 transition-all duration-500 group-hover:w-12 group-hover:bg-brand-cream" />
        <span>{buttonLabel}</span>
        <span className="arrow">→</span>
      </div>

      {/* Hover hairline */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-red transition-[width] duration-700 ease-out group-hover:w-full"
      />
    </a>
  );
}
