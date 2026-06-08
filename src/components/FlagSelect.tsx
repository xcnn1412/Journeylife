"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { type Country, flagImg } from "@/lib/tour-destinations";

/* Searchable country dropdown with real flag images (flagcdn). Native <select>
   can't render images, so this is a custom combobox. Submits via a hidden input
   so the surrounding <form> still picks the value up by `name`. */

export interface OptionGroup {
  label?: string;
  items: Country[];
}

function Flag({ th }: { th: string }) {
  const src = flagImg(th);
  if (!src) return <span className="text-[14px] leading-none">🌍</span>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={20}
      height={15}
      loading="lazy"
      className="h-[15px] w-5 shrink-0 rounded-[2px] object-cover ring-1 ring-black/10"
    />
  );
}

export function FlagSelect({
  value,
  onChange,
  name,
  placeholder,
  searchPlaceholder,
  noMatch,
  groups,
  fieldClass,
}: {
  value: string;
  onChange: (value: string) => void;
  name: string;
  placeholder: string;
  searchPlaceholder: string;
  noMatch: string;
  groups: OptionGroup[];
  fieldClass: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = groups.flatMap((g) => g.items).find((c) => c.th === value);
  const ql = q.trim().toLowerCase();
  const filtered = groups
    .map((g) => ({
      label: g.label,
      items: g.items.filter((c) => !ql || c.th.toLowerCase().includes(ql) || c.en.toLowerCase().includes(ql)),
    }))
    .filter((g) => g.items.length);

  function pick(v: string) {
    onChange(v);
    setOpen(false);
    setQ("");
  }

  return (
    <div ref={ref} className="relative">
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${fieldClass} flex items-center gap-2 text-left`}
      >
        {selected ? (
          <>
            <Flag th={selected.th} />
            <span className="truncate">{selected.th} · {selected.en}</span>
          </>
        ) : (
          <span className="text-brand-mute/60">{placeholder}</span>
        )}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`ml-auto shrink-0 text-brand-mute transition-transform ${open ? "rotate-180" : ""}`} aria-hidden><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {open && (
        <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-brand-line bg-white shadow-[0_24px_60px_-20px_rgba(10,16,36,.45)]">
          <div className="border-b border-brand-line p-2">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg bg-brand-paper px-3 py-2 text-[13px] text-brand-ink outline-none placeholder:text-brand-mute/60"
            />
          </div>

          <ul role="listbox" className="max-h-64 overflow-auto py-1">
            <li>
              <button type="button" onClick={() => pick("")} className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-brand-mute hover:bg-brand-paper">
                {placeholder}
              </button>
            </li>
            {filtered.map((g, gi) => (
              <Fragment key={gi}>
                {g.label && (
                  <li className="px-3 pt-2.5 pb-1 text-[10px] tracking-wide-cap uppercase font-semibold text-brand-mute/70">{g.label}</li>
                )}
                {g.items.map((c) => (
                  <li key={c.th}>
                    <button
                      type="button"
                      onClick={() => pick(c.th)}
                      className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13.5px] hover:bg-brand-paper ${
                        c.th === value ? "bg-brand-blue/5 font-semibold text-brand-blue" : "text-brand-ink"
                      }`}
                    >
                      <Flag th={c.th} />
                      <span className="truncate">{c.th}</span>
                      <span className="ml-auto text-[11px] text-brand-mute/70">{c.en}</span>
                    </button>
                  </li>
                ))}
              </Fragment>
            ))}
            {!filtered.length && (
              <li className="px-3 py-5 text-center text-[13px] text-brand-mute">{noMatch}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
