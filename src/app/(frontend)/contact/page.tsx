import type { Metadata } from "next";
import { ContactPage } from "./ContactPage";

export const metadata: Metadata = {
  title: "ติดต่อเรา · JOURNEYLIFE",
  description:
    "ติดต่อ บริษัท เจอร์นี่ ไลฟ์ จำกัด · 6/54 ซอยลาดพร้าว 101 แยก 42 แขวงคลองจั่น เขตบางกะปิ กรุงเทพฯ 10240 · โทร 02-051-4240 · journeylife.office@gmail.com",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return <ContactPage />;
}
