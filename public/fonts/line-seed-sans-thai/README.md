# LINE Seed Sans Thai — Self-hosted font files

วางไฟล์ฟอนต์ (`.woff2`) ของ **LINE Seed Sans Thai** ในโฟลเดอร์นี้ เพื่อให้ Next.js เสิร์ฟแบบ self-hosted (ไม่ดึงจาก CDN ภายนอก)

## ดาวน์โหลด

ทางการ (SIL OFL 1.1, ใช้ฟรีรวมเชิงพาณิชย์):

- เว็บ: https://seed.line.me/index_en.html
- GitHub: https://github.com/line/LINE-Seed-Sans-TH

เลือก format **WOFF2** สำหรับ web

## ไฟล์ที่ต้องวาง

```
public/fonts/line-seed-sans-thai/
├── LINESeedSansTH_W_Th.woff2     (weight 200 — Thin)
├── LINESeedSansTH_W_Rg.woff2     (weight 400 — Regular)
├── LINESeedSansTH_W_Bd.woff2     (weight 700 — Bold)
└── LINESeedSansTH_W_He.woff2     (weight 800 — Heavy)
```

ชื่อไฟล์ตรงกับ `src/app/layout.tsx` หากเปลี่ยนชื่อ ต้องแก้ใน layout.tsx ด้วย

## Fallback ระหว่างยังไม่มีไฟล์

`globals.css` มี `@font-face` จาก CDN (`fonts.cdnfonts.com`) เป็น fallback เพื่อให้ render ได้ทันที — แต่ production ควรใช้ self-hosted เพื่อ performance/privacy
