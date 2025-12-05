import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import * as authApi from '../api/auth';
import { auth } from '../firebase';

const STORAGE_KEY = 'fresha-auth';

const normalizeUser = (authUser) =>
  authUser
    ? {
        ...authUser,
        role: authUser.role || 'user',
      }
    : null;

const readStoredAuth = () => {
  if (typeof window === 'undefined') {
    return { user: null, token: null };
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { user: null, token: null };
  }

  try {
    const parsed = JSON.parse(stored);
    return {
      user: normalizeUser(parsed.user),
      token: parsed.token || null,
    };
  } catch {
    return { user: null, token: null };
  }
};

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => normalizeUser(readStoredAuth().user));
  const [token, setToken] = useState(() => readStoredAuth().token);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!user || !token) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
  }, [user, token]);

  useEffect(() => {
    if (!auth) {
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        setUser(null);
        setToken(null);
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(STORAGE_KEY);
        }
        return;
      }

      try {
        const profile = await authApi.fetchUserProfile(authUser.uid);
        const normalized = normalizeUser(profile);
        setUser(normalized);
        setToken(await authUser.getIdToken());
      } catch (error) {
        console.error('Failed to synchronize auth state', error);
      }
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await authApi.login(email, password);
    setUser(normalizeUser(response.user));
    setToken(response.token);
  }, []);

  const register = useCallback(async (name, email, password, phone) => {
    const response = await authApi.register(name, email, password, phone);
    setUser(normalizeUser(response.user));
    setToken(response.token);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setToken(null);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const isAdmin = useMemo(() => user?.role === 'admin', [user]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAdmin,
      login,
      logout,
      register,
    }),
    [user, token, isAdmin, login, logout, register],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
