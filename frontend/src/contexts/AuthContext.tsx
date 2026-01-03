import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  department?: string;
  employeeId?: string;
  avatar?: string;
  companyLogo?: string;
  companyName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  companyLogo: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, company: string, password: string, logo?: string) => Promise<boolean>;
  logout: () => void;
  setCompanyLogo: (logo: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  { id: '1', name: 'Sarah Johnson', email: 'admin@dayflow.com', role: 'admin', department: 'Human Resources', employeeId: 'ADM001' },
  { id: '2', name: 'John Smith', email: 'employee@dayflow.com', role: 'employee', department: 'Engineering', employeeId: 'EMP001' },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [companyLogo, setCompanyLogoState] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem('dayflow_user');
    const storedLogo = localStorage.getItem('dayflow_company_logo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedLogo) {
      setCompanyLogoState(storedLogo);
    }
  }, []);

  const setCompanyLogo = (logo: string | null) => {
    setCompanyLogoState(logo);
    if (logo) {
      localStorage.setItem('dayflow_company_logo', logo);
    } else {
      localStorage.removeItem('dayflow_company_logo');
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if using employee ID (starts with letters)
    const isEmployeeId = /^[A-Za-z]/.test(email);
    
    let foundUser = mockUsers.find(u => 
      isEmployeeId ? u.employeeId?.toLowerCase() === email.toLowerCase() : u.email.toLowerCase() === email.toLowerCase()
    );

    if (!foundUser) {
      // For demo, create a user based on email pattern
      if (email.includes('admin')) {
        foundUser = { ...mockUsers[0], email };
      } else {
        foundUser = { ...mockUsers[1], email };
      }
    }

    if (password.length >= 8) {
      setUser(foundUser);
      localStorage.setItem('dayflow_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, company: string, password: string, logo?: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (password.length >= 8) {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role: 'admin', // New signups are admins (company owners)
        department: 'Management',
        employeeId: `ADM${Date.now().toString().slice(-3)}`,
        companyName: company,
        companyLogo: logo,
      };
      setUser(newUser);
      localStorage.setItem('dayflow_user', JSON.stringify(newUser));
      if (logo) {
        setCompanyLogo(logo);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCompanyLogoState(null);
    localStorage.removeItem('dayflow_user');
    localStorage.removeItem('dayflow_company_logo');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, companyLogo, login, signup, logout, setCompanyLogo }}>
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
