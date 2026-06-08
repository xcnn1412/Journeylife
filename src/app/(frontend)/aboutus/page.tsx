import type { Metadata } from "next";
import { AboutUs } from "./AboutUs";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา · JOURNEYLIFE",
  description:
    "บริษัท เจอร์นี่ ไลฟ์ จำกัด — รับจัดทัวร์ Incentive องค์กร สัมมนา และอีเวนต์ ครบวงจร ตั้งแต่ปี 2014 · ใบอนุญาตนำเที่ยว TAT 11/11057",
  alternates: { canonical: "/aboutus" },
};

export default function Page() {
  return <AboutUs />;
}
