import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useKhataData } from "@/hooks/useKhataData";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { VoiceInput } from "@/components/VoiceInput";
import { Dashboard } from "@/components/Dashboard";
import { CustomerList } from "@/components/CustomerList";
import { TransactionHistory } from "@/components/TransactionHistory";
import { Customer } from "@/types/khata";
import { LayoutDashboard, Users, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<Customer | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    customers,
    transactions,
    addTransaction,
    deleteCustomer,
    getCustomerTransactions,
    getStats,
  } = useKhataData();

  /* ✅ FIXED: phoneNumber INCLUDED */
  const handleVoiceCommand = (
    customerName: string,
    phoneNumber: string,
    amount: number,
    description: string,
    type: "debt" | "payment",
  ) => {
    addTransaction(customerName, phoneNumber, amount, description, type);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (selectedCustomer?._id === customerId) {
      setSelectedCustomer(null);
    }
    deleteCustomer(customerId);
  };

  const stats = getStats();
  const customerTransactions = selectedCustomer
    ? getCustomerTransactions(selectedCustomer._id)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Header showAuthButtons={!user} />

      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Voice / Manual Input */}
          <div className="lg:col-span-1 space-y-4">
            <VoiceInput
              onVoiceCommand={handleVoiceCommand}
              editData={
                selectedCustomer
                  ? {
                      customerName: selectedCustomer.name,
                      phone: selectedCustomer.phone || "",
                      description: `Locked: ${selectedCustomer.name}`,
                      amount: "",
                      type: "debt",
                    }
                  : undefined
              }
              onClear={() => setSelectedCustomer(null)}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dashboard" className="flex gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="customers" className="flex gap-2">
                  <Users className="h-4 w-4" />
                  Customers
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex gap-2">
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
    </div>
  );
};

export default Index;
