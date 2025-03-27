import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi component mount
    const token = localStorage.getItem('accessToken');
    const userInfoStr = localStorage.getItem('userInfo');
    
    if (token && userInfoStr) {
      setIsLoggedIn(true);
      setUserInfo(JSON.parse(userInfoStr));
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUserInfo(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 