import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Users, TrendingDown } from 'lucide-react';

interface QuickActionsProps {
  onQuickDebt: () => void;
  onQuickPayment: () => void;
  onViewCustomers: () => void;
}

export const QuickActions = ({ onQuickDebt, onQuickPayment, onViewCustomers }: QuickActionsProps) => {
  return (
    <Card className="bg-gradient-card border-0 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <Button 
            onClick={onQuickDebt}
            className="justify-start gap-3 h-12"
            variant="outline"
          >
            <PlusCircle className="h-4 w-4 text-warning" />
            Record Debt
          </Button>
          
          <Button 
            onClick={onQuickPayment}
            className="justify-start gap-3 h-12"
            variant="outline"
          >
            <TrendingDown className="h-4 w-4 text-success" />
            Record Payment
          </Button>
          
          <Button 
            onClick={onViewCustomers}
            className="justify-start gap-3 h-12"
            variant="outline"
          >
            <Users className="h-4 w-4 text-primary" />
            View All Customers
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};