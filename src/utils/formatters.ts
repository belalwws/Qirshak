import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

export const formatCurrency = (
  amount: number,
  currency: string = 'EGP',
  locale: string = 'ar-EG'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatAmount = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toFixed(0);
};

export const formatDate = (
  dateString: string,
  formatStr: string = 'dd MMM yyyy',
  isArabic: boolean = false
): string => {
  const date = parseISO(dateString);
  return format(date, formatStr, { locale: isArabic ? ar : enUS });
};

export const formatRelativeDate = (dateString: string, isArabic: boolean = true): string => {
  const date = parseISO(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (isArabic) {
    if (diffInDays === 0) return 'اليوم';
    if (diffInDays === 1) return 'أمس';
    if (diffInDays < 7) return `منذ ${diffInDays} أيام`;
  } else {
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
  }
  
  return format(date, 'dd MMM yyyy', { locale: isArabic ? ar : enUS });
};

export const getMonthRange = (date: Date = new Date()) => {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
};

export const getLastMonths = (count: number = 6): Date[] => {
  const months: Date[] = [];
  for (let i = 0; i < count; i++) {
    months.push(subMonths(new Date(), i));
  }
  return months.reverse();
};

export const isInCurrentMonth = (dateString: string): boolean => {
  const date = parseISO(dateString);
  const { start, end } = getMonthRange();
  return isWithinInterval(date, { start, end });
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const truncateText = (text: string, maxLength: number = 30): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
