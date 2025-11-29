# Product Requirements Document (PRD): Hat Yai Restart

| Attribute | Details |
| :--- | :--- |
| **Project Name** | Hat Yai Restart (รวมพลังกู้คืนหาดใหญ่) |
| **Version** | 1.1.0 |
| **Status** | Updated |
| **Author** | John (PM) |
| **Date** | 2025-11-29 |

## 1. Goals and Background Context

### Goals
* **Centralized Recovery Platform:** พัฒนา Web Application (PWA) ที่เป็นศูนย์กลางข้อมูลและการจัดการทรัพยากรสำหรับการฟื้นฟูเมืองหาดใหญ่หลังน้ำท่วม
* **Effective Matching:** สร้างระบบจับคู่ความช่วยเหลือที่รวดเร็วระหว่างผู้ประสบภัยและช่าง/จิตอาสา ลดปัญหาการขาดแคลนแรงงานและการโก่งราคา
* **Waste Management Optimization:** ใช้ระบบ Heatmap และ Crowdsourcing เพื่อระบุจุดขยะตกค้าง ช่วยให้หน่วยงานท้องถิ่นบริหารจัดการรถเก็บขยะได้อย่างมีประสิทธิภาพ
* **Smart Donation:** ลดปัญหาของบริจาคล้นและขาดแคลนด้วยระบบ Matching ตามความต้องการจริง (Demand-Supply)
* **Sustainable Model:** วางโครงสร้างเพื่อรองรับโมเดล Social Enterprise ในระยะยาว (CSR, Affiliate, Service Marketplace)

### Background Context
หลังเหตุการณ์น้ำท่วมใหญ่ เมืองหาดใหญ่เผชิญวิกฤตการฟื้นฟูที่ซับซ้อน ทั้งขยะชิ้นใหญ่ล้นเมือง การขาดแคลนช่างซ่อมแซม และการกระจายของบริจาคที่ไม่ทั่วถึง แม้ภาครัฐจะดำเนินการอยู่ แต่ยังขาดเครื่องมือที่เชื่อมโยงภาคประชาชนและเอกชนเข้าด้วยกันแบบ Real-time "Hat Yai Restart" จึงถูกพัฒนาขึ้นเพื่อเป็น Platform กลางที่เน้นความเร็ว (Speed), การเข้าถึงง่าย (Accessibility), และข้อมูลที่แม่นยำ (Data-Driven) เพื่อเร่งกระบวนการฟื้นฟูเมือง

### Change Log
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-11-29 | 1.1.0 | Updated to reflect actual project status (React + Vite) | AI Assistant |
| 2025-11-29 | 1.0.0 | Initial PRD Creation | John (PM) |

## 2. Requirements

### Functional Requirements
* **FR1 - User Authentication:** ระบบรองรับการเข้าสู่ระบบผ่าน **Google Account (Gmail)** เท่านั้นในระยะแรก โดยใช้ **Supabase Auth** และแบ่งสิทธิ์ผู้ใช้เป็น 3 กลุ่ม: Requester (ผู้ประสบภัย), Provider (ช่าง/จิตอาสา), Admin
* **FR2 - Job Posting & Management:** ผู้ประสบภัยสามารถสร้างคำร้อง (Job) ระบุประเภทงาน (ล้าง/ซ่อม/ขนย้าย) แนบรูปภาพ และพิกัด GPS ได้
* **FR3 - Price Guideline:** ระบบต้องแสดง "ราคากลางแนะนำ" สำหรับงานแต่ละประเภทเพื่อให้ผู้ใช้รับทราบก่อนตกลงจ้าง
* **FR4 - Provider Job Acceptance:** ผู้ให้บริการสามารถดูรายการงาน (Job Feed) คัดกรองตามระยะทาง และกดรับงานเพื่ออัปเดตสถานะได้
* **FR5 - Waste Reporting (Heatmap):** ผู้ใช้สามารถถ่ายรูปและปักหมุดจุดขยะชิ้นใหญ่ ระบบแสดงผลรวมเป็น Heatmap บนแผนที่
* **FR6 - Donation Wishlist:** ผู้ประสบภัยสร้างรายการของที่ต้องการ และผู้บริจาคเลือกส่งของตามรายการได้
* **FR7 - Emergency Directory:** หน้ารวมเบอร์โทรฉุกเฉินพร้อมปุ่ม Tap-to-Call

### Non-Functional Requirements
* **NFR1 - PWA Standard:** ระบบต้องทำงานเป็น Progressive Web Application ติดตั้งได้บน Home Screen และทำงานได้ดีบน Mobile Browser
* **NFR2 - Low Bandwidth Optimization:** หน้าเว็บต้องโหลดเสร็จภายใน 3 วินาที (FCP) บนเครือข่าย 3G/4G
* **NFR3 - Accessibility:** รองรับมาตรฐาน WCAG AA เน้น Contrast และขนาดตัวอักษรสำหรับผู้สูงอายุ
* **NFR4 - Data Privacy:** ข้อมูลส่วนตัว (เบอร์โทร, ที่อยู่ละเอียด) จะเปิดเผยต่อคู่กรณีเมื่อมีการจับคู่งานสำเร็จแล้วเท่านั้น

## 3. User Interface Design Goals

### Overall UX Vision
"Clean, Fast, Trustworthy" - เน้นความเรียบง่าย ลดขั้นตอนการกรอกข้อมูล (Minimal Input) และใช้ Visual นำสายตา

### Key Interaction Paradigms
* **Card-based Design:** สำหรับแสดงรายการงานและของบริจาค เพื่อให้อ่านง่ายบนมือถือ
* **Map-centric Interface:** สำหรับการดูภาพรวมจุดขยะและงานใกล้ตัว
* **Tap-to-Call:** ปุ่มโทรออกขนาดใหญ่สำหรับกรณีฉุกเฉิน

### Core Screens
1.  **Landing / Dashboard:** เมนูหลักเข้าถึงฟีเจอร์สำคัญ และสถานะงานปัจจุบัน
2.  **Quick Post:** ฟอร์มแจ้งงาน/ขยะ แบบ Step-by-step
3.  **Map View:** แผนที่แสดง Pin งานและ Heatmap ขยะ
4.  **Job List & Detail:** รายการงานพร้อมตัวกรองระยะทาง
5.  **Emergency Page:** รายชื่อเบอร์โทรฉุกเฉินแยกหมวดหมู่

### Target Platforms
* **Mobile First Web (Responsive)** รองรับ iOS และ Android

## 4. Technical Assumptions

### Cloud & Infrastructure
* **Hosting:** Vercel (Frontend)
* **Database:** ยังไม่ได้กำหนด (อยู่ระหว่างการพิจารณา: Turso หรือ Supabase)
* **Auth:** ยังไม่ได้ implement (วางแผนใช้ Supabase Auth หรือ Google Auth)

### Frontend
* **Framework:** React 18 + Vite
* **Language:** TypeScript
* **Styling:** Tailwind CSS + shadcn/ui
* **Routing:** React Router DOM
* **State Management:** React Hook Form + Zod
* **Maps:** **OpenStreetMap** (วางแผนใช้ Leaflet/MapLibre)
* **Navigation:** Deep Link to Google Maps App

### Backend
* **Architecture:** ยังไม่ได้ implement (วางแผนใช้ Serverless Functions บน Vercel)
* **Repo Structure:** Monorepo (Frontend-focused)

## 5. Epic List

* **Epic 1: Foundation & Identity:** เตรียม Project Structure, Database, Auth และ Dashboard พื้นฐาน
* **Epic 2: Marketplace - Requester Focus:** ระบบโพสต์งาน, ระบุพิกัด, และจัดการงานฝั่งผู้ประสบภัย
* **Epic 3: Marketplace - Provider Focus:** ระบบค้นหางาน, รับงาน, และอัปเดตสถานะฝั่งช่าง/จิตอาสา
* **Epic 4: Mapping & Waste Management:** ระบบแผนที่ Heatmap, แจ้งจุดขยะ, และนำทาง
* **Epic 5: Donation & Emergency:** ระบบ Wishlist ของบริจาค และสมุดโทรศัพท์ฉุกเฉิน

## 6. Epic Details

### Epic 1: Foundation & Identity
**Goal:** วางรากฐานทางเทคนิค ติดตั้งเครื่องมือ และสร้างหน้าแรกให้ใช้งานได้
* **Story 1.1 Project Initialization (COMPLETED):**
    * **As a** Developer, **I want** to initialize the React + Vite project with Tailwind, shadcn/ui, **so that** the development environment is ready.
    * **AC:** ✅ Vite app runs locally, components and styling work correctly.
* **Story 1.2 Authentication Setup (PENDING):**
    * **As a** User, **I want** to login with my Google Account, **so that** I can access the platform securely.
    * **AC:** ⏳ Login with Google via Supabase works, User profile is created in database.
* **Story 1.3 Layout & Dashboard UI (PENDING):**
    * **As a** User, **I want** to see a clean Dashboard with main menu options, **so that** I can navigate to different services.
    * **AC:** ⏳ Responsive Layout with main navigation, Dashboard shows menu cards.

### Epic 2: Marketplace - Requester Focus
**Goal:** ให้ผู้ประสบภัยสามารถขอความช่วยเหลือได้สำเร็จ
* **Story 2.1 Job Data Model & API (PENDING):**
    * **As a** Developer, **I want** to define the Job schema and create CRUD APIs, **so that** job data can be stored.
    * **AC:** ⏳ Schema includes title, type, photos, location, status. API endpoints work.
* **Story 2.2 Job Posting UI (PENDING):**
    * **As a** Requester, **I want** to post a job request with photos and location, **so that** I can find help.
    * **AC:** ⏳ Form allows job type, photo upload, GPS location, saving to database.
* **Story 2.3 My Requests View (PENDING):**
    * **As a** Requester, **I want** to see the status of my posted jobs, **so that** I know if someone has accepted help.
    * **AC:** ⏳ List view of own jobs with status tags (Waiting, In Progress, Done).

### Epic 3: Marketplace - Provider Focus
**Goal:** ให้ช่างและจิตอาสาสามารถค้นหาและรับงานได้
* **Story 3.1 Job Feed & Filter (PENDING):**
    * **As a** Provider, **I want** to see available jobs sorted by distance, **so that** I can choose jobs nearby.
    * **AC:** ⏳ List of 'Waiting' jobs, calculated distance from user, filter by job category.
* **Story 3.2 Job Acceptance Logic (PENDING):**
    * **As a** Provider, **I want** to accept a job, **so that** I can start working and the requester knows I'm coming.
    * **AC:** ⏳ Clicking 'Accept' updates job status to 'In Progress', assigns Provider ID to Job.
* **Story 3.3 Job Completion (PENDING):**
    * **As a** Provider, **I want** to mark a job as complete, **so that** the work is recorded.
    * **AC:** ⏳ Button to complete job, updates status to 'Done'.

### Epic 4: Mapping & Waste Management
**Goal:** จัดการข้อมูลพิกัดและแสดงผล Heatmap ขยะ
* **Story 4.1 Map Component Integration (PENDING):**
    * **As a** User, **I want** to see an interactive map (OpenStreetMap), **so that** I can visualize locations.
    * **AC:** ⏳ Leaflet/MapLibre component renders correctly, supports markers and basic interaction.
* **Story 4.2 Waste Reporting (PENDING):**
    * **As a** User, **I want** to pin a waste pile location with a photo, **so that** authorities can collect it.
    * **AC:** ⏳ Form to submit waste report, saves geolocated data to database.
* **Story 4.3 Heatmap Visualization (PENDING):**
    * **As a** User, **I want** to see a heatmap of waste reports, **so that** I can see critical areas.
    * **AC:** ⏳ Map renders heatmap layer based on density of waste reports.
* **Story 4.4 Navigation Deep Link (PENDING):**
    * **As a** Provider, **I want** to click a button to navigate to a job/waste location, **so that** I can drive there easily.
    * **AC:** ⏳ 'Navigate' button opens Google Maps App with destination coordinates.

### Epic 5: Donation & Emergency
**Goal:** ฟีเจอร์เสริมเพื่อความครบถ้วน (Wishlist & Contacts)
* **Story 5.1 Emergency Directory (PENDING):**
    * **As a** User, **I want** to see a list of emergency numbers and call them instantly, **so that** I can get urgent help.
    * **AC:** ⏳ Static page with categorized numbers, Tap-to-call functionality implemented.
* **Story 5.2 Donation Wishlist (PENDING):**
    * **As a** Requester, **I want** to list items I need, **so that** donors can send the right things.
    * **AC:** ⏳ Simple CRUD for 'Wishlist Items', Public view for donors to see needs.
