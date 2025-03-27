import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement admin login logic
    console.log('Admin login:', formData);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: isDarkMode
          ? 'linear-gradient(135deg, rgb(18, 18, 18) 0%, rgb(30, 30, 30) 100%)'
          : 'linear-gradient(135deg, rgb(248, 249, 250) 0%, rgb(255, 255, 255) 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            backgroundColor: isDarkMode
              ? 'rgba(30, 30, 30, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            borderRadius: '24px',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <AdminPanelSettings
              sx={{
                fontSize: 60,
                color: '#FF6B6B',
                mb: 2,
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: isDarkMode ? '#ffffff' : '#2D3436',
                mb: 1,
              }}
            >
              Đăng nhập Admin
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
              }}
            >
              Vui lòng đăng nhập để truy cập trang quản trị
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.02)',
                  '&:hover': {
                    backgroundColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                },
                '& .MuiOutlinedInput-input': {
                  color: isDarkMode ? '#ffffff' : '#2D3436',
                },
              }}
            />

            <TextField
              fullWidth
              label="Mật khẩu"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.02)',
                  '&:hover': {
                    backgroundColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                },
                '& .MuiOutlinedInput-input': {
                  color: isDarkMode ? '#ffffff' : '#2D3436',
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                borderRadius: '12px',
                backgroundColor: '#FF6B6B',
                '&:hover': {
                  backgroundColor: '#FF5252',
                },
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              Đăng nhập
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/ChoiceSignUp')}
              sx={{
                color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                '&:hover': {
                  backgroundColor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.02)',
                },
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              Quay lại
            </Button>
          </form>
        </Paper>
      </Container>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert
          onClose={() => setError('')}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminLogin; 