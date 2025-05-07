import React, { useState } from 'react';
import axios from 'axios';
import { 
  Box, Container, Paper, Typography, TextField, Button, Link, InputAdornment, IconButton, Alert, Snackbar, CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, School } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { keyframes } from '@mui/system';
import { useTheme } from '../context/ThemeContext';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from "../context/AuthContext";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Tạo instance axios với timeout
      const axiosInstance = axios.create({
        timeout: 10000, // 10 giây timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const response = await axiosInstance.post(
        "https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/auth/login",
        {
          username,
          password,
        }
      );

      if (response.data && response.data.data) {
        const { accessToken, refreshToken } = response.data.data;

        // Decode token và lấy thông tin user
        const decodedToken = jwtDecode(accessToken);
        const userInfo = {
          id: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
          email: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
          fullName: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
          role: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        };

        // Lưu token và thông tin user
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        // Gọi hàm login từ AuthContext
        login(accessToken, userInfo);

        // Chuyển hướng dựa trên role
        switch (userInfo.role) {
          case "Tổ trưởng chuyên môn":
            navigate("/manager/dashboard", { replace: true });
            break;
            case "Tổ phó":
            navigate("/manager/dashboard", { replace: true });
            break;
          case "Administrator":
            navigate("/admin/dashboard", { replace: true });
            break;
          case "Giáo viên":
            navigate("/", { replace: true });
            break;
          default:
            navigate("/", { replace: true });
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        setError("Kết nối quá thời gian. Vui lòng kiểm tra kết nối mạng và thử lại.");
      } else if (error.response) {
        setError(error.response.data.message || "Đăng nhập thất bại");
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <School sx={{ fontSize: 60, color: '#FF6B6B', mb: 2, animation: `${float} 3s ease-in-out infinite` }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Chào mừng trở lại
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField 
              fullWidth 
              label="Username" 
              variant="outlined" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              sx={{ mb: 3 }}
              disabled={loading}
              InputProps={{ 
                startAdornment: (<InputAdornment position="start"><Email /></InputAdornment>) 
              }}
            />
            <TextField 
              fullWidth 
              label="Mật khẩu" 
              type={showPassword ? 'text' : 'password'} 
              variant="outlined" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              sx={{ mb: 3 }}
              disabled={loading}
              InputProps={{
                startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>),
                endAdornment: (<InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} disabled={loading}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>),
              }}
            />
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              sx={{ 
                py: 1.5, 
                borderRadius: '12px', 
                backgroundColor: '#FF6B6B', 
                color: '#ffffff',
                position: 'relative',
                '&:hover': {
                  backgroundColor: '#FF5252',
                }
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress 
                  size={24} 
                  sx={{ 
                    color: 'white',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }} 
                />
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>
        </Paper>
      </Container>
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError('')} 
          severity="error" 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;