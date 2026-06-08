"use client";
import { useState } from "react";
import { useSite } from "@/lib/site-context";
import { Container, SectionHeading } from "./_layout";

interface LeadForm {
  company: string;
  name: string;
  phone: string;
  pax: string;
  type: string;
}

export function HowWeWork() {
  const { t } = useSite();
  const h = t.howWeWork;
  const f = h.form;

  const [form, setForm] = useState<LeadForm>({
    company: "",
    name: "",
    phone: "",
    pax: "",
    type: f.types[0],
  });
  const [sent, setSent] = useState(false);

  // Resolve selection to a valid option after a language switch (no effect needed).
  const selectedType = f.types.includes(form.type) ? form.type : f.types[0];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="py-16 sm:py-24 md:py-36 bg-brand-paper relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 hero-glow-tr opacity-40" />

      <Container className="relative">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-20 items-start">
          {/* ── Left: 3-step path ── */}
          <div>
            <div className="reveal max-w-[44ch]">
              <SectionHeading eyebrow={h.eyebrow} title={h.title} />
              <p className="text-[17px] md:text-[19px] text-brand-mute mt-6 font-light leading-[1.6]">
                {h.sub}
              </p>
            </div>

            {/* Steps timeline */}
            <ol className="reveal list-none p-0 m-0 mt-12 relative">
              {/* connector line */}
              <span
                aria-hidden
                className="absolute left-[23px] top-3 bottom-3 w-px bg-linear-to-b from-brand-red/40 via-brand-line to-transparent"
              />
              {h.steps.map((s, i) => (
                <li
                  key={i}
                  className="relative flex gap-5 pb-9 last:pb-0"
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <span className="relative z-10 grid place-items-center shrink-0 w-12 h-12 rounded-full bg-brand-blue text-white h-display text-[20px] shadow-[0_8px_20px_-8px_rgba(13,43,94,.6)]">
                    {i + 1}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="h-display text-[22px] md:text-[26px] text-brand-ink">{s.title}</h3>
                    <p className="text-[14px] md:text-[15px] text-brand-mute mt-2 leading-[1.7] font-light max-w-[42ch]">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* ── Right: lead form ── */}
          <form
            onSubmit={submit}
            className="reveal grid gap-5 bg-white p-6 sm:p-8 md:p-10 rounded-2xl border border-brand-line shadow-[0_28px_70px_-30px_rgba(10,16,36,.5)]"
          >
            <div className="border-b border-brand-line pb-5">
              <h3 className="h-display text-[24px] md:text-[28px] text-brand-ink">{f.title}</h3>
              <p className="text-[13px] text-brand-mute mt-1.5 font-light">{f.note}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label={f.company} value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
              <Field label={f.name} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label={f.phone} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              <Field label={f.pax} value={form.pax} onChange={(v) => setForm({ ...form, pax: v })} />
            </div>
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

            <button type="submit" className="btn btn-red mt-1 w-full" disabled={sent}>
              {sent ? f.success : f.submit}
              {!sent && <span className="arrow">→</span>}
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
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-brand-line p-4 text-[14px] focus:outline-none focus:border-brand-blue transition-colors"
      />
    </div>
  );
}
