import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { createTheme, Theme, colors } from '@/theme';
import { useSettingsStore } from '@/store/settingsStore';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const { isDarkMode, toggleDarkMode } = useSettingsStore();
  
  const isDark = isDarkMode ?? systemColorScheme === 'dark';
  
  const theme = useMemo(() => createTheme(isDark), [isDark]);
  
  const value = useMemo(
    () => ({
      theme,
      isDark,
      toggleTheme: toggleDarkMode,
    }),
    [theme, isDark, toggleDarkMode]
  );
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for getting colors directly
export const useColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};
