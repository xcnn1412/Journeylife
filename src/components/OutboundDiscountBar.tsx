"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSite } from "@/lib/site-context";

/* ──────────────────────────────────────────────────────────
   OUTBOUND DISCOUNT BAR — left-side promo CTA for /outboundtrip.
   น้องเจอร์นี่ (สวัสดีฮะ) โผล่มุมล่างซ้าย + speech bubble เด้งขึ้น
   "ยิ่งจองเยอะ ยิ่งมีส่วนลด" → ปุ่ม LINE OA.
   Auto-pops after a short delay; dismissible (remembered in
   localStorage); the mascot stays as a quiet re-opener.
   ────────────────────────────────────────────────────────── */

const STORAGE_KEY = "jl-discount-cta";

export function OutboundDiscountBar() {
  const { t } = useSite();
  const c = t.overseasPackages.discountBar;
  const lineHref = `https://line.me/R/ti/p/${t.contact.direct.line}`;
  const [open, setOpen] = useState(false);

  // Auto-open once after a beat, unless the visitor closed it before.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY) === "closed") return;
    const id = setTimeout(() => setOpen(true), 1600);
    return () => clearTimeout(id);
  }, []);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "closed");
    } catch {
      /* ignore */
    }
  };

  return (
    <aside className="fixed bottom-3 left-3 z-40 flex items-end gap-2.5 sm:bottom-5 sm:left-5">
      {/* Mascot — tap to toggle the offer */}
      <button type="button" onClick={() => setOpen((o) => !o)} aria-label={open ? c.close : c.open} className="cta-pop-in group relative shrink-0">
        {!open && (
          <span aria-hidden className="absolute right-1 top-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-70" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-red ring-2 ring-white" />
          </span>
        )}
        <Image
          src="/mascot/journey-hello.png"
          alt={c.mascotAlt}
          width={120}
          height={120}
          className="mascot-fly w-[74px] drop-shadow-[0_16px_26px_rgba(13,43,94,.45)] transition-transform duration-300 group-hover:scale-105 sm:w-[104px]"
        />
      </button>

      {/* Speech bubble */}
      <div
        inert={!open}
        className={`relative mb-2 w-[240px] max-w-[calc(100vw-104px)] origin-bottom-left rounded-2xl bg-white p-3.5 shadow-[0_28px_60px_-22px_rgba(10,16,36,.55)] ring-1 ring-black/5 transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] motion-reduce:transition-none sm:w-[268px] ${
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-2 scale-90 opacity-0"
        }`}
      >
        {/* tail pointing to the mascot */}
        <span aria-hidden className="absolute -left-1.5 bottom-6 h-3 w-3 rotate-45 rounded-[2px] bg-white ring-1 ring-black/5" />

        {/* close */}
        <button
          type="button"
          onClick={close}
          aria-label={c.close}
          className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-brand-ink text-white shadow-md ring-2 ring-white transition-transform hover:scale-110"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>

        <span className="inline-flex items-center gap-1 rounded-full bg-brand-red/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide-cap text-brand-red">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 23a6.6 6.6 0 0 0 6.6-6.6c0-2.1-1-4-2.6-5.5-.4 1.3-1.4 2.1-2.6 2.1 1.1-2.1 0-4.7-2.1-6.3-.3 2.1-1.8 3.2-3.1 4.8-1 1.3-2.1 2.8-2.1 5A6.6 6.6 0 0 0 12 23Z" /></svg>
          {c.badge}
        </span>
        <p className="mt-2 text-[15px] font-extrabold leading-snug text-brand-ink">{c.title}</p>
        <p className="mt-1 text-[12px] leading-[1.6] text-brand-mute">{c.sub}</p>

        <a
          href={lineHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[13px] font-bold text-white shadow-[0_12px_24px_-10px_rgba(6,199,85,.7)] transition-transform hover:-translate-y-px"
          style={{ backgroundColor: "#06C755" }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 3C6.48 3 2 6.62 2 11.07c0 3.99 3.55 7.33 8.35 7.96.33.07.77.22.88.5.1.26.07.66.03.92l-.14.85c-.04.26-.2 1.02.9.56 1.1-.46 5.92-3.49 8.08-5.97 1.49-1.64 2.2-3.3 2.2-4.99C22 6.62 17.52 3 12 3Z" /></svg>
          {c.cta}
        </a>
      </div>
    </aside>
  );
}
