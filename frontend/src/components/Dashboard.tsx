import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, IndianRupee, TrendingUp, Clock, LogIn } from 'lucide-react';
import { KhataStats } from '@/types/khata';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  stats: KhataStats;
}

export const Dashboard = ({ stats }: DashboardProps) => {
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
            Please sign in or create an account to view your dashboard and manage your khata records.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/login')} className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
            <Button onClick={() => navigate('/signup')} variant="outline" className="flex items-center gap-2">
              Create Account
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.totalCustomers}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Outstanding Debt
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              ₹{stats.totalOutstandingDebt.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Transactions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {stats.totalTransactionsToday}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Status
            </CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              Live
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentTransactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No transactions yet. Start by adding a voice command!
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50"
                >
                  <div className="flex-1">
                    <p className="font-medium">{transaction.customerName}</p>
                    <p className="text-sm text-muted-foreground">{transaction.description}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'debt' ? 'text-warning' : 'text-success'
                    }`}>
                      {transaction.type === 'debt' ? '+' : '-'}₹{transaction.amount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
