"use client";
import type { ReactNode } from "react";
import { useSite } from "@/lib/site-context";
import { Container, SectionHeading } from "./_layout";

/* ── Channel icons ── */
const LineIcon = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 3C6.48 3 2 6.62 2 11.07c0 3.99 3.55 7.33 8.35 7.96.33.07.77.22.88.5.1.26.07.66.03.92l-.14.85c-.04.26-.2 1.02.9.56 1.1-.46 5.92-3.49 8.08-5.97 1.49-1.64 2.2-3.3 2.2-4.99C22 6.62 17.52 3 12 3Z" />
  </svg>
);
const MessengerIcon = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.42 3.14 7.16.16.14.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.99-.88c.17-.07.36-.09.54-.04 1.04.29 2.15.45 3.32.45 5.64 0 10-4.13 10-9.7C22.7 6.13 18.34 2 12 2Zm6 7.46-2.94 4.66c-.47.74-1.47.93-2.18.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.94-4.66c.47-.74 1.47-.93 2.18-.4l2.34 1.75c.21.16.51.16.72 0l3.16-2.4c.42-.32.97.18.69.63Z" />
  </svg>
);
const PhoneIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);
const TiktokIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.2v12.86a2.45 2.45 0 0 1-2.45 2.36 2.45 2.45 0 1 1 .72-4.79V10.1a5.66 5.66 0 0 0-1.06-.1A5.66 5.66 0 1 0 15.2 15.7V9.18a7.5 7.5 0 0 0 4.4 1.42V7.4a4.3 4.3 0 0 1-3-1.58Z" />
  </svg>
);

export function ContactStrip() {
  const { t } = useSite();
  const s = t.contactStrip;
  const d = t.contact.direct;
  const tel = `tel:${d.phone.replace(/[^\d+]/g, "")}`;
  const tiktokHandle = d.tiktok.includes("@") ? `@${d.tiktok.split("@")[1]}` : "TikTok";

  const channels = [
    { id: "line", label: s.channels.line, sub: d.line, href: `https://line.me/R/ti/p/${d.line}`, color: "#06C755", icon: LineIcon, featured: true, external: true },
    { id: "messenger", label: s.channels.messenger, sub: "Facebook", href: d.messenger, color: "#0084FF", icon: MessengerIcon, external: true },
    { id: "call", label: s.channels.call, sub: d.phone, href: tel, color: "#0d2b5e", icon: PhoneIcon, external: false },
    { id: "tiktok", label: s.channels.tiktok, sub: tiktokHandle, href: d.tiktok, color: "#111418", icon: TiktokIcon, external: true },
  ];

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 md:py-28 bg-brand-blue text-white">
      {/* Navy depth + signature accents (mirrors the Process band so seams blend) */}
      <div aria-hidden className="absolute inset-0 bg-linear-to-b from-brand-blue-deep via-brand-blue to-brand-ink" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,.07),transparent_55%)] pointer-events-none" />

      <Container className="relative">
        {/* Header */}
        <div className="reveal text-center max-w-[60ch] mx-auto mb-12 md:mb-16">
          <SectionHeading eyebrow={s.eyebrow} title={s.title} invert />
          <p className="text-[17px] md:text-[20px] text-white/85 mt-6 font-light">{s.sub}</p>
          <p className="text-[14px] md:text-[15px] text-white/60 mt-3 font-light leading-[1.7] max-w-[48ch] mx-auto">
            {s.lede}
          </p>
        </div>

        {/* Channels */}
        <div className="reveal grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-[980px] mx-auto">
          {channels.map((c, i) => {
            const { id, ...rest } = c;
            return <Channel key={id} {...rest} fastest={s.fastest} delay={i * 70} />;
          })}
        </div>
      </Container>
    </section>
  );
}

function Channel({
  label,
  sub,
  href,
  color,
  icon,
  featured = false,
  external = false,
  fastest,
  delay,
}: {
  label: string;
  sub: string;
  href: string;
  color: string;
  icon: ReactNode;
  featured?: boolean;
  external?: boolean;
  fastest: string;
  delay: number;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={`${label} · ${sub}`}
      style={{ transitionDelay: `${delay}ms` }}
      className={`card-lift group relative flex flex-col items-center text-center gap-3 rounded-2xl p-5 md:p-7 transition-colors duration-500 ${
        featured
          ? "bg-white ring-2 ring-[#06C755] shadow-[0_24px_60px_-24px_rgba(6,199,85,.7)]"
          : "bg-white/95 hover:bg-white"
      }`}
    >
      {/* "Replies fastest" ribbon on the featured LINE card */}
      {featured && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-semibold tracking-wide-cap uppercase text-white shadow-[0_6px_16px_-6px_rgba(6,199,85,.8)]"
          style={{ backgroundColor: "#06C755" }}
        >
          {fastest}
        </span>
      )}

      {/* Icon disc */}
      <span
        className="grid h-14 w-14 md:h-16 md:w-16 place-items-center rounded-full text-white shadow-[0_8px_22px_-8px_rgba(10,16,36,.5)] transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: color }}
      >
        {icon}
      </span>

      <span className="mt-1">
        <span className="block text-[15px] md:text-[16px] font-semibold text-brand-ink">{label}</span>
        <span className="block text-[12px] md:text-[13px] text-brand-mute font-light mt-0.5 break-all">{sub}</span>
      </span>
    </a>
  );
}
