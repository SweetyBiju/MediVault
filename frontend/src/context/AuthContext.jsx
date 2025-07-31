import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // Install axios: npm install axios

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '', // Use env variable
});

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await api.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCurrentUser(res.data.data);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const register = async (userData) => {
    try {
      const res = await api.post('/api/auth/signup', userData);
      if (res.data.success) {
        localStorage.setItem('token', res.data.data.token);
        setCurrentUser(res.data.data);
        return { success: true };
      }
      return { success: false, error: res.data.error };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/signin', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.data.token);
        setCurrentUser(res.data.data);
        return { success: true };
      }
      return { success: false, error: res.data.error };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
