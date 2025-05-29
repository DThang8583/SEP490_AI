import React, { useState } from 'react';
import axios from 'axios';
import { 
  Box, Container, Paper, Typography, TextField, Button, Link, InputAdornment, IconButton, Alert, Snackbar, CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordStep, setForgotPasswordStep] = useState('inputEmail');
  const [otpInput, setOtpInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
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
            navigate("/admin", { replace: true });
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
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
    setForgotPasswordOpen(true);
    setError('');
    setSuccess('');
    setForgotPasswordError('');
    setForgotPasswordEmail('');
    setForgotPasswordStep('inputEmail');
    setOtpInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
    setForgotPasswordLoading(false);
    setForgotPasswordError('');
  };

  const handleSendOtp = async () => {
    if (!forgotPasswordEmail) {
      setForgotPasswordError('Vui lòng nhập Username hoặc Email.');
      return;
    }
    setForgotPasswordLoading(true);
    setForgotPasswordError('');
    setSuccess('');
    setError('');

    try {
      const response = await axios.post(
        'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/auth/email',
        { email: forgotPasswordEmail }
      );
      
      if (response.data && response.data.code === 0) {
        setForgotPasswordStep('inputResetDetails');
        setForgotPasswordError('');
      } else {
        if(forgotPasswordOpen) {
             setForgotPasswordError(response.data?.message || 'Có lỗi xảy ra. Không thể gửi mã OTP.');
        } else {
             setError(response.data?.message || 'Có lỗi xảy ra. Không thể gửi mã OTP.');
             setSuccess('');
        }
      }

    } catch (error) {
      console.error('Forgot password error:', error);
      if(forgotPasswordOpen) {
          setForgotPasswordError(error.response?.data?.message || 'Đã xảy ra lỗi khi yêu cầu đặt lại mật khẩu.');
      } else {
          setError(error.response?.data?.message || 'Đã xảy ra lỗi khi yêu cầu đặt lại mật khẩu.');
          setSuccess('');
      }
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleResetPasswordSubmit = async () => {
    if (!otpInput || !newPasswordInput || !confirmPasswordInput) {
      setForgotPasswordError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setForgotPasswordError('Mật khẩu mới không khớp.');
      return;
    }
    setForgotPasswordLoading(true);
    setForgotPasswordError('');
    setSuccess('');
    setError('');

    try {
      const response = await axios.post(
        'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/auth/reset-password',
        {
          otp: otpInput,
          newPassword: newPasswordInput,
          confirmedPassword: confirmPasswordInput,
        }
      );

      if (response.data && response.data.code === 0) {
        setForgotPasswordOpen(false);
        setSuccess('Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.');
        setForgotPasswordEmail('');
        setOtpInput('');
        setNewPasswordInput('');
        setConfirmPasswordInput('');
        setForgotPasswordStep('inputEmail');
      } else {
        setForgotPasswordError(response.data?.message || 'Đặt lại mật khẩu thất bại.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setForgotPasswordError(error.response?.data?.message || 'Đã xảy ra lỗi khi đặt lại mật khẩu.');
    } finally {
      setForgotPasswordLoading(false);
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
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link component="button" variant="body2" onClick={handleForgotPasswordClick} disabled={loading || forgotPasswordLoading}>
              Quên mật khẩu?
            </Link>
          </Box>
        </Paper>
      </Container>
      <Snackbar 
        open={!!error || !!success}
        autoHideDuration={6000} 
        onClose={() => setError('')} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError('')}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {error || success}
        </Alert>
      </Snackbar>
      <Dialog open={forgotPasswordOpen} onClose={handleForgotPasswordClose}>
        <DialogTitle>Quên mật khẩu</DialogTitle>
        <DialogContent>
          {forgotPasswordStep === 'inputEmail' && (
            <Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Nhập Username hoặc Email của bạn để nhận mã OTP đặt lại mật khẩu.
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                label="Username hoặc Email"
                type="text"
                fullWidth
                variant="outlined"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                disabled={forgotPasswordLoading}
                error={!!forgotPasswordError}
                helperText={forgotPasswordError}
              />
            </Box>
          )}

          {forgotPasswordStep === 'inputResetDetails' && (
            <Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Mã OTP đã được gửi. Vui lòng kiểm tra email và nhập mã cùng mật khẩu mới.
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                label="Mã OTP"
                type="text"
                fullWidth
                variant="outlined"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                disabled={forgotPasswordLoading}
                error={!!forgotPasswordError}
                helperText={forgotPasswordError}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Mật khẩu mới"
                type="password"
                fullWidth
                variant="outlined"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                disabled={forgotPasswordLoading}
                error={!!forgotPasswordError}
                helperText={forgotPasswordError}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Xác nhận mật khẩu mới"
                type="password"
                fullWidth
                variant="outlined"
                value={confirmPasswordInput}
                onChange={(e) => setConfirmPasswordInput(e.target.value)}
                disabled={forgotPasswordLoading}
                error={!!forgotPasswordError}
                helperText={forgotPasswordError}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleForgotPasswordClose} disabled={forgotPasswordLoading}>Hủy</Button>
          {forgotPasswordStep === 'inputEmail' && (
            <Button onClick={handleSendOtp} variant="contained" disabled={forgotPasswordLoading}>
              {forgotPasswordLoading ? <CircularProgress size={24} /> : 'Gửi mã OTP'}
            </Button>
          )}
          {forgotPasswordStep === 'inputResetDetails' && (
            <Button onClick={handleResetPasswordSubmit} variant="contained" disabled={forgotPasswordLoading}>
              {forgotPasswordLoading ? <CircularProgress size={24} /> : 'Đặt lại mật khẩu'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;