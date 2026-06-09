import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/next/preview"] },
    sitemap: "https://journeylife.co.th/sitemap.xml",
    host: "https://journeylife.co.th",
  };
}
