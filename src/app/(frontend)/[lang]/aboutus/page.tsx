import type { Metadata } from "next";
import { isLocale, localeAlternates, type Locale } from "@/lib/locale";
import { AboutUs } from "./AboutUs";

const META: Record<Locale, { title: string; description: string }> = {
  th: {
    title: "เกี่ยวกับเรา · JOURNEYLIFE",
    description:
      "บริษัท เจอร์นี่ ไลฟ์ จำกัด — รับจัดทัวร์ Incentive องค์กร สัมมนา และอีเวนต์ ครบวงจร ตั้งแต่ปี 2013 · ใบอนุญาตนำเที่ยว TAT 11/11057",
  },
  en: {
    title: "About us · JOURNEYLIFE",
    description:
      "Journey Life Co., Ltd. — full-service corporate incentive travel, seminars and events since 2013 · TAT licence 11/11057.",
  },
  zh: {
    title: "关于我们 · JOURNEYLIFE",
    description:
      "Journey Life 有限公司 — 企业奖励旅游、研讨会与活动一站式承办，始于 2013 年 · TAT 经营许可 11/11057。",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: Locale = isLocale(lang) ? lang : "th";
  return { ...META[l], alternates: localeAlternates(l, "/aboutus") };
}

export default function Page() {
  return <AboutUs />;
}
