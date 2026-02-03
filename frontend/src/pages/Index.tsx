import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useKhataData } from '@/hooks/useKhataData';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { VoiceInput } from '@/components/VoiceInput';
import { Dashboard } from '@/components/Dashboard';
import { CustomerList } from '@/components/CustomerList';
import { TransactionHistory } from '@/components/TransactionHistory';
import { Customer } from '@/types/khata';
import { LayoutDashboard, Users, History, Mic, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
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
      <Header showAuthButtons={!user} />
      
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

      {/* Authentication modal removed — header Sign In button handles navigation */}
    </div>
  );
};

export default Index;
