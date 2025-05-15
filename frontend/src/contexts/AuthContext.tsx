import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

// Types
interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
}

interface DecodedToken {
  userId: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  exp: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  // Check if token is valid and set user data
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // Set default Authorization header for all requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Decode token to get user info
          const decoded = jwtDecode<DecodedToken>(token);
          
          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            // Token expired, logout
            handleLogout();
            return;
          }
          
          // Set user data from token
          setUser({
            id: decoded.userId,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role,
          });
        } catch (error) {
          console.error('Error initializing auth:', error);
          handleLogout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token]);

  // Login function
  const handleLogin = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        username,
        password,
      });
      
      const { token } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      setToken(token);
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    
    // Remove Authorization header
    delete axios.defaults.headers.common['Authorization'];
  };

  // Context value
  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;