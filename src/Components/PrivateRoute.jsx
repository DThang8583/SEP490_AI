import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, userInfo } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem('accessToken');
  const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Kiểm tra cả token và userInfo trong localStorage
  const isAuthenticated = token && storedUserInfo;

  // Nếu chưa đăng nhập, chuyển hướng về trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu đã đăng nhập, kiểm tra role và chuyển hướng nếu cần
  if (storedUserInfo) {
    switch (storedUserInfo.role) {
      case "Tổ trưởng chuyên môn":
        if (!location.pathname.startsWith('/manager')) {
          return <Navigate to="/manager/dashboard" replace />;
        }
        break;
      case "Administrator":
        if (!location.pathname.startsWith('/admin')) {
          return <Navigate to="/admin/dashboard" replace />;
        }
        break;
      case "Giáo viên":
        if (location.pathname.startsWith('/manager') || location.pathname.startsWith('/admin')) {
          return <Navigate to="/" replace />;
        }
        break;
      default:
        if (location.pathname.startsWith('/manager') || location.pathname.startsWith('/admin')) {
          return <Navigate to="/" replace />;
        }
    }
  }

  return children;
};

export default PrivateRoute; 