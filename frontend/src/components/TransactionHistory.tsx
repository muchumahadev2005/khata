import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, Clock, Users, LogIn } from "lucide-react";
import { Transaction, Customer } from "@/types/khata";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface TransactionHistoryProps {
  transactions: Transaction[];
  customer?: Customer;
}

export const TransactionHistory = ({
  transactions,
  customer,
}: TransactionHistoryProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const title = customer
    ? `${customer.name}'s Transactions`
    : "All Transactions";

  if (!user) {
    return (
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <LogIn className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-center mb-2">
            Sign In Required
          </h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Please sign in or create an account to view transaction history.
          </p>
          <div className="flex gap-4">
            <Button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="flex items-center gap-2 bg-sky-400 text-white hover:bg-sky-500 border-none"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no specific customer, group transactions by customer
  const groupedTransactions = customer
    ? null
    : transactions.reduce(
        (acc, transaction) => {
          const key = transaction.customerName;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(transaction);
          return acc;
        },
        {} as Record<string, Transaction[]>,
      );

  const customerSummaries = groupedTransactions
    ? Object.entries(groupedTransactions)
        .map(([customerName, customerTransactions]) => {
          const totalDebt = customerTransactions
            .filter((t) => t.type === "debt")
            .reduce((sum, t) => sum + t.amount, 0);
          const totalPayments = customerTransactions
            .filter((t) => t.type === "payment")
            .reduce((sum, t) => sum + t.amount, 0);
          const netAmount = totalDebt - totalPayments;
          const latestTransaction = customerTransactions.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )[0];

          return {
            customerName,
            transactionCount: customerTransactions.length,
            netAmount,
            latestDate: latestTransaction.date,
          };
        })
        .sort(
          (a, b) =>
            new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime(),
        )
    : null;

  return (
    <Card className="bg-gradient-card border-0 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              No transactions found. Start adding voice commands!
            </p>
          </div>
        ) : customer ? (
          // Individual transactions for specific customer
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
              .map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                    p-2 rounded-full
                    ${
                      transaction.type === "debt"
                        ? "bg-warning/10 text-warning"
                        : "bg-success/10 text-success"
                    }
                  `}
                    >
                      {transaction.type === "debt" ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {transaction.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {transaction.type}
                        </Badge>
                        {transaction.paymentMethod && (
                          <Badge variant="secondary" className="text-xs">
                            {transaction.paymentMethod}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === "debt"
                          ? "text-warning"
                          : "text-success"
                      }`}
                    >
                      {transaction.type === "debt" ? "+" : "-"}₹
                      {transaction.amount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          // Grouped view for all transactions
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {customerSummaries!.map((summary) => (
              <div
                key={summary.customerName}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {summary.customerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {summary.transactionCount} transaction
                      {summary.transactionCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      summary.netAmount > 0
                        ? "text-warning"
                        : summary.netAmount < 0
                          ? "text-success"
                          : "text-muted-foreground"
                    }`}
                  >
                    {summary.netAmount > 0
                      ? "+"
                      : summary.netAmount < 0
                        ? "-"
                        : ""}
                    ₹{Math.abs(summary.netAmount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last: {new Date(summary.latestDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
