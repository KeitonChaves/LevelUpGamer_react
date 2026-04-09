import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (
      storedUser &&
      storedUser !== "undefined" &&
      storedUser !== "null" &&
      storedUser.trim() !== ""
    ) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const login = async (email, contrasena) => {
    try {
      const response = await axios.post(
        `/api/usuarios/login`,
        { email, contrasena },
        {
          headers: { "x-api-key": "lvlupgamer1306" },
        }
      );
      console.log("Respuesta completa del backend:", response.data);

      const userData = response.data; // Corregido: quitar .data

      if (userData && typeof userData === "object") {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
        return { ok: true, user: userData };
      } else {
        return { ok: false, message: response.data?.message || "Credenciales incorrectas" };
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      let msg = error.response?.data?.message || error.response?.data || error.message;
      return { ok: false, message: msg || "Error al intentar iniciar sesión" };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ login, logout, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
