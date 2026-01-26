import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // Mock user database

  const register = (email, password, userName) => {
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return false;
    }
    
    // Add new user to mock database
    const newUser = { email, password, name: userName, id: Date.now() };
    setUsers(prev => [...prev, newUser]);
    return true;
  };

  const login = (email, password, userName) => {
    // For demo: allow any login, but in real app check against users array
    // const foundUser = users.find(u => u.email === email && u.password === password);
    // if (foundUser) {
    if (email && password) {
      setIsAuthenticated(true);
      setUser({ 
        email, 
        name: userName || email.split('@')[0],
        id: Date.now()
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    users,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};