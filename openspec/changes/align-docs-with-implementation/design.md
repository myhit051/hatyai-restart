## Context
โปรเจค Hatyai มี documentation ที่ระบุว่าเป็น Next.js PWA พร้อมฟีเจอร์ขั้นสูง (authentication, database, maps) แต่ในความเป็นจริงมีเพียง React+Vite UI prototype พื้นฐาน ความไม่ตรงกันนี้ทำให้:
- ทีม dev สับสนเกี่ยวกับขอบเขตงาน
- ไม่สามารถวางแผนการพัฒนาได้อย่างมีประสิทธิภาพ
- มี dependency ที่ไม่ได้ใช้จึงทำให้โปรเจครก
- ไม่สามารถประเมินความคืบหน้าได้ถูกต้อง

## Goals / Non-Goals
**Goals:**
- ทำให้เอกสารสอดคล้องกับสถานะปัจจุบัน
- สร้างแผนพัฒนาที่สมจริงและทำได้จริง
- ลดความซับซ้อนลงเพื่อให้ทีมสามารถทำงานต่อได้
- กำหนด MVP ที่ชัดเจนพร้อม timeline

**Non-Goals:**
- ไม่ได้ลบฟีเจอร์ขั้นสูงถาวร แต่ย้ายไปเป็น future enhancement
- ไม่เปลี่ยน core technology (React + TypeScript)
- ไม่ลดคุณภาพของ UI ที่มีอยู่แล้ว

## Decisions
**Decision: ใช้ Incremental Development Approach**
- เริ่มจาก UI prototype ที่มีอยู่แล้ว
- เพิ่มฟีเจอร์ทีละน้อยตาม priority
- ใช้ technology stack ที่เรียบง่ายในเบื้องต้น

**Alternatives considered:**
- **Full Rewrite**: ใช้ Next.js ตั้งแต่เริ่ม - ยากเกินไป ใช้เวลานาน
- **Keep Current Stack**: ใช้ Vite แต่เพิ่มฟีเจอร์ - ดีที่สุดสำหรับทีมขนาดเล็ก
- **Hybrid Approach**: ค่อยๆ migrate ไป Next.js - ซับซ้อนเกินไปในปัจจุบัน

## Risks / Trade-offs
**Technical Risks:**
- Vite อาจไม่ support PWA features ดีเท่า Next.js → แก้ไขด้วย plugin และ manual configuration
- Performance อาจไม่ดีเท่า Next.js SSR → แก้ไขด้วย optimization techniques

**Business Risks:**
- ความคาดหวังของ stakeholders อาจสูงเกินไป → ต้องสื่อสารใหม่
- Timeline อาจยาวขึ้นจากที่คาดไว้ → ต้องปรับเป้าหมายให้สมจริง

**Trade-offs:**
- **Speed vs Features**: เลือกความเร็วในการ ship MVP แทนฟีเจอร์ครบ
- **Simplicity vs Scalability**: เลือกความเรียบง่ายในปัจจุบันแทน scalability ในอนาคต

## Migration Plan
**Phase 1: Align Documentation (Week 1)**
- อัปเดตเอกสารให้ตรงกับ reality
- สร้าง spec สำหรับ MVP features
- ขออนุมัติจาก stakeholders

**Phase 2: Cleanup & Optimize (Week 2)**
- ลบ dependencies ที่ไม่ใช้
- Optimize โครงสร้างโปรเจค
- Setup CI/CD พื้นฐาน

**Phase 3: Incremental Development (Week 3-12)**
- Add authentication (basic)
- Add basic data persistence
- Add map integration (สำหรับหาที่อยู่ในหาดใหญ่)
- Prepare for PWA features

## Open Questions
- ต้องการ authentication system แบบไหน (social login, email/password)?
- Database ที่เหมาะสมคืออะไร (local storage, simple API, full backend)?
- จำเป็นต้องมี offline capabilities ใน MVP หรือไม่?
- Budget และ timeline ที่แท้จริงสำหรับโปรเจคนี้คือเท่าไหร่?