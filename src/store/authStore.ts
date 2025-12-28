import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isGuest: boolean;
  isLoading: boolean;
  lastSyncedAt: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setIsGuest: (isGuest: boolean) => void;
  setLoading: (loading: boolean) => void;
  setLastSynced: (date: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  continueAsGuest: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isGuest: false,
      isLoading: false,
      lastSyncedAt: null,
      
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setIsGuest: (isGuest) => set({ isGuest }),
      setLoading: (isLoading) => set({ isLoading }),
      setLastSynced: (date) => set({ lastSyncedAt: date }),
      
      login: (user, token) => set({ 
        user, 
        token, 
        isGuest: false,
        isLoading: false,
      }),
      
      logout: () => set({ 
        user: null, 
        token: null, 
        isGuest: false,
        lastSyncedAt: null,
      }),
      
      continueAsGuest: () => set({ 
        user: null, 
        token: null, 
        isGuest: true,
        isLoading: false,
      }),
    }),
    {
      name: STORAGE_KEYS.AUTH,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isGuest: state.isGuest,
        lastSyncedAt: state.lastSyncedAt,
      }),
    }
  )
);
