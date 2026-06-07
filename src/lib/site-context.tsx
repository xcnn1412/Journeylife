"use client";
import { createContext, useCallback, useContext, useEffect, useSyncExternalStore, ReactNode } from "react";
import { I18N, type Lang, type Dict } from "./i18n";

interface Ctx { lang: Lang; setLang: (l: Lang) => void; t: Dict; }
const SiteCtx = createContext<Ctx | null>(null);

const LANG_KEY = "jl-lang";
const subscribeLang = (cb: () => void) => {
  window.addEventListener("storage", cb);          // other tabs
  window.addEventListener("jl-lang-change", cb);   // this tab
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("jl-lang-change", cb);
  };
};
const readLang = (): Lang => (localStorage.getItem(LANG_KEY) === "en" ? "en" : "th");
const serverLang = (): Lang => "th";

export function SiteProvider({ children }: { children: ReactNode }) {
  // SSR-safe localStorage read without a setState-in-effect: server + first
  // hydration render use "th", then the client snapshot resolves the stored lang.
  const lang = useSyncExternalStore(subscribeLang, readLang, serverLang);

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem(LANG_KEY, l);
    window.dispatchEvent(new Event("jl-lang-change")); // re-read in this tab
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
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
