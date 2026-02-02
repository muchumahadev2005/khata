import { useState, useEffect } from 'react';
import { Customer, Transaction, KhataStats } from '../types/khata';
import { sampleCustomers, sampleTransactions } from '../data/sampleData';
import { useAuth } from '../contexts/AuthContext';

const getUserStorageKeys = (userId: string) => ({
  CUSTOMERS: `khata_customers_${userId}`,
  TRANSACTIONS: `khata_transactions_${userId}`,
  INITIALIZED: `khata_initialized_${userId}`,
});

export const useKhataData = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load data from localStorage on mount, with sample data fallback
  useEffect(() => {
    if (!user) {
      // Clear data when user logs out
      setCustomers([]);
      setTransactions([]);
      return;
    }

    const STORAGE_KEYS = getUserStorageKeys(user.id);
    const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    const savedCustomers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    const savedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);

    if (!isInitialized) {
      // First time loading for this user - use sample data
      setCustomers(sampleCustomers);
      setTransactions(sampleTransactions);
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    } else {
      // Load saved data
      if (savedCustomers) {
        setCustomers(JSON.parse(savedCustomers));
      }
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
    }
  }, [user]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!user) return;
    const STORAGE_KEYS = getUserStorageKeys(user.id);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers, user]);

  useEffect(() => {
    if (!user) return;
    const STORAGE_KEYS = getUserStorageKeys(user.id);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions, user]);

  const addCustomer = (name: string, phone?: string): Customer => {
    const newCustomer: Customer = {
      id: Date.now().toString(),
      name,
      phone,
      totalDebt: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setCustomers(prev => [...prev, newCustomer]);
    return newCustomer;
  };

  const addTransaction = (
    customerName: string,
    amount: number,
    description: string,
    type: 'debt' | 'payment' | 'adjustment',
    paymentMethod?: 'cash' | 'digital' | 'check'
  ): Transaction => {
    // Find or create customer
    let customer = customers.find(c => 
      c.name.toLowerCase() === customerName.toLowerCase()
    );
    
    if (!customer) {
      customer = addCustomer(customerName);
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      customerId: customer.id,
      customerName: customer.name,
      type,
      amount,
      description,
      date: new Date(),
      paymentMethod,
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Update customer debt (allow negative values for credits)
    setCustomers(prev => prev.map(c => {
      if (c.id === customer!.id) {
        const debtChange = type === 'debt' ? amount : -amount;
        return {
          ...c,
          totalDebt: c.totalDebt + debtChange,
          updatedAt: new Date(),
        };
      }
      return c;
    }));

    return newTransaction;
  };

  const getCustomerTransactions = (customerId: string): Transaction[] => {
    return transactions.filter(t => t.customerId === customerId);
  };

  const deleteCustomer = (customerId: string) => {
    // Remove customer only, keep transactions
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    
    // Do not remove transactions for this customer to keep transaction history permanent
    // setTransactions(prev => prev.filter(t => t.customerId !== customerId));
  };

  const getStats = (): KhataStats => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayTransactions = transactions.filter(t => 
      new Date(t.date) >= today
    );

    return {
      totalCustomers: customers.length,
      totalOutstandingDebt: customers.reduce((sum, c) => sum + c.totalDebt, 0),
      totalTransactionsToday: todayTransactions.length,
      recentTransactions: transactions.slice(0, 5),
    };
  };

  return {
    customers,
    transactions,
    addCustomer,
    addTransaction,
    deleteCustomer,
    getCustomerTransactions,
    getStats,
  };
};