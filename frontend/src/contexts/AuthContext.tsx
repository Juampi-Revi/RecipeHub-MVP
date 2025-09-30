import { createContext } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);