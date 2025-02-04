export type UserType = 'farmer' | 'retailer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  type: UserType;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
} 