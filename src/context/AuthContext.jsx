import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1';

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await axios.post(`${API_BASE}/auth/refresh-token`, { refreshToken });

      if (response.data?.data) {
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error refreshing token:', error);
      return false;
    }
  };

  const fetchAndSetUserInfo = async (userId, accessToken) => {
    if (!userId || !accessToken) return;
    try {
      const response = await axios.get(`${API_BASE}/users/${userId}/update`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data?.code === 0 && response.data.data) {
        const updatedUserInfo = {
          id: userId, // Đảm bảo luôn có ID
          ...response.data.data,
          gradeId: userInfo?.gradeId || response.data.data.gradeId,
        };

        setUserInfo(updatedUserInfo);
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      }
    } catch (error) {
      console.error('❌ Error fetching user info:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const storedUserInfo = localStorage.getItem('userInfo');
  
      if (accessToken && storedUserInfo) {
        try {
          const parsedUser = JSON.parse(storedUserInfo);
          if (parsedUser?.id) {
            setIsLoggedIn(true);
            setUserInfo(parsedUser);
            // Ở đây không gọi fetchAndSetUserInfo để cập nhật user từ API
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('❌ Error parsing user info from localStorage:', err);
        }
      }
  
      // Nếu accessToken không hợp lệ hoặc thiếu userInfo
      const refreshed = await refreshToken();
      if (refreshed) {
        const newAccessToken = localStorage.getItem('accessToken');
        const storedUserInfoAfterRefresh = localStorage.getItem('userInfo');
  
        try {
          // Không gọi fetchAndSetUserInfo ở đây nữa
          // Chỉ set lại từ userInfo đã lưu trong localStorage
          const parsedUser = JSON.parse(storedUserInfoAfterRefresh || '{}');
          if (parsedUser?.id) {
            setIsLoggedIn(true);
            setUserInfo(parsedUser);
          } else {
            handleLogout();
          }
        } catch (error) {
          handleLogout();
        }
      } else {
        handleLogout();
      }
  
      setLoading(false);
    };
  
    checkAuth();
  }, []);
  

  const login = (token, user) => {
    try {
      if (!token || !user) throw new Error('Invalid login data');
      localStorage.setItem('accessToken', token);
      localStorage.setItem('userInfo', JSON.stringify(user));
      setIsLoggedIn(true);
      setUserInfo(user);
    } catch (error) {
      console.error('❌ Error during login:', error);
      handleLogout();
    }
  };

  const logout = () => handleLogout();

  const updateUserInfo = (newData) => {
    setUserInfo((prev) => {
      const updated = { ...prev, ...newData };
      localStorage.setItem('userInfo', JSON.stringify(updated));
      return updated;
    });
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, login, logout, updateUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
