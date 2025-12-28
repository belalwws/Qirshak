import { API_URL } from '@/utils/constants';
import { User, Transaction, AuthResponse, ApiError } from '@/types';
import { useAuthStore } from '@/store';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = useAuthStore.getState().token;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: 'An unexpected error occurred',
      }));
      throw new Error(error.message);
    }
    return response.json();
  }

  // Auth endpoints
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ name, email, password }),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async getProfile(): Promise<User> {
    const response = await fetch(`${this.baseUrl}/auth/profile`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<User>(response);
  }

  // Transaction endpoints
  async getTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${this.baseUrl}/transactions`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<Transaction[]>(response);
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const response = await fetch(`${this.baseUrl}/transactions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(transaction),
    });
    return this.handleResponse<Transaction>(response);
  }

  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    const response = await fetch(`${this.baseUrl}/transactions/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(transaction),
    });
    return this.handleResponse<Transaction>(response);
  }

  async deleteTransaction(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/transactions/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: 'Failed to delete transaction',
      }));
      throw new Error(error.message);
    }
  }

  async syncTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    const response = await fetch(`${this.baseUrl}/transactions/sync`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ transactions }),
    });
    return this.handleResponse<Transaction[]>(response);
  }
}

export const apiService = new ApiService();
