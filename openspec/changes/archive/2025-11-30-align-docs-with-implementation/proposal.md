# Change: ปรับเอกสารให้สอดคล้องกับสถานะปัจจุบันของโปรเจค

## Why
เอกสารโปรเจคระบุความต้องการสูง (Next.js PWA พร้อม Supabase, Turso, Maps) แต่ในความเป็นจริงมีเพียง React+Vite UI prototype เท่านั้น ทำให้เกิดความสับสนและไม่สามารถวางแผนการพัฒนาต่อได้อย่างชัดเจน

## What Changes
- **ปรับเปลี่ยนขอบเขตโปรเจค**ให้สอดคล้องกับสถานะปัจจุบัน (UI prototype)
- **สร้างแผนพัฒนาขั้นต่ำ**ที่สามารถทำได้จริง
- **ย้ายความต้องการขั้นสูง**ไปเป็นส่วนขยายในอนาคต
- **กำหนด MVP (Minimum Viable Product)**ที่ชัดเจน

## Impact
- Affected specs: `project-docs`, `technical-requirements`
- Affected code: ทุกไฟล์ในโปรเจค (เนื่องจากการเปลี่ยนขอบเขต)
- External dependencies: ลดขนาด dependency ที่ไม่จำเป็น
- Development timeline: ปรับเป็นแผน 3 เดือนแทน 6 เดือน