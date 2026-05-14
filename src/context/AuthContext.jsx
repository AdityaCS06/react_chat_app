import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getProfile } from "../api/auth";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshToken = useCallback(async () => {
    const storedRefresh = localStorage.getItem("refresh_token");
    if (!storedRefresh) return false;
    try {
      const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/auth";
      const res = await axios.post(`${AUTH_BASE_URL}/refresh`, {
        refresh_token: storedRefresh,
      });
      const data = res.data;
      setToken(data.access_token);
      localStorage.setItem("access_token", data.access_token);
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
      getProfile(storedToken)
        .then((data) => {
          setUser(data);
        })
        .catch(async () => {
          const refreshed = await refreshToken();
          if (refreshed) {
            const newToken = localStorage.getItem("access_token");
            try {
              const data = await getProfile(newToken);
              setUser(data);
            } catch {
              logout();
            }
          } else {
            logout();
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (data) => {
    setUser(data.user);
    setToken(data.access_token);

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
