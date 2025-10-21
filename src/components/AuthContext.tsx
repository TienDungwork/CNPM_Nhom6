import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../src/services/api';

type UserRole = 'user' | 'admin' | null;

interface User {
  userId: number;
  username: string;
  email: string;
  fullName?: string;
  role: 'user' | 'admin';
  dateOfBirth?: string;
  gender?: string;
  height?: number;
  weight?: number;
}

interface AuthContextType {
  role: UserRole;
  userName: string | null;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  height?: number;
  weight?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          setRole(parsedUser.role);
          setUserName(parsedUser.name || parsedUser.fullName || parsedUser.username);

          // Try to verify token - but don't logout if it fails
          try {
            const response = await authAPI.getProfile();
            if (response.user) {
              setUser(response.user);
              setUserName(response.user.name || response.user.fullName || response.user.username);
              localStorage.setItem('user', JSON.stringify(response.user));
            }
          } catch (profileError) {
            // Profile fetch failed but keep user logged in with cached data
            console.warn('Profile verification failed, keeping cached session:', profileError);
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          // Only clear on JSON parse error
          if (error instanceof SyntaxError) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
            setRole(null);
            setUserName(null);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (emailOrUsername: string, password: string) => {
    try {
      const response = await authAPI.login({ email: emailOrUsername, password });
      
      const { token: newToken, user: newUser } = response;
      
      // Save to state
      setToken(newToken);
      setUser(newUser);
      setRole(newUser.role);
      setUserName(newUser.name || newUser.fullName || newUser.username);
      
      // Save to localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authAPI.register(data);
      
      const { token: newToken, user: newUser } = response;
      
      // Save to state
      setToken(newToken);
      setUser(newUser);
      setRole(newUser.role);
      setUserName(newUser.name || newUser.fullName || newUser.username);
      
      // Save to localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    // Clear state
    setToken(null);
    setUser(null);
    setRole(null);
    setUserName(null);
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    setUserName(updatedUser.fullName || updatedUser.username);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ 
      role, 
      userName, 
      user, 
      token, 
      isLoading,
      login, 
      register,
      logout,
      updateUser
    }}>
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
