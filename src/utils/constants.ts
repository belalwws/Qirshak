export const APP_NAME = 'قرشك - Qirshak';

// Production API URL
export const API_URL = 'https://qirshak.onrender.com/api';

export const CURRENCIES = [
  { code: 'EGP', symbol: 'ج.م', name: 'Egyptian Pound', nameAr: 'جنيه مصري', nameEn: 'Egyptian Pound' },
  { code: 'USD', symbol: '$', name: 'US Dollar', nameAr: 'دولار أمريكي', nameEn: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro', nameAr: 'يورو', nameEn: 'Euro' },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', nameAr: 'ريال سعودي', nameEn: 'Saudi Riyal' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', nameAr: 'درهم إماراتي', nameEn: 'UAE Dirham' },
  { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', nameAr: 'دينار كويتي', nameEn: 'Kuwaiti Dinar' },
];

export const STORAGE_KEYS = {
  TRANSACTIONS: '@qirshak_transactions',
  SETTINGS: '@qirshak_settings',
  CATEGORIES: '@qirshak_categories',
  AUTH: '@qirshak_auth',
} as const;

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

export const HAPTIC_FEEDBACK = {
  light: 'light',
  medium: 'medium',
  heavy: 'heavy',
  success: 'success',
  warning: 'warning',
  error: 'error',
} as const;
