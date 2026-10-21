'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredUser, setStoredUser, setToken, getToken } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncAuthState = () => {
      const storedUser = getStoredUser();
      const storedToken = getToken();
      setUser(storedUser || null);
      setTokenState(storedToken || null);
      setLoading(false);
    };

    syncAuthState();

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', syncAuthState);
      window.addEventListener('shraddhasetu_auth_sync', syncAuthState);
      return () => {
        window.removeEventListener('storage', syncAuthState);
        window.removeEventListener('shraddhasetu_auth_sync', syncAuthState);
      };
    }
  }, []);

  const broadcastChange = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('shraddhasetu_auth_sync'));
      window.dispatchEvent(new CustomEvent('shraddhasetu_data_sync'));
    }
  };

  const login = async (email, password, requestedRole = 'CLIENT') => {
    const res = await api.login({ email, password, requestedRole });
    if (res.success && res.user) {
      setUser(res.user);
      setTokenState(res.token);
      setStoredUser(res.user);
      setToken(res.token);
      broadcastChange();
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
      broadcastChange();
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const sendOtp = async (phone, role = 'CLIENT') => {
    return await api.sendOtp({ phone, role });
  };

  const loginWithOtp = async ({ phone, otp, role = 'CLIENT', name = '', city = 'Varanasi' }) => {
    const res = await api.verifyOtp({ phone, otp, role, name, city });
    if (res.success && res.user) {
      setUser(res.user);
      setTokenState(res.token);
      setStoredUser(res.user);
      setToken(res.token);
      broadcastChange();
      return res;
    }
    throw new Error(res.message || 'OTP verification failed');
  };

  const logout = () => {
    setUser(null);
    setTokenState(null);
    setStoredUser(null);
    setToken(null);
    broadcastChange();
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
      sendOtp,
      loginWithOtp,
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
