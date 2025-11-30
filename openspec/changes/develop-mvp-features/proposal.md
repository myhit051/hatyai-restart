# Change: Develop Hat Yai Restart - Flood Recovery Platform

## Why
Hat Yai Restart เป็น Web Application สำคัญสำหรับเป็นแพลตฟอร์มกลางบริหารจัดการทรัพยากรและการช่วยเหลือช่วงฟื้นฟูหาดใหญ่หลังน้ำท่วม ตอนนี้มีโครงสร้างพื้นฐานพร้อมแต่ยังขาดฟีเจอร์หลักที่จำเป็นเพื่อแก้ไขปัญหาคอขวด 3 ด้าน: ช่างซ่อมแซมขาดแคลน, ขยะชิ้นใหญ่ล้นเมือง, และการกระจายของบริจาคไม่ตรงจุด

## What Changes
- พัฒนา Repair Services Marketplace - ตลาดกลางหาช่างซ่อมแซมและจัดการคำขอซ่อม
- พัฒนา Waste Management System - ระบบรายงานและจัดการขยะชิ้นใหญ่/วัสดุฟื้นฟู
- พัฒนา Relief Resource Distribution - ระบบกระจายของบริจาคและทรัพยากรฟื้นฟู
- พัฒนา User Management & Roles - ระบบจัดการผู้ใช้ (ผู้ประสพภัย, อาสาสมัคร, ช่าง, ผู้บริจาค)
- **BREAKING** อาจมีการปรับโครงสร้าง navigation และ routing ใหม่

## Impact
- Affected specs: mvp-features, ui-prototype
- Affected code: src/pages/*, src/components/*, src/App.tsx, routing system
- Dependencies: ต้องเพิ่ม state management, authentication system, database integration