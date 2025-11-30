## Context
โปรเจค Hat Yai Restart ต้องการเพิ่มฟีเจอร์โพสต์หางานทั่วไปเพื่อช่วยเหลือคนในพื้นที่ที่ตกงานหลังน้ำท่วม โดยมีเป้าหมายให้คนสามารถหารายได้เพิ่มและคนที่ต้องการจ้างงานทั่วไปสามารถหาคนทำได้ง่าย

## Goals / Non-Goals
- **Goals**:
  - สร้างแพลตฟอร์มสำหรับโพสต์งานทั่วไปที่ง่ายต่อการใช้งาน
  - รองรับทั้ง 2 ฝั่ง: คนที่ต้องการจ้าง และคนที่ต้องการหางานทำ
  - ให้สามารถระบุค่าจ้างได้
  - มีระบบการติดต่อที่ปลอดภัย
- **Non-Goals**:
  - ไม่ใช่ระบบจัดการจ้างงานแบบพนักงานประจำ
  - ไม่ใช่แพลตฟอร์มสำหรับบริษัทจ้างงานขนาดใหญ่
  - ไม่มีระบบการชำระเงินผ่านระบบ

## Decisions
- **Database Design**: ใช้ประเภทงานที่เป็น dynamic categories แทนที่จะเป็น hardcode เฉพาะงานซ่อม/ล้าง/ขนย้าย
- **User Interface**: แยกฟอร์มสำหรับ 2 ประเภทผู้ใช้ แต่แสดงในรายการเดียวกัน
- **Contact System**: ใช้การแสดงข้อมูลติดต่อแบบ Controlled Access (แสดงเฉพาะเมื่อมีการ Approve)
- **Job Categories**: ใช้ระบบ categories ที่ flexible สามารถเพิ่มได้ง่าย

## Alternatives considered
1. **แยกงานทั่วไปไปเป็น app ใหม่** - ตัดสินใจไม่ทำเพราะเพิ่มความซับซ้อน
2. **ใช้ระบบเดียวกับงานซ่อม/ล้าง** - ตัดสินใจไม่ทำเพราะงานทั่วไปมีลักษณะต่างกัน
3. **ใช้ Platform อื่นเช่น Facebook Group** - ตัดสินใจทำเองเพื่อควบคุมและจัดการข้อมูลได้ดีขึ้น

## Risks / Trade-offs
- **Spam/Scam Jobs** → Mitigation: มีระบบ Report และ Admin Approval
- **ข้อมูลส่วนตัวรั่วไหล** → Mitigation: ใช้ Controlled Access และ Privacy Settings
- **Performance Issues** → Mitigation: ใช้ Database Indexing และ Pagination
- **Feature Creep** → Mitigation: เน้นเฉพาะฟีเจอร์จำเป็นตาม MVP

## Migration Plan
1. เพิ่มตารางใหม่สำหรับ job categories
2. อัปเดตตาราง jobs ให้รองรับข้อมูลใหม่
3. สร้าง UI components ใหม่
4. อัปเดต API endpoints
5. ทดสอบและทำ Validation

## Open Questions
- จำเป็นต้องมีระบบ Rating/Review หรือไม่?
- ควรมีระบบ Geolocation สำหรับงานทั่วไปหรือไม่?
- จะจัดการกับ Jobs ที่过期 อย่างไร?