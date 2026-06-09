"use client";
import { useState, type ReactNode } from "react";
import Image from "next/image";
import avatar from "../../../../../public/employee/avatar.jpg";
import { Nav } from "@/components/Nav";
import { StickyCTA } from "@/components/StickyCTA";
import { Footer } from "@/components/sections";
import { Container } from "@/components/sections/_layout";
import { useSite, RevealObserver } from "@/lib/site-context";

interface FormState {
  company: string;
  name: string;
  email: string;
  phone: string;
  pax: string;
  type: string;
  msg: string;
}

export function ContactPage() {
  const { t } = useSite();
  const c = t.contactPage;
  const d = t.contact.direct;
  const f = t.contact.form;

  const tel = `tel:${d.phone.replace(/[^\d+]/g, "")}`;
  const lineHref = `https://line.me/R/ti/p/${d.line}`;
  const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(c.address)}&z=16&output=embed`;

  // Per-department accent for the org chart (blue · red · gold · mute).
  const ACCENT = ["#0d2b5e", "#c8102e", "#b8924a", "#5b6072"];

  // Hot-contact channels — every way to reach us, one tap.
  const tiktokHandle = d.tiktok.includes("@") ? `@${d.tiktok.split("@")[1]}` : "TikTok";
  const hotChannels = [
    { id: "line", label: c.labels.line, sub: d.line, href: lineHref, color: "#06C755", icon: <LineIcon />, ext: true },
    { id: "facebook", label: c.labels.facebook, sub: "/journeylife", href: d.facebook, color: "#1877F2", icon: <FacebookIcon />, ext: true },
    { id: "tiktok", label: c.labels.tiktok, sub: tiktokHandle, href: d.tiktok, color: "#111418", icon: <TiktokIcon />, ext: true },
    { id: "call", label: c.labels.phone, sub: d.phone, href: tel, color: "#0d2b5e", icon: <PhoneIcon />, ext: false },
    { id: "email", label: c.labels.email, sub: c.email, href: `mailto:${c.email}`, color: "#c8102e", icon: <MailIcon />, ext: false },
  ];

  const [form, setForm] = useState<FormState>({
    company: "", name: "", email: "", phone: "", pax: "", type: f.types[0], msg: "",
  });
  const [sent, setSent] = useState(false);
  const selectedType = f.types.includes(form.type) ? form.type : f.types[0];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <>
      <RevealObserver />
      <Nav />
      <StickyCTA />

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-brand-blue text-white">
          <div aria-hidden className="absolute inset-0 bg-linear-to-b from-brand-blue-deep via-brand-blue to-brand-blue-deep" />
          <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-brand-red" />
          <Container className="relative pt-36 md:pt-44 pb-16 md:pb-20 text-center">
            <span className="eyebrow" style={{ color: "rgba(255,255,255,.55)" }}>{c.eyebrow}</span>
            <h1 className="h-display mt-6 text-white" style={{ fontSize: "clamp(40px, 6vw, 84px)" }}>{c.title}</h1>
            <span aria-hidden className="block w-12 h-px bg-brand-red mx-auto mt-6" />
            <p className="mt-6 max-w-[56ch] mx-auto text-[16px] md:text-[18px] font-light leading-[1.7] text-white/70">{c.sub}</p>
          </Container>
        </section>

        {/* ── Org chart — contact each department (mock) ── */}
        <section className="bg-brand-paper py-16 md:py-24">
          <Container>
            <div className="reveal text-center max-w-[54ch] mx-auto mb-12 md:mb-16">
              <span className="eyebrow">{c.orgEyebrow}</span>
              <h2 className="h-display mt-6 text-brand-ink" style={{ fontSize: "clamp(28px, 3.4vw, 46px)" }}>{c.orgTitle}</h2>
              <p className="mt-5 text-[15px] md:text-[16px] text-brand-mute font-light leading-[1.7]">{c.orgSub}</p>
            </div>

            <div className="flex flex-col items-center">
              {/* Company node */}
              <div className="reveal relative z-10 rounded-2xl bg-brand-blue text-white px-8 py-4 text-center shadow-[0_18px_44px_-18px_rgba(13,43,94,.7)]">
                <div className="wordmark text-[18px]">JOURNEY<span className="text-brand-red">LIFE</span></div>
                <div className="text-[9px] tracking-wide-cap uppercase text-white/55 mt-1">{c.orgCompany}</div>
              </div>
              {/* Trunk */}
              <span aria-hidden className="w-px h-8 bg-brand-line" />

              {/* Department branches */}
              <div className="relative w-full">
                <span aria-hidden className="hidden lg:block absolute top-0 left-[12.5%] right-[12.5%] h-px bg-brand-line" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
                  {c.departments.map((dep, i) => (
                    <div key={dep.key} className="flex flex-col items-center">
                      <span aria-hidden className="hidden lg:block w-px h-8 bg-brand-line" />
                      <div
                        className="reveal card-lift w-full overflow-hidden rounded-xl border border-brand-line bg-white"
                        style={{ transitionDelay: `${i * 70}ms` }}
                      >
                        <div className="h-1.5" style={{ background: ACCENT[i % ACCENT.length] }} />
                        <div className="p-5">
                          <h3 className="text-brand-blue font-semibold text-[15px] md:text-[16px] leading-tight">{dep.name}</h3>
                          <p className="text-[12px] text-brand-mute mt-1.5 font-light leading-snug min-h-[34px]">{dep.desc}</p>
                          <div className="mt-4 pt-4 border-t border-brand-line">
                            <div className="flex items-center gap-3">
                              <Image
                                src={avatar}
                                alt={dep.person}
                                className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-white shadow-[0_4px_12px_-4px_rgba(10,16,36,.45)]"
                              />
                              <div className="text-[13px] font-medium text-brand-ink leading-tight">{dep.person}</div>
                            </div>
                            <div className="mt-3.5 grid gap-2.5">
                            <a href={tel} className="flex items-center gap-2 text-[12.5px] text-brand-mute hover:text-brand-blue transition-colors">
                              <span className="text-brand-blue/55 shrink-0"><PhoneIcon /></span>{dep.phone}
                            </a>
                            <a href={`mailto:${dep.email}`} className="flex items-center gap-2 text-[12.5px] text-brand-mute hover:text-brand-blue transition-colors break-all">
                              <span className="text-brand-blue/55 shrink-0"><MailIcon /></span>{dep.email}
                            </a>
                            <a href={`https://line.me/R/ti/p/${dep.line}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[12.5px] text-brand-mute hover:text-brand-blue transition-colors">
                              <span className="text-[#06C755] shrink-0"><LineIcon /></span>LINE {dep.line}
                            </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="reveal text-center text-[11px] text-brand-mute/80 mt-10">{c.orgMockNote}</p>
          </Container>
        </section>

        {/* ── Hot contact — every channel, one tap ── */}
        <section className="relative overflow-hidden bg-brand-blue text-white py-16 md:py-24">
          <div aria-hidden className="absolute inset-0 bg-linear-to-b from-brand-blue-deep via-brand-blue to-brand-blue-deep" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,.07),transparent_55%)] pointer-events-none" />
          <Container className="relative">
            <div className="reveal text-center max-w-[52ch] mx-auto mb-12 md:mb-14">
              <span className="eyebrow" style={{ color: "rgba(255,255,255,.55)" }}>{c.hotEyebrow}</span>
              <h2 className="h-display mt-6 text-white" style={{ fontSize: "clamp(28px, 3.4vw, 46px)" }}>{c.hotTitle}</h2>
              <p className="mt-5 text-[15px] md:text-[16px] text-white/65 font-light">{c.hotSub}</p>
            </div>

            <div className="reveal grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-[1000px] mx-auto">
              {hotChannels.map((ch, i) => (
                <a
                  key={ch.id}
                  href={ch.href}
                  {...(ch.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-label={`${ch.label} · ${ch.sub}`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                  className="card-lift group flex flex-col items-center gap-3 rounded-2xl bg-white/[0.05] ring-1 ring-white/10 hover:bg-white/[0.1] p-5 text-center transition-colors"
                >
                  <span
                    className="grid h-14 w-14 place-items-center rounded-full text-white shadow-[0_8px_22px_-8px_rgba(0,0,0,.6)] transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: ch.color }}
                  >
                    {ch.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold text-white">{ch.label}</span>
                    <span className="block text-[11px] text-white/55 mt-0.5 break-all">{ch.sub}</span>
                  </span>
                </a>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Info + map + form ── */}
        <section className="bg-white border-t border-brand-line py-16 md:py-24">
          <Container>
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* Left — details + map */}
              <div className="reveal">
                <ul className="list-none p-0 m-0 grid gap-5">
                  <InfoRow icon={<PinIcon />} label={c.labels.address}>
                    <p className="text-[15px] text-brand-ink leading-[1.6]">{c.address}</p>
                    <a href={c.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[12px] tracking-wide-cap uppercase font-semibold text-brand-red hover:gap-2.5 transition-all">
                      {c.labels.map}<span>→</span>
                    </a>
                  </InfoRow>
                  <InfoRow icon={<PhoneIcon />} label={c.labels.phone}>
                    <a href={tel} className="h-display text-[26px] text-brand-blue hover:text-brand-red transition-colors">{d.phone}</a>
                  </InfoRow>
                  <InfoRow icon={<MailIcon />} label={c.labels.email}>
                    <a href={`mailto:${c.email}`} className="text-[15px] text-brand-ink hover:text-brand-blue transition-colors break-all">{c.email}</a>
                  </InfoRow>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <InfoRow icon={<LineIcon />} label={c.labels.line}>
                      <a href={lineHref} target="_blank" rel="noopener noreferrer" className="text-[15px] text-brand-ink hover:text-brand-blue transition-colors">{d.line}</a>
                    </InfoRow>
                    <InfoRow icon={<ClockIcon />} label={c.labels.hours}>
                      <p className="text-[14px] text-brand-ink">{d.hours}</p>
                    </InfoRow>
                  </div>
                </ul>

                {/* Embedded map */}
                <div className="mt-8 overflow-hidden rounded-2xl border border-brand-line shadow-[0_24px_60px_-30px_rgba(10,16,36,.4)]">
                  <iframe
                    title="Journey Life · Google Map"
                    src={mapEmbed}
                    className="block w-full h-[300px] md:h-[340px] border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* Right — message form */}
              <form onSubmit={submit} className="reveal grid gap-5 bg-white p-6 sm:p-8 md:p-10 rounded-2xl border border-brand-line shadow-[0_28px_70px_-30px_rgba(10,16,36,.45)]">
                <div className="border-b border-brand-line pb-5">
                  <h2 className="h-display text-[24px] md:text-[28px] text-brand-ink">{c.formTitle}</h2>
                  <p className="text-[13px] text-brand-mute mt-1.5 font-light">{c.formNote}</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label={f.company} value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
                  <Field label={f.name} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label={f.email} type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                  <Field label={f.phone} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label={f.pax} value={form.pax} onChange={(v) => setForm({ ...form, pax: v })} />
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] tracking-wide-cap uppercase font-semibold text-brand-mute">{f.type}</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="bg-white border border-brand-line p-4 text-[14px] focus:outline-none focus:border-brand-blue transition-colors"
                    >
                      {f.types.map((ty) => <option key={ty}>{ty}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-wide-cap uppercase font-semibold text-brand-mute">{f.msg}</label>
                  <textarea
                    rows={5}
                    value={form.msg}
                    onChange={(e) => setForm({ ...form, msg: e.target.value })}
                    className="bg-white border border-brand-line p-4 text-[14px] resize-y focus:outline-none focus:border-brand-blue transition-colors"
                  />
                </div>
                <button type="submit" className="btn btn-blue mt-1 w-full" disabled={sent}>
                  {sent ? c.success : f.submit}
                  {!sent && <span className="arrow">→</span>}
                </button>
              </form>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}

function InfoRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="shrink-0 grid h-11 w-11 place-items-center rounded-xl bg-brand-blue/[0.06] text-brand-blue ring-1 ring-brand-line">{icon}</span>
      <div className="min-w-0">
        <div className="text-[10px] tracking-wide-cap uppercase font-semibold text-brand-mute mb-1">{label}</div>
        {children}
      </div>
    </li>
  );
}

function Field({ label, type = "text", value, onChange }: { label: string; type?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] tracking-wide-cap uppercase font-semibold text-brand-mute">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-brand-line p-4 text-[14px] focus:outline-none focus:border-brand-blue transition-colors"
      />
    </div>
  );
}

/* ── Icons ── */
const PinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" />
  </svg>
);
const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
  </svg>
);
const LineIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 3C6.48 3 2 6.62 2 11.07c0 3.99 3.55 7.33 8.35 7.96.33.07.77.22.88.5.1.26.07.66.03.92l-.14.85c-.04.26-.2 1.02.9.56 1.1-.46 5.92-3.49 8.08-5.97 1.49-1.64 2.2-3.3 2.2-4.99C22 6.62 17.52 3 12 3Z" />
  </svg>
);
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6 4.39 10.97 10.13 11.85v-8.38H7.08v-3.47h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.47h-2.79v8.38C19.61 23.04 24 18.07 24 12.07Z" />
  </svg>
);
const TiktokIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.2v12.86a2.45 2.45 0 0 1-2.45 2.36 2.45 2.45 0 1 1 .72-4.79V10.1a5.66 5.66 0 0 0-1.06-.1A5.66 5.66 0 1 0 15.2 15.7V9.18a7.5 7.5 0 0 0 4.4 1.42V7.4a4.3 4.3 0 0 1-3-1.58Z" />
  </svg>
);
