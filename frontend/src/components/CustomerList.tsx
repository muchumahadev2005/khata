import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, User, IndianRupee, Trash2, LogIn } from 'lucide-react';
import { Customer } from '@/types/khata';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CustomerListProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
}

export const CustomerList = ({ customers, onSelectCustomer, onDeleteCustomer }: CustomerListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <LogIn className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-center mb-2">
            Sign In Required
          </h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Please sign in or create an account to view and manage your customers.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="flex items-center gap-2 bg-sky-400 text-white hover:bg-sky-500 border-none">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleDeleteClick = (e: React.MouseEvent, customerId: string, customerName: string) => {
    e.stopPropagation(); // Prevent triggering onSelectCustomer
    if (confirm(`Are you sure you want to delete ${customerName}? Their transactions will remain in the history.`)) {
      onDeleteCustomer(customerId);
      toast({
        title: "Customer deleted",
        description: `${customerName} has been removed. Their transaction history remains intact.`,
      });
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

  return (
    <Card className="bg-gradient-card border-0 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Customers ({customers.length})
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-8">
            <User className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              {customers.length === 0 
                ? 'No customers yet. Add transactions via voice commands!'
                : 'No customers found matching your search.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredCustomers
              .sort((a, b) => b.totalDebt - a.totalDebt)
              .map((customer) => (
               <div
                 key={customer.id}
                 onClick={() => onSelectCustomer(customer)}
                 className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 cursor-pointer transition-colors"
               >
                 <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{customer.name}</p>
                      {customer.totalDebt > 0 && (
                        <Badge variant={customer.totalDebt > 1000 ? "destructive" : "secondary"}>
                          ₹{customer.totalDebt}
                        </Badge>
                      )}
                      {customer.totalDebt < 0 && (
                        <Badge className="bg-credit text-credit-foreground">
                          Credit ₹{Math.abs(customer.totalDebt)}
                        </Badge>
                      )}
                    </div>
                   {customer.phone && (
                     <p className="text-sm text-muted-foreground">{customer.phone}</p>
                   )}
                   <p className="text-xs text-muted-foreground">
                     Last updated: {new Date(customer.updatedAt).toLocaleDateString()}
                   </p>
                 </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      {customer.totalDebt > 0 ? (
                        <div className="flex items-center gap-1 text-warning">
                          <IndianRupee className="h-4 w-4" />
                          <span className="font-semibold">{customer.totalDebt}</span>
                        </div>
                      ) : customer.totalDebt < 0 ? (
                        <div className="flex items-center gap-1 text-credit">
                          <IndianRupee className="h-4 w-4" />
                          <span className="font-semibold">{Math.abs(customer.totalDebt)}</span>
                          <span className="text-xs">Credit</span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-success border-success">
                          Clear
                        </Badge>
                      )}
                    </div>
                   <Button
                     variant="ghost"
                     size="icon"
                     onClick={(e) => handleDeleteClick(e, customer.id, customer.name)}
                     className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                   >
                     <Trash2 className="h-4 w-4" />
                   </Button>
                 </div>
               </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};