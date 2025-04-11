import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Container, Paper, Typography, TextField, Button, Link, InputAdornment, Alert, Snackbar, CircularProgress
} from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { keyframes } from '@mui/system';
import { useTheme } from '../context/ThemeContext';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Get email from location state or query params
    const emailFromState = location.state?.email;
    const emailFromQuery = new URLSearchParams(location.search).get('email');
    
    if (emailFromState) {
      setEmail(emailFromState);
    } else if (emailFromQuery) {
      setEmail(emailFromQuery);
    } else {
      // If no email is provided, redirect back to forgot password
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/auth/reset-password",
        {
          otp,
          newPassword,
          confirmedPassword: confirmPassword
        }
      );

      if (response.data && response.data.code === 0) {
        setSuccess("Mật khẩu đã được đặt lại thành công!");
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Không thể đặt lại mật khẩu");
      } else {
        setError("Không thể đặt lại mật khẩu. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/auth/email",
        {
          email,
        }
      );

      if (response.data && response.data.code === 0) {
        setSuccess("Mã OTP mới đã được gửi đến email của bạn.");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Không thể gửi lại mã OTP");
      } else {
        setError("Không thể gửi lại mã OTP. Vui lòng thử lại.");
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
            <Typography variant="h4" component="h1" gutterBottom>
              Xác thực OTP
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Nhập mã OTP đã được gửi đến email của bạn
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField 
              fullWidth 
              label="Mã OTP" 
              variant="outlined" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              required 
              sx={{ mb: 3 }}
              disabled={loading}
              InputProps={{ 
                startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>) 
              }}
            />
            <TextField 
              fullWidth 
              label="Mật khẩu mới" 
              type="password" 
              variant="outlined" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
              sx={{ mb: 3 }}
              disabled={loading}
              InputProps={{ 
                startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>) 
              }}
            />
            <TextField 
              fullWidth 
              label="Xác nhận mật khẩu mới" 
              type="password" 
              variant="outlined" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              sx={{ mb: 3 }}
              disabled={loading}
              InputProps={{ 
                startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>) 
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
                'Đặt lại mật khẩu'
              )}
            </Button>
          </form>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button 
              variant="text" 
              onClick={handleResendOTP} 
              disabled={loading}
              sx={{ 
                color: '#FF6B6B',
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 107, 0.04)',
                }
              }}
            >
              Gửi lại mã OTP
            </Button>
          </Box>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link 
              component={RouterLink} 
              to="/login" 
              sx={{ 
                color: '#FF6B6B', 
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                }
              }}
            >
              Quay lại đăng nhập
            </Link>
          </Box>
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
      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess('')} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccess('')} 
          severity="success" 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VerifyOTP; 