import type { Metadata } from "next";
import { ServicesIndex } from "./ServicesIndex";

export const metadata: Metadata = {
  title: "บริการของเรา · JOURNEYLIFE",
  description: "บริการครบวงจร: Company Trip · CSR · Event · Night Party · Seminar · Team Building · ทัวร์ต่างประเทศ · ทัวร์ในประเทศ",
  alternates: { canonical: "/services" },
};

export default function Page() {
  return <ServicesIndex />;
}
