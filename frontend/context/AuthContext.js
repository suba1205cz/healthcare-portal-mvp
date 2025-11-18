import { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, try to fetch current user if token exists
  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/api/auth/me')
      .then((res) => {
        setUser(res.data.user);
        setProfile(res.data.profile);
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { token, user, profile } = res.data;

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }

    setUser(user);
    setProfile(profile || null);
    return res.data;
  };

  const register = async (data) => {
    const res = await api.post('/api/auth/register', data);
    const { token, user, profile } = res.data;

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }

    setUser(user);
    setProfile(profile || null);
    return res.data;
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
