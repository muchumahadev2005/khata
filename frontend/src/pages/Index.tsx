import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useKhataData } from '@/hooks/useKhataData';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { VoiceInput } from '@/components/VoiceInput';
import { Dashboard } from '@/components/Dashboard';
import { CustomerList } from '@/components/CustomerList';
import { TransactionHistory } from '@/components/TransactionHistory';
import { Customer } from '@/types/khata';
import { LayoutDashboard, Users, History, Mic, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { customers, transactions, addTransaction, deleteCustomer, getCustomerTransactions, getStats } = useKhataData();
  
  const handleVoiceCommand = (customerName: string, amount: number, description: string, type: 'debt' | 'payment') => {
    addTransaction(customerName, amount, description, type);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleDeleteCustomer = (customerId: string) => {
    // If the selected customer is being deleted, clear selection
    if (selectedCustomer?.id === customerId) {
      setSelectedCustomer(null);
    }
    deleteCustomer(customerId);
  };

  const stats = getStats();
  const customerTransactions = selectedCustomer ? getCustomerTransactions(selectedCustomer.id) : [];

  return (
    <div className="min-h-screen bg-background">
      <Header showAuthButtons={!user && !showAuthModal} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Voice Input - Always visible */}
          <div className="lg:col-span-1 space-y-4">
            <VoiceInput onVoiceCommand={handleVoiceCommand} />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="customers" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Customers
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Transactions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <Dashboard stats={stats} />
              </TabsContent>

              <TabsContent value="customers">
                <div className="space-y-6">
                <CustomerList 
                  customers={customers} 
                  onSelectCustomer={handleSelectCustomer}
                  onDeleteCustomer={handleDeleteCustomer}
                />
                  {selectedCustomer && (
                    <TransactionHistory
                      transactions={customerTransactions}
                      customer={selectedCustomer}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="transactions">
                <TransactionHistory transactions={transactions} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

      </main>

      {/* Authentication Modal */}
      <Dialog open={!user && showAuthModal} modal onOpenChange={(open) => {
        if (!open) {
          // Close modal on X click
          // Allow modal to close and show login/signup buttons on top right
          setShowAuthModal(false);
        }
      }}>
        <DialogContent className="sm:max-w-md relative">
          <button
            aria-label="Close"
            className="absolute top-3 right-3 rounded-md p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setShowAuthModal(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              Welcome to Smart Credit Speak
            </DialogTitle>
            <DialogDescription className="text-center">
              Sign in to your account to manage your khata and access all features.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-6">
            <Button
              onClick={() => navigate('/login')}
              className="w-full flex items-center gap-2"
              size="lg"
            >
              <LogIn className="h-5 w-5" />
              Sign In
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              variant="outline"
              className="w-full flex items-center gap-2"
              size="lg"
            >
              <UserPlus className="h-5 w-5" />
              Create Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
