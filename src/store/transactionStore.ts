import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, TransactionType } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';
import { generateId, getMonthRange } from '@/utils/formatters';
import { parseISO, isWithinInterval } from 'date-fns';

interface TransactionState {
  transactions: Transaction[];
  
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  clearAllTransactions: () => void;
  
  // Selectors
  getTransactionById: (id: string) => Transaction | undefined;
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getTransactionsByDateRange: (startDate: Date, endDate: Date) => Transaction[];
  getCurrentMonthTransactions: () => Transaction[];
  getTotalByType: (type: TransactionType, month?: number, year?: number) => number;
  getBalance: () => number;
  getCurrentMonthIncome: () => number;
  getCurrentMonthExpense: () => number;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      
      addTransaction: (transactionData) => {
        const newTransaction: Transaction = {
          ...transactionData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },
      
      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },
      
      clearAllTransactions: () => {
        set({ transactions: [] });
      },
      
      getTransactionById: (id) => {
        return get().transactions.find((t) => t.id === id);
      },
      
      getTransactionsByType: (type) => {
        return get().transactions.filter((t) => t.type === type);
      },
      
      getTransactionsByDateRange: (startDate, endDate) => {
        return get().transactions.filter((t) => {
          const date = parseISO(t.date);
          return isWithinInterval(date, { start: startDate, end: endDate });
        });
      },
      
      getCurrentMonthTransactions: () => {
        const { start, end } = getMonthRange();
        return get().getTransactionsByDateRange(start, end);
      },
      
      getTotalByType: (type, month?, year?) => {
        let transactions = get().transactions.filter((t) => t.type === type);
        
        if (month !== undefined && year !== undefined) {
          transactions = transactions.filter((t) => {
            const date = parseISO(t.date);
            return date.getMonth() === month && date.getFullYear() === year;
          });
        }
        
        return transactions.reduce((sum, t) => sum + t.amount, 0);
      },
      
      getBalance: () => {
        const transactions = get().transactions;
        return transactions.reduce((balance, t) => {
          return t.type === 'income' 
            ? balance + t.amount 
            : balance - t.amount;
        }, 0);
      },
      
      getCurrentMonthIncome: () => {
        const now = new Date();
        return get().getTotalByType('income', now.getMonth(), now.getFullYear());
      },
      
      getCurrentMonthExpense: () => {
        const now = new Date();
        return get().getTotalByType('expense', now.getMonth(), now.getFullYear());
      },
    }),
    {
      name: STORAGE_KEYS.TRANSACTIONS,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
