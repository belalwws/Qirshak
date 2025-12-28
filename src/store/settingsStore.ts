import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/utils/constants';

interface SettingsState {
  currency: string;
  currencySymbol: string;
  isDarkMode: boolean;
  language: 'en' | 'ar';
  hasSeenWelcome: boolean;
  
  // Actions
  setCurrency: (currency: string, symbol: string) => void;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
  setLanguage: (lang: 'en' | 'ar') => void;
  setHasSeenWelcome: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currency: 'EGP',
      currencySymbol: 'ج.م',
      isDarkMode: false,
      language: 'ar',
      hasSeenWelcome: false,
      
      setCurrency: (currency, symbol) => set({ currency, currencySymbol: symbol }),
      
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      setDarkMode: (value) => set({ isDarkMode: value }),
      
      setLanguage: (lang) => set({ language: lang }),
      
      setHasSeenWelcome: (value) => set({ hasSeenWelcome: value }),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
