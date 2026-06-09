import type { Metadata, Viewport } from "next";
import { Kanit } from "next/font/google";
import { notFound } from "next/navigation";
import { SiteProvider } from "@/lib/site-context";
import { LOCALES, isLocale, localeAlternates, OG_LOCALE, type Locale } from "@/lib/locale";
import "../globals.css";

// Kanit — Thai + Latin in one family; the whole site renders in this typeface.
const kanit = Kanit({
  subsets: ["latin", "thai"],
  weight: ["200", "300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});

// Prerender the three locales (/th, /en, /zh) at build time.
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

// Per-locale homepage title/description (other pages override their own).
const META: Record<Locale, { title: string; description: string; ogDesc: string }> = {
  th: {
    title: "JOURNEYLIFE · ทัวร์ Incentive ระดับองค์กร · รับจัดกรุ๊ปทัวร์ & สัมมนา",
    description:
      "JOURNEYLIFE — บริษัทรับจัดทัวร์ Incentive ระดับองค์กร · Outbound · Inbound · MICE · ใบอนุญาต TAT 11/11057 · ตั้งแต่ปี 2013",
    ogDesc: "ทัวร์ Incentive ระดับองค์กร · Outbound · Inbound · MICE · ใบอนุญาต TAT 11/11057",
  },
  en: {
    title: "JOURNEYLIFE · Bespoke Corporate Incentive Travel & MICE",
    description:
      "JOURNEYLIFE — bespoke corporate incentive travel, group tours, seminars & MICE, at home and abroad. TAT licence 11/11057 · since 2013.",
    ogDesc: "Bespoke corporate incentive travel · Outbound · Inbound · MICE · TAT 11/11057",
  },
  zh: {
    title: "JOURNEYLIFE · 企业奖励旅游与 MICE 定制专家",
    description:
      "JOURNEYLIFE — 量身定制的企业奖励旅游、团队旅游、会议研讨与 MICE，国内外一站式承办。TAT 经营许可 11/11057 · 始于 2013 年。",
    ogDesc: "企业奖励旅游 · 海外 · 国内 · MICE · TAT 11/11057",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: Locale = isLocale(lang) ? lang : "th";
  const m = META[l];
  return {
    metadataBase: new URL("https://journeylife.co.th"),
    title: m.title,
    description: m.description,
    keywords: ["ทัวร์ incentive", "company trip", "บริษัททัวร์", "MICE Thailand", "ทัวร์องค์กร", "ทัวร์ฮอกไกโด incentive", "DMC Thailand", "JOURNEYLIFE", "TAT 11/11057", "corporate incentive travel", "企业奖励旅游"],
    alternates: localeAlternates(l),
    openGraph: {
      type: "website",
      url: `https://journeylife.co.th/${l}`,
      title: m.title,
      description: m.ogDesc,
      locale: OG_LOCALE[l],
      alternateLocale: LOCALES.filter((x) => x !== l).map((x) => OG_LOCALE[x]),
    },
    twitter: { card: "summary_large_image", title: m.title, description: m.ogDesc },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#0d2b5e",
  width: "device-width",
  initialScale: 1,
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} data-scroll-behavior="smooth" className={kanit.variable}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org", "@type": "TravelAgency",
            name: "JOURNEYLIFE", alternateName: "Journey Life Co., Ltd.",
            url: "https://journeylife.co.th/", telephone: "+66-2-051-4240",
            inLanguage: lang,
            description: "Bespoke corporate incentive travel agency in Bangkok. TAT licensed 11/11057.",
            address: { "@type": "PostalAddress", addressLocality: "Bangkok", addressCountry: "TH" },
            areaServed: ["TH","JP","KR","SG","VN","CH","AE","MV","CN"],
          }),
        }}/>
      </head>
      <body><SiteProvider lang={lang}>{children}</SiteProvider></body>
    </html>
  );
}
