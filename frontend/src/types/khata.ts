export interface Customer {
  id: string;
  name: string;
  phone?: string;
  totalDebt: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  type: 'debt' | 'payment' | 'adjustment';
  amount: number;
  description: string;
  date: Date;
  paymentMethod?: 'cash' | 'digital' | 'check';
}

export interface KhataStats {
  totalCustomers: number;
  totalOutstandingDebt: number;
  totalTransactionsToday: number;
  recentTransactions: Transaction[];
}

// Authentication related types
export interface User {
  id: string;
  phone: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface OTPVerification {
  phone: string;
  otp: string;
  expiresAt: Date;
}
