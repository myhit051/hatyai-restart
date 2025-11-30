// Mock API Services for Development
// In production, replace with actual API calls

import { RepairJob } from "@/store/jobStore";
import { WasteReport } from "@/store/wasteStore";
import { Resource, ResourceNeed } from "@/store/resourceStore";

export class MockApiService {
  private static delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Authentication
  static async login(email: string, password: string) {
    await this.delay(800);

    if (email === "test@hatyai.restart" && password === "123456") {
      return {
        success: true,
        user: {
          id: "1",
          name: "ผู้ทดสอบ ระบบ",
          email: email,
          phone: "0812345678",
          role: "volunteer" as const,
          profile: {
            avatar: "",
            skills: ["ช่วยเหลือ", "ฟื้นฟู"],
            location: "หาดใหญ่",
            bio: "อาสาสมัครสำหรับฟื้นฟูหาดใหญ่",
            rating: 4.5,
            completedJobs: 15
          }
        }
      };
    }

    // Mock user login for any email (development)
    return {
      success: true,
      user: {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email: email,
        phone: "0812345678",
        role: "volunteer" as const,
        profile: {
          avatar: "",
          skills: [],
          location: "",
          bio: "",
          rating: 0,
          completedJobs: 0
        }
      }
    };
  }

  static async register(userData: any) {
    await this.delay(1000);
    return {
      success: true,
      user: {
        id: Date.now().toString(),
        ...userData,
        profile: {
          avatar: "",
          skills: [],
          location: "",
          bio: "",
          rating: 0,
          completedJobs: 0
        }
      }
    };
  }

  // Repair Jobs
  static async getRepairJobs(filters?: any) {
    await this.delay(500);
    // Return mock jobs based on filters
    return [];
  }

  static async createRepairJob(jobData: Partial<RepairJob>) {
    await this.delay(800);
    return {
      success: true,
      job: {
        id: Date.now().toString(),
        ...jobData,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }

  static async assignJob(jobId: string, technicianId: string) {
    await this.delay(600);
    return { success: true };
  }

  static async updateJobStatus(jobId: string, status: string, notes?: string) {
    await this.delay(400);
    return { success: true };
  }

  // Waste Management
  static async getWasteReports(filters?: any) {
    await this.delay(500);
    return [];
  }

  static async createWasteReport(reportData: Partial<WasteReport>) {
    await this.delay(800);
    return {
      success: true,
      report: {
        id: Date.now().toString(),
        ...reportData,
        status: "reported" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }

  static async assignWasteCollection(reportId: string, teamId: string) {
    await this.delay(600);
    return { success: true };
  }

  static async updateWasteStatus(reportId: string, status: string, notes?: string) {
    await this.delay(400);
    return { success: true };
  }

  // Resource Management
  static async getResources(filters?: any) {
    await this.delay(500);
    return [];
  }

  static async getResourceNeeds(filters?: any) {
    await this.delay(500);
    return [];
  }

  static async donateResource(resourceData: Partial<Resource>) {
    await this.delay(800);
    return {
      success: true,
      resource: {
        id: Date.now().toString(),
        ...resourceData,
        status: "available" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }

  static async requestResource(needData: Partial<ResourceNeed>) {
    await this.delay(800);
    return {
      success: true,
      need: {
        id: Date.now().toString(),
        ...needData,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }

  static async matchResource(resourceId: string, needId: string) {
    await this.delay(600);
    return { success: true };
  }

  // Geolocation Services (Mock)
  static async getCurrentLocation() {
    await this.delay(2000);
    return {
      lat: 7.0119,
      lng: 100.4758,
      address: "หาดใหญ่, สงขลา"
    };
  }

  static async searchLocation(query: string) {
    await this.delay(1000);
    return [
      {
        lat: 7.0119,
        lng: 100.4758,
        address: "หาดใหญ่, สงขลา",
        display_name: "หาดใหญ่, อำเภอหาดใหญ่, จังหวัดสงขลา"
      }
    ];
  }

  // File Upload (Mock)
  static async uploadImage(file: File) {
    await this.delay(2000);
    return {
      success: true,
      url: `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`,
      filename: file.name
    };
  }

  // Notifications (Mock)
  static async sendNotification(userId: string, title: string, message: string) {
    await this.delay(300);
    return { success: true };
  }

  // Statistics (Mock)
  static async getDashboardStats(userId: string) {
    await this.delay(1500);
    return {
      jobsCompleted: 15,
      wasteCollected: 5,
      resourcesDistributed: 8,
      volunteerHours: 45,
      impactScore: 4.5
    };
  }
}

export default MockApiService;