export interface Customer {
  _id: string;
  name: string;
  phone: string;
  totalDebt: number;
  updatedAt: string;
}

export interface TransactionCustomerRef {
  _id: string;
  name: string;
  phone: string;
}

export interface Transaction {
  _id: string;
  type: 'DEBT' | 'PAYMENT';
  amount: number;
  description: string;
  createdAt: string;
  customerId: TransactionCustomerRef; // populated by backend
  customerName?: string; // snapshot name from backend
  paymentMethod?: 'cash' | 'digital' | 'check';
}

export interface KhataStats {
  totalCustomers: number;
  totalOutstandingDebt: number;
  totalTransactionsToday: number;
  recentTransactions: Transaction[];
}

// Minimal authentication types used in UI
export interface User {
  id: string;
  email?: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}