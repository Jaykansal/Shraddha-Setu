'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredUser, setStoredUser, setToken, getToken } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getToken();
    if (storedUser && storedToken) {
      setUser(storedUser);
      setTokenState(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, requestedRole = 'CLIENT') => {
    const res = await api.login({ email, password, requestedRole });
    if (res.success && res.user) {
      setUser(res.user);
      setTokenState(res.token);
      setStoredUser(res.user);
      setToken(res.token);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (payload) => {
    const res = await api.register(payload);
    if (res.success && res.user) {
      setUser(res.user);
      setTokenState(res.token);
      setStoredUser(res.user);
      setToken(res.token);
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setTokenState(null);
    setStoredUser(null);
    setToken(null);
  };

  const isDevotee = user?.role === 'CLIENT';
  const isPandit = user?.role === 'PANDIT';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      isDevotee,
      isPandit,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
