import React, { useState } from 'react';
import axios from 'axios';
import { 
  Box, Container, Paper, Typography, TextField, Button, Link, InputAdornment, Alert, Snackbar, CircularProgress
} from '@mui/material';
import { Email } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { keyframes } from '@mui/system';
import { useTheme } from '../context/ThemeContext';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        setSuccess("Mã OTP đã được gửi đến email của bạn.");
        // Navigate to OTP verification page after 2 seconds
        setTimeout(() => {
          navigate('/verify-otp', { state: { email } });
        }, 2000);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Không thể gửi mã OTP");
      } else {
        setError("Không thể gửi mã OTP. Vui lòng thử lại.");
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
              Quên mật khẩu
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField 
              fullWidth 
              label="Email" 
              variant="outlined" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              sx={{ mb: 3 }}
              disabled={loading}
              InputProps={{ 
                startAdornment: (<InputAdornment position="start"><Email /></InputAdornment>) 
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
                'Gửi yêu cầu'
              )}
            </Button>
          </form>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
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

export default ForgotPassword; 