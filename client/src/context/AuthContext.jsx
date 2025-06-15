import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const isGuest = localStorage.getItem("guest");

    if (isGuest === "true") {
      setUser({ username: "Guest", guest: true });
    } else if (token && username) {
      setUser({ username });
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", userData.username);
    localStorage.removeItem("guest");
    setUser(userData);
  };

  const loginAsGuest = () => {
    localStorage.setItem("guest", "true");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser({ username: "Guest", guest: true });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("guest");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loginAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
};
