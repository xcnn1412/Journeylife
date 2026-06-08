# Outbound (ทัวร์ต่างประเทศ) — สถาปัตยกรรม & การดึงข้อมูล

> เอกสารนี้อธิบายว่าฟีเจอร์ "ทัวร์ต่างประเทศ" ทำงานยังไง — ดึงข้อมูลจากเว็บจองทัวร์
> `tour.journeylife.co.th` (ระบบภายนอกของ okwebtour) มา **parse ฝั่ง server** แล้วเรนเดอร์
> ในเว็บเราเอง เขียนให้ทั้งคนและ AI อ่านต่อยอดได้

---

## 1. ภาพรวม

เราไม่มี REST API ของ tour site — มันเป็นเว็บ PHP ที่ **server-render HTML**. เราจึง
`fetch()` หน้า HTML เหล่านั้น **ฝั่ง server** (เลี่ยง CORS) แล้ว **parse ด้วย regex**
เอาเฉพาะข้อมูลที่ต้องใช้ มาเรนเดอร์เป็น UI ของเราเอง ผู้ใช้ไม่ต้องออกไปเว็บ tour
(ยกเว้นขั้น "จอง/ชำระเงิน" ที่ลิงก์ไป `booking.php` ของเขา)

**Flow ผู้ใช้:**
```
/outboundtrip                → ฟอร์มค้นหา + การ์ดประเทศ + โปรไฟไหม้ (filter) + แกลเลอรี
   └─ กดค้นหา ─────────────→ /outboundtrip/search?<query>   (ผลการค้นหา)
        └─ คลิกการ์ดทัวร์ ──→ /outboundtrip/tour/[id]        (รายละเอียดโปรแกรม)
             └─ กด "จอง" ──→ tour.journeylife.co.th/booking.php  (ออกนอกเว็บ)
```

**หลักการสำคัญ:**
- ทุกการ `fetch` tour site ทำใน **Server Component / lib ฝั่ง server** เท่านั้น
- ใส่ `User-Agent` แบบเบราว์เซอร์/บอทเสมอ ไม่งั้นบางหน้าตอบ 403
- caching ใช้ ISR (`next: { revalidate: 600 }`) ยกเว้นหน้าค้นหาใช้ `cache: "no-store"`
  (เพราะ query หลากหลาย ไม่ควร cache)

---

## 2. เส้นทาง (endpoints) ของ tour site ที่เราใช้

| Endpoint | ใช้ทำอะไร | lib ของเรา |
|---|---|---|
| `GET /hotdeal.php` | โปรโมชัน "ไฟไหม้" (ราคาเต็ม→ลด) | [`src/lib/hot-deals.ts`](src/lib/hot-deals.ts) |
| `GET /search.php?<query>` | ค้นหาโปรแกรมทัวร์ | [`src/lib/tour-search.ts`](src/lib/tour-search.ts) |
| `GET /tour.php?tour_id=<id>` | รายละเอียดโปรแกรมรายตัว | [`src/lib/tour-detail.ts`](src/lib/tour-detail.ts) |
| `GET /listcountry.php` | รายชื่อประเทศปลายทาง (ใช้ตอน build รายการครั้งเดียว) | data ฝังใน [`src/lib/tour-destinations.ts`](src/lib/tour-destinations.ts) |
| `GET /booking.php?...` | หน้าจองจริง (ลิงก์ออกไปเฉยๆ ไม่ parse) | — |
| `https://tourfiles.vm101.net/pdf/<...>.pdf` | ไฟล์โปรแกรม PDF (ลิงก์ออกไป) | — |

Base URL: `https://tour.journeylife.co.th`
รูปภาพทั้งหมดอยู่ที่ CDN: `https://files.okwebtour.com/storage/banner/...`

---

## 3. `/search.php` — Query String (สำคัญที่สุด)

หน้าค้นหาส่ง **GET** ไปที่ `search.php` ด้วยพารามิเตอร์เหล่านี้ (ชื่อ field ตรงกับฟอร์มจริงของ tour site):

| param | ความหมาย | ตัวอย่างค่า | หมายเหตุ |
|---|---|---|---|
| `keyword` | คำค้นหลัก = **ชื่อประเทศ (ไทย)** | `ญี่ปุ่น` | เราผูกกับ dropdown ประเทศ |
| `keywords` | คำค้นรอง = **เมือง/คำเสริม** | `โตเกียว` | เราผูกกับ dropdown เมือง |
| `priceRange` | ช่วงราคา `min-max` | `10000-15000`, `400000` | ค่าจาก list คงที่ (ดู `PRICE_RANGES`) |
| `day` | จำนวนวัน | `6` | 1–30 |
| `tourid` | รหัสทัวร์ | `025-B07437` | ค้นตรงรหัส |
| `cstartdate` | วันเริ่มเดินทาง | `01-10-2569` | **รูปแบบ `DD-MM-BBBB`** (พ.ศ. = ค.ศ.+543) |
| `cenddate` | วันสิ้นสุด | `06-10-2569` | เหมือนกัน |
| `sort` | การเรียง | `new` / `asc` / `desc` | เราตั้ง default `new` |

**กฎสำคัญของผลลัพธ์ (สังเกตจากการทดสอบจริง):**
- ค้นหาว่าง / `sort=new` อย่างเดียว → คืน **12 โปรแกรมล่าสุด** (ไม่ใช่ 0)
- `keyword` ที่ตรง → กรองตามประเทศ; ที่ **ไม่ match อะไรเลย → คืน 0**
- ผลลัพธ์ **1 หน้า = 12 การ์ด** (`tour-card`) — ถ้าต้องการมากกว่านี้ลิงก์ไปดูบนเว็บ tour

### 3.1 การแปลงวันที่ (Buddhist year)
input `<input type="date">` ให้ค่า `yyyy-mm-dd` ต้องแปลงเป็น `DD-MM-BBBB`:
```ts
// yyyy-mm-dd → DD-MM-BBBB (ดูใน TourSearch.tsx)
const [y, m, d] = iso.split("-");
return `${d}-${m}-${Number(y) + 543}`;  // 2026-10-01 → 01-10-2569
```

### 3.2 ⚠️ กับดัก: Double-encoding ของภาษาไทย
ปัญหาที่เคยเจอ: ค้นหาแล้วได้ 0 ผลเสมอ ทั้งที่ tour site มีข้อมูล
**สาเหตุ:** ชื่อประเทศไทยถูก URL-encode **สองรอบ** — `router.push()` ส่งค่าที่
`URLSearchParams.toString()` encode แล้ว (`%E0%B8...`) ไปโดน encode ซ้ำเป็น `%25E0...`
→ `search.php` มองเป็นข้อความมั่ว → match ไม่เจอ → 0

**วิธีแก้ (อยู่ใน [`/outboundtrip/search/page.tsx`](src/app/(frontend)/outboundtrip/search/page.tsx)):**
ก่อนส่งค่าให้ `searchTours` ตรวจว่าถ้ายังมี `%XX` ค้างอยู่ ให้ `decodeURIComponent` อีกชั้น
```ts
let v = sp[k];                       // ค่าจาก Next searchParams (ปกติ decode มาแล้ว)
if (/%[0-9A-Fa-f]{2}/.test(v)) v = decodeURIComponent(v);  // เก็บกวาด double-encode
```
- เคส encode ปกติ: ค่าเป็น "ญี่ปุ่น" (ไม่มี `%`) → ข้าม ไม่กระทบ
- เคส encode ซ้ำ: เหลือ "%E0%B8.." → decode → "ญี่ปุ่น" → ค้นเจอ
> **กฎสำหรับ AI:** เวลาส่งคำค้นภาษาไทยผ่าน URL ให้ encode "ครั้งเดียว" เสมอ และทำให้ทนทานต่อ
> การ encode ซ้ำด้วยการ decode ตรงปลายทางถ้ายังเห็น `%XX`

---

## 4. lib ฝั่ง server (เรียกใช้ยังไง)

### 4.1 `searchTours(params)` — [`src/lib/tour-search.ts`](src/lib/tour-search.ts)
```ts
import { searchTours, buildSearchUrl, SEARCH_KEYS } from "@/lib/tour-search";

const { results, fullUrl } = await searchTours({
  keyword: "ญี่ปุ่น",
  keywords: "โตเกียว",   // optional
  priceRange: "30000-35000", // optional
  sort: "new",
});
// results: TourResult[]  (สูงสุด 12 ต่อหน้า, dedupe ตาม tour_id)
// fullUrl: URL เดียวกันบนเว็บ tour (ใช้ทำลิงก์ "ดูทั้งหมด")
```
- `SEARCH_KEYS` = รายชื่อ param ที่ valid (ใช้ filter searchParams)
- `buildSearchUrl(params)` = ประกอบ URL `search.php` (ใส่ `sort=new` ถ้าไม่มี)
- ดึงด้วย `cache: "no-store"`; คืน `{results: [], fullUrl}` ถ้าพัง

**`TourResult` shape:**
```ts
interface TourResult {
  id: string;        // tour_id
  href: string;      // tour.php?tour_id=ID (ลิงก์เดิมของ tour site)
  img: string;       // banner 1:1 (ดูข้อ 6 เรื่อง URL รูป)
  title: string;
  code: string;      // "025-B07437"
  days: string;      // "6 วัน 4 คืน"
  airline: string;   // "AirAsia X (XJ)"
  price: number;     // ราคาเริ่มต้น (เลขล้วน)
  country: string;   // ดึงจาก title "ทัวร์<ประเทศ>"
  flag: string;      // emoji ธง
}
```

### 4.2 `getHotDeals(limit?)` — [`src/lib/hot-deals.ts`](src/lib/hot-deals.ts)
```ts
import { getHotDeals } from "@/lib/hot-deals";
const deals = await getHotDeals(40);  // default 40, ISR 600s
```
parse `.deal-row` แต่ละบล็อกได้: `id, img, title, code, country, flag, dateText,`
`originalPrice, firePrice, discountPercent`
- dedupe ตาม `id|dateText` (เก็บทุก "งวดเดินทาง" ที่ราคาต่างกัน)
- ราคา: `original-price-tag` (เต็ม) → `blink-pricepro` (ไฟไหม้) → `badge-discount-percent` (%)
- ประเทศ: ดึงจาก title prefix `ทัวร์<ประเทศ>` (ธงทำงานแม้สะกดต่าง เช่น "อียีปต์")

### 4.3 `getTourDetail(id)` — [`src/lib/tour-detail.ts`](src/lib/tour-detail.ts)
```ts
import { getTourDetail } from "@/lib/tour-detail";
const tour = await getTourDetail("24262");  // null ถ้าไม่เจอ; ISR 600s
```
parse จาก `tour.php?tour_id=ID`:
| field | มาจาก |
|---|---|
| `title` | `<h1>` |
| `image` | `<meta property="og:image">` (banner เต็ม) |
| `code` / `duration` / `airline` | กล่อง meta (`รหัสทัวร์` / `ช่วงเวลา` / `เดินทางโดย`) |
| `highlights[]` | `<ul><li>` ถัดจาก "ไฮไลท์ทริป ห้ามพลาด" |
| `periods[]` | ตารางถัดจาก "เลือกวันเดินทาง" → `{date, price, priceNum, seats, bookHref}` |
| `itinerary[]` | accordion ถัดจาก "แผนการเดินทาง" → `{day, title, detail}` |
| `pdf` | ลิงก์ `.pdf` ตัวแรก |
| `priceFrom` | min ของ period prices |

**⚠️ ข้อจำกัด itinerary:** เนื้อหารายวันแบบ prose (มื้ออาหาร/ที่พัก/รายละเอียด) **ไม่ได้อยู่ใน
HTML ที่ server-render** (accordion-body ว่างเปล่า, ไม่มี AJAX endpoint) — มีแต่ "ชื่อสถานที่
ต่อวัน" ในหัวข้อ. เราจึงแสดง itinerary เป็น list สถานที่รายวัน + ลิงก์ PDF สำหรับรายละเอียดเต็ม
(ไม่ทำ dropdown ลวงที่กดแล้วว่าง). ถ้าต้องการเนื้อหาเต็มต้องไปดึง/แปลงจาก PDF (ซับซ้อนกว่ามาก)

**การจอง (booking):** ปุ่ม "จอง" รายงวดลิงก์ไป `booking.php` ของ tour site
(`bookHref` ผ่าน `encodeURI` เพราะ href ดิบมีไทย/ช่องว่าง)

---

## 5. ข้อมูลปลายทาง & ธง — [`src/lib/tour-destinations.ts`](src/lib/tour-destinations.ts)

ดึงจาก `listcountry.php` (ทำครั้งเดียว ฝังเป็น constant) — **73 ประเทศ** ปลายทางจริง
```ts
COUNTRIES: { th: string; en: string }[]   // 73 รายการ เรียงตามอักษรไทย
POPULAR_TH: string[]                       // ชื่อไทยของประเทศยอดนิยม (โชว์กลุ่มบนสุด)
CITIES: Record<string, string[]>           // เมืองยอดนิยมต่อประเทศ (curated, ส่งเป็น keywords)
flagFor(th): string                        // emoji ธง (ใช้ใน chips/cards)
flagImg(th): string                        // URL รูปธงจาก flagcdn (ตาม ISO code) — ใช้ใน dropdown
```
- `keyword` ส่งเป็น **ชื่อไทย** (`COUNTRIES[].th`) — ตรงกับที่ `search.php` ต้องการ
- `CITIES` เป็นชุด curated (ชื่อเมืองไทยที่ปรากฏใน title ทัวร์) เพื่อกัน user พิมพ์ผิด
- ⚠️ **flag emoji เรนเดอร์เป็น "JP/KR" บน Windows** (font OS ไม่รองรับ) → ใน dropdown จึงใช้
  **รูปธงจริง** จาก `flagImg()` ผ่าน `<img>` (native `<option>` ใส่รูปไม่ได้ จึงต้องทำ custom dropdown)

---

## 6. ⚠️ กับดัก URL รูปภาพ (banner)

- **search.php**: `data-src` ชี้ `/storage/banner/<เลข>/CODE-600.jpg` ซึ่ง **404**
  (เลขคือ agency-id subfolder). ไฟล์จริงอยู่ที่ root → **ตัด subfolder ตัวเลขทิ้ง**
  ```ts
  rawImg.replace(/(\/storage\/banner\/)\d+\//, "$1");
  // .../banner/836/025-B07437-600.jpg → .../banner/025-B07437-600.jpg ✓
  ```
  ดึงจาก `data-srcset` ก่อน (มี URL ที่ถูกอยู่แล้ว) แล้วค่อย fallback `data-src`
- **hotdeal.php**: banner อยู่ที่ root อยู่แล้ว ไม่ต้องตัด
- **อัตราส่วนรูป = 1:1** (600×600 / 1040×1040) → การ์ดใช้ `aspect-square` (ไม่ใช่ 16:9)
- รูป CDN ใช้ `<img>` ธรรมดา (ไม่ผ่าน `next/image`) จึงไม่ต้องตั้ง `remotePatterns`

---

## 7. หน้า & คอมโพเนนต์ของเรา

| ไฟล์ | บทบาท |
|---|---|
| [`app/(frontend)/outboundtrip/page.tsx`](src/app/(frontend)/outboundtrip/page.tsx) | หน้าหลัก (server) — เรียก `getHotDeals` ส่งเข้า `<OverseasPackages>` |
| [`app/(frontend)/outboundtrip/search/page.tsx`](src/app/(frontend)/outboundtrip/search/page.tsx) | หน้าผลค้นหา (server, dynamic) — อ่าน searchParams → `searchTours` → `<TourResults>` |
| [`app/(frontend)/outboundtrip/tour/[id]/page.tsx`](src/app/(frontend)/outboundtrip/tour/[id]/page.tsx) | หน้ารายละเอียด (server, ISR) — `getTourDetail` → `<TourDetailView>`; `notFound()` ถ้า null |
| [`components/TourSearch.tsx`](src/components/TourSearch.tsx) | ฟอร์มค้นหา (client) — สร้าง query แล้ว `router.push("/outboundtrip/search?...")` |
| [`components/FlagSelect.tsx`](src/components/FlagSelect.tsx) | dropdown ประเทศแบบ custom (รูปธง + ค้นหาได้) — submit ผ่าน hidden `<input name>` |
| [`components/TourResults.tsx`](src/components/TourResults.tsx) | การ์ดผลค้นหา (client) — คลิก → `/outboundtrip/tour/[id]` (เปิดแท็บใหม่) |
| [`components/HotDealFilter.tsx`](src/components/HotDealFilter.tsx) | โปรไฟไหม้แบบ filter แยกประเทศ + ราคา (ใช้บน /outboundtrip) |
| [`components/TourDetailView.tsx`](src/components/TourDetailView.tsx) | เรนเดอร์รายละเอียดทุก section |
| [`components/sections/overseas-packages.tsx`](src/components/sections/overseas-packages.tsx) | section รวม (search + การ์ดประเทศ + แกลเลอรี + deals) — props: `dealsVariant`, `galleryAtBottom` |

**`<OverseasPackages>` props:**
- `hotDeals: HotDeal[]`
- `dealsVariant: "marquee" | "filter"` — `marquee` = homepage console, `filter` = /outboundtrip
- `galleryAtBottom: boolean` — สลับลำดับ gallery ไปท้ายสุด (ใช้บน /outboundtrip)

---

## 8. สรุปกฎสำหรับ AI ที่จะมาแก้ต่อ

1. **ดึงข้อมูลเฉพาะฝั่ง server** ในไฟล์ `src/lib/*` หรือ Server Component — อย่า fetch tour site จาก client
2. ใส่ `User-Agent` เสมอ; พังให้คืน empty/`null` (มี try/catch อยู่แล้ว)
3. **encode ภาษาไทยใน URL ครั้งเดียว** + decode เผื่อ double-encode ที่ปลายทาง (ดูข้อ 3.2)
4. รูป search.php ต้อง **ตัด `/storage/banner/<เลข>/` subfolder** (ข้อ 6); รูปเป็น **1:1**
5. parsing พึ่งโครงสร้าง HTML ของ okwebtour — ถ้า tour site เปลี่ยน layout **regex จะพัง**
   ต้องไปอัปเดต regex ใน lib ที่เกี่ยวข้อง (วิธีหา: `curl` หน้านั้นมาดู class/มาร์กอัปจริง)
6. itinerary แบบ prose ไม่มีใน HTML — อย่าพยายาม parse, ชี้ไป PDF แทน
7. caching: รายการ/รายละเอียด ใช้ ISR 600s; หน้าค้นหา `no-store`
8. ขั้นจอง/ชำระเงิน ลิงก์ออกไป `booking.php` ของ tour site เสมอ (เราไม่ทำ checkout เอง)

---

## 9. วิธีตรวจโครงสร้าง tour site ใหม่ (เมื่อ regex พัง)

```bash
# ดึง HTML จริงมาส่อง class/มาร์กอัป
curl -s -A "Mozilla/5.0" "https://tour.journeylife.co.th/search.php?keyword=ญี่ปุ่น&sort=new" -o /tmp/x.html
# นับการ์ด
grep -o 'class="[^"]*tour-card' /tmp/x.html | wc -l
# ดูบล็อกตัวอย่าง (ใช้ node parse แล้ว .replace(/\s+/g," ") ให้อ่านง่าย)
```
endpoint ที่ใช้บ่อยตอน debug: `search.php`, `hotdeal.php`, `tour.php?tour_id=<id>`, `listcountry.php`
