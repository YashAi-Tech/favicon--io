import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // If returning from Google OAuth callback, let AuthCallback handle it first.
    if (window.location.hash?.includes("session_id=")) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, [checkAuth]);

  const persist = (data) => {
    if (data.token) localStorage.setItem("lovable_token", data.token);
    setUser(data.user);
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    persist(res.data);
    return res.data.user;
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    persist(res.data);
    return res.data.user;
  };

  const completeGoogle = async (sessionId) => {
    const res = await api.post("/auth/session", { session_id: sessionId });
    persist(res.data);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {}
    localStorage.removeItem("lovable_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, register, login, completeGoogle, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
