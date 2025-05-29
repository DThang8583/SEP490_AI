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

  // Hàm fetch thông tin user đầy đủ từ API và cập nhật state
  const fetchAndSetUserInfo = async (userId, accessToken) => {
    if (!userId || !accessToken) return;
    try {
      const response = await axios.get(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users/${userId}/update`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data && response.data.code === 0 && response.data.data) {
        setUserInfo(prevInfo => ({ ...prevInfo, ...response.data.data }));
        // Cập nhật localStorage với thông tin user đầy đủ
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
          try {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            localStorage.setItem('userInfo', JSON.stringify({ ...parsedUserInfo, ...response.data.data }));
          } catch (error) {
            console.error('Error updating full user info in localStorage:', error);
          }
        } else {
             localStorage.setItem('userInfo', JSON.stringify(response.data.data));
        }
      }
    } catch (error) {
      console.error('Error fetching full user info:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const storedUserInfo = localStorage.getItem('userInfo');
      let userId = null;
      
      if (accessToken && storedUserInfo) {
        try {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          if (parsedUserInfo && parsedUserInfo.id) {
            setIsLoggedIn(true);
            setUserInfo(parsedUserInfo); // Set tạm thời thông tin từ localStorage
            userId = parsedUserInfo.id;
            // Fetch thông tin user đầy đủ sau khi có accessToken và userId
            fetchAndSetUserInfo(userId, accessToken);
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error('Error parsing user info from localStorage:', error);
          handleLogout();
        }
      } else {
        // Nếu không có accessToken, thử refresh
        const success = await refreshToken();
        if (success) {
             const updatedAccessToken = localStorage.getItem('accessToken');
             const updatedUserInfoStr = localStorage.getItem('userInfo');
             if(updatedAccessToken && updatedUserInfoStr){
                  const updatedUserInfo = JSON.parse(updatedUserInfoStr);
                   if(updatedUserInfo && updatedUserInfo.id){
                        setIsLoggedIn(true);
                        setUserInfo(updatedUserInfo);
                        userId = updatedUserInfo.id;
                         // Fetch thông tin user đầy đủ sau khi refresh thành công
                        fetchAndSetUserInfo(userId, updatedAccessToken);
                   } else {
                         handleLogout();
                   }
             } else {
                  handleLogout();
             }
        } else {
          handleLogout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []); // Dependency array trống để chỉ chạy 1 lần khi mount

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

  const updateUserInfo = (newData) => {
    setUserInfo(prevInfo => ({ ...prevInfo, ...newData }));
    // Optionally update localStorage as well to persist changes across reloads
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        localStorage.setItem('userInfo', JSON.stringify({ ...parsedUserInfo, ...newData }));
      } catch (error) {
        console.error('Error updating user info in localStorage:', error);
      }
    }
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, login, logout, updateUserInfo }}>
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