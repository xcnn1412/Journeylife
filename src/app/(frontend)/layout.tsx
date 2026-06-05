import type { Metadata, Viewport } from "next";
import { Kanit } from "next/font/google";
import { SiteProvider } from "@/lib/site-context";
import "./globals.css";

// Kanit — Thai + Latin in one family; the whole site renders in this typeface.
const kanit = Kanit({
  subsets: ["latin", "thai"],
  weight: ["200", "300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://journeylife.co.th"),
  title: "JOURNEYLIFE · Bespoke Corporate Incentive Travel · ทัวร์ Incentive ระดับองค์กร",
  description: "JOURNEYLIFE — บริษัทรับจัดทัวร์ Incentive ระดับองค์กร · Outbound · Inbound · MICE · ใบอนุญาต TAT 11/11057 · ตั้งแต่ปี 2014",
  keywords: ["ทัวร์ incentive", "company trip", "บริษัททัวร์", "MICE Thailand", "ทัวร์องค์กร", "ทัวร์ฮอกไกโด incentive", "DMC Thailand", "JOURNEYLIFE", "TAT 11/11057"],
  alternates: { canonical: "/", languages: { "th-TH": "/", "en-US": "/?lang=en" } },
  openGraph: {
    type: "website", url: "https://journeylife.co.th/",
    title: "JOURNEYLIFE · Bespoke Corporate Incentive Travel",
    description: "ทัวร์ Incentive ระดับองค์กร · Outbound · Inbound · MICE · ใบอนุญาต TAT 11/11057",
    locale: "th_TH", alternateLocale: "en_US",
  },
  twitter: { card: "summary_large_image", title: "JOURNEYLIFE · Bespoke Incentive Travel", description: "Crafted incentive trips for Thailand's most demanding companies. Since 2014." },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0d2b5e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={kanit.variable}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org", "@type": "TravelAgency",
            name: "JOURNEYLIFE", alternateName: "Journey Life Co., Ltd.",
            url: "https://journeylife.co.th/", telephone: "+66-2-051-4240",
            description: "Bespoke corporate incentive travel agency in Bangkok. TAT licensed 11/11057.",
            address: { "@type": "PostalAddress", addressLocality: "Bangkok", addressCountry: "TH" },
            areaServed: ["TH","JP","KR","SG","VN","CH","AE","MV"],
          }),
        }}/>
      </head>
      <body><SiteProvider>{children}</SiteProvider></body>
    </html>
  );
}
