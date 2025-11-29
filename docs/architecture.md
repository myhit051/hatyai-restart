# Architecture Document: Hat Yai Restart

| Attribute | Details |
| :--- | :--- |
| **Project Name** | Hat Yai Restart |
| **Version** | 1.1.0 |
| **Status** | Updated |
| **Author** | Winston (Architect) |
| **Date** | 2025-11-29 |

## 1. Introduction
เอกสารนี้ระบุโครงสร้างสถาปัตยกรรมสำหรับโปรเจกต์ "Hat Yai Restart" ซึ่งเป็น Progressive Web Application (PWA) สำหรับบริหารจัดการฟื้นฟูเมืองหาดใหญ่ โดยเน้นสถาปัตยกรรมแบบ **Modern SPA with Serverless Backend** เพื่อความรวดเร็วในการพัฒนา (Time-to-market) และต้นทุนต่ำ (Cost-effective) ในช่วงเริ่มต้น

### Key Decisions
* **Frontend:** ใช้ **React + Vite** แทน Next.js เพื่อความเร็วในการ Development และ Build ขนาดเล็กกว่า
* **Database:** ยังอยู่ระหว่างการพิจารณาระหว่าง **Turso (libSQL)** และ **Supabase (PostgreSQL)** เพื่อประสิทธิภาพและความง่ายในการตั้งค่า
* **Maps:** วางแผนใช้ **OpenStreetMap** (Leaflet/MapLibre) เพื่อลดค่าใช้จ่าย API และใช้ Google Maps เฉพาะการ Deep Link นำทาง
* **Auth:** วางแผนใช้ **Supabase Auth** จัดการ Identity แต่ยังไม่ได้ implement ในปัจจุบัน

## 2. High Level Architecture

### System Overview
ระบบทำงานบนสถาปัตยกรรม **React SPA + Vite** ที่โฮสต์บน **Vercel** โดยมีส่วนประกอบหลักดังนี้:

```mermaid
graph TD
    User[User (Mobile/Desktop)] -->|HTTPS| CDN[Vercel Edge Network]
    CDN -->|Static Assets| Storage[Vercel Assets]
    CDN -->|SPA Files| React[React SPA (Vite Build)]

    subgraph "Future Backend Layer (Serverless Functions)"
        React[React SPA] -->|API Calls| API[API Routes]
        API -->|Auth Check| Supabase[Supabase Auth (Planned)]
        API -->|Data Query| DB[(Database - TBD)]
    end

    subgraph "External Services"
        React -->|Tiles| OSM[OpenStreetMap Server (Planned)]
        React -->|Deep Link| GMap[Google Maps App (Planned)]
    end
```

**Current Status:**
- ✅ Frontend SPA พร้อม UI Components
- ❌ Backend API (ยังไม่ได้ implement)
- ❌ Database (ยังไม่ได้ implement)
- ❌ Auth (ยังไม่ได้ implement)
- ❌ Maps (ยังไม่ได้ implement)

## 3. Tech Stack

| Category | Technology | Version | Status | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Framework** | React + Vite | 18.x / 5.x | ✅ Implemented | เร็วใน Development, Build ขนาดเล็ก, Ecosystem ใหญ่ |
| **Language** | TypeScript | 5.x | ✅ Implemented | Type safety ลดบั๊กขณะพัฒนา |
| **Database** | TBD (Turso/Supabase) | - | ❌ Not Implemented | กำลังพิจารณา: Turso (libSQL) หรือ Supabase (PostgreSQL) |
| **ORM** | TBD (Drizzle/Prisma) | - | ❌ Not Implemented | ขึ้นอยู่กับ Database ที่เลือก |
| **Auth** | TBD (Supabase Auth) | - | ❌ Not Implemented | วางแผนใช้ Google OAuth ผ่าน Supabase |
| **Styling** | Tailwind CSS | 3.x | ✅ Implemented | Utility-first, พัฒนา UI ได้รวดเร็ว |
| **UI Library** | shadcn/ui | Latest | ✅ Implemented | สวยงาม, Accessible, Copy-paste components |
| **Routing** | React Router DOM | 6.x | ✅ Implemented | Client-side routing สำหรับ SPA |
| **Forms** | React Hook Form + Zod | 7.x / 3.x | ✅ Implemented | Form validation ที่แข็งแกร่ง |
| **State Mgmt** | React Query | 5.x | ✅ Implemented | Server state management และ caching |
| **Maps** | TBD (Leaflet/MapLibre) | - | ❌ Not Implemented | วางแผนใช้ OpenStreetMap สำหรับแผนที่ |
| **Deployment** | Vercel | - | ✅ Implemented | Zero-config deployment สำหรับ React SPA |

## 4. Data Models (Schema Design - Planned)

**สถานะปัจจุบัน:** ยังไม่ได้ implement Database และ ORM (อยู่ระหว่างการพิจารณา Turso vs Supabase)

วางแผนใช้ **Drizzle ORM** (สำหรับ Turso) หรือ **Prisma** (สำหรับ Supabase) ในการประกาศ Schema โดยมีตารางหลักดังนี้:

### 4.1 Users Table (`users`) - Planned
เก็บข้อมูลผู้ใช้งานที่ Sync มาจาก Supabase Auth
* `id` (TEXT, PK): ตรงกับ Supabase User ID
* `email` (TEXT): อีเมล
* `role` (TEXT): 'requester' | 'provider' | 'admin'
* `phone` (TEXT): เบอร์ติดต่อ (Optional)
* `display_name` (TEXT): ชื่อที่แสดง
* `created_at` (INT): Timestamp

### 4.2 Jobs Table (`jobs`) - Planned
เก็บข้อมูลการจ้างงาน/ขอความช่วยเหลือ
* `id` (INTEGER, PK, AutoInc)
* `requester_id` (TEXT, FK -> users.id)
* `provider_id` (TEXT, FK -> users.id, Nullable): ช่างที่รับงาน
* `title` (TEXT): หัวข้อ (เช่น "ซ่อมปลั๊กไฟ")
* `category` (TEXT): 'cleaning' | 'repair' | 'transport'
* `description` (TEXT)
* `status` (TEXT): 'waiting' | 'in_progress' | 'done' | 'cancelled'
* `lat` (REAL): ละติจูด
* `lng` (REAL): ลองจิจูด
* `image_url` (TEXT): รูปหน้างาน
* `price_estimate` (TEXT): ราคากลางที่ระบบแนะนำ
* `created_at` (INT)

### 4.3 Waste Reports Table (`waste_reports`) - Planned
เก็บข้อมูลจุดขยะ
* `id` (INTEGER, PK, AutoInc)
* `reporter_id` (TEXT, FK -> users.id)
* `image_url` (TEXT)
* `lat` (REAL)
* `lng` (REAL)
* `status` (TEXT): 'reported' | 'cleared'
* `created_at` (INT)

### 4.4 Wishlist Table (`wishlist_items`) - Planned
เก็บรายการของที่ต้องการ
* `id` (INTEGER, PK, AutoInc)
* `user_id` (TEXT, FK -> users.id)
* `item_name` (TEXT)
* `quantity` (INTEGER)
* `unit` (TEXT)
* `is_fulfilled` (BOOLEAN)

## 5. API Design (Planned Serverless Functions)

**สถานะปัจจุบัน:** ยังไม่ได้ implement API และ Backend

วางแผนใช้ **Serverless Functions** บน Vercel หรือ **API Routes** สำหรับการจัดการข้อมูล โดย Frontend จะใช้ **React Query** ในการเรียก API และ **React Hook Form** สำหรับ Form Submission

### Planned API Endpoints:
* `POST /api/auth/login`: Google OAuth ผ่าน Supabase
* `POST /api/auth/callback`: OAuth Callback
* `GET /api/auth/me`: Get current user profile

#### Jobs API:
* `GET /api/jobs`: ดึงรายการงาน (รองรับ Query param: lat, lng, category)
* `POST /api/jobs`: สร้างงานใหม่
* `PUT /api/jobs/:id/accept`: ช่างกดรับงาน
* `PUT /api/jobs/:id/complete`: ปิดงาน
* `GET /api/jobs/my`: ดึงรายการงานของผู้ใช้ปัจจุบัน

#### Waste Management API:
* `GET /api/waste`: ดึงรายการจุดขยะสำหรับ Heatmap
* `POST /api/waste`: แจ้งพิกัดขยะ
* `PUT /api/waste/:id/clear`: ทำเครื่องหมายว่าขยะถูกเก็บแล้ว

#### Donation API:
* `GET /api/wishlist`: ดึงรายการของที่ต้องการทั้งหมด
* `POST /api/wishlist`: เพิ่มรายการของที่ต้องการ
* `PUT /api/wishlist/:id/fulfill`: ทำเครื่องหมายว่าได้รับการบริจาคแล้ว

### Authentication & Security:
* ใช้ JWT Token จาก Supabase Auth
* API Middleware ตรวจสอบ Authorization Header
* Zod Validation สำหรับทุก Request Body

## 6. Frontend Architecture (Current Implementation)

### Directory Structure
```text
src/
├── main.tsx                # App entry point
├── App.tsx                 # Main app component
├── components/
│   ├── ui/                 # ✅ shadcn/ui components (Button, Card, etc.)
│   ├── forms/              # Form components (React Hook Form)
│   └── pages/              # Page components (Planned)
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── styles/                 # CSS/Tailwind files
└── types/                  # TypeScript interfaces (Planned)
```

**Current Status:**
- ✅ Base React + Vite setup
- ✅ shadcn/ui components installed
- ✅ Tailwind CSS configured
- ✅ React Router DOM for routing
- ✅ React Hook Form + Zod for forms
- ✅ React Query for state management
- ❌ Pages/Components for specific features (Not implemented)
- ❌ Database integration (Not implemented)
- ❌ Authentication flow (Not implemented)

### Map Integration Strategy (Planned)
**สถานะปัจจุบัน:** ยังไม่ได้ implement Map components

วางแผนการทำงานดังนี้:
* ใช้ `react-leaflet` เป็นตัวแสดงผล OpenStreetMap
* **Optimization:** การโหลด Heatmap จะไม่โหลด Marker ทุกจุดหากมีจำนวนมาก แต่จะใช้ Library `leaflet.heat` เพื่อ Render สีแทน
* **User Location:** ใช้ Browser Geolocation API (`navigator.geolocation`) เพื่อระบุตำแหน่งปัจจุบัน
* **Performance:** ใช้ Virtualization สำหรับจำนวน Markers ที่มาก
* **Deep Linking:** ใช้ Google Maps URL scheme เพื่อเปิดแอปนำทาง

## 7. Security & Performance (Planned)

### Security (Future Implementation)
* **Authentication:** ตรวจสอบ JWT Token ผ่าน Supabase ในทุก Protected API
* **Input Validation:** ใช้ **Zod** ในการ Validate ข้อมูลทุกครั้งก่อนส่งเข้า API
* **Image Upload:** จำกัดขนาดไฟล์รูปภาพไม่เกิน 5MB และบีบอัด (Compress) ที่ฝั่ง Client ก่อนอัปโหลดเพื่อประหยัด Bandwidth
* **CORS:** ตั้งค่า CORS policies ให้เข้มงวด
* **Rate Limiting:** จำกัดการเรียกใช้ API ต่อผู้ใช้

### Performance (Implementation Strategy)
* **Bundle Size:** ใช้ Vite และ Tree Shaking สำหรับขนาด Bundle ที่เล็กที่สุด
* **Code Splitting:** แบ่ง Code ตาม Routes และ Components
* **Lazy Loading:** โหลด Components หนักๆ เช่น Maps แบบ Lazy
* **Caching:** ใช้ React Query สำหรับ Client-side caching
* **Image Optimization:** วางแผนใช้ `next/image` หรือ Cloudinary API สำหรับปรับขนาดภาพอัตโนมัติ

## 8. Development Workflow

### Current Development Setup
1.  **Setup:** `npm install` -> ตั้งค่า `.env` (ยังไม่มี environment variables ที่ต้องการ)
2.  **Dev:** `npm run dev` -> Vite development server
3.  **Build:** `npm run build` -> Production build
4.  **Deploy:** Push to GitHub -> Vercel Auto Deploy

### Future Development Workflow (When Backend is Added)
1.  **Setup:** `npm install` -> ตั้งค่า `.env` (DATABASE_URL, SUPABASE_KEY, etc.)
2.  **DB Setup:** สร้าง Database schema (Drizzle/Prisma)
3.  **DB Migration:** `npx drizzle-kit push` หรือ `npx prisma migrate`
4.  **Dev:** `npm run dev` -> Frontend + Backend development
5.  **Deploy:** Push to GitHub -> Vercel Auto Deploy

### Technology Stack Migration Notes
- ✅ **已完成:** React + Vite + TypeScript + Tailwind + shadcn/ui
- ❌ **待实现:** Database (Turso/Supabase), Authentication, API Routes, Map Integration
