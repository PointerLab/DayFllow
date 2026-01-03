import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, signup as apiSignup } from '@/api/auth';

interface User {
  role: 'ADMIN' | 'HR' | 'EMP';
  login_id: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (loginId: string, password: string) => Promise<void>;
  signup: (userData: object) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('dayflow_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (loginId: string, password: string) => {
    const data = await apiLogin(loginId, password);
    const userData = { role: data.role, login_id: data.login_id };
    setUser(userData);
    localStorage.setItem('dayflow_user', JSON.stringify(userData));
    localStorage.setItem('dayflow_auth_tokens', JSON.stringify({ access: data.access, refresh: data.refresh }));
  };

  const signup = async (userData: object) => {
    return await apiSignup(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dayflow_user');
    localStorage.removeItem('dayflow_auth_tokens');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;

