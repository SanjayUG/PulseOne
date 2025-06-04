import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        if (!location.pathname.includes('/login') && !location.pathname.includes('/register')) {
          navigate('/login');
        }
        return;
      }

      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('http://localhost:5000/api/auth/verify');
        setUser(response.data.user);
        
        // If on auth pages and authenticated, redirect to dashboard
        if (location.pathname.includes('/login') || location.pathname.includes('/register')) {
          navigate('/');
        }
      } catch (error) {
        // Only clear auth state if it's an authentication error
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
          
          if (!location.pathname.includes('/login') && !location.pathname.includes('/register')) {
            navigate('/login');
          }
        } else {
          // For other errors (like 404), keep the user logged in
          console.warn('Auth verification failed:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [navigate, location.pathname]);

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      // Only navigate if login was successful
      if (user) {
        navigate('/');
      }
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 