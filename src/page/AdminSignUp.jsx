import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { 
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
  ArrowBack,
  Phone,
  Cake,
  LocationOn,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { keyframes } from '@mui/system';
import { useTheme } from '../context/ThemeContext';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const AdminSignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      const response = await fetch('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth,
          gender: parseInt(formData.gender),
          address: formData.address,
          roleId: 2
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Có lỗi xảy ra khi đăng ký');
      }

      setSuccess('Đăng ký thành công!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi đăng ký');
    }
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
        <Button
          component={RouterLink}
          to="/ChoiceSignUp"
          startIcon={<ArrowBack />}
          sx={{
            mb: 3,
            color: isDarkMode ? '#ffffff' : '#2D3436',
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          Quay lại
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '24px',
            background: isDarkMode 
              ? 'rgba(30, 30, 30, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <AdminPanelSettings 
              sx={{ 
                fontSize: 60, 
                color: 'rgb(33, 150, 243)',
                mb: 2,
                animation: `${float} 3s ease-in-out infinite`,
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
              Đăng ký tài khoản Admin
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
              }}
            >
              Điền thông tin để tạo tài khoản mới
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên đăng nhập"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
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
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
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
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
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
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
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
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ngày sinh"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Cake sx={{ color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
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
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel sx={{ color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)' }}>
                    Giới tính
                  </InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    label="Giới tính"
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgb(33, 150, 243)',
                      },
                      color: isDarkMode ? '#ffffff' : '#2D3436',
                    }}
                  >
                    <MenuItem value="1">Nam</MenuItem>
                    <MenuItem value="2">Nữ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn sx={{ color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
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
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mật khẩu"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
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
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)' }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
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
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    backgroundColor: 'rgb(33, 150, 243)',
                    color: '#ffffff',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgb(25, 118, 210)',
                      transform: 'translateY(-2px)',
                    },
                    boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Đăng ký
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                    }}
                  >
                    Đã có tài khoản?{' '}
                    <Button
                      component={RouterLink}
                      to="/login"
                      sx={{
                        color: 'rgb(33, 150, 243)',
                        textTransform: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Đăng nhập
                    </Button>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
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
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            '& .MuiAlert-icon': {
              color: '#FF6B6B',
            },
          }}
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
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            '& .MuiAlert-icon': {
              color: '#4CAF50',
            },
          }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminSignUp;