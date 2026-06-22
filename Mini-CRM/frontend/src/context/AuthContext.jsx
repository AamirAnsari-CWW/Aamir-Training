import React, { createContext, useContext, useEffect, useState } from "react";

import { apiRequest } from "../api/api";

const AuthContext = createContext();

// Centralizes authentication state so pages do not need to read/write tokens directly. Components consume this through the useAuth hook below.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("crmToken");

    // On refresh, verify the stored token before showing protected screens.
    if (!token) {
      setLoading(false);
      return;
    }

    apiRequest("/auth/profile")
      .then((result) => setUser(result.data.user))
      .catch(() => localStorage.removeItem("crmToken"))
      .finally(() => setLoading(false));
  }, []);

  const saveLogin = (data) => {
    localStorage.setItem("crmToken", data.token);
    setUser(data.user);
  };

  // Login and register both return the same token/user payload.
  const login = async (formData) => {
    const result = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    saveLogin(result.data);
  };

  const register = async (formData) => {
    const result = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    saveLogin(result.data);
  };

  // Logging out is intentionally local: the backend does not need a logout call because the JWT is removed from this browser.
  const logout = () => {
    localStorage.removeItem("crmToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook used by routes, layout, and auth forms.
export function useAuth() {
  return useContext(AuthContext);
}
