import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { I18N } from "@/lib/i18n";
import { ServiceDetail } from "./ServiceDetail";

// Only the 8 known service slugs are valid — anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return I18N.en.pillars.items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const it = I18N.th.pillars.items.find((i) => i.slug === slug);
  if (!it) return {};
  return {
    title: `${it.title} · บริการ · JOURNEYLIFE`,
    description: it.body,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title: `${it.title} · JOURNEYLIFE`,
      description: it.body,
      images: [it.img],
      url: `/services/${slug}`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!I18N.en.pillars.items.some((i) => i.slug === slug)) notFound();
  return <ServiceDetail slug={slug} />;
}
