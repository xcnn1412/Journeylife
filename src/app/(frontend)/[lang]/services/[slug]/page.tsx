import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { I18N } from "@/lib/i18n";
import { isLocale, localeAlternates, type Locale } from "@/lib/locale";
import { ServiceDetail } from "./ServiceDetail";

// Only the 8 known service slugs are valid — anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return I18N.en.pillars.items.map((i) => ({ slug: i.slug }));
}

const SUFFIX: Record<Locale, string> = { th: "บริการ · JOURNEYLIFE", en: "Services · JOURNEYLIFE", zh: "服务 · JOURNEYLIFE" };

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const l: Locale = isLocale(lang) ? lang : "th";
  const it = I18N[l].pillars.items.find((i) => i.slug === slug);
  if (!it) return {};
  return {
    title: `${it.title} · ${SUFFIX[l]}`,
    description: it.body,
    alternates: localeAlternates(l, `/services/${slug}`),
    openGraph: {
      title: `${it.title} · JOURNEYLIFE`,
      description: it.body,
      images: [it.img],
      url: `/${l}/services/${slug}`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { slug } = await params;
  if (!I18N.en.pillars.items.some((i) => i.slug === slug)) notFound();
  return <ServiceDetail slug={slug} />;
}
