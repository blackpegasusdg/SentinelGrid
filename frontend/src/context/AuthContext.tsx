import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/types';
import { users, getApiError } from '@/services/api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sg_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const logout = useCallback(() => {
    localStorage.removeItem('sg_token');
    localStorage.removeItem('sg_user');
    setToken(null);
    setUser(null);
  }, []);

  // After login, fetch user profile
  const login = useCallback(async (accessToken: string) => {
    localStorage.setItem('sg_token', accessToken);
    setToken(accessToken);
    try {
      const me = await users.me();
      setUser(me);
      localStorage.setItem('sg_user', JSON.stringify(me));
    } catch (e) {
      setError(getApiError(e));
      logout();
    }
  }, [logout]);

  // On mount: restore session
  useEffect(() => {
    const storedToken = localStorage.getItem('sg_token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    users.me()
      .then(me => { setUser(me); setToken(storedToken); })
      .catch(() => { logout(); })
      .finally(() => setIsLoading(false));
  }, [logout]);

  // Listen for global 401 events
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('sg:unauthorized', handler);
    return () => window.removeEventListener('sg:unauthorized', handler);
  }, [logout]);

  return (
    <AuthContext.Provider value={{
      user, token,
      isAuthenticated: !!user && !!token,
      isLoading, login, logout, error, clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
