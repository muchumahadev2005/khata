import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthState } from '@/types/khata';

interface AuthContextProps extends AuthState {
  login: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AUTH_STORAGE_KEY = 'smart_credit_speak_auth_user';

const generateMockOTP = () => {
  // For demo purposes, generate a fixed OTP or random OTP
  return '123456';
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentOTP, setSentOTP] = useState<string | null>(null);
  const [otpExpiresAt, setOtpExpiresAt] = useState<Date | null>(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (phone: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate sending OTP
      const otp = generateMockOTP();
      setSentOTP(otp);
      setOtpExpiresAt(new Date(Date.now() + 5 * 60 * 1000)); // OTP valid for 5 minutes
      // In real app, send OTP via SMS API here
      console.log(`OTP sent to ${phone}: ${otp}`);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!sentOTP || !otpExpiresAt) {
        throw new Error('No OTP sent. Please request OTP again.');
      }
      if (new Date() > otpExpiresAt) {
        throw new Error('OTP expired. Please request OTP again.');
      }
      if (otp !== sentOTP) {
        throw new Error('Invalid OTP. Please try again.');
      }
      // OTP verified, create user session
      const newUser: User = {
        id: phone,
        phone,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUser(newUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      setSentOTP(null);
      setOtpExpiresAt(null);
    } catch (err: any) {
      setError(err.message || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
