"use client";
import { createContext, useCallback, useContext, useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { I18N, type Lang, type Dict } from "./i18n";
import { localeHref } from "./locale";

interface Ctx { lang: Lang; setLang: (l: Lang) => void; t: Dict; }
const SiteCtx = createContext<Ctx | null>(null);

const LANG_KEY = "jl-lang";

/**
 * The active locale comes from the URL (the [lang] segment), passed in here by
 * the server layout — so SSR/HTML is already in the right language for crawlers.
 * Switching language navigates to the same page under the new locale prefix and
 * remembers the choice in a cookie (read by middleware for the root redirect).
 */
export function SiteProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const setLang = useCallback((l: Lang) => {
    document.cookie = `${LANG_KEY}=${l}; path=/; max-age=31536000; samesite=lax`;
    const { search, hash } = window.location;
    router.push(`${localeHref(pathname || "/", l)}${search}${hash}`);
  }, [pathname, router]);

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    document.cookie = `${LANG_KEY}=${lang}; path=/; max-age=31536000; samesite=lax`;
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
