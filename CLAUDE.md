@AGENTS.md

# JOURNEYLIFE — สรุปข้อมูลเว็บไซต์

เว็บ Landing Page บริษัท **Journey Life Co., Ltd.** — รับจัดทัวร์ **Incentive ระดับองค์กร** (Corporate Incentive Travel) แบบ Bespoke
จากกรุงเทพ ส่งทั่วโลก · ดำเนินงานตั้งแต่ปี 2014 · ใบอนุญาตนำเที่ยว **TAT 11/11057**

- **โดเมน:** https://journeylife.co.th
- **โทร:** 02-051-4240 · **LINE OA:** @journeylife · **อีเมล:** incentive@journeylife.co.th
- **เวลาทำการ:** จ.–ส. 09:00–18:00 น. (ICT)
- **ภาษา:** ไทย (default) + อังกฤษ — สลับด้วยปุ่ม TH/EN, จำค่าไว้ใน `localStorage` key `jl-lang`
- **กลุ่มเป้าหมาย:** HR / Marketing / Events lead ขององค์กรชั้นนำ

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Framework | **Next.js 16.2.4** (App Router) — ⚠️ มี breaking changes จาก version ที่คุ้นเคย ดู `node_modules/next/dist/docs/` ก่อนเขียนโค้ด |
| React | **19.2.4** + **React Compiler** (`reactCompiler: true` ใน [next.config.ts](next.config.ts)) |
| Styling | **Tailwind CSS v4** (`@import "tailwindcss"`, `@theme` / `@utility` ใน [globals.css](src/app/globals.css)) |
| Fonts | **Kanit** (next/font, subsets `latin`+`thai`, weights 200–700) — ฟอนต์เดียวทั้งเว็บ exposed เป็น CSS var `--font-sans` |
| DB / CMS | **Payload CMS 3** + PostgreSQL (กำลังจะเชื่อม — Portfolio blog) · ⚠️ ต้องใช้ Next ≥ 16.2.6 · เก็บสื่อบน Cloudflare R2 · _(ถอด Prisma ออกแล้ว — Payload เป็นเจ้าของ DB)_ |
| Lint | ESLint 9 + eslint-config-next |

Scripts: `npm run dev` · `npm run build` · `npm run start` · `npm run lint`

## โครงสร้างโปรเจกต์

**⚠️ App Router แบ่งเป็น 2 route groups** — เว็บไซต์อยู่ใน `(frontend)`, Payload admin/API อยู่ใน `(payload)` · `payload.config.ts` + `src/collections/*` คุม CMS · เนื้อหา Portfolio มาจาก DB (Payload) ไม่ใช่ i18n

```
payload.config.ts     # Payload config (db adapter, lexical, R2 storage, SEO)
src/collections/       # Users · Media · Categories · Posts (Portfolio)
src/payload-types.ts   # generated (อย่าแก้มือ — รัน `npm run generate:types`)
src/
  app/
    (frontend)/       # ★ เว็บไซต์สาธารณะ
      layout.tsx        # metadata, JSON-LD, SiteProvider, fonts (Kanit)
      page.tsx          # ประกอบ section ทั้งหมด (Server Component)
      globals.css       # design tokens + utilities ทั้งหมด
      services/[slug]/  # หน้า service detail (SSG)
      portfolio/        # /portfolio + /portfolio/[slug] (ดึงจาก Payload, force-dynamic)
    (payload)/        # ★ Payload admin (/admin) + api (/api/*) — boilerplate ห้ามแก้ logic
  components/
    Nav.tsx           # Nav, Logo, AnimNum (นับเลขขึ้น), Hero
    Sakura.tsx        # กลีบซากุระลอย (ambient layer — ใช้กับ feature ฮอกไกโด)
    sections/
      _layout.tsx     # Container + SectionHeading (eyebrow + h2)
      index.ts        # re-export ทุก section
      trust-bar / pillars / relief / marquee / why / services /
      destinations / process / clients / contact / footer
  components/
    StickyCTA.tsx     # dock ลอยขวา (น้องเจอร์นี่ + LINE/โทร/Email/Facebook)
  lib/
    i18n.ts           # ★ เนื้อหาคอนเทนต์ทั้งหมด (en/th) — แก้ข้อความที่นี่
    site-context.tsx  # SiteProvider, useSite, useReveal, RevealObserver
```

## ลำดับ Section บนหน้า (page.tsx)

จัดเป็น 4 กลุ่มตามหลักการ conversion:
1. **Lead** — `Hero` (full-bleed video bg `/herosection/herosection.mp4`, poster = `herobackground.jpg`)
2. **Trust** — `TrustBar` (แถบ navy credentials + ลิงก์ DBD + stat counters)
3. **Offer** — `Pillars` (3 เสาบริการ) → `Relief` (HR pain points) → `Marquee` → `Why` (5 รูปแบบทริป) → `Services` (4 เส้นทางในไทย) → `Destinations` (ต่างประเทศ) → `Process` (4 ขั้นตอน)
4. **Conversion** — `Clients` (testimonial) → `Contact` (ฟอร์ม)
5. `Footer`

- `StickyCTA` ลอยทุกหน้า (นอก `<main>`) · ส่วน `Hero`/`Nav` อยู่ใน [Nav.tsx](src/components/Nav.tsx)
- ลบ section `SocialProof` (Our Client logo marquee) ออกแล้ว
- Nav anchor links: `#why` (Incentive) · `#services` · `#destinations` · `#clients` · `#contact` · Pillars id = `#our-services`

## เนื้อหาหลัก (อยู่ใน i18n.ts)

- **Hero:** "Reward ทีมเก่ง ด้วยทริปที่เขาจะเล่าต่อ" · sub "new journey experience"
- **Stats:** 120+ ทริป · 12 ปี · 32 ประเทศ · 98% retention
- **Services (Incentive ในไทย, 4 รูปแบบ):** Coastal (ภูเก็ต/กระบี่/สมุย/หัวหิน) · Highland (เชียงใหม่/ปาย/น่าน/เขาใหญ่) · Heritage (สุโขทัย/อยุธยา/เชียงราย) · Capital MICE (กรุงเทพ/พัทยา)
- **Destinations (ต่างประเทศ):** ญี่ปุ่น-ฮอกไกโด · สวิตเซอร์แลนด์ · มัลดีฟส์ · เกาหลีใต้ · UAE-ดูไบ · ไทย-ภูเก็ต
- **Why (5 รูปแบบ):** Incentive · Outing · Team Building · Kick-off · Retreat
- **Process (4 ขั้นตอน):** Brief → Proposal (ภายใน 5 วันทำการ) → Production → On the ground
- **Contact form:** company / name / email / phone (LINE) / pax / type / msg — ปัจจุบัน submit แค่โชว์ ✓ 4 วินาที **ยังไม่ส่งข้อมูลจริง / ไม่เชื่อม backend**

## Design System (globals.css)

- **สี:** `brand-red` #c8102e · `brand-blue` (navy) #0d2b5e · `brand-blue-deep` #061a3d · `brand-ink` #0a1024 · `brand-cream` #e6c98a · `brand-paper` #fafbfd · `brand-mute` #5b6072
- **กฎสี 60-30-10:** น้ำเงิน (navy) 60% = สีหลัก/โครงสร้าง · ขาว 30% = พื้น/คอนเทนต์ · แดง 10% = accent เท่านั้น (เส้น/จุด/CTA) — Hero ใช้ navy overlay เด่นตามกฎนี้
- **Utilities สำคัญ:** `h-display` / `h-italic` (heading น้ำหนักบาง), `eyebrow`, `wordmark`, `btn` + `btn-red`/`btn-blue`/`btn-ghost-*`, `reveal` (fade-in on scroll), `nav-link`, `card-lift`, `ph-img` (image placeholder), `tracking-wide-cap` (0.28em)
- **Animation:** reveal-on-scroll (IntersectionObserver ใน `useReveal`), นับเลข `AnimNum`, marquee, กลีบซากุระ, `float-soft`
- รองรับ `prefers-reduced-motion` (ปิด sakura)

## SEO / Metadata (layout.tsx)

- `metadataBase`: https://journeylife.co.th · canonical `/`, th-TH default + en-US `/?lang=en`
- OpenGraph + Twitter card · `themeColor` #0d2b5e
- **JSON-LD** `TravelAgency` — areaServed: TH, JP, KR, SG, VN, CH, AE, MV
- keywords เน้น: ทัวร์ incentive, company trip, MICE Thailand, ทัวร์องค์กร, ฮอกไกโด, DMC Thailand, TAT 11/11057

## หมายเหตุการพัฒนา

- **แก้ข้อความทุกอย่างที่ [src/lib/i18n.ts](src/lib/i18n.ts)** — ทุก section อ่านจาก `useSite().t`; ต้องแก้ทั้ง `en` และ `th` ให้ key ตรงกัน (type `Dict` บังคับ shape ตรงกัน)
- Section ส่วนใหญ่เป็น `"use client"` เพราะใช้ `useSite()`; `page.tsx`/`layout.tsx` เป็น Server Component
- ฟอนต์ใช้ **Kanit** ตัวเดียวทั้งเว็บ (Thai+Latin) ผ่าน next/font — token `--font-thai` / `--font-sans` ใน [globals.css](src/app/globals.css) ชี้มาที่ Kanit ทั้งหมด
