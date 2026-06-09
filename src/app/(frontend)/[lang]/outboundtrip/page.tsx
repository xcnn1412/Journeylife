import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer, OverseasPackages } from "@/components/sections";
import { StickyCTA } from "@/components/StickyCTA";
import { OutboundDiscountBar } from "@/components/OutboundDiscountBar";
import { RevealObserver } from "@/lib/site-context";
import { isLocale, localeAlternates, type Locale } from "@/lib/locale";
import { getHotDeals } from "@/lib/hot-deals";

// Statically cached + ISR; hot deals refresh on the same 10-minute cycle.
export const revalidate = 600;

const META: Record<Locale, { title: string; description: string; ogDesc: string }> = {
  th: {
    title: "ทัวร์ต่างประเทศ คุณภาพ ราคาคุ้มค่า · JOURNEYLIFE",
    description:
      "แพ็กเกจทัวร์ต่างประเทศคุณภาพจาก Journey Life — ญี่ปุ่น · เกาหลี · เวียดนาม · จีน · อินเดีย · ตุรกี และอีกหลายเส้นทาง · ราคาคุ้มค่า ดูแลโดยทีมงานมืออาชีพ · ใบอนุญาต TAT 11/11057",
    ogDesc: "แพ็กเกจทัวร์ต่างประเทศคุณภาพ ราคาคุ้มค่า โดย Journey Life",
  },
  en: {
    title: "Overseas tours — great quality, great value · JOURNEYLIFE",
    description:
      "Quality overseas tour packages by Journey Life — Japan · Korea · Vietnam · China · India · Turkey and more · great value, professional team · TAT licence 11/11057.",
    ogDesc: "Quality, great-value overseas tour packages by Journey Life.",
  },
  zh: {
    title: "海外旅游 品质优良 超值实惠 · JOURNEYLIFE",
    description:
      "Journey Life 优质海外旅游套餐 — 日本 · 韩国 · 越南 · 中国 · 印度 · 土耳其等多条路线 · 超值实惠，专业团队全程打理 · TAT 经营许可 11/11057。",
    ogDesc: "Journey Life 优质、超值的海外旅游套餐。",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: Locale = isLocale(lang) ? lang : "th";
  const m = META[l];
  return {
    title: m.title,
    description: m.description,
    alternates: localeAlternates(l, "/outboundtrip"),
    openGraph: {
      type: "website",
      url: `https://journeylife.co.th/${l}/outboundtrip`,
      title: m.title,
      description: m.ogDesc,
    },
  };
}

export default async function OutboundTripPage() {
  const hotDeals = await getHotDeals();

  return (
    <>
      <RevealObserver />
      <Nav />
      <StickyCTA />
      <OutboundDiscountBar />

      <main>
        {/* ทัวร์ต่างประเทศ — country-filtered hot-deal board, gallery moved to the bottom */}
        <OverseasPackages hotDeals={hotDeals} dealsVariant="filter" galleryAtBottom />
      </main>

      <Footer />
    </>
  );
}
