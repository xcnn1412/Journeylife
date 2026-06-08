import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer, OverseasPackages } from "@/components/sections";
import { StickyCTA } from "@/components/StickyCTA";
import { OutboundDiscountBar } from "@/components/OutboundDiscountBar";
import { RevealObserver } from "@/lib/site-context";
import { getHotDeals } from "@/lib/hot-deals";

// Statically cached + ISR; hot deals refresh on the same 10-minute cycle.
export const revalidate = 600;

export const metadata: Metadata = {
  title: "ทัวร์ต่างประเทศ คุณภาพ ราคาคุ้มค่า · JOURNEYLIFE",
  description:
    "แพ็กเกจทัวร์ต่างประเทศคุณภาพจาก Journey Life — ญี่ปุ่น · เกาหลี · เวียดนาม · จีน · อินเดีย · ตุรกี และอีกหลายเส้นทาง · ราคาคุ้มค่า ดูแลโดยทีมงานมืออาชีพ · ใบอนุญาต TAT 11/11057",
  alternates: { canonical: "/outboundtrip" },
  openGraph: {
    type: "website",
    url: "https://journeylife.co.th/outboundtrip",
    title: "ทัวร์ต่างประเทศ คุณภาพ ราคาคุ้มค่า · JOURNEYLIFE",
    description: "แพ็กเกจทัวร์ต่างประเทศคุณภาพ ราคาคุ้มค่า โดย Journey Life",
  },
};

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
