"use client";
import { useEffect, useState } from "react";
import { useSite } from "@/lib/site-context";
import { Logo } from "./Nav";

export function Marquee() {
  const items = ["Hokkaido", "Seoul", "Tokyo", "Zurich", "Maldives", "Dubai", "Bali", "Phuket", "Singapore", "Switzerland"];
  return (
    <section className="bg-brand-blue text-white border-y border-brand-blue overflow-hidden relative">
      <div aria-hidden className="absolute inset-0 bg-linear-to-r from-brand-blue via-transparent to-brand-blue z-10 pointer-events-none"/>
      <div className="marquee-track">
        {[...items, ...items].map((it, i) => (
          <span key={i} className="h-display text-[34px] md:text-[40px] flex items-center gap-20 whitespace-nowrap text-white/90">
            {it}<span className="w-1.5 h-1.5 rounded-full bg-brand-red"/>
          </span>
        ))}
      </div>
    </section>
  );
}

export function Why() {
  const { t } = useSite();
  return (
    <section id="why" className="py-24 md:py-36 bg-white relative">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="reveal grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 mb-20">
          <div>
            <span className="eyebrow">{t.why.eyebrow}</span>
            <h2 className="h-display mt-6" style={{ fontSize: "clamp(38px, 5.2vw, 72px)" }}>{t.why.title}</h2>
          </div>
          <p className="text-[18px] md:text-[20px] text-brand-mute self-end leading-[1.65] max-w-[58ch] font-light">{t.why.lede}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-brand-line border border-brand-line">
          {t.why.items.map((it, i) => (
            <div key={i} className="reveal card-lift bg-white p-10 md:p-14 min-h-[340px] flex flex-col relative overflow-hidden" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="h-display text-brand-red text-[28px] mb-8">{it.num}</div>
              <h3 className="h-display text-[28px] md:text-[34px] mb-5">{it.title}</h3>
              <p className="text-[15px] text-brand-mute leading-[1.75] max-w-[42ch] font-light">{it.body}</p>
              <div aria-hidden className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-red transition-[width] duration-700 ease-out group-hover:w-full"/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Services() {
  const { t } = useSite();
  return (
    <section id="services" className="py-24 md:py-36 bg-brand-paper relative">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="reveal text-center max-w-[60ch] mx-auto mb-16">
          <span className="eyebrow">{t.services.eyebrow}</span>
          <h2 className="h-display mt-6" style={{ fontSize: "clamp(38px, 5.2vw, 72px)" }}>{t.services.title}</h2>
          <p className="text-[18px] text-brand-mute mt-6 leading-[1.65] font-light">{t.services.lede}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-brand-line border border-brand-line">
          {t.services.items.map((it, i) => (
            <div key={i} className="reveal group relative bg-white p-10 md:p-12 min-h-[300px] flex flex-col cursor-pointer transition-colors duration-500 hover:bg-brand-blue hover:text-white overflow-hidden" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="flex justify-between items-start gap-4">
                <span className="text-[10px] tracking-wide-cap uppercase font-semibold text-brand-red group-hover:text-white transition-colors">{it.tag}</span>
                <span className="text-[10px] text-brand-mute group-hover:text-white/50 transition-colors tracking-[0.15em] font-medium">{String(i + 1).padStart(2, "0")} / 04</span>
              </div>
              <h3 className="h-display text-[30px] md:text-[38px] mt-8 mb-5">{it.title}</h3>
              <p className="text-[15px] text-brand-mute leading-[1.75] flex-1 max-w-[42ch] group-hover:text-white/75 transition-colors font-light">{it.body}</p>
              <div className="mt-7 self-end transition-transform duration-500 group-hover:translate-x-2">
                <svg width="38" height="14" viewBox="0 0 38 14" fill="none">
                  <path d="M0 7 L36 7 M30 1 L36 7 L30 13" stroke="currentColor" strokeWidth="1"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Destinations() {
  const { t } = useSite();
  return (
    <section id="destinations" className="py-24 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="reveal grid lg:grid-cols-2 gap-10 lg:gap-20 items-end mb-16">
          <div>
            <span className="eyebrow">{t.destinations.eyebrow}</span>
            <h2 className="h-display mt-6" style={{ fontSize: "clamp(38px, 5.2vw, 72px)" }}>{t.destinations.title}</h2>
          </div>
          <p className="text-[18px] text-brand-mute leading-[1.65] max-w-[56ch] font-light">{t.destinations.lede}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {t.destinations.items.map((it, i) => (
            <a key={i} href="#contact" className="reveal block group" style={{ transitionDelay: `${i * 60}ms` }}>
              <div className="relative overflow-hidden">
                <div className="ph-img transition-transform duration-700 ease-out group-hover:scale-[1.04]" style={{ aspectRatio: "4 / 5" }}>
                  <span>{it.region}</span>
                </div>
                {/* Tags overlay */}
                <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10">
                  <span className="bg-white text-brand-ink text-[10px] tracking-wide-cap uppercase font-semibold px-3 py-1.5 shadow-[0_2px_8px_rgba(10,16,36,.08)]">{it.region}</span>
                  <span className="bg-brand-red text-white text-[10px] tracking-wide-cap uppercase font-semibold px-3 py-1.5">{it.pax}</span>
                </div>
                {/* Bottom gradient overlay reveal on hover */}
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-brand-ink/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"/>
              </div>
              <div className="mt-6">
                <div className="text-[10px] tracking-wide-cap uppercase font-medium text-brand-mute">{it.tag}</div>
                <h3 className="h-display text-[26px] md:text-[30px] mt-2.5 group-hover:text-brand-red transition-colors duration-500">{it.title}</h3>
                <div className="flex justify-between items-baseline mt-4 pt-4 border-t border-brand-line group-hover:border-brand-red/50 transition-colors duration-500">
                  <span className="text-[11px] tracking-wide-cap uppercase font-medium text-brand-mute">{it.days}</span>
                  <span className="h-display text-[18px] text-brand-blue">{it.price}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-20">
          <a href="#contact" className="btn btn-blue">{t.destinations.cta}<span className="arrow">→</span></a>
        </div>
      </div>
    </section>
  );
}

export function Process() {
  const { t } = useSite();
  return (
    <section className="py-24 md:py-36 bg-brand-blue text-white relative overflow-hidden">
      <div aria-hidden className="absolute top-0 left-0 w-1 h-full bg-brand-red"/>
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,.08),transparent_55%)] pointer-events-none"/>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative">
        <div className="reveal max-w-[42ch] mb-20">
          <span className="eyebrow" style={{ color: "rgba(255,255,255,.5)" }}>{t.process.eyebrow}</span>
          <h2 className="h-display mt-6 text-white" style={{ fontSize: "clamp(38px, 5.2vw, 72px)" }}>{t.process.title}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {t.process.steps.map((s, i) => (
            <div key={i} className="reveal bg-brand-blue p-9 min-h-[320px] flex flex-col transition-colors duration-500 hover:bg-brand-blue-deep relative group" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="h-display text-brand-red text-[28px] mb-7">{s.n}</div>
              <h3 className="h-display text-[24px] md:text-[28px] mb-4">{s.title}</h3>
              <p className="text-[14px] leading-[1.75] font-light" style={{ color: "rgba(255,255,255,.7)" }}>{s.body}</p>
              <div aria-hidden className="absolute top-0 left-0 h-0.5 w-0 bg-brand-red transition-[width] duration-700 ease-out group-hover:w-full"/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Clients() {
  const { t } = useSite();
  return (
    <section id="clients" className="py-24 md:py-36 bg-brand-paper">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="reveal text-center max-w-[60ch] mx-auto mb-16">
          <span className="eyebrow">{t.clients.eyebrow}</span>
          <h2 className="h-display mt-6" style={{ fontSize: "clamp(38px, 5.2vw, 72px)" }}>{t.clients.title}</h2>
          <p className="text-[16px] text-brand-mute mt-6 italic font-light">{t.clients.lede}</p>
        </div>

        <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-px bg-brand-line border border-brand-line">
          {t.clients.list.map((c, i) => (
            <div key={i} className="bg-white py-10 flex items-center justify-center text-[12px] tracking-wide-cap font-semibold text-brand-ink hover:bg-brand-blue hover:text-white transition-colors duration-500 cursor-default">{c}</div>
          ))}
        </div>

        <div className="reveal mt-24 max-w-[64ch] mx-auto text-center">
          <svg width="36" height="28" viewBox="0 0 36 28" fill="none" className="mx-auto mb-7">
            <path d="M0 28 L0 16 C 0 8, 5 2, 14 0 L 14 4 C 8 6, 6 10, 6 14 L 14 14 L 14 28 Z M22 28 L22 16 C 22 8, 27 2, 36 0 L 36 4 C 30 6, 28 10, 28 14 L 36 14 L 36 28 Z" fill="#c8102e"/>
          </svg>
          <blockquote className="h-display text-[24px] md:text-[32px] leading-[1.4] text-brand-ink m-0">&ldquo;{t.testimonial.quote}&rdquo;</blockquote>
          <footer className="text-[11px] tracking-wide-cap uppercase font-medium text-brand-mute mt-7">— {t.testimonial.who}</footer>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const { t } = useSite();
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", pax: "", type: t.contact.form.types[0], msg: "" });
  const [sent, setSent] = useState(false);
  useEffect(() => { setForm(f => ({ ...f, type: t.contact.form.types[0] })); }, [t.contact.form.types]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="py-24 md:py-36 bg-white relative">
      <div aria-hidden className="absolute inset-0 hero-glow-tr opacity-50"/>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-24">
          <div className="reveal">
            <span className="eyebrow">{t.contact.eyebrow}</span>
            <h2 className="h-display mt-6" style={{ fontSize: "clamp(38px, 5.2vw, 72px)" }}>{t.contact.title}</h2>
            <p className="text-[17px] text-brand-mute mt-6 leading-[1.65] max-w-[44ch] font-light">{t.contact.lede}</p>

            <div className="mt-14 pt-8 border-t border-brand-line">
              <div className="text-[10px] tracking-wide-cap uppercase font-semibold text-brand-mute mb-5">{t.contact.direct.title}</div>
              <ul className="list-none p-0 m-0 grid gap-3.5">
                <li className="h-display text-[28px] text-brand-blue">{t.contact.direct.phone}</li>
                <li className="text-[13px] tracking-wide-cap font-medium">LINE OA · {t.contact.direct.line}</li>
                <li className="text-[13px] tracking-wide-cap text-brand-mute font-medium">{t.contact.direct.email}</li>
                <li className="text-[11px] tracking-wide-cap text-brand-mute mt-3 uppercase font-medium">{t.contact.direct.hours}</li>
                <li className="text-[11px] tracking-wide-cap text-brand-red uppercase font-semibold">{t.contact.direct.license}</li>
              </ul>
            </div>
          </div>

          <form className="reveal grid gap-5 bg-brand-paper p-8 md:p-10 border border-brand-line" onSubmit={submit}>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label={t.contact.form.company} value={form.company} onChange={v => setForm({ ...form, company: v })}/>
              <Field label={t.contact.form.name} value={form.name} onChange={v => setForm({ ...form, name: v })}/>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label={t.contact.form.email} type="email" value={form.email} onChange={v => setForm({ ...form, email: v })}/>
              <Field label={t.contact.form.phone} value={form.phone} onChange={v => setForm({ ...form, phone: v })}/>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label={t.contact.form.pax} value={form.pax} onChange={v => setForm({ ...form, pax: v })}/>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-wide-cap uppercase font-semibold text-brand-mute">{t.contact.form.type}</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  className="bg-white border border-brand-line p-4 text-[14px] focus:outline-none focus:border-brand-red transition-colors">
                  {t.contact.form.types.map(ty => <option key={ty}>{ty}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-wide-cap uppercase font-semibold text-brand-mute">{t.contact.form.msg}</label>
              <textarea rows={5} value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })}
                className="bg-white border border-brand-line p-4 text-[14px] resize-y focus:outline-none focus:border-brand-red transition-colors"/>
            </div>
            <button type="submit" className="btn btn-red mt-2 w-fit" disabled={sent}>
              {sent ? "✓ " + t.contact.form.submit : t.contact.form.submit}<span className="arrow">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, type = "text", value, onChange }: { label: string; type?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] tracking-wide-cap uppercase font-semibold text-brand-mute">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} className="bg-white border border-brand-line p-4 text-[14px] focus:outline-none focus:border-brand-red transition-colors"/>
    </div>
  );
}

export function Footer() {
  const { t } = useSite();
  return (
    <footer className="bg-brand-ink text-white pt-20 pb-8 relative overflow-hidden">
      <div aria-hidden className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-red to-transparent"/>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 max-w-[360px]">
            <Logo size={32} dark/>
            <p className="mt-7 text-[14px] leading-[1.7] text-white/60 font-light">{t.footer.tagline}</p>
          </div>
          {t.footer.cols.map((col, i) => (
            <div key={i}>
              <div className="text-[10px] tracking-wide-cap uppercase font-semibold text-white/40 mb-5">{col.title}</div>
              <ul className="list-none p-0 m-0 grid gap-3">
                {col.links.map((l, j) => (
                  <li key={j}><a href="#" className="text-[13px] no-underline text-white/80 hover:text-brand-red transition-colors duration-300 font-light">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-20 pt-7 border-t border-white/10 flex justify-between flex-wrap gap-4 text-[10px] tracking-wide-cap uppercase text-white/40 font-medium">
          <span>{t.footer.legal}</span>
          <span>BANGKOK · TOKYO · ZURICH</span>
        </div>
      </div>
    </footer>
  );
}
