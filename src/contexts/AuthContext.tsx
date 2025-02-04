import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserType, LoginCredentials, AuthState } from '../types/auth';

// Mock users for testing
const MOCK_USERS = [
  {
    id: '1',
    email: 'farmer@example.com',
    password: 'password123',
    name: 'John Farmer',
    type: 'farmer' as UserType,
  },
  {
    id: '2',
    email: 'retailer@example.com',
    password: 'password123',
    name: 'Mike Retailer',
    type: 'retailer' as UserType,
  },
  {
    id: '3',
    email: 'farmer2@example.com',
    password: 'password123',
    name: 'Sarah Farmer',
    type: 'farmer' as UserType,
  },
  {
    id: '4',
    email: 'farmer3@example.com',
    password: 'password123',
    name: 'David Farmer',
    type: 'farmer' as UserType,
  },
  {
    id: '5',
    email: 'retailer2@example.com',
    password: 'password123',
    name: 'Lisa Retailer',
    type: 'retailer' as UserType,
  },
  {
    id: '6',
    email: 'retailer3@example.com',
    password: 'password123',
    name: 'Tom Retailer',
    type: 'retailer' as UserType,
  },
  {
    id: '7',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    type: 'admin' as UserType,
  }
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple storage key
const AUTH_STORAGE_KEY = 'freshchain_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  // Load user data on mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedData) {
        const userData = JSON.parse(storedData);
        setAuthState({
          user: userData,
          isAuthenticated: true,
          loading: false,
        });
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find matching user
      const user = MOCK_USERS.find(
        u => u.email === credentials.email && 
             u.type === credentials.type &&
             u.password === credentials.password
      );

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Create user object without password
      const userData: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
      };

      // Store in localStorage
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));

      // Update state
      setAuthState({
        user: userData,
        isAuthenticated: true,
        loading: false,
      });

    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear storage
    localStorage.removeItem(AUTH_STORAGE_KEY);

    // Reset state
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  const value: AuthContextType = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
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