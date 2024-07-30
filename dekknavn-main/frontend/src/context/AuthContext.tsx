// src/context/AuthContext.tsx
// ### ChatGPT
import React, { createContext, useContext, ReactNode, useState } from "react";
import { User } from "../types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: any) => void; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user);

  const login = (user: any) => {
    setIsAuthenticated(true);
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
