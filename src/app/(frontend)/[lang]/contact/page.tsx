import type { Metadata } from "next";
import { isLocale, localeAlternates, type Locale } from "@/lib/locale";
import { ContactPage } from "./ContactPage";

const META: Record<Locale, { title: string; description: string }> = {
  th: {
    title: "ติดต่อเรา · JOURNEYLIFE",
    description:
      "ติดต่อ บริษัท เจอร์นี่ ไลฟ์ จำกัด · 6/54 ซอยลาดพร้าว 101 แยก 42 แขวงคลองจั่น เขตบางกะปิ กรุงเทพฯ 10240 · โทร 02-051-4240 · journeylife.office@gmail.com",
  },
  en: {
    title: "Contact us · JOURNEYLIFE",
    description:
      "Contact Journey Life Co., Ltd. · Bangkok · Tel 02-051-4240 · journeylife.office@gmail.com · we reply within one business hour.",
  },
  zh: {
    title: "联系我们 · JOURNEYLIFE",
    description:
      "联系 Journey Life 有限公司 · 泰国曼谷 · 电话 02-051-4240 · journeylife.office@gmail.com · 1 个工作小时内回复。",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: Locale = isLocale(lang) ? lang : "th";
  return { ...META[l], alternates: localeAlternates(l, "/contact") };
}

export default function Page() {
  return <ContactPage />;
}
