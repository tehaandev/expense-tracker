export interface User {
  id: string;
  email: string;
  name?: string;
  monthlyExpenseLimit?: number;
  currency: string;
  limitEnabled: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export interface AuthError {
  message: string;
  status?: number;
}

