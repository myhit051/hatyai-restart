# Project Context

## Purpose
โปรเจค Hat Yai Restart (รวมพลังกู้คืนหาดใหญ่) เป็น Progressive Web Application (PWA) สำหรับเป็นศูนย์กลางข้อมูลและการจัดการทรัพยากรสำหรับการฟื้นฟูเมืองหาดใหญ่หลังน้ำท่วม สร้างขึ้นเพื่อเชื่อมโยงความช่วยเหลือระหว่างผู้ประสบภัยและช่าง/จิตอาสา บริหารจัดการขยะ และจัดการการบริจาคสิ่งของอย่างมีประสิทธิภาพ

## Tech Stack
- **Frontend**: Next.js (App Router) + TypeScript
- **UI Components**: shadcn/ui + Tailwind CSS
- **Hosting**: Vercel (Frontend & API Routes)
- **Database**: Turso (libSQL) - Distributed SQLite for high read performance
- **Authentication**: Supabase Auth (Google Provider only)
- **Maps**: OpenStreetMap (via Leaflet/MapLibre) for display
- **Navigation**: Deep Link to Google Maps App
- **Architecture**: Serverless Functions (Next.js API Routes), Monorepo

## Project Conventions

### Code Style
- ใช้ TypeScript สำหรับ type safety
- Component names ใช้ PascalCase
- File names ใช้ kebab-case
- ใช้ Prettier สำหรับ formatting
- ใช้ ESLint rules ที่กำหนดไว้

### Architecture Patterns
- Serverless Functions (Next.js API Routes)
- Component-based architecture
- Custom hooks สำหรับ state management
- Props drilling สำหรับข้อมูลที่ไม่ซับซ้อน
- Context API สำหรับ global state (ถ้าจำเป็น)
- Progressive Web Application (PWA) standards

### Testing Strategy
- Unit testing สำหรับ utilities และ custom hooks
- Component testing สำหรับ UI components
- E2E testing สำหรับ user flows (ในอนาคต)
- Manual testing สำหรับ UI/UX ในปัจจุบัน
- Performance testing สำหรับ PWA standards (FCP < 3 seconds on 3G/4G)

### Git Workflow
- Main branch: `main`
- Feature branches: `feature/feature-name`
- Commit format: `feat: add feature description`
- PRs require review ก่อน merge

## Domain Context
โปรเจคนี้มุ่งเน้นการฟื้นฟูเมืองหาดใหญ่หลังน้ำท่วม ประกอบด้วยฟีเจอร์หลัก 5 ส่วน:

### 1. User Authentication & Management
- ผู้ใช้ 3 กลุ่ม: Requester (ผู้ประสบภัย), Provider (ช่าง/จิตอาสา), Admin
- Login ผ่าน Google Account (Gmail) ด้วย Supabase Auth

### 2. Marketplace System
- การโพสต์และจับคู่งาน (Job Matching): ล้าง/ซ่อม/ขนย้าย
- ระบบราคากลางแนะนำสำหรับแต่ละประเภทงาน
- การกรองและค้นหางานตามระยะทาง
- การอัปเดตสถานะงาน (Waiting, In Progress, Done)

### 3. Mapping & Waste Management
- แผนที่แสดงตำแหน่งงานและ Heatmap ของขยะ
- ระบบแจ้งจุดขยะชิ้นใหญ่ (Waste Reporting)
- การนำทางไปยังสถานที่ (Deep Link to Google Maps)

### 4. Donation Management
- ระบบ Wishlist ของสิ่งของที่ผู้ประสบภัยต้องการ
- การจับคู่ความต้องการกับผู้บริจาค (Demand-Supply Matching)

### 5. Emergency Directory
- รายชื่อเบอร์โทรฉุกเฉินแยกหมวดหมู่
- ปุ่ม Tap-to-Call สำหรับการโทรด่วน

## Important Constraints
- **Budget**: Limited budget - ต้องใช้ free/low-cost solutions
- **Timeline**: 3 months for MVP, 6 months for full features
- **Team**: Small team (1-3 developers)
- **Performance**: หน้าเว็บต้องโหลดเสร็จภายใน 3 วินาที (FCP) บนเครือข่าย 3G/4G
- **Accessibility**: รองรับมาตรฐาน WCAG AA เน้น Contrast และขนาดตัวอักษรสำหรับผู้สูงอายุ
- **Data Privacy**: ข้อมูลส่วนตัว (เบอร์โทร, ที่อยู่ละเอียด) เปิดเผยต่อคู่กรณีเมื่อมีการจับคู่งานสำเร็จแล้วเท่านั้น
- **Platform**: PWA ที่ทำงานได้ดีบน Mobile Browser และติดตั้งได้บน Home Screen
- **Technical**: Should work on modern browsers (Chrome, Firefox, Safari, Edge)

## Current Status
- **Progress**: Project Planning & Specification Phase (PRD v1.0.0 approved)
- **Epic Structure**: 5 Epics ที่วางแผนไว้ครบถ้วน (Foundation, Marketplace Requester, Marketplace Provider, Mapping, Donation)
- **Next Steps**: เริ่ม Epic 1: Foundation & Identity - Project Initialization, Authentication Setup, Dashboard UI
- **Ready to Implement**: Stories 1.1-1.3 มี Acceptance Criteria ที่ชัดเจน

## External Dependencies
- **UI Icons**: Lucide React
- **Maps**: OpenStreetMap (via Leaflet/MapLibre) for display, Google Maps for navigation
- **Authentication**: Supabase Auth (Google Provider only)
- **Database**: Turso (libSQL) - Distributed SQLite for high read performance
- **Hosting**: Vercel (Frontend & API Routes)

## Key Design Principles
- **UX Vision**: "Clean, Fast, Trustworthy" - เน้นความเรียบง่าย ลดขั้นตอนการกรอกข้อมูล (Minimal Input) และใช้ Visual นำสายตา
- **Mobile First**: Card-based Design สำหรับอ่านง่ายบนมือถือ
- **Map-centric Interface**: สำหรับการดูภาพรวมจุดขยะและงานใกล้ตัว
- **Low Bandwidth Optimization**: หน้าเว็บต้องโหลดเสร็จภายใน 3 วินาทีบนเครือข่าย 3G/4G
