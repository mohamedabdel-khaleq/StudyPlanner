
import React, { createContext, useContext, useState } from 'react';

import {
  loginUser,
  registerUser,
  getCurrentUser,
} from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      setToken(data.access_token);
      setUser(data.user);

      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);

    try {
      const data = await registerUser(name, email, password);

      return data;
    } finally {
      setLoading(false);
    }
  };

  const getMe = async () => {
    if (!token) {
      return null;
    }

    const data = await getCurrentUser(token);

    setUser(data);

    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        getMe,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

