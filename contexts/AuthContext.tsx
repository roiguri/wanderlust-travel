import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { router } from 'expo-router';
import { storeTokens, storeUser, clearAuthData, getUser, isAuthenticated } from '@/lib/storage';
import { registerUser, loginUser, logoutUser, RegisterData, LoginData, AuthResponse } from '@/lib/api';

interface User {
  id: string;
  email: string;
  username: string;
  profile_picture_url?: string;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = !!user;

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const authenticated = await isAuthenticated();
      
      if (authenticated) {
        const userData = await getUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Clear any corrupted auth data
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = async (authData: AuthResponse) => {
    try {
      // Store tokens and user data
      await storeTokens(authData.token, authData.refreshToken);
      await storeUser(authData.user);
      
      // Update state
      setUser(authData.user);
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Failed to save authentication data');
    }
  };

  const login = async (data: LoginData) => {
    try {
      const authData = await loginUser(data);
      await handleAuthSuccess(authData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const authData = await registerUser(data);
      await handleAuthSuccess(authData);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await logoutUser();
      await clearAuthData();
      setUser(null);
      
      // Navigate to login page after logout
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      await clearAuthData();
      setUser(null);
      
      // Navigate to login page even if logout fails
      router.replace('/(auth)/login');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}