import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios'; // Use axios for direct API calls here
import { User } from '../types';
import { getMyProfile } from '../services/dataService'; // Import profile fetching

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const AUTH_TOKEN_KEY = 'authToken';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Start loading true to check for existing token
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem(AUTH_TOKEN_KEY));

  // Function to set token in state and localStorage
  const handleSetToken = (newToken: string | null) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`; // Set for future axios requests
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Function to fetch user profile based on token
  const fetchUserProfile = useCallback(async () => {
    if (!token) {
        setUser(null);
        setLoading(false);
        return;
    }
    setLoading(true);
    setError(null);
    try {
        // Ensure token is set for the request
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const profile = await getMyProfile();
        setUser(profile);
    } catch (err) {
        console.error("Erro ao buscar perfil com token:", err);
        handleSetToken(null); // Clear invalid token
        setUser(null);
        // Optionally set an error message, but often we just want to clear the user
        // setError("Sessão inválida ou expirada.");
    } finally {
        setLoading(false);
    }
  }, [token]);

  // Check for existing token and fetch profile on initial load
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]); // Depend on the memoized fetchUserProfile

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { user: loggedInUser, token: newToken } = response.data;
      setUser(loggedInUser);
      handleSetToken(newToken);
    } catch (err: any) {
      console.error("Erro no login:", err);
      const message = err.response?.data?.message || 'Falha no login. Verifique suas credenciais.';
      setError(message);
      handleSetToken(null);
      setUser(null);
      throw new Error(message); // Re-throw for form handling
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
      const { user: registeredUser, token: newToken } = response.data;
      setUser(registeredUser);
      handleSetToken(newToken);
    } catch (err: any) {
      console.error("Erro no registro:", err);
      const message = err.response?.data?.message || 'Falha no registro. Tente novamente.';
      setError(message);
      handleSetToken(null);
      setUser(null);
      throw new Error(message); // Re-throw for form handling
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    handleSetToken(null);
    // Optionally redirect user to login page here or let consuming components handle it
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

