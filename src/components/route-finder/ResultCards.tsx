"use client";
import type { Scored } from "@/lib/country-atlas";
import { localeHref, type Locale } from "@/lib/locale";

/* Final step — the 3 best-fit destinations. Each card links straight into the
   existing on-site search (/outboundtrip/search?keyword=<thai country>), so the
   quiz converts into real tour results with no new backend. */

export interface ResultCopy {
  resultTitle: string;
  resultSub: string;
  matchLabel: string;
  whyPrefix: string;
  viewTours: string;
  consult: string;
  restart: string;
  poweredBy: string;
  bestMatch: string;
}

const RANK_TONE = ["from-[#e6c98a] to-[#c79b45]", "from-brand-blue to-brand-blue-deep", "from-brand-red to-[#a90c24]"];

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2.5 13.6 8l5.4 1.6L13.6 11 12 16.5 10.4 11 5 9.6 10.4 8 12 2.5Z" />
    </svg>
  );
}

export function ResultCards({
  top,
  labelMap,
  copy,
  lineHref,
  lang,
  onRestart,
}: {
  top: Scored[];
  labelMap: Map<string, string>; // "qid:value" -> localized label, for the "why"
  copy: ResultCopy;
  lineHref: string;
  lang: Locale;
  onRestart: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div>
        <h3 className="h-display text-brand-ink" style={{ fontSize: "clamp(20px, 2.4vw, 28px)" }}>
          {copy.resultTitle}
        </h3>
        <p className="mt-1.5 text-[13px] text-brand-mute font-light">{copy.resultSub}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-blue/6 px-2.5 py-1 text-[10.5px] font-semibold text-brand-blue">
          <Sparkle className="text-brand-red" />
          {copy.poweredBy}
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {top.map((s, i) => {
          const why = [...new Set(s.matched.map((m) => labelMap.get(`${m.qid}:${m.value}`)).filter(Boolean))].slice(0, 4);
          const match = Math.round(s.normalized * 100);
          const searchHref = localeHref(`/outboundtrip/search?keyword=${encodeURIComponent(s.c.th)}`, lang);
          return (
            <article
              key={s.c.th}
              className={`rf-card relative overflow-hidden rounded-2xl border bg-white p-4 ${
                i === 0
                  ? "border-brand-cream/70 shadow-[0_22px_50px_-26px_rgba(199,155,69,.55)] ring-1 ring-brand-cream/40"
                  : "border-brand-line shadow-[0_18px_44px_-28px_rgba(10,16,36,.5)]"
              }`}
              style={{ animationDelay: `${i * 90}ms` }}
            >
              {i === 0 && (
                <span className="absolute right-0 top-0 inline-flex items-center gap-1 rounded-bl-xl bg-linear-to-r from-[#e6c98a] to-[#c79b45] px-2.5 py-1 text-[9.5px] font-bold tracking-wide-cap uppercase text-brand-ink">
                  <Sparkle /> {copy.bestMatch}
                </span>
              )}
              <div className="flex items-start gap-3.5">
                {/* Rank + flag */}
                <div className="relative shrink-0">
                  <span className={`grid h-12 w-12 place-items-center rounded-xl bg-linear-to-br ${RANK_TONE[i] ?? RANK_TONE[1]} text-white`}>
                    {s.c.flagSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.c.flagSrc} alt="" width={26} height={20} className="h-5 w-[26px] rounded-[3px] object-cover ring-1 ring-black/15" />
                    ) : (
                      <span className="text-[20px]">{s.c.flag}</span>
                    )}
                  </span>
                  <span className="absolute -top-1.5 -left-1.5 grid h-5 w-5 place-items-center rounded-full bg-brand-ink text-[11px] font-bold text-white ring-2 ring-white">
                    {i + 1}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <h4 className="text-[16px] font-bold text-brand-ink leading-tight">{s.c.th}</h4>
                    <span className="text-[11px] text-brand-mute">{s.c.en}</span>
                  </div>

                  {/* Match bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-line">
                      <div className="h-full rounded-full bg-linear-to-r from-brand-red to-[#e6a24a] transition-[width] duration-700" style={{ width: `${match}%` }} />
                    </div>
                    <span className="text-[11px] font-semibold text-brand-red tabular-nums">{copy.matchLabel} {match}%</span>
                  </div>

                  {/* Why */}
                  {why.length > 0 && (
                    <p className="mt-2 text-[12px] text-brand-mute leading-snug">
                      <span className="font-semibold text-brand-ink">{copy.whyPrefix}:</span> {why.join(" · ")}
                    </p>
                  )}

                  {/* CTAs */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a href={searchHref} target="_blank" rel="noopener noreferrer" className="btn btn-blue !py-2 !px-4 text-[12px]!">
                      {copy.viewTours}
                      <span className="arrow">→</span>
                    </a>
                    <a
                      href={lineHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn justify-center gap-1.5 !py-2 !px-4 text-[12px]! text-white"
                      style={{ backgroundColor: "#06C755" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 3C6.48 3 2 6.62 2 11.07c0 3.99 3.55 7.33 8.35 7.96.33.07.77.22.88.5.1.26.07.66.03.92l-.14.85c-.04.26-.2 1.02.9.56 1.1-.46 5.92-3.49 8.08-5.97 1.49-1.64 2.2-3.3 2.2-4.99C22 6.62 17.52 3 12 3Z" /></svg>
                      {copy.consult}
                    </a>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-auto pt-5 text-center">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-mute transition-colors hover:text-brand-ink"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.4 2.6L3 8" /><path d="M3 3v5h5" /></svg>
          {copy.restart}
        </button>
      </div>
    </div>
  );
}
