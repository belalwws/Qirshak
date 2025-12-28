export const APP_NAME = 'قرشك - Qirshak';

// Use your computer's IP address for mobile testing
// Run 'ipconfig' in terminal to find your IPv4 address
export const API_URL = 'http://192.168.1.3:3000/api';

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
