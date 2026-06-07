/**
 * Onboarding panel shown at the top of the Payload admin dashboard.
 *
 * A plain Server Component (no client JS) that walks first-time, non-technical
 * Thai editors through publishing a Portfolio post. Registered via
 * `admin.components.beforeDashboard` in payload.config.ts. Styling uses Payload's
 * theme CSS variables so it adapts to light/dark mode automatically.
 */
import type { CSSProperties } from "react";

const steps: { n: string; title: string; body: string }[] = [
  {
    n: "1",
    title: "เปิดเมนู “ผลงาน (Portfolio)”",
    body: "ดูเมนูด้านซ้าย ใต้กลุ่ม “เนื้อหาเว็บไซต์” แล้วกดปุ่ม “สร้างใหม่ (Create New)” ที่มุมขวาบน",
  },
  {
    n: "2",
    title: "กรอกชื่อผลงานและคำโปรย",
    body: "ใส่ชื่อทริป/โครงการ และคำโปรยสั้น ๆ ส่วนช่อง “Slug” เว้นว่างได้ ระบบจะสร้างลิงก์ให้เอง",
  },
  {
    n: "3",
    title: "อัปโหลดรูปปกและรูปในแกลเลอรี",
    body: "ลากรูปมาวางได้เลย ระบบจะย่อขนาดและบีบอัดรูปให้อัตโนมัติทุกครั้ง ไม่ต้องย่อรูปเองก่อน",
  },
  {
    n: "4",
    title: "กด “เผยแพร่ (Publish)”",
    body: "ยังไม่พร้อมก็กด “บันทึกฉบับร่าง” ไว้ก่อนได้ เมื่อพร้อมค่อยกด “เผยแพร่” ให้ขึ้นเว็บจริง",
  },
];

const wrap: CSSProperties = {
  marginBottom: "2rem",
  padding: "1.75rem",
  borderRadius: "12px",
  border: "1px solid var(--theme-elevation-150)",
  background: "var(--theme-elevation-50)",
  borderLeft: "4px solid #c8102e",
};

const headRow: CSSProperties = { display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" };

const grid: CSSProperties = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
};

const card: CSSProperties = {
  padding: "1rem 1.1rem",
  borderRadius: "10px",
  background: "var(--theme-elevation-0)",
  border: "1px solid var(--theme-elevation-100)",
};

const badge: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "26px",
  height: "26px",
  borderRadius: "50%",
  background: "#0d2b5e",
  color: "#fff",
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "0.5rem",
};

const tip: CSSProperties = {
  marginTop: "1.25rem",
  paddingTop: "1rem",
  borderTop: "1px solid var(--theme-elevation-100)",
  fontSize: "13px",
  lineHeight: 1.7,
  color: "var(--theme-elevation-650)",
};

export function Welcome() {
  return (
    <section style={wrap}>
      <div style={headRow}>
        {/* eslint-disable-next-line @next/next/no-img-element -- admin panel, outside the Next image pipeline */}
        <img src="/mascot/journey-love.png" alt="" width={56} height={56} style={{ flexShrink: 0 }} />
        <div>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>ยินดีต้อนรับสู่ระบบจัดการเนื้อหา Journey Life</h2>
          <p style={{ margin: "0.35rem 0 0", fontSize: "14px", color: "var(--theme-elevation-650)" }}>
            ที่นี่คือที่สำหรับเพิ่ม/แก้ไข “ผลงาน (Portfolio)” และรูปภาพที่จะแสดงบนเว็บไซต์ — ทำตาม 4 ขั้นตอนด้านล่างได้เลย
          </p>
        </div>
      </div>

      <div style={grid}>
        {steps.map((s) => (
          <div key={s.n} style={card}>
            <span style={badge}>{s.n}</span>
            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "0.25rem" }}>{s.title}</div>
            <div style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--theme-elevation-650)" }}>{s.body}</div>
          </div>
        ))}
      </div>

      <p style={tip}>
        💡 <strong>เคล็ดลับ</strong> — รูปภาพทุกไฟล์จะถูกย่อขนาดและบีบอัดให้อัตโนมัติ เว็บจึงโหลดเร็วเสมอ ·
        เปลี่ยนภาษาเมนู (ไทย/อังกฤษ) ได้ที่ “บัญชีของฉัน” มุมล่างซ้าย ·
        ติดปัญหาการใช้งานติดต่อทีมพัฒนาได้ที่ <strong>incentive@journeylife.co.th</strong>
      </p>
    </section>
  );
}
