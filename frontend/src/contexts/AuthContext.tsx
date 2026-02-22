import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, signup as apiSignup } from '@/api/auth';

interface User {
  first_name: string;
  last_name: string;
  email: string;
  company_name?: string;
  role: 'ADMIN' | 'HR' | 'EMP' | 'INT';
  login_id: string;
  date_of_joining?: string;
  department?: string;
  employment_type?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (loginId: string, password: string, userDetails?: Partial<User>) => Promise<User>;
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

  const login = async (loginId: string, password: string, userDetails?: Partial<User>) => {
    const data = await apiLogin(loginId, password);
    const userData: User = {
      role: data.role,
      login_id: data.login_id,
      first_name: data.first_name ?? userDetails?.first_name ?? '',
      last_name: data.last_name ?? userDetails?.last_name ?? '',
      email: data.email ?? userDetails?.email ?? loginId,
      company_name: data.company_name ?? userDetails?.company_name ?? '',
      date_of_joining: data.date_of_joining ?? userDetails?.date_of_joining,
      department: data.department ?? userDetails?.department ?? '',
      employment_type: data.employment_type ?? userDetails?.employment_type ?? '',
    };
    setUser(userData);
    localStorage.setItem('dayflow_user', JSON.stringify(userData));
    localStorage.setItem('dayflow_auth_tokens', JSON.stringify({ access: data.access, refresh: data.refresh }));
    return userData;
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
