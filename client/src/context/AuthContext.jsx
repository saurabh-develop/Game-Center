import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const isGuest = localStorage.getItem("guest");

    console.log("AuthProvider init:", { token, username, isGuest });

    if (isGuest === "true") {
      setUser({ username: "Guest", guest: true });
    } else if (token && username) {
      setUser({ username, guest: false });
    } else {
      setUser(null);
    }

    console.log("Auth end: user =", username);
  }, []);

  const login = (userData, token) => {
    if (!userData?.username) {
      console.warn("Login failed: username missing in userData", userData);
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("username", userData.username);
    localStorage.removeItem("guest");

    setUser({ username: userData.username, guest: false });
    console.log("User logged in:", userData.username);
  };

  const loginAsGuest = () => {
    localStorage.setItem("guest", "true");
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    setUser({ username: "Guest", guest: true });
    console.log("User logged in as guest");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("guest");

    setUser(null);
    console.log("User logged out");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, loginAsGuest }}
    >
      {children}
    </AuthContext.Provider>
  );
};
