const TH_CITIES: { name: string; tier: "primary" | "secondary" }[] = [
  { name: "กรุงเทพ", tier: "primary" },
  { name: "เชียงใหม่", tier: "primary" },
  { name: "ภูเก็ต", tier: "primary" },
  { name: "น่าน", tier: "secondary" },
  { name: "พัทยา", tier: "primary" },
  { name: "เลย", tier: "secondary" },
  { name: "กระบี่", tier: "primary" },
  { name: "จันทบุรี", tier: "secondary" },
  { name: "เกาะสมุย", tier: "primary" },
  { name: "บุรีรัมย์", tier: "secondary" },
  { name: "หัวหิน", tier: "primary" },
  { name: "แม่ฮ่องสอน", tier: "secondary" },
  { name: "เชียงราย", tier: "primary" },
  { name: "ตราด", tier: "secondary" },
  { name: "อยุธยา", tier: "primary" },
  { name: "สุโขทัย", tier: "secondary" },
  { name: "กาญจนบุรี", tier: "primary" },
  { name: "พังงา", tier: "secondary" },
  { name: "ลำปาง", tier: "secondary" },
  { name: "ตรัง", tier: "secondary" },
];

export function Marquee() {
  return (
    <section className="bg-brand-blue text-white border-y border-brand-blue overflow-hidden relative">
      {/* Left/right fade overlays so text dissolves at edges */}
      <div aria-hidden className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-brand-blue to-transparent z-10 pointer-events-none" />
      <div aria-hidden className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-brand-blue to-transparent z-10 pointer-events-none" />

      <div className="marquee-track">
        {[...TH_CITIES, ...TH_CITIES].map((c, i) => (
          <span key={i} className="h-display text-[34px] md:text-[44px] flex items-center gap-20 whitespace-nowrap text-white/95">
            {c.name}
            <span
              className={`w-1.5 h-1.5 rounded-full ${c.tier === "primary" ? "bg-brand-red" : "bg-brand-cream"}`}
              aria-hidden
            />
          </span>
        ))}
      </div>
    </section>
  );
}
