import { Category, TransactionType } from '@/types';
import { colors } from '@/theme';

export const defaultCategories: Category[] = [
  // Expense Categories
  {
    id: 'food',
    name: 'Food & Dining',
    nameAr: 'الطعام',
    icon: 'restaurant',
    color: colors.categories.food,
    type: 'expense',
  },
  {
    id: 'transport',
    name: 'Transportation',
    nameAr: 'المواصلات',
    icon: 'car',
    color: colors.categories.transport,
    type: 'expense',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    nameAr: 'التسوق',
    icon: 'cart',
    color: colors.categories.shopping,
    type: 'expense',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    nameAr: 'الترفيه',
    icon: 'game-controller',
    color: colors.categories.entertainment,
    type: 'expense',
  },
  {
    id: 'bills',
    name: 'Bills & Utilities',
    nameAr: 'الفواتير',
    icon: 'receipt',
    color: colors.categories.bills,
    type: 'expense',
  },
  {
    id: 'health',
    name: 'Health',
    nameAr: 'الصحة',
    icon: 'medical',
    color: colors.categories.health,
    type: 'expense',
  },
  {
    id: 'education',
    name: 'Education',
    nameAr: 'التعليم',
    icon: 'school',
    color: colors.categories.education,
    type: 'expense',
  },
  {
    id: 'other_expense',
    name: 'Other',
    nameAr: 'أخرى',
    icon: 'ellipsis-horizontal',
    color: colors.categories.other,
    type: 'expense',
  },
  
  // Income Categories
  {
    id: 'salary',
    name: 'Salary',
    nameAr: 'الراتب',
    icon: 'wallet',
    color: colors.categories.salary,
    type: 'income',
  },
  {
    id: 'freelance',
    name: 'Freelance',
    nameAr: 'عمل حر',
    icon: 'briefcase',
    color: colors.categories.freelance,
    type: 'income',
  },
  {
    id: 'investment',
    name: 'Investment',
    nameAr: 'استثمار',
    icon: 'trending-up',
    color: colors.categories.investment,
    type: 'income',
  },
  {
    id: 'gift',
    name: 'Gift',
    nameAr: 'هدية',
    icon: 'gift',
    color: colors.categories.gift,
    type: 'income',
  },
  {
    id: 'other_income',
    name: 'Other',
    nameAr: 'أخرى',
    icon: 'ellipsis-horizontal',
    color: colors.categories.other,
    type: 'income',
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return defaultCategories.find(cat => cat.id === id);
};

export const getCategoriesByType = (type: TransactionType): Category[] => {
  return defaultCategories.filter(cat => cat.type === type);
};
