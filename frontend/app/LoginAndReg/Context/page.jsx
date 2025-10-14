// app/LoginAndReg/Context/page.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("authToken");
      const storedUserData = localStorage.getItem("userData");
      if (token && storedUserData) {
        setIsLoggedIn(true);
        setUserData(JSON.parse(storedUserData));
      }
    }
  }, []);

  const login = (data) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("authToken", data.token || "default-token");
      localStorage.setItem("userData", JSON.stringify(data));
    }
    setIsLoggedIn(true);
    setUserData(data);
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
    }
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
