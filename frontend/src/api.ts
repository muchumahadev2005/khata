import axios from "axios";

const AUTH_TOKEN_KEY = "smart_credit_speak_token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // http://localhost:5000
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* =======================
   TRANSACTIONS
======================= */

export const addTransaction = (data: {
  name: string;
  phoneNumber: string;
  amount: number;
  description: string;
  type: "DEBT" | "PAYMENT";
}) => {
  return api.post("/api/transactions", data);
};

export const getTransactions = () => {
  return api.get("/api/transactions");
};

/* =======================
   CUSTOMERS
======================= */

export const getCustomers = () => {
  return api.get("/api/customers");
};

export const deleteCustomer = (customerId: string) => {
  return api.delete(`/api/customers/${customerId}`);
};

/* =======================
   DASHBOARD
======================= */

export const getDashboard = () => {
  return api.get("/api/dashboard");
};

export default api;
