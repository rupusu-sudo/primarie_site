import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext<any>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));

  useEffect(() => {
    const savedUser = localStorage.getItem('admin_user');
    
    // Verificăm dacă avem date și dacă sunt valide
    if (savedUser && savedUser !== "undefined" && token) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (e) {
        // Dacă dă eroare la parse, curățăm tot imediat
        console.error("Date corupte detectate. Resetare...");
        handleLogout(); 
      }
    } else if (savedUser === "undefined") {
        handleLogout();
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
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);