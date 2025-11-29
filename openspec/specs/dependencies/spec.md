# Dependencies & Technical Requirements Specification

## 📦 Dependencies ต่อแต่ละ Phase ของการพัฒนา

### Phase 1: Foundation (Week 1-4)
**เป้าหมาย**: สร้าง functional UI ด้วย mock data

#### ตอนนี้มีอยู่แล้ว (Current Dependencies)
```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",        // ✅ สำหรับ form validation
    "@radix-ui/*": "multiple components",     // ✅ UI components
    "@tanstack/react-query": "^5.83.0",       // ✅ State management
    "react": "^18.3.1",                       // ✅ React framework
    "react-dom": "^18.3.1",                  // ✅ DOM rendering
    "react-hook-form": "^7.61.1",             // ✅ Form management
    "react-router-dom": "^6.30.1",           // ✅ Navigation
    "zod": "^3.25.76",                        // ✅ Schema validation
    "tailwind-merge": "^2.6.0",               // ✅ CSS utilities
    "clsx": "^2.1.1",                         // ✅ Conditional classes
    "lucide-react": "^0.462.0",               // ✅ Icons
    "sonner": "^1.7.4"                        // ✅ Toast notifications
  }
}
```

#### ต้องเพิ่มสำหรับ Phase 1
```json
{
  "dependencies": {
    "date-fns": "^3.6.0",                    // ✅ มีแล้ว - จัดการวันที่
    "@types/node": "^22.16.5",               // ✅ มีแล้ว - Node types
    "typescript": "^5.8.3"                   // ✅ มีแล้ว - TypeScript
  },
  "devDependencies": {
    "vite": "^5.4.19",                       // ✅ มีแล้ว - Build tool
    "@vitejs/plugin-react-swc": "^3.11.0"    // ✅ มีแล้ว - React plugin
  }
}
```

### Phase 2: UX Enhancement (Week 5-8)
**เป้าหมาย**: ปรับปรุงประสบการณ์ผู้ใช้และ performance

#### ต้องเพิ่มสำหรับ Phase 2
```json
{
  "dependencies": {
    "framer-motion": "^11.0.0",              // 🆕 Animations และ transitions
    "react-intersection-observer": "^9.8.0", // 🆕 Infinite scroll และ lazy loading
    "react-virtualized": "^9.22.5",         // 🆕 Virtualized lists
    "workbox-window": "^7.0.0",             // 🆕 Service worker utilities
    "web-vitals": "^4.0.0"                   // 🆕 Performance monitoring
  },
  "devDependencies": {
    "@types/web-vitals": "^2.0.0",           // 🆕 Web vitals types
    "vite-plugin-pwa": "^0.16.0"            // 🆕 PWA plugin for Vite
  }
}
```

### Phase 3: Authentication & Database (Week 9-12)
**เป้าหมาย**: เชื่อมต่อกับ backend จริง

#### ต้องเพิ่มสำหรับ Phase 3
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.0.0",       // 🆕 Supabase client
    "@supabase/auth-helpers-react": "^0.4.0", // 🆕 Auth helpers
    "leaflet": "^1.9.0",                     // 🆕 Map library
    "react-leaflet": "^4.2.0",              // 🆕 React map components
    "react-dropzone": "^14.2.0",             // 🆕 File upload
    "axios": "^1.6.0",                       // 🆕 HTTP client (optional)
    "socket.io-client": "^4.7.0"            // 🆕 Real-time connections
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.0",              // 🆕 Leaflet types
    "@types/react-dropzone": "^5.1.0"        // 🆕 Dropzone types
  }
}
```

## 🏗️ Technical Architecture ต่อแต่ละ Phase

### Phase 1 Architecture: Mock Data Layer
```typescript
// services/mockDataService.ts
class MockDataService {
  private jobs: Job[] = mockJobs;
  private users: User[] = mockUsers;
  private wasteReports: WasteReport[] = mockReports;

  async getJobs(filters?: JobFilters): Promise<Job[]> {
    // Mock filtering logic
    return this.jobs.filter(job => applyFilters(job, filters));
  }

  async createJob(jobData: CreateJobRequest): Promise<Job> {
    const newJob = {
      id: generateId(),
      ...jobData,
      createdAt: new Date(),
      status: 'pending' as const
    };
    this.jobs.push(newJob);
    return newJob;
  }
}
```

### Phase 2 Architecture: Enhanced Frontend
```typescript
// services/performanceService.ts
class PerformanceService {
  async trackPageLoad(): Promise<void> {
    const vitals = getWebVitals();
    await this.sendToAnalytics(vitals);
  }

  async optimizeImage(url: string): Promise<string> {
    // Image optimization logic
    return optimizedUrl;
  }
}

// services/offlineService.ts
class OfflineService {
  async cacheData(): Promise<void> {
    // Cache essential data for offline use
  }

  async syncWhenOnline(): Promise<void> {
    // Sync offline changes when online
  }
}
```

### Phase 3 Architecture: Real Backend Integration
```typescript
// services/apiService.ts
class ApiService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getJobs(filters?: JobFilters): Promise<Job[]> {
    let query = this.supabase
      .from('jobs')
      .select('*');

    // Apply real database filters
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}
```

## 📊 Dependency Analysis และ Trade-offs

### ขนาด Bundle ต่อแต่ละ Phase
| Phase | Dependencies | Estimated Bundle Size (gzipped) | Impact |
|-------|-------------|-------------------------------|--------|
| Phase 1 | Current deps | ~300KB | ✅ เล็ก รวดเร็ว |
| Phase 2 | +5 packages | ~400KB | ⚠️ เพิ่ม 100KB |
| Phase 3 | +8 packages | ~600KB | ⚠️ เพิ่ม 200KB แต่มีฟีเจอร์เยอะ |

### ความซับซ้อนของการ Setup
| Dependency | Setup Complexity | Maintenance | Recommendation |
|------------|------------------|-------------|----------------|
| **TanStack Query** | ต่ำ | ต่ำ | ✅ ใช้แล้ว เหมาะกับโปรเจค |
| **Framer Motion** | กลาง | กลาง | ✅ เพิ่ม UX ดีขึ้นมาก |
| **Supabase** | กลาง | กลาง | ✅ Auth + Database ในที่เดียว |
| **Leaflet** | สูง | ต่ำ | ⚠️ พิจารณา alternatives |
| **Socket.io** | สูง | สูง | 🔴 อาจไม่ต้องใช้ใน MVP |

## 🚀 Installation & Setup Instructions

### Phase 1: Immediate Setup
```bash
# Dependencies ตอนนี้มีอยู่แล้วทั้งหมด
npm install  # ทำงานได้เลย
npm run dev  # Development server
```

### Phase 2: UX Enhancement Setup
```bash
# เพิ่ม UX dependencies
npm install framer-motion react-intersection-observer react-virtualized workbox-window web-vitals
npm install -D @types/web-vitals vite-plugin-pwa

# อัปเดต vite.config.ts
# เพิ่ม PWA configuration
```

### Phase 3: Backend Integration Setup
```bash
# เพิ่ม backend dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-react leaflet react-leaflet react-dropzone socket.io-client
npm install -D @types/leaflet @types/react-dropzone

# Setup environment variables
# SUPABASE_URL=your_supabase_url
# SUPABASE_ANON_KEY=your_supabase_key
```

## 🔧 Configuration Files

### vite.config.ts (Current)
```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### vite.config.ts (Phase 2 - PWA)
```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
    }),
  ],
});
```

## 📋 Environment Variables

### .env.example
```bash
# Phase 1-2: No env variables needed

# Phase 3: Backend integration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MAP_API_KEY=your_map_api_key  # Optional if using premium maps
```

## 🎯 Migration Strategy

### การเพิ่ม Dependencies ทีละส่วน
1. **Week 1**: ใช้ dependencies ปัจจุบัน
2. **Week 4**: เพิ่ม UX dependencies ก่อน Phase 2
3. **Week 8**: เพิ่ม backend dependencies ก่อน Phase 3

### การลด Dependencies ที่ไม่จำเป็น
```json
{
  "dependencies": {
    // พิจารณาลบถ้าไม่ได้ใช้:
    "recharts": "^2.15.4",              // ถ้าไม่มี dashboard analytics
    "vaul": "^0.9.9",                   // ถ้าไม่ใช้ drawer component
    "embla-carousel-react": "^8.6.0",   // ถ้าไม่มี carousel
    "input-otp": "^1.4.2"               // ถ้าไม่มี OTP input
  }
}
```

## 🚨 Potential Issues & Solutions

### Bundle Size Concerns
- **Problem**: Bundle ใหญ่เกินไป
- **Solution**:
  - Code splitting ตาม routes
  - Dynamic imports สำหรับ heavy components
  - Tree shaking สำหรับ unused code

### Dependency Conflicts
- **Problem**: React 18 compatibility issues
- **Solution**:
  - ใช้ @latest versions
  - ตรวจสอบ peer dependencies
  - Test บน development environment ก่อน

### Performance Impact
- **Problem**: เพิ่ม dependencies ทำให้ช้า
- **Solution**:
  - วัด performance หลังเพิ่มแต่ละ dependency
  - ใช้ lazy loading สำหรับ non-critical features
  - Optimize loading strategies

## 🔍 Monitoring & Analytics

### Performance Monitoring
```typescript
// Phase 2 เพิ่ม
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Error Tracking
```typescript
// Phase 3 เพิ่ม
class ErrorTracker {
  track(error: Error, context?: any): void {
    console.error('Application Error:', error, context);
    // Send to error tracking service
  }
}
```

## 📈 Recommended Alternatives

### สำหรับ Maps
- **OpenStreetMap + Leaflet** (แนะนำ) - ฟรี, ไม่ต้อง API key
- **Mapbox** - มี free tier, quality ดี
- **Google Maps** - แพงแต่ data quality สูง

### สำหรับ Authentication
- **Supabase Auth** (แนะนำ) - Auth + Database ในที่เดียว
- **Firebase Auth** - ยอดนิยม, ecosystem ใหญ่
- **NextAuth.js** - ถ้าย้ายไป Next.js

### สำหรับ Real-time
- **Supabase Realtime** (แนะนำ) - ถ้าใช้ Supabase
- **Socket.io** - Custom solution
- **Firebase Realtime Database** - Alternative