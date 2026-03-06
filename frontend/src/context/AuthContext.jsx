import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('km_auth');
    if (saved) {
      try {
        const { user, token } = JSON.parse(saved);
        setUser(user || null); 
        setToken(token || null);
        if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch {}
    }
    setInitializing(false);
  }, []);

  async function login(email, password) {
    if (!email || !password) throw new Error('Enter credentials');
    
    try {
      // This is the exact URL that matches your backend server.js
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      const { token, message } = response.data;
      
      const u = { email }; 
      setUser(u); 
      setToken(token);
      
      localStorage.setItem('km_auth', JSON.stringify({ user: u, token }));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  function logout() {
    setUser(null); 
    setToken(null);
    localStorage.removeItem('km_auth');
    delete axios.defaults.headers.common['Authorization'];
  }

  const value = useMemo(() => ({
    user, token, initializing,
    isAuthenticated: !!token,
    login, logout
  }), [user, token, initializing]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }