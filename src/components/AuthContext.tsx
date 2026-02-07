import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext<any>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));

  useEffect(() => {
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser && savedUser !== "undefined" && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        handleLogout(); 
      }
    }
  }, [token]);

  const handleLogin = (data: any) => {
    if (!data.token || !data.user) return;
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);