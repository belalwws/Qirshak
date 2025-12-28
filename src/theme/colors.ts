export const colors = {
  light: {
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    
    success: '#22C55E',
    successLight: '#4ADE80',
    successDark: '#16A34A',
    
    danger: '#EF4444',
    dangerLight: '#F87171',
    dangerDark: '#DC2626',
    
    warning: '#F59E0B',
    warningLight: '#FBBF24',
    warningDark: '#D97706',
    
    background: '#F8FAFC',
    backgroundSecondary: '#F1F5F9',
    
    card: '#FFFFFF',
    cardSecondary: '#F8FAFC',
    
    text: '#1E293B',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  
  dark: {
    primary: '#818CF8',
    primaryLight: '#A5B4FC',
    primaryDark: '#6366F1',
    
    success: '#4ADE80',
    successLight: '#86EFAC',
    successDark: '#22C55E',
    
    danger: '#F87171',
    dangerLight: '#FCA5A5',
    dangerDark: '#EF4444',
    
    warning: '#FBBF24',
    warningLight: '#FCD34D',
    warningDark: '#F59E0B',
    
    background: '#0F172A',
    backgroundSecondary: '#1E293B',
    
    card: '#1E293B',
    cardSecondary: '#334155',
    
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    
    border: '#334155',
    borderLight: '#475569',
    
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  
  // Category colors
  categories: {
    food: '#F59E0B',
    transport: '#3B82F6',
    shopping: '#EC4899',
    entertainment: '#8B5CF6',
    bills: '#EF4444',
    health: '#10B981',
    education: '#06B6D4',
    salary: '#22C55E',
    freelance: '#6366F1',
    investment: '#14B8A6',
    gift: '#F472B6',
    other: '#64748B',
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type ThemeColors = typeof colors.light;
