'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type {
  PublicUser,
  AuthResponse,
  LoginInput,
  RegisterInput,
} from '@khatwa/shared';
import { apiFetch } from '@/lib/api';
import { setSession, clearSession, getToken } from '@/lib/auth-cookies';

interface AuthContextValue {
  user: PublicUser | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<PublicUser>;
  register: (input: RegisterInput) => Promise<PublicUser>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  // عند التحميل: لو في توكن، اجلب بيانات المستخدم — hydrate from /me
  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await apiFetch<PublicUser>('/api/auth/me');
      setUser(me);
    } catch {
      clearSession();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleAuth = (res: AuthResponse): PublicUser => {
    setSession(res.token, res.user.role);
    setUser(res.user);
    return res.user;
  };

  const login = async (input: LoginInput) => {
    const res = await apiFetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return handleAuth(res);
  };

  const register = async (input: RegisterInput) => {
    const res = await apiFetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return handleAuth(res);
  };

  const logout = () => {
    clearSession();
    setUser(null);
    void apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
