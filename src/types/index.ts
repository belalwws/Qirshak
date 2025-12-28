// Transaction Types
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string;
  date: string; // ISO string
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  color: string;
  type: TransactionType;
}

// Store Types
export interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionsByDateRange: (startDate: string, endDate: string) => Transaction[];
  getTotalByType: (type: TransactionType, month?: number, year?: number) => number;
}

export interface SettingsStore {
  currency: string;
  currencySymbol: string;
  isDarkMode: boolean;
  language: 'en' | 'ar';
  setCurrency: (currency: string, symbol: string) => void;
  toggleDarkMode: () => void;
  setLanguage: (lang: 'en' | 'ar') => void;
}

// Chart Types
export interface ChartData {
  label: string;
  value: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  lastSyncedAt: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  code?: string;
}
