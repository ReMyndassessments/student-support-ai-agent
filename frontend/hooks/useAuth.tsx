import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import backend from '~backend/client';
import type { UserProfile } from '~backend/users/me';
import type { LoginRequest } from '~backend/auth/login';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const profile = await backend.users.me();
        setUser(profile);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await backend.auth.login(credentials);
    if (response.success) {
      const profile = await backend.users.me();
      setUser(profile);
    }
  };

  const logout = async () => {
    await backend.auth.logout();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAdmin: user?.isAdmin ?? false,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
