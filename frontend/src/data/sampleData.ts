import { Customer, Transaction } from '../types/khata';

export const sampleCustomers: Customer[] = [
  {
    id: '1',
    name: 'Ramesh Kumar',
    phone: '+91 98765 43210',
    totalDebt: 1500,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2', 
    name: 'Priya Sharma',
    phone: '+91 87654 32109',
    totalDebt: 750,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    name: 'Mohammed Ali',
    totalDebt: 0,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-17'),
  },
];

export const sampleTransactions: Transaction[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Ramesh Kumar',
    type: 'debt',
    amount: 500,
    description: 'Groceries and household items',
    date: new Date('2024-01-20'),
  },
  {
    id: '2',
    customerId: '1', 
    customerName: 'Ramesh Kumar',
    type: 'debt',
    amount: 1000,
    description: 'Rice and wheat flour',
    date: new Date('2024-01-15'),
  },
  {
    id: '3',
    customerId: '2',
    customerName: 'Priya Sharma',
    type: 'debt', 
    amount: 750,
    description: 'Vegetables and fruits',
    date: new Date('2024-01-18'),
  },
  {
    id: '4',
    customerId: '3',
    customerName: 'Mohammed Ali',
    type: 'debt',
    amount: 300,
    description: 'Tea and snacks',
    date: new Date('2024-01-16'),
  },
  {
    id: '5',
    customerId: '3',
    customerName: 'Mohammed Ali', 
    type: 'payment',
    amount: 300,
    description: 'Paid for tea and snacks',
    date: new Date('2024-01-17'),
    paymentMethod: 'cash',
  },
];