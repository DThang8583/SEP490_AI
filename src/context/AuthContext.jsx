import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await axios.post(
        'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/auth/refresh-token',
        { refreshToken }
      );

      if (response.data && response.data.data) {
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const storedUserInfo = localStorage.getItem('userInfo');
      
      if (accessToken && storedUserInfo) {
        try {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          if (parsedUserInfo) {
            setIsLoggedIn(true);
            setUserInfo(parsedUserInfo);
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error('Error parsing user info:', error);
          handleLogout();
        }
      } else {
        // Nếu không có accessToken, thử refresh
        const success = await refreshToken();
        if (!success) {
          handleLogout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  const login = (token, user) => {
    try {
      if (!token || !user) {
        throw new Error('Invalid login data');
      }
      localStorage.setItem('accessToken', token);
      localStorage.setItem('userInfo', JSON.stringify(user));
      setIsLoggedIn(true);
      setUserInfo(user);
    } catch (error) {
      console.error('Error during login:', error);
      handleLogout();
      throw error;
    }
  };

  const logout = () => {
    handleLogout();
  };

  if (loading) {
    return null;
  }

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