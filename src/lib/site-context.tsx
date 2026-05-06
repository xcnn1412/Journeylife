"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { I18N, type Lang, type Dict } from "./i18n";

interface Ctx { lang: Lang; setLang: (l: Lang) => void; t: Dict; }
const SiteCtx = createContext<Ctx | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("th");

  useEffect(() => {
    const sl = (localStorage.getItem("jl-lang") as Lang | null);
    if (sl) setLang(sl);
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    localStorage.setItem("jl-lang", lang);
  }, [lang]);

  return <SiteCtx.Provider value={{ lang, setLang, t: I18N[lang] }}>{children}</SiteCtx.Provider>;
}

export function useSite() {
  const c = useContext(SiteCtx);
  if (!c) throw new Error("useSite must be inside SiteProvider");
  return c;
}

export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* Drop-in client component that activates the .reveal-on-scroll observer.
   Lets the parent page stay a Server Component. */
export function RevealObserver() {
  useReveal();
  return null;
}
