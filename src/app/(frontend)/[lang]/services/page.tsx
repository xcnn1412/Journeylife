import type { Metadata } from "next";
import { isLocale, localeAlternates, type Locale } from "@/lib/locale";
import { ServicesIndex } from "./ServicesIndex";

const META: Record<Locale, { title: string; description: string }> = {
  th: {
    title: "บริการของเรา · JOURNEYLIFE",
    description: "บริการครบวงจร: Company Trip · CSR · Event · Night Party · Seminar · Team Building · ทัวร์ต่างประเทศ · ทัวร์ในประเทศ",
  },
  en: {
    title: "Our services · JOURNEYLIFE",
    description: "End-to-end services: Company Trip · CSR · Event · Night Party · Seminar · Team Building · Outbound & Domestic Tours.",
  },
  zh: {
    title: "我们的服务 · JOURNEYLIFE",
    description: "一站式服务：Company Trip · CSR · Event · Night Party · Seminar · Team Building · 海外旅游 · 国内旅游。",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: Locale = isLocale(lang) ? lang : "th";
  return { ...META[l], alternates: localeAlternates(l, "/services") };
}

export default function Page() {
  return <ServicesIndex />;
}
