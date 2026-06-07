"use client";
import { useState } from "react";
import { useSite } from "@/lib/site-context";
import { Container, SectionHeading } from "./_layout";

interface FormState {
  company: string;
  name: string;
  email: string;
  phone: string;
  pax: string;
  type: string;
  msg: string;
}

export function Contact() {
  const { t } = useSite();
  const [form, setForm] = useState<FormState>({
    company: "",
    name: "",
    email: "",
    phone: "",
    pax: "",
    type: t.contact.form.types[0],
    msg: "",
  });
  const [sent, setSent] = useState(false);

  // Derived (no effect): on a language switch the option labels change, so resolve
  // the current selection to a valid option instead of syncing state in an effect.
  const typeOptions = t.contact.form.types;
  const selectedType = typeOptions.includes(form.type) ? form.type : typeOptions[0];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="py-16 sm:py-24 md:py-36 bg-brand-blue-soft relative">
      <div aria-hidden className="absolute inset-0 hero-glow-tr opacity-50" />

      <Container className="relative">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-24">
          {/* Left — title, lede, direct line */}
          <div className="reveal">
            <SectionHeading eyebrow={t.contact.eyebrow} title={t.contact.title} />
            <p className="text-[17px] text-brand-mute mt-6 leading-[1.65] max-w-[44ch] font-light">
              {t.contact.lede}
            </p>

            <div className="mt-14 pt-8 border-t border-brand-line">
              <div className="text-[10px] tracking-wide-cap uppercase font-semibold text-brand-mute mb-5">
                {t.contact.direct.title}
              </div>
              <ul className="list-none p-0 m-0 grid gap-3.5">
                <li className="h-display text-[28px] text-brand-blue">{t.contact.direct.phone}</li>
                <li className="text-[13px] tracking-wide-cap font-medium">LINE OA · {t.contact.direct.line}</li>
                <li className="text-[13px] tracking-wide-cap text-brand-mute font-medium">{t.contact.direct.email}</li>
                <li className="text-[11px] tracking-wide-cap text-brand-mute mt-3 uppercase font-medium">{t.contact.direct.hours}</li>
                <li className="text-[11px] tracking-wide-cap text-brand-red uppercase font-semibold">{t.contact.direct.license}</li>
              </ul>
            </div>
          </div>

          {/* Right — form */}
          <form className="reveal grid gap-5 bg-brand-paper p-6 sm:p-8 md:p-10 border border-brand-line" onSubmit={submit}>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label={t.contact.form.company} value={form.company} onChange={v => setForm({ ...form, company: v })} />
              <Field label={t.contact.form.name} value={form.name} onChange={v => setForm({ ...form, name: v })} />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label={t.contact.form.email} type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
              <Field label={t.contact.form.phone} value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label={t.contact.form.pax} value={form.pax} onChange={v => setForm({ ...form, pax: v })} />
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-wide-cap uppercase font-semibold text-brand-mute">{t.contact.form.type}</label>
                <select
                  value={selectedType}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="bg-white border border-brand-line p-4 text-[14px] focus:outline-none focus:border-brand-blue transition-colors"
                >
                  {typeOptions.map(ty => <option key={ty}>{ty}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-wide-cap uppercase font-semibold text-brand-mute">{t.contact.form.msg}</label>
              <textarea
                rows={5}
                value={form.msg}
                onChange={e => setForm({ ...form, msg: e.target.value })}
                className="bg-white border border-brand-line p-4 text-[14px] resize-y focus:outline-none focus:border-brand-blue transition-colors"
              />
            </div>
            <button type="submit" className="btn btn-blue mt-2 w-fit" disabled={sent}>
              {sent ? "✓ " + t.contact.form.submit : t.contact.form.submit}
              <span className="arrow">→</span>
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] tracking-wide-cap uppercase font-semibold text-brand-mute">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-white border border-brand-line p-4 text-[14px] focus:outline-none focus:border-brand-blue transition-colors"
      />
    </div>
  );
}
