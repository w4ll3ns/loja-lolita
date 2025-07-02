
import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'admin' | 'vendedor' | 'caixa' | 'consultivo';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuários de exemplo para demonstração
const mockUsers: User[] = [
  { id: '1', name: 'João Admin', email: 'admin@loja.com', role: 'admin' },
  { id: '2', name: 'Maria Vendedora', email: 'vendedor@loja.com', role: 'vendedor' },
  { id: '3', name: 'Pedro Caixa', email: 'caixa@loja.com', role: 'caixa' },
  { id: '4', name: 'Ana Consultiva', email: 'consulta@loja.com', role: 'consultivo' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simula delay de login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validação simples para demonstração
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === '123456') {
      setUser(foundUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
