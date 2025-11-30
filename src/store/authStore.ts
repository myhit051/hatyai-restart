import { create } from 'zustand';

export type UserRole = 'victim' | 'volunteer' | 'technician' | 'donor' | 'coordinator';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profile: {
    avatar?: string;
    skills?: string[];
    location?: string;
    bio?: string;
    rating?: number;
    completedJobs?: number;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  updateProfile: (updates: Partial<User['profile']>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      // Mock authentication - ใน production จะเชื่อมกับ API จริง
      const mockUser: User = {
        id: '1',
        name: 'สมชาย ใจดี',
        email: email,
        phone: '0812345678',
        role: 'volunteer',
        profile: {
          avatar: '',
          skills: ['ช่วยเหลือ', 'ขนย้ายของ'],
          location: 'หาดใหญ่',
          bio: 'อาสาสมัครสำหรับฟื้นฟูหาดใหญ่',
          rating: 4.5,
          completedJobs: 15
        }
      };

      set({ user: mockUser, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  register: async (userData) => {
    try {
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role: userData.role || 'volunteer',
        profile: {
          avatar: '',
          skills: [],
          location: '',
          bio: '',
          rating: 0,
          completedJobs: 0
        }
      };

      set({ user: newUser, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  },

  updateProfile: (updates) => {
    const currentUser = get().user;
    if (currentUser) {
      set({
        user: {
          ...currentUser,
          profile: {
            ...currentUser.profile,
            ...updates
          }
        }
      });
    }
  }
}));