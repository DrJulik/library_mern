import { createContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';
import { AuthContextType, User, RegisterData, AuthResponse } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<void> => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await authService.login(email, password);
    if (response.success && response.user) {
      setUser(response.user);
      setIsAuthenticated(true);
    }
    return response;
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await authService.register(userData);
    return response;
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    register,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

