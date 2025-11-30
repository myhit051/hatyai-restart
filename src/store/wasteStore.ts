import { create } from 'zustand';

export type WasteType = 'construction' | 'hazardous' | 'electronic' | 'organic' | 'household' | 'other';
export type WasteStatus = 'reported' | 'assigned' | 'in-collection' | 'collected' | 'disposed';

export interface WasteReport {
  id: string;
  reporterId: string;
  reporterName: string;
  location: string;
  coordinates: { lat: number; lng: number };
  wasteType: WasteType;
  estimatedVolume: string;
  description: string;
  images: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  status: WasteStatus;
  assignedTo?: string;
  collectionTeamName?: string;
  accessibilityNotes?: string;
  environmentalRisk: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  estimatedDisposalMethod?: string;
  specialInstructions?: string;
}

interface WasteState {
  wasteReports: WasteReport[];
  myReports: WasteReport[];
  activeCollections: WasteReport[];
  createReport: (reportData: Partial<WasteReport>) => Promise<void>;
  assignCollection: (reportId: string, teamId: string) => Promise<void>;
  updateCollectionStatus: (reportId: string, status: WasteStatus, notes?: string) => Promise<void>;
  getWasteByLocation: (bounds: { north: number; south: number; east: number; west: number }) => WasteReport[];
  getHighRiskWaste: () => WasteReport[];
  loadReports: () => void;
}

// Mock data
const mockWasteReports: WasteReport[] = [
  {
    id: '1',
    reporterId: '5',
    reporterName: 'นายประสิทธิ์ รักษ์สิ่งแวดล้อม',
    location: 'ตลาดหาดใหญ่ ใกล้ปากทาง',
    coordinates: { lat: 7.0128, lng: 100.4768 },
    wasteType: 'hazardous',
    estimatedVolume: '2-3 ตัน',
    description: 'ขยะอันตรายจากน้ำท่วม เช่น สารเคมี แบตเตอรี่ ของใช้ไฟฟ้าเสีย',
    images: [],
    urgencyLevel: 'high',
    status: 'reported',
    accessibilityNotes: 'สามารถเข้าถึงได้ด้วยรถขนาดใหญ่ แต่ต้องระมัดระวังพื้นที่ลื่น',
    environmentalRisk: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDisposalMethod: 'กำจัดตามมาตรฐานขยะอันตราย',
    specialInstructions: 'ต้องมีอุปกรณ์ป้องกันพิเศษ และทีมผู้เชี่ยวชาญ'
  },
  {
    id: '2',
    reporterId: '6',
    reporterName: 'นางสาวมานี รักบ้านเกิด',
    location: 'โรงพยาบาลหาดใหญ่ หลังอาคาร',
    coordinates: { lat: 7.0145, lng: 100.4758 },
    wasteType: 'household',
    estimatedVolume: '1-2 ตัน',
    description: 'ขยะชิ้นใหญ่จากบ้านเรือน เช่น เฟอร์นิเจอร์ เครื่องใช้ไฟฟ้าเสีย',
    images: [],
    urgencyLevel: 'medium',
    status: 'assigned',
    accessibilityNotes: 'ต้องใช้รถขนขนาดใหญ่ และมีพื้นที่จอดรถชั่วคราว',
    environmentalRisk: 'low',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    updatedAt: new Date().toISOString(),
    assignedTo: 'team-1',
    collectionTeamName: 'ทีมกำจัดขยะเมืองหาดใหญ่',
    estimatedDisposalMethod: 'คัดแยกและรีไซเคิล',
    specialInstructions: 'มีของที่สามารถนำไปบริจาคได้บ้าง'
  }
];

export const useWasteStore = create<WasteState>((set, get) => ({
  wasteReports: mockWasteReports,
  myReports: [],
  activeCollections: [],

  createReport: async (reportData: Partial<WasteReport>) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const newReport: WasteReport = {
      id: Date.now().toString(),
      reporterId: currentUser.id || '1',
      reporterName: currentUser.name || 'ไม่ระบุชื่อ',
      location: reportData.location || '',
      coordinates: reportData.coordinates || { lat: 0, lng: 0 },
      wasteType: reportData.wasteType || 'other',
      estimatedVolume: reportData.estimatedVolume || '',
      description: reportData.description || '',
      images: reportData.images || [],
      urgencyLevel: reportData.urgencyLevel || 'medium',
      status: 'reported',
      accessibilityNotes: reportData.accessibilityNotes,
      environmentalRisk: reportData.environmentalRisk || 'low',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDisposalMethod: reportData.estimatedDisposalMethod,
      specialInstructions: reportData.specialInstructions
    };

    set(state => ({
      wasteReports: [...state.wasteReports, newReport],
      myReports: currentUser.id ? [...state.myReports, newReport] : state.myReports
    }));
  },

  assignCollection: async (reportId: string, teamId: string) => {
    // Mock team name - ใน production จะดึงจาก database
    const teamName = 'ทีมกำจัดขยะอาสาสมัคร';

    set(state => ({
      wasteReports: state.wasteReports.map(report =>
        report.id === reportId
          ? {
              ...report,
              status: 'assigned' as WasteStatus,
              assignedTo: teamId,
              collectionTeamName: teamName,
              updatedAt: new Date().toISOString()
            }
          : report
      )
    }));
  },

  updateCollectionStatus: async (reportId: string, status: WasteStatus, notes?: string) => {
    set(state => ({
      wasteReports: state.wasteReports.map(report =>
        report.id === reportId
          ? {
              ...report,
              status,
              specialInstructions: notes ? (report.specialInstructions || '') + '\n' + notes : report.specialInstructions,
              updatedAt: new Date().toISOString()
            }
          : report
      )
    }));
  },

  getWasteByLocation: (bounds) => {
    return get().wasteReports.filter(report =>
      report.coordinates.lat >= bounds.south &&
      report.coordinates.lat <= bounds.north &&
      report.coordinates.lng >= bounds.west &&
      report.coordinates.lng <= bounds.east
    );
  },

  getHighRiskWaste: () => {
    return get().wasteReports.filter(report =>
      report.environmentalRisk === 'high' && report.status !== 'collected'
    );
  },

  loadReports: () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const reports = get().wasteReports;

    const userReports = reports.filter(report =>
      report.reporterId === currentUser.id || report.assignedTo === 'team-1' // Mock team assignment
    );

    const activeCollections = reports.filter(report =>
      report.status === 'assigned' || report.status === 'in-collection'
    );

    set({
      myReports: userReports,
      activeCollections: activeCollections
    });
  }
}));