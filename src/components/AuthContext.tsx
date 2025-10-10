import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'user' | 'admin' | null;

interface AuthContextType {
  role: UserRole;
  userName: string | null;
  login: (role: UserRole, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const login = (newRole: UserRole, name: string) => {
    setRole(newRole);
    setUserName(name);
  };

  const logout = () => {
    setRole(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ role, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
