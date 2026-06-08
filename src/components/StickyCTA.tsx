"use client";
import Image from "next/image";
import { useSite } from "@/lib/site-context";
import type { ReactNode } from "react";

/* ──────────────────────────────────────────────────────────
   STICKY CTA — floating contact dock, right-centered.
   น้องเจอร์นี่ (mascot) ลอยอยู่บนสุด + speech bubble.
   แต่ละปุ่มมีไอคอน; label สไลด์ออกตอน hover.
   ────────────────────────────────────────────────────────── */
export function StickyCTA() {
  const { t, lang } = useSite();
  const d = t.contact.direct;
  const tel = `tel:${d.phone.replace(/[^\d+]/g, "")}`;
  const bubble = lang === "th" ? "ไปเที่ยวกันน!" : "Let's travel!";

  return (
    <aside className="fixed right-2 sm:right-3 md:right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center">
      {/* Mascot + speech bubble — clicks through to the contact page */}
      <a
        href="/contact"
        aria-label={lang === "th" ? "ปรึกษาฟรี — ไปหน้าติดต่อเรา" : "Free consult — go to the contact page"}
        className="group/m mb-2 flex flex-col items-center cta-pop-in"
      >
        <span className="bubble-bob relative hidden sm:block rounded-full bg-brand-blue px-3 py-1 text-[11px] font-semibold leading-none text-white shadow-[0_8px_20px_-8px_rgba(13,43,94,.7)]">
          {bubble}
          <span aria-hidden className="absolute left-1/2 -bottom-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-brand-blue" />
        </span>
        <Image
          src="/mascot/journey-fly.png"
          alt={lang === "th" ? "น้องเจอร์นี่" : "Journey mascot"}
          width={80}
          height={80}
          priority
          className="mascot-fly mt-1 h-12 w-12 sm:h-[72px] sm:w-[72px] drop-shadow-[0_12px_20px_rgba(13,43,94,.45)] transition-transform duration-300 group-hover/m:scale-110 md:h-20 md:w-20"
        />
      </a>

      {/* Glass dock */}
      <div className="flex flex-col items-center gap-2.5 rounded-full bg-white/75 p-2 shadow-[0_14px_44px_-14px_rgba(10,16,36,.4)] ring-1 ring-black/5 backdrop-blur-md">
        <Item
          href={`https://line.me/R/ti/p/${d.line}`}
          label={`LINE ${d.line}`}
          color="#06C755"
          delay={0.08}
          pulse
          external
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 3C6.48 3 2 6.62 2 11.07c0 3.99 3.55 7.33 8.35 7.96.33.07.77.22.88.5.1.26.07.66.03.92l-.14.85c-.04.26-.2 1.02.9.56 1.1-.46 5.92-3.49 8.08-5.97 1.49-1.64 2.2-3.3 2.2-4.99C22 6.62 17.52 3 12 3Z" />
            </svg>
          }
        />
        <Item
          href={tel}
          label={d.phone}
          color="#0d2b5e"
          delay={0.16}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
            </svg>
          }
        />
        <Item
          href={`mailto:${d.email}`}
          label={d.email}
          color="#061a3d"
          delay={0.24}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-10 6L2 7" />
            </svg>
          }
        />
        <Item
          href={d.facebook}
          label="Facebook"
          color="#1877F2"
          delay={0.32}
          external
          icon={
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6 4.39 10.97 10.13 11.85v-8.38H7.08v-3.47h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.47h-2.79v8.38C19.61 23.04 24 18.07 24 12.07z" />
            </svg>
          }
        />
      </div>
    </aside>
  );
}

function Item({
  href,
  label,
  color,
  icon,
  delay,
  pulse = false,
  external = false,
}: {
  href: string;
  label: string;
  color: string;
  icon: ReactNode;
  delay: number;
  pulse?: boolean;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={label}
      className="cta-pop-in group relative flex items-center"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Label — slides out to the left on hover */}
      <span className="pointer-events-none absolute right-full mr-2.5 translate-x-2 whitespace-nowrap opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
        <span
          className="inline-block rounded-full px-4 py-2 text-[12px] font-semibold tracking-[0.03em] text-white shadow-[0_8px_24px_-10px_rgba(10,16,36,.6)]"
          style={{ backgroundColor: color }}
        >
          {label}
        </span>
      </span>

      {/* Icon disc */}
      <span className="relative grid h-11 w-11 place-items-center rounded-full text-white shadow-[0_6px_18px_-6px_rgba(10,16,36,.5)] ring-1 ring-white/25 transition-transform duration-300 group-hover:scale-110 md:h-12 md:w-12" style={{ backgroundColor: color }}>
        {/* attention ring */}
        {pulse && (
          <span aria-hidden className="absolute inset-0 animate-ping rounded-full opacity-60" style={{ backgroundColor: color }} />
        )}
        <span className="relative">{icon}</span>
      </span>
    </a>
  );
}
