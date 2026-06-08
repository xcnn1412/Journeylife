"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

/* ──────────────────────────────────────────────────────────
   BOOKING MODAL — opens from a departure's "จอง" button.
   3-step booking flow that funnels to LINE OA (where the discount
   is given): copy the tour details → add LINE → paste & send.
   No checkout of our own — LINE closes the sale.
   ────────────────────────────────────────────────────────── */

export interface BookingCopy {
  title: string;
  discountBanner: string;
  discountNote: string;
  step1: string;
  step2: string;
  step3: string;
  copyBtn: string;
  copied: string;
  scanHint: string;
  addLine: string;
  openLine: string;
  step3Desc: string;
  or: string;
  bookOnline: string;
  bookOnlineSub: string;
  close: string;
  msgIntro: string;
  msgCode: string;
  msgProgram: string;
  msgDate: string;
  msgPrice: string;
}

const LineGlyph = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 3C6.48 3 2 6.62 2 11.07c0 3.99 3.55 7.33 8.35 7.96.33.07.77.22.88.5.1.26.07.66.03.92l-.14.85c-.04.26-.2 1.02.9.56 1.1-.46 5.92-3.49 8.08-5.97 1.49-1.64 2.2-3.3 2.2-4.99C22 6.62 17.52 3 12 3Z" />
  </svg>
);

function StepRow({ n, title, last, children }: { n: number; title: string; last?: boolean; children: ReactNode }) {
  return (
    <div className="flex gap-3.5">
      <div className="flex flex-col items-center">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-blue text-[13px] font-bold text-white">{n}</span>
        {!last && <span aria-hidden className="mt-1 w-px flex-1 bg-brand-line" />}
      </div>
      <div className="min-w-0 flex-1 pb-5">
        <h3 className="text-[14px] font-bold text-brand-ink">{title}</h3>
        <div className="mt-2.5">{children}</div>
      </div>
    </div>
  );
}

export function BookingModal({
  code,
  title,
  date,
  price,
  lineHref,
  copy,
  onClose,
  onOnlineBooking,
}: {
  code: string;
  title: string;
  date: string;
  price: string;
  lineHref: string;
  copy: BookingCopy;
  onClose: () => void;
  onOnlineBooking: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const message = [
    copy.msgIntro,
    `${copy.msgCode}: ${code}`,
    `${copy.msgProgram}: ${title}`,
    `${copy.msgDate}: ${date}`,
    `${copy.msgPrice}: ${price}`,
  ].join("\n");

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(lineHref)}`;

  // Scroll lock + ESC.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = message;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5">
      <div className="rf-backdrop absolute inset-0 bg-brand-ink/70 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={copy.title}
        className="rf-panel relative z-[1] flex max-h-[92vh] w-full max-w-[460px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_50px_120px_-30px_rgba(6,26,61,.8)]"
      >
        {/* Header — discount hook */}
        <div className="relative shrink-0 overflow-hidden bg-linear-to-br from-brand-red to-[#a90c24] px-5 py-5 text-white sm:px-6">
          <span aria-hidden className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.close}
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/25 transition-colors hover:bg-white/25"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>

          <span className="cta-flash inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-extrabold text-brand-red">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 23a6.6 6.6 0 0 0 6.6-6.6c0-2.1-1-4-2.6-5.5-.4 1.3-1.4 2.1-2.6 2.1 1.1-2.1 0-4.7-2.1-6.3-.3 2.1-1.8 3.2-3.1 4.8-1 1.3-2.1 2.8-2.1 5A6.6 6.6 0 0 0 12 23Z" /></svg>
            {copy.discountBanner}
            <span aria-hidden className="text-[11px] align-top">*</span>
          </span>
          <p className="mt-2 text-[10.5px] text-white/70">* {copy.discountNote}</p>
          <h2 className="h-display mt-3 text-[20px] text-white sm:text-[22px]">{copy.title}</h2>
          <p className="mt-1 truncate text-[12px] text-white/80">
            <span className="font-semibold">{code}</span> · {date}
          </p>
        </div>

        {/* Body — 3 steps */}
        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          {/* Step 1 — copy details */}
          <StepRow n={1} title={copy.step1}>
            <div className="rounded-xl border border-brand-line bg-brand-paper p-3">
              <p className="whitespace-pre-line text-[12.5px] leading-[1.7] text-brand-ink/80">{message}</p>
            </div>
            <button
              type="button"
              onClick={doCopy}
              className={`mt-2.5 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-bold transition-colors ${
                copied ? "bg-emerald-600 text-white" : "bg-brand-blue text-white hover:bg-brand-blue-deep"
              }`}
            >
              {copied ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5" /></svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              )}
              {copied ? copy.copied : copy.copyBtn}
            </button>
          </StepRow>

          {/* Step 2 — add LINE (QR + button) */}
          <StepRow n={2} title={copy.step2}>
            <div className="flex items-center gap-4 rounded-xl border border-brand-line bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrSrc}
                alt="LINE @journeylife QR"
                width={104}
                height={104}
                loading="lazy"
                className="h-[104px] w-[104px] shrink-0 rounded-lg ring-1 ring-brand-line"
              />
              <div className="min-w-0">
                <p className="text-[12px] leading-[1.6] text-brand-mute">{copy.scanHint}</p>
                <a
                  href={lineHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12.5px] font-bold text-white"
                  style={{ backgroundColor: "#06C755" }}
                >
                  <LineGlyph size={15} />
                  {copy.addLine}
                </a>
              </div>
            </div>
          </StepRow>

          {/* Step 3 — paste & send */}
          <StepRow n={3} title={copy.step3} last>
            <p className="text-[12.5px] leading-[1.7] text-brand-mute">{copy.step3Desc}</p>
            <a
              href={lineHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[14px] font-bold text-white shadow-[0_14px_28px_-12px_rgba(6,199,85,.7)] transition-transform hover:-translate-y-px"
              style={{ backgroundColor: "#06C755" }}
            >
              <LineGlyph />
              {copy.openLine}
            </a>
          </StepRow>

          {/* Secondary booking path — our own online form (a clear alternative) */}
          <div className="mt-2">
            <div className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wide-cap text-brand-mute/55">
              <span aria-hidden className="h-px flex-1 bg-brand-line" />
              {copy.or}
              <span aria-hidden className="h-px flex-1 bg-brand-line" />
            </div>
            <button
              type="button"
              onClick={onOnlineBooking}
              className="group flex w-full items-center gap-3 rounded-xl border border-brand-blue/30 bg-brand-blue/[0.03] px-4 py-3 text-left transition-all hover:-translate-y-px hover:border-brand-blue hover:bg-brand-blue/[0.07] hover:shadow-[0_12px_28px_-16px_rgba(13,43,94,.6)]"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-blue/10 text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h6" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-bold text-brand-ink">{copy.bookOnline}</span>
                <span className="block text-[11px] text-brand-mute">{copy.bookOnlineSub}</span>
              </span>
              <span aria-hidden className="shrink-0 text-brand-blue transition-transform group-hover:translate-x-0.5">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
