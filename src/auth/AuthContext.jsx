import { createContext, useContext, useEffect, useState } from "react";

import { apiRequest } from "../api/apiClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(sessionStorage.getItem("token"));

  useEffect(() => {
    if (token) sessionStorage.setItem("token", token);
  }, [token]);

  const register = async (credentials) => {
    const result = await apiRequest("/users/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    setToken(result.token);
  };

  const login = async (credentials) => {
    const result = await apiRequest("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    setToken(result.token);
  };

  const logout = () => {
    setToken(null);
    sessionStorage.removeItem("token");
  };

  const value = { token, register, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
