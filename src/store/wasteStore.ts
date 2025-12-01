import { create } from 'zustand';
import {
  getWasteReports,
  createWasteReport,
  updateWasteStatus,
  type WasteReport as WasteReportDB,
  type WasteReportData,
  type WasteStatus,
  type WasteType,
  type SeverityLevel,
  deleteWasteReport,
} from '@/app/actions/waste';

export type { WasteType, WasteStatus } from '@/app/actions/waste';

export interface WasteReport {
  id: string;
  reporterId: string;
  reporterName?: string;
  location: string | null;
  coordinates: { lat: number; lng: number } | null;
  wasteType: WasteType;
  description: string | null;
  imageUrl: string | null;
  severity: SeverityLevel;
  status: WasteStatus;
  createdAt: string;
  updatedAt: string;
}

interface WasteState {
  wasteReports: WasteReport[];
  myReports: WasteReport[];
  activeReports: WasteReport[];
  isLoading: boolean;
  createReport: (reportData: WasteReportData) => Promise<{ success: boolean; error?: string }>;
  updateStatus: (reportId: string, status: WasteStatus) => Promise<void>;
  getWasteByLocation: (bounds: { north: number; south: number; east: number; west: number }) => WasteReport[];
  getHighRiskWaste: () => WasteReport[];
  loadReports: (userId?: string) => Promise<void>;
  deleteReport: (id: string) => Promise<{ success: boolean; error?: string }>;
}

const mapWasteReport = (report: WasteReportDB): WasteReport => {
  let coordinates: { lat: number; lng: number } | null = null;
  if (report.coordinates) {
    try {
      coordinates = JSON.parse(report.coordinates);
    } catch (e) {
      coordinates = null;
    }
  }

  return {
    id: report.id,
    reporterId: report.reporter_id,
    reporterName: report.reporter_name,
    location: report.location,
    coordinates,
    wasteType: report.waste_type,
    description: report.description,
    imageUrl: report.image_url,
    severity: report.severity,
    status: report.status,
    createdAt: report.created_at,
    updatedAt: report.updated_at,
  };
};

export const useWasteStore = create<WasteState>((set, get) => ({
  wasteReports: [],
  myReports: [],
  activeReports: [],
  isLoading: false,

  loadReports: async (userId?: string) => {
    set({ isLoading: true });
    try {
      const reportsData = await getWasteReports();
      const reports = reportsData.map(mapWasteReport);

      const userReports = userId
        ? reports.filter(report => report.reporterId === userId)
        : [];

      const active = reports.filter(
        report => report.status === 'reported' || report.status === 'acknowledged'
      );

      set({
        wasteReports: reports,
        myReports: userReports,
        activeReports: active,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading waste reports:', error);
      set({ isLoading: false });
    }
  },

  createReport: async (reportData: WasteReportData) => {
    const result = await createWasteReport(reportData);
    if (result.success) {
      await get().loadReports(reportData.reporter_id);
    }
    return result;
  },

  updateStatus: async (reportId: string, status: WasteStatus) => {
    const result = await updateWasteStatus(reportId, status);
    if (result.success) {
      await get().loadReports();
    }
  },

  getWasteByLocation: (bounds) => {
    return get().wasteReports.filter(report => {
      if (!report.coordinates) return false;
      return (
        report.coordinates.lat >= bounds.south &&
        report.coordinates.lat <= bounds.north &&
        report.coordinates.lng >= bounds.west &&
        report.coordinates.lng <= bounds.east
      );
    });
  },

  getHighRiskWaste: () => {
    return get().wasteReports.filter(
      report => report.severity === 'high' && report.status !== 'cleared'
    );
  },

  deleteReport: async (id: string) => {
    const result = await deleteWasteReport(id);
    if (result.success) {
      await get().loadReports();
    }
    return result;
  },
}));