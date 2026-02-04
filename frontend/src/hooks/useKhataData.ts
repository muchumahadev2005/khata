import { useEffect, useState } from "react";
import { Customer, Transaction, KhataStats } from "@/types/khata";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCustomers,
  getTransactions,
  addTransaction as apiAddTransaction,
  deleteCustomer as apiDeleteCustomer,
} from "@/api";

export const useKhataData = () => {
  const { user } = useAuth();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [cRes, tRes] = await Promise.all([
        getCustomers(),
        getTransactions(),
      ]);
      setCustomers(cRes.data);
      setTransactions(tRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchAllData();
    else {
      setCustomers([]);
      setTransactions([]);
    }
  }, [user]);

  // ✅ PHONE NUMBER INCLUDED
  const addTransaction = async (
    customerName: string,
    phoneNumber: string,
    amount: number,
    description: string,
    type: "debt" | "payment"
  ) => {
    await apiAddTransaction({
      name: customerName,
      phoneNumber: phoneNumber || undefined,
      amount,
      description,
      type: type === "debt" ? "DEBT" : "PAYMENT",
    });

    await fetchAllData();
  };

  const deleteCustomer = async (customerId: string) => {
    await apiDeleteCustomer(customerId);
    await fetchAllData();
  };

  const getCustomerTransactions = (customerId: string) =>
    transactions.filter((t) => t.customerId?._id === customerId);

  const getStats = (): KhataStats => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTx = transactions.filter(
      (t) => new Date(t.createdAt) >= today
    );

    return {
      totalCustomers: customers.length,
      totalOutstandingDebt: customers.reduce(
        (s, c) => s + (c.totalDebt || 0),
        0
      ),
      totalTransactionsToday: todayTx.length,
      recentTransactions: transactions.slice(0, 5),
    };
  };

  return {
    customers,
    transactions,
    loading,
    addTransaction,
    deleteCustomer,
    getCustomerTransactions,
    getStats,
  };
};
