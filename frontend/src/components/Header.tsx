import React from "react";
import { BookOpen, Mic, LogOut, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  showAuthButtons?: boolean;
}

export const Header = ({ showAuthButtons = false }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b bg-gradient-card shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between sm:gap-0 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Digital Khata
              </h1>
              <p className="text-sm text-muted-foreground">
                Voice-powered ledger management
              </p>
            </div>
          </div>
          <div className="flex sm:items-center items-start sm:flex-row flex-col gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mic className="h-4 w-4 text-accent" />
              <span>Voice Ready</span>
            </div>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.phone}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};
