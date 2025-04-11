import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Kiểm tra và khôi phục trạng thái đăng nhập từ localStorage
    const token = localStorage.getItem('accessToken');
    const storedUserInfo = localStorage.getItem('userInfo');
    
    if (token && storedUserInfo) {
      setIsLoggedIn(true);
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userInfo', JSON.stringify(user));
    setIsLoggedIn(true);
    setUserInfo(user);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
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