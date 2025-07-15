import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser)); // ✅ safely parse
      }
    } catch (error) {
      console.error("Failed to parse currentUser from localStorage", error);
      setCurrentUser(null);
    }
  }, []);

  const register = async (userData) => {
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[userData.email]) {
      return { success: false, error: 'User already exists' };
    }

    users[userData.email] = userData;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(userData)); // ✅ store full object
    setCurrentUser(userData);

    return { success: true };
  };

  const login = async (email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || {};

    const user = users[email];

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Incorrect password' };
    }

    localStorage.setItem('currentUser', JSON.stringify(user)); // ✅ store full object
    setCurrentUser(user);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
