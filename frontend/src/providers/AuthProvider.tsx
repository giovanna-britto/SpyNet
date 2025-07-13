// src/providers/AuthProvider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser } from '@/services/authService';
import type { AuthContextType, User, LoginCredentials, RegistrationData } from '@/types';
import { toast } from "sonner";
import { LoadingSpinner } from '@/components/ui/loadingSpinner'; 
import { useDisconnect } from 'wagmi';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestLoading, setIsRequestLoading] = useState(false); 

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUserJSON = localStorage.getItem('authUser');
      if (storedToken && storedUserJSON && storedUserJSON !== 'undefined') {
        setToken(storedToken);
        setUser(JSON.parse(storedUserJSON));
      }
    } catch (error) {
      console.error("Failed to load authentication data from localStorage", error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    } finally {
      setIsLoading(false); 
    }
  }, []);

  const handleAuth = (authToken: string, userData: User) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('authUser', JSON.stringify(userData));
  };

  const login = async (data: LoginCredentials) => {
    setIsRequestLoading(true); 
    try {
      const response = await loginUser(data);
      
      const userData: User = {
        user_id: response.user_id ?? '',
        name: response.name ?? '',
        email: response.email ?? '',
        role: response.role ?? '' 
      };

      handleAuth(response.access_token, userData);
      toast.success("Login successful!");
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsRequestLoading(false); 
    }
  };

  const register = async (data: RegistrationData): Promise<void> => {
    setIsRequestLoading(true);
    try {
      await registerUser(data); 
      toast.success("Registration successful! Please log in.");
      router.push('/login?registered=true');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Registration failed. Please check your data.");
    } finally {
      setIsRequestLoading(false);
    }
  };

  const logout = () => {
    disconnect(); 
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, isLoading: isRequestLoading }}>
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center h-screen">
          <LoadingSpinner />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
