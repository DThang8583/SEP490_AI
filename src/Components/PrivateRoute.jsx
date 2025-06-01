
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, userInfo } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra role và điều hướng phù hợp
  if (userInfo) {
    switch (userInfo.role) {
      case "Tổ trưởng chuyên môn":
        if (!location.pathname.startsWith('/quanly')) {
          return <Navigate to="/quanly/dashboard" replace />;
        }
        break;
      case "Tổ phó":
        if (!location.pathname.startsWith('/quanly')) {
          return <Navigate to="/quanly/dashboard" replace />;
        }
        break;
      case "Administrator":
        if (!location.pathname.startsWith('/admin')) {
          return <Navigate to="/admin" replace />;
        }
        break;
      case "Teacher":
        if (location.pathname.startsWith('/quanly') || location.pathname.startsWith('/admin')) {
          return <Navigate to="/" replace />;
        }
        break;
      default:
        if (location.pathname.startsWith('/quanly') || location.pathname.startsWith('/admin')) {
          return <Navigate to="/" replace />;
        }
    }
  }

  return children;
};

export default PrivateRoute; 