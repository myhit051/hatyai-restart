import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { syncUser } from '@/app/actions/user';

export type UserRole = 'general_user' | 'technician' | 'admin';

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
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkSession: async () => {
    const supabase = createClient();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // In a real app, we would fetch the user's profile from our database here
        // For now, we'll construct a basic user object from metadata
        const metadata = session.user.user_metadata || {};

        const user: User = {
          id: session.user.id,
          email: session.user.email!,
          name: metadata.name || session.user.email?.split('@')[0] || 'User',
          phone: metadata.phone || '',
          role: (metadata.role as UserRole) || 'general_user',
          profile: {
            avatar: metadata.avatar_url || '',
            skills: metadata.skills || [],
            location: metadata.location || '',
            bio: metadata.bio || '',
            rating: 0,
            completedJobs: 0
          }
        };

        // Sync user to Turso
        syncUser({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          avatar: user.profile.avatar
        });

        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Session check failed:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    const supabase = createClient();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const metadata = data.user.user_metadata || {};
        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          name: metadata.name || email.split('@')[0],
          phone: metadata.phone || '',
          role: (metadata.role as UserRole) || 'general_user',
          profile: {
            avatar: metadata.avatar_url || '',
            skills: metadata.skills || [],
            location: metadata.location || '',
            bio: metadata.bio || '',
            rating: 0,
            completedJobs: 0
          }
        };

        // Sync user to Turso
        await syncUser({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          avatar: user.profile.avatar
        });

        set({ user, isAuthenticated: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  },

  loginWithGoogle: async () => {
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Google login failed:', error);
    }
  },

  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  register: async (userData) => {
    const supabase = createClient();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email!,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            role: userData.role || 'general_user',
            // Add other profile fields to metadata for now
            location: userData.profile?.location,
            skills: userData.profile?.skills,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Note: If email confirmation is enabled, the user might not be logged in immediately
        // But for this MVP we'll assume we can proceed or handle the "check email" state
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  },
}));