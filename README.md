# Hat Yai Restart

**โปรเจคช่วยเหลือผู้ประสบภัยน้ำท่วมในพื้นที่หาดใหญ่**

## Project Info

**Status**: UI Prototype (Phase 1 - 60% Complete)
**Platform**: Web Application สำหรับช่วยเหลือผู้ประสบภัยน้ำท่วมในหาดใหญ่
**Development**: React + TypeScript + Vite + shadcn/ui

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e026f84b-1fa8-4a0a-921e-c9723f7337f2) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## ฟีเจอร์ปัจจุบัน (Current Features)

### ✅ สามารถใช้งานได้แล้ว
- **UI Navigation** - สลับหน้าได้ระหว่าง Index, MyJobs, Map, Profile
- **Responsive Design** - รองรับมือถือและ desktop
- **Modern UI** - ใช้ shadcn/ui components ที่สวยงาม
- **Development Ready** - npm run dev ทำงานได้

### 🔄 กำลังพัฒนา (Phase 2)
- **Authentication System** - Login/Logout ผ่าน Google Account
- **Database Integration** - จัดเก็บข้อมูล jobs และ user profiles
- **Mock Data** - ข้อมูลตัวอย่างสำหรับการทดสอบ

### 📋 แผนการพัฒนา (Phase 3)
- **Map Integration** - แผนที่แสดงจุดต่างๆในหาดใหญ่
- **Real-time Updates** - อัปเดตสถานะแบบ real-time
- **PWA Features** - ติดตั้งบนมือถือได้

## เทคโนโลยีที่ใช้

### Frontend Stack
- **React 18** + **TypeScript** - พื้นฐานของแอปพลิเคชัน
- **Vite** - Build tool ที่รวดเร็ว
- **Tailwind CSS** - CSS framework สำหรับ styling
- **shadcn/ui** - UI components library
- **React Router DOM** - จัดการ routing ระหว่างหน้า
- **TanStack Query** - State management

### พัฒนาต่อในอนาคต
- **Supabase** - Authentication + Database (แผน Phase 2)
- **OpenStreetMap** - แผนที่ฟรี (แผน Phase 3)
- **Vite PWA** - Progressive Web App features (แผน Phase 3)

## วิธีการรันแอปพลิเคชัน

```bash
# 1. Clone repository
git clone <your-repo-url>
cd hatyai-restart

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# แอปพลิเคชันจะรันที่ http://localhost:8083 (หรือ port ที่ว่าง)
```

## โครงสร้างโปรเจค

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── *.tsx           # Custom components
├── pages/              # Page components
│   ├── Index.tsx       # หน้าหลัก
│   ├── MyJobs.tsx      # หน้างานของฉัน
│   ├── MapPage.tsx     # หน้าแผนที่
│   └── Profile.tsx     # หน้าโปรไฟล์
└── hooks/              # Custom hooks

docs/                   # เอกสารโปรเจค
openspec/              # OpenSpec change proposals
```

## การมีส่วนร่วม

### สำหรับนักพัฒนา
1. Fork repository
2. สร้าง feature branch: `git checkout -b feature/feature-name`
3. Commit changes: `git commit -m 'feat: add feature description'`
4. Push to branch: `git push origin feature/feature-name`
5. สร้าง Pull Request

### สำหรับทดสอบ
- รัน `npm run dev` และทดสอบบน browser
- ทดสอบบน mobile devices ด้วย responsive design
- รายงาน bugs ผ่าน GitHub Issues

## OpenSpec Documentation

ดูเอกสารความเปลี่ยนแปลงและแผนการพัฒนา:
- UI Prototype: `openspec/specs/ui-prototype/spec.md`
- Future Enhancement: `openspec/specs/future-enhancement/spec.md`
- Change Proposals: `openspec/changes/`
