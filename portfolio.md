# Portfolio (ผลงาน) — คู่มือการใช้งาน

ส่วน Portfolio คือบล็อก "ผลงาน" ขององค์กร เนื้อหา **ไม่ได้อยู่ใน `i18n.ts`** แต่ดึงจาก
**Payload CMS (PostgreSQL)** โดยตรง จัดการเนื้อหาผ่านหน้าแอดมินที่ `/admin`

---

## หน้าที่เกี่ยวข้อง

| ไฟล์ | หน้าที่ |
|------|---------|
| [src/app/(frontend)/portfolio/page.tsx](src/app/(frontend)/portfolio/page.tsx) | หน้ารวมผลงาน `/portfolio` — grid การ์ด |
| [src/app/(frontend)/portfolio/[slug]/page.tsx](src/app/(frontend)/portfolio/[slug]/page.tsx) | หน้ารายละเอียด `/portfolio/{slug}` |
| [src/collections/Posts.ts](src/collections/Posts.ts) | schema ของผลงาน (collection `posts`) |
| [src/collections/Media.ts](src/collections/Media.ts) | คลังรูป/วิดีโอ + image sizes |
| [src/collections/Categories.ts](src/collections/Categories.ts) | หมวดหมู่ |
| [src/lib/payload.ts](src/lib/payload.ts) | `getPayloadClient()` + `mediaImage()` |
| [payload.config.ts](payload.config.ts) | config DB / R2 / SEO / lexical |

> ทั้งสองหน้าเป็น Server Component และตั้ง `export const dynamic = "force-dynamic"`
> (render ใหม่ทุก request) — แก้เนื้อหาในแอดมินแล้วเห็นผลทันที โดยมี
> `afterChange`/`afterDelete` hook ใน `Posts.ts` คอย `revalidatePath` ให้ด้วย

> **⚠️ ระวังจุดที่ยังไม่สอดคล้องกัน:** บนหน้าแรกมี section
> [src/components/sections/portfolio.tsx](src/components/sections/portfolio.tsx)
> (`id="portfolio"`) ที่โชว์แกลเลอรีพรีวิว + ปุ่ม "ดูผลงานทั้งหมด" → `/portfolio`
> แต่รูปในพรีวิวนี้ดึงจาก **`t.portfolio.images` (static ใน i18n)** ไม่ได้ดึงจาก
> Payload — ดังนั้นพรีวิวหน้าแรกกับผลงานจริงใน `/portfolio` เป็นคนละชุดข้อมูล
> (ควรพิจารณาให้พรีวิวดึงจาก Payload ด้วย เพื่อให้ตรงกัน)

---

## วิธีทำงาน (data flow)

### หน้ารวม `/portfolio`
1. เรียก `getPayloadClient()` → `payload.find({ collection: "posts" })`
2. กรองเฉพาะที่ `_status = published` · เรียง `-publishedAt` · `depth: 1` (populate รูป cover) · `limit: 60`
3. วน `docs` แสดงเป็นการ์ด: cover (ผ่าน `mediaImage()`), `title`, `excerpt`, ปุ่ม "อ่านต่อ" ลิงก์ไป `/portfolio/{slug}`
4. ถ้าไม่มีโพสต์ → แสดง "ยังไม่มีผลงานเผยแพร่ในขณะนี้"

### หน้ารายละเอียด `/portfolio/{slug}`
1. `getPost(slug)` หาโพสต์ที่ `slug` ตรง + published (`depth: 2` populate ทั้ง cover และ gallery)
2. ไม่เจอ → `notFound()` (404)
3. `generateMetadata()` สร้าง title / description / OpenGraph จากตัวโพสต์ (SEO ต่อหน้า)
4. แสดง Hero (cover) → `content` (rich text ผ่าน `<RichText>` ของ Lexical) → gallery grid → ปุ่มกลับ → section `<Contact />`

---

## โครงสร้างข้อมูลของผลงาน (collection `posts`)

| ฟิลด์ | ชนิด | หมายเหตุ |
|-------|------|----------|
| `title` | text **(จำเป็น)** | ชื่อผลงาน |
| `slug` | text (unique) | เว้นว่างได้ → สร้างอัตโนมัติจาก `title` (รองรับตัวอักษรไทย) |
| `excerpt` | textarea | ข้อความสั้นบนการ์ด + ใช้เป็น meta description |
| `cover` | upload → media | รูปปก (การ์ด + Hero + OG image) |
| `content` | richText (Lexical) | เนื้อหาหลัก |
| `gallery` | array → image | แกลเลอรีรูปเพิ่มเติม |
| `category` | relationship → categories | หมวดหมู่ |
| `client` | text | ชื่อลูกค้า/องค์กร |
| `publishedAt` | date | ใช้เรียงลำดับ |

**สิทธิ์การเข้าถึง:** สาธารณะเห็นเฉพาะที่ published · ผู้ใช้ที่ล็อกอินเห็นทุกสถานะ
(เปิด drafts/versions ไว้ — บันทึกเป็นฉบับร่างได้)

**ขนาดรูป (Media):** `thumbnail` 480w · `card` 1024w · `og` 1200×630
สร้างอัตโนมัติด้วย sharp · `mediaImage(m, size)` เลือกขนาดที่ต้องการ

---

## วิธีลงผลงานใหม่ (สำหรับทีมงาน)

1. รัน `npm run dev` แล้วเปิด `http://localhost:3000/admin`
2. ครั้งแรกสุด: สร้างบัญชีแอดมินคนแรก (หน้าจอจะให้กรอกเอง)
3. เมนู **Portfolio** → **Create New**
4. กรอก `title`, `excerpt`, อัป `cover`, เขียน `content`, ใส่ `gallery`/`category`/`client`/`publishedAt` ตามต้องการ
5. กด **Publish** (ถ้ากด Save จะเป็นฉบับร่าง ยังไม่ขึ้นเว็บ)
6. เปิด `http://localhost:3000/portfolio` ตรวจผล

---

## คำสั่งที่เกี่ยวข้อง

```bash
npm run dev                 # รันเว็บ + แอดมิน
npm run generate:types      # อัปเดต src/payload-types.ts หลังแก้ schema (อย่าแก้ไฟล์นั้นด้วยมือ)
npm run generate:importmap  # อัปเดต import map ของแอดมิน
npm run migrate             # รัน DB migrations
```

---

## ⚠️ สิ่งที่ต้องทำต่อ (TODO)

### 1. แก้ค่า env ให้ Payload ทำงานได้ (บล็อกอยู่ตอนนี้)
ปัจจุบัน `.env` ยังเป็นค่า mockup และ **ขาดตัวแปรสำคัญ** ที่ `payload.config.ts` ต้องใช้:

- [ ] **`PAYLOAD_SECRET`** — ยังไม่มีในไฟล์ `.env` (`secret: process.env.PAYLOAD_SECRET || ""`)
      ต้องตั้งเป็นสตริงสุ่มยาว ๆ ไม่งั้นแอดมิน/เซสชันจะไม่ปลอดภัย/ใช้ไม่ได้
- [ ] **`DATABASE_URI`** (หรือใช้ `DATABASE_URL` เดิมก็ได้ — config รองรับทั้งคู่)
      ต้องชี้ไป Postgres ที่รันได้จริง ถ้าไม่ใช่ `postgres...` config จะ fallback เป็น SQLite (`file:./payload-dev.db`) สำหรับ dev แบบออฟไลน์
- [ ] อัปเดต `.env.example` / `.env` — ลบส่วนที่อ้างถึง **Prisma** (ถอดออกแล้ว) และเพิ่ม `PAYLOAD_SECRET`, ตัวแปร R2

### 2. ตั้งค่า Cloudflare R2 (สำหรับ production)
ตอนนี้ R2 จะเปิดเฉพาะเมื่อมี `R2_BUCKET` — ถ้าไม่ตั้ง รูปจะถูกเก็บในเครื่อง (หายเมื่อ redeploy)
ต้องเพิ่ม: `R2_BUCKET`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`

### 3. เตรียม DB จริง + รัน migration
- [ ] เตรียม Postgres (เช่น Railway ตามคอมเมนต์ใน config)
- [ ] `npm run generate:types` แล้ว `npm run migrate`
- [ ] สร้างบัญชีแอดมินคนแรก + ลงข้อมูลผลงานจริง (ตอนนี้ยังว่าง — หน้าเว็บจะโชว์ "ยังไม่มีผลงาน")

### 4. ฟีเจอร์ฝั่งหน้าเว็บที่ยังไม่มี (พิจารณาทำเพิ่ม)
- [ ] **กรองตาม category** — มีฟิลด์ `category` แต่หน้า `/portfolio` ยังไม่ทำ filter/แท็บหมวดหมู่
- [ ] **แบ่งหน้า (pagination)** — ตอนนี้ `limit: 60` ตายตัว ถ้าผลงานเกินจะไม่ครบ
- [ ] **เวอร์ชันสองภาษา (TH/EN)** — เว็บหลักรองรับ TH/EN แต่ Portfolio ยังเป็นภาษาเดียว
      (ต้องออกแบบ schema เพิ่ม locale ถ้าต้องการ)
- [ ] **ลิงก์เข้า Portfolio จาก Nav** — ปัจจุบัน `Nav.tsx` **ยังไม่มี** ลิงก์ไป `/portfolio`
      (เข้าถึงได้แค่ผ่านปุ่มใน section พรีวิวบนหน้าแรก) ควรเพิ่มในเมนูหลัก
- [ ] **ให้พรีวิวหน้าแรกตรงกับข้อมูลจริง** — section `portfolio.tsx` ยังดึงรูปจาก i18n
      ควรเปลี่ยนไปดึงผลงานล่าสุดจาก Payload
- [ ] **แสดง `client` / `publishedAt`** บนการ์ดหรือหน้ารายละเอียด (ตอนนี้มีข้อมูลแต่ยังไม่โชว์)
- [ ] ใส่ **JSON-LD** ต่อบทความ (เช่น `Article`/`CreativeWork`) เพื่อ SEO
