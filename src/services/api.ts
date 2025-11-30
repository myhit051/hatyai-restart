// API Service Layer
// Switch between mock and real API based on environment

import MockApiService from "./mockApi";

// Toggle this for development vs production
const USE_MOCK_API = import.meta.env.DEV || true; // Set to false when real API is ready

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  // Authentication
  static async login(email: string, password: string) {
    if (USE_MOCK_API) {
      return MockApiService.login(email, password);
    }

    // Real API implementation
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    return response.json();
  }

  static async register(userData: any) {
    if (USE_MOCK_API) {
      return MockApiService.register(userData);
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return response.json();
  }

  static async logout() {
    if (USE_MOCK_API) {
      return { success: true };
    }

    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    return response.json();
  }

  // Repair Jobs
  static async getRepairJobs(filters?: any) {
    if (USE_MOCK_API) {
      return MockApiService.getRepairJobs(filters);
    }

    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`/api/repair/jobs?${queryParams}`);
    return response.json();
  }

  static async createRepairJob(jobData: any) {
    if (USE_MOCK_API) {
      return MockApiService.createRepairJob(jobData);
    }

    const response = await fetch('/api/repair/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(jobData),
    });

    return response.json();
  }

  static async assignJob(jobId: string, technicianId: string) {
    if (USE_MOCK_API) {
      return MockApiService.assignJob(jobId, technicianId);
    }

    const response = await fetch(`/api/repair/jobs/${jobId}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ technicianId }),
    });

    return response.json();
  }

  // Waste Management
  static async getWasteReports(filters?: any) {
    if (USE_MOCK_API) {
      return MockApiService.getWasteReports(filters);
    }

    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`/api/waste/reports?${queryParams}`);
    return response.json();
  }

  static async createWasteReport(reportData: any) {
    if (USE_MOCK_API) {
      return MockApiService.createWasteReport(reportData);
    }

    const response = await fetch('/api/waste/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(reportData),
    });

    return response.json();
  }

  // Resource Management
  static async getResources(filters?: any) {
    if (USE_MOCK_API) {
      return MockApiService.getResources(filters);
    }

    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`/api/resources?${queryParams}`);
    return response.json();
  }

  static async donateResource(resourceData: any) {
    if (USE_MOCK_API) {
      return MockApiService.donateResource(resourceData);
    }

    const response = await fetch('/api/resources', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(resourceData),
    });

    return response.json();
  }

  // Geolocation
  static async getCurrentLocation() {
    if (USE_MOCK_API) {
      return MockApiService.getCurrentLocation();
    }

    // Use browser geolocation API
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Current Location'
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }

  // File Upload
  static async uploadImage(file: File) {
    if (USE_MOCK_API) {
      return MockApiService.uploadImage(file);
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    return response.json();
  }
}

export default ApiService;