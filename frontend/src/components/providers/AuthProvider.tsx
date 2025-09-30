import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import type { AuthContextType } from '../../contexts/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        name: 'Demo User',
        email,
      };
      
      setUser(mockUser);
    } catch {
      // Handle error silently for now
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (name: string, email: string): Promise<void> => {
    const mockUser: User = {
      id: '1',
      name,
      email,
    };
    setUser(mockUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};