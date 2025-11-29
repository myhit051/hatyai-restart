# MVP Features Specification

## แผนการพัฒนาฟีเจอร์พื้นฐาน (MVP Development Plan)

### Phase 1: Mock Data & Basic Logic (Week 1-2)
**เป้าหมาย**: ทำให้ UI สามารถแสดงข้อมูลจริงและมีการทำงานพื้นฐาน

#### 1.1 Job Management System
**Mock Jobs Data:**
```typescript
interface Job {
  id: string;
  title: string;
  description: string;
  category: 'repair' | 'rescue' | 'transport' | 'food' | 'medical';
  status: 'pending' | 'in_progress' | 'completed';
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  requester: {
    name: string;
    phone: string;
  };
  urgency: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}
```

**Features:**
- ✅ แสดงรายการ jobs บนหน้า Index
- ✅ สร้าง job ใหม่ (form validation)
- ✅ ดูรายละเอียด job
- ✅ กรอง jobs ตาม category/urgency
- ✅ แก้ไขสถานะ job

#### 1.2 Waste Report System
**Mock Waste Reports:**
```typescript
interface WasteReport {
  id: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  wasteType: 'furniture' | 'electronics' | 'construction' | 'general';
  amount: 'small' | 'medium' | 'large';
  description: string;
  photoUrl?: string;
  status: 'reported' | 'assigned' | 'collected';
  reportedBy: string;
  createdAt: Date;
}
```

**Features:**
- ✅ รายงานจุดทิ้งขยะใหญ่
- ✅ แสดงจุดทิ้งขยะบนหน้า MapPage
- ✅ กรองตามประเภทขยะ
- ✅ อัปโหลดรูปภาพ (local storage)

#### 1.3 User Profile Management
**Mock User Data:**
```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'requester' | 'helper' | 'both';
  skills: string[];
  location?: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
}
```

**Features:**
- ✅ แก้ไขข้อมูลส่วนตัว
- ✅ เลือกบทบาท (ผู้ขอความช่วยเหลือ/ผู้ช่วย/ทั้งสอง)
- ✅ ระบุทักษะที่สามารถช่วยเหลือ
- ✅ ดูประวัติการทำงาน

### Phase 2: Enhanced UX & State Management (Week 3-4)

#### 2.1 Real-time UI Updates
- Loading states สำหรับทุกการดำเนินการ
- Toast notifications สำหรับ success/error messages
- Optimistic updates สำหรับ user actions
- Error boundaries สำหรับ error handling

#### 2.2 Advanced Filtering & Search
- ค้นหา jobs ตามชื่อ/คำอธิบาย
- กรองตามรัศมีระยะทาง (mock calculation)
- กรองตามวันที่สร้าง
- Sorting ตามความเร่งด่วน/วันที่

#### 2.3 Mobile Optimizations
- Pull-to-refresh สำหรับรายการข้อมูล
- Swipe actions สำหรับ job list
- Better touch targets สำหรับ mobile
- Offline support พื้นฐาน (service worker)

### Phase 3: Integration Preparation (Week 5-6)

#### 3.1 API Layer Abstraction
สร้าง service layer ที่ง่ายต่อการเปลี่ยนจาก mock data เป็น real API:

```typescript
// services/apiService.ts
class ApiService {
  async getJobs(filters?: JobFilters): Promise<Job[]> {
    // Mock implementation now, real API later
    return mockJobs;
  }

  async createJob(job: CreateJobRequest): Promise<Job> {
    // Mock implementation now, real API later
    return createMockJob(job);
  }
}
```

#### 3.2 Data Validation & Types
- Zod schemas สำหรับ data validation
- TypeScript interfaces ที่ครบครัน
- Form validation ด้วย react-hook-form
- Type-safe API calls

#### 3.3 Performance Optimizations
- Code splitting สำหรับ large components
- Lazy loading สำหรับ images
- Bundle size optimization
- Component memoization

## Technical Implementation Details

### การจัดการ State (State Management)

#### Global State
```typescript
// store/useAppStore.ts
interface AppStore {
  currentUser: UserProfile | null;
  jobs: Job[];
  wasteReports: WasteReport[];
  isLoading: boolean;
  error: string | null;
}
```

#### Component State
- ใช้ useState สำหรับ local state
- ใช้ useReducer สำหรับ complex state logic
- ใช้ React Query สำหรับ server state

### Form Management
```typescript
// ตัวอย่างการใช้ react-hook-form + zod
const jobFormSchema = z.object({
  title: z.string().min(1, "กรุณาระบุหัวข้อ"),
  description: z.string().min(10, "กรุณาอธิบายอย่างน้อย 10 ตัวอักษร"),
  category: z.enum(["repair", "rescue", "transport", "food", "medical"]),
  urgency: z.enum(["low", "medium", "high"]),
});
```

### Data Mocking Strategy
1. **Static JSON files** สำหรับข้อมูลเริ่มต้น
2. **Local storage** สำหรับ persistence ใน browser
3. **Session storage** สำหรับ temporary data
4. **Memory store** สำหรับ runtime state

## Success Metrics สำหรับ MVP

### User Experience
- ✅ ผู้ใช้สามารถสร้าง job ใหม่ได้ภายใน 2 นาที
- ✅ หน้าเว็บโหลดภายใน 3 วินาทีบน mobile
- ✅ ทุกการกระทำมี feedback ทันที
- ✅ Navigation ราบรื่นและ intuitive

### Technical Quality
- ✅ Zero TypeScript errors
- ✅ Bundle size < 1MB (gzipped)
- ✅ Lighthouse score > 90
- ✅ ทำงานได้บน Chrome, Firefox, Safari, Edge

### Functionality
- ✅ สามารถสร้าง/ดู/แก้ไข jobs ได้
- ✅ สามารถรายงาน/ดูจุดทิ้งขยะได้
- ✅ สามารถจัดการข้อมูลส่วนตัวได้
- ✅ ทำงานได้แม้ไม่มี internet connection

## Dependencies ที่ต้องเพิ่มสำหรับ MVP

```json
{
  "zod": "^3.25.76", // มีแล้ว
  "react-hook-form": "^7.61.1", // มีแล้ว
  "@hookform/resolvers": "^3.10.0", // มีแล้ว
  "date-fns": "^3.6.0", // มีแล้ว
  "clsx": "^2.1.1", // มีแล้ว
  "tailwind-merge": "^2.6.0" // มีแล้ว
}
```

## การทดสอบ MVP

### Manual Testing Checklist
- [ ] สร้าง job ใหม่และตรวจสอบว่าแสดงในรายการ
- [ ] แก้ไขสถานะ job และตรวจสอบว่าอัปเดต
- [ ] รายงานขยะใหม่และตรวจสอบว่าแสดงบนแผนที่
- [ ] แก้ไขข้อมูลส่วนตัวและตรวจสอบว่าบันทึก
- [ ] ทดสอบบน mobile devices หลายขนาด
- [ ] ทดสอบบน browsers หลายประเภท
- [ ] ทดสอบกับข้อมูลจำลองขนาดใหญ่
- [ ] ทดสอบสถานการณ์ network ช้า/ขาดหาย

### Performance Testing
- Lighthouse performance audit
- Bundle size analysis
- Memory usage monitoring
- Network request optimization