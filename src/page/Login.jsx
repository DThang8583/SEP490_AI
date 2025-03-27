import React, { useState } from 'react';
import axios from 'axios';
import { 
  Box, Container, Paper, Typography, TextField, Button, Link, InputAdornment, IconButton, Alert, Snackbar 
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
  const [email, setEmail] = useState('');
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
      console.log("Sending login request with:", { email, password });
      const response = await axios.post(
        "https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/auth/login",
        {
          email,
          password,
        }
      );

      console.log("API Response:", response);
      console.log("Response data:", response.data);

      if (response.data && response.data.data) {
        const { accessToken, refreshToken } = response.data.data;
        console.log("Access Token:", accessToken);
        console.log("Refresh Token:", refreshToken);

        // Decode the JWT token to get user information
        const decodedToken = jwtDecode(accessToken);
        console.log("Decoded Token:", decodedToken);

        // Extract user information from the token
        const userInfo = {
          id: decodedToken.id,
          email: decodedToken.email,
          roleId: decodedToken.roleId,
          fullName: decodedToken.fullName,
        };
        console.log("User Info:", userInfo);

        // Use the login function from AuthContext
        login(accessToken, userInfo);

        // Navigate based on role
        if (decodedToken.roleId === 2) {
          navigate("/admin/dashboard");
        } else if (decodedToken.roleId === 3) {
          navigate("/");
        } else if (decodedToken.roleId === 1) {
          navigate("/manager/dashboard");
        } else {
          navigate("/");
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        setError(error.response.data.message || "Đăng nhập thất bại");
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
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
            <TextField fullWidth label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} required sx={{ mb: 3 }}
              InputProps={{ startAdornment: (<InputAdornment position="start"><Email /></InputAdornment>) }}
            />
            <TextField fullWidth label="Mật khẩu" type={showPassword ? 'text' : 'password'} variant="outlined" value={password} 
              onChange={(e) => setPassword(e.target.value)} required sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>),
                endAdornment: (<InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>),
              }}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ py: 1.5, borderRadius: '12px', backgroundColor: '#FF6B6B', color: '#ffffff' }}>
              Đăng nhập
            </Button>
          </form>
        </Paper>
      </Container>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
