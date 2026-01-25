'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, logoutUser, AuthResponse, User } from '../services/authService';
import { setApiTokens, clearApiTokens } from '@/app/lib/utils/apiFetch';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => Promise<void>;
  getAuthHeader: () => { Authorization?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedRefreshToken = localStorage.getItem('refreshToken');
    const savedUser = localStorage.getItem('user');
    
    if (savedAccessToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setAccessToken(savedAccessToken);
        setRefreshToken(savedRefreshToken);
        setUser(parsedUser);
        // sync apiFetch in-memory token
        try {
          setApiTokens(savedAccessToken, savedRefreshToken || undefined);
        } catch (e) {
          // ignore in non-browser env
        }
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const response: AuthResponse = await loginUser({ username, password });
    
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken || null);
    setUser(response.user);
    
    localStorage.setItem('accessToken', response.accessToken);
    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    localStorage.setItem('user', JSON.stringify(response.user));
    try {
      setApiTokens(response.accessToken, response.refreshToken || undefined);
    } catch (e) {
      // ignore
    }
  };

  const logout = async () => {
    if (accessToken) {
      try {
        await logoutUser(accessToken);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    try {
      clearApiTokens();
    } catch (e) {
      // ignore
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => {
    const response: AuthResponse = await registerUser(userData);
    
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken || null);
    setUser(response.user);
    
    localStorage.setItem('accessToken', response.accessToken);
    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  const getAuthHeader = () => {
    if (!accessToken) {
      return {};
    }
    return {
      'Authorization': `Bearer ${accessToken}`,
    };
  };

  // keep context tokens in sync with apiFetch refreshes
  useEffect(() => {
    function handler(e: Event) {
      try {
        const ce = e as CustomEvent;
        const { accessToken: a, refreshToken: r } = ce.detail || {};
        setAccessToken(a || null);
        setRefreshToken(r || null);
        if (!a) {
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (err) {
        // ignore
      }
    }

    window.addEventListener('tokensUpdated', handler as EventListener);
    return () => window.removeEventListener('tokensUpdated', handler as EventListener);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isLoading,
        isAuthenticated: !!accessToken && !!user,
        login,
        logout,
        register,
        getAuthHeader,
      }}
    >
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
