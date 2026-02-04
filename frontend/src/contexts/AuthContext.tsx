import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  googleLogin: (googleToken: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AUTH_TOKEN_KEY = "smart_credit_speak_token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔁 Load token on refresh
  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);
        setUser({
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
        });
        setToken(storedToken);
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    }
  }, []);

  // 🔐 Google login handler
  const googleLogin = async (googleToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: googleToken }),
      });

      if (!res.ok) {
        throw new Error("Google authentication failed");
      }

      const data = await res.json();
      const decoded: any = jwtDecode(data.token);

      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      setToken(data.token);
      setUser({
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
      });
    } catch (err: any) {
      setError(err.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        error,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
