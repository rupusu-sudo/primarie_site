import React, { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext<any>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedUser !== "undefined" && savedToken) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const handleLogin = useCallback((data: { token: string; user: any }) => {
    if (!data || !data.token || !data.user) return;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    window.location.href = "/";
  }, []);
  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,      
      isAdmin, 
      login: handleLogin, 
      logout: handleLogout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth trebuie folosit în AuthProvider");
  return context;
};