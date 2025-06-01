import React, { useState } from 'react';
import axios from 'axios';
import { 
  Box, Container, Paper, Typography, TextField, Button, Link, InputAdornment, IconButton, Alert, Snackbar, CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, School, Security, LockReset } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { styled, keyframes } from '@mui/material/styles';
import { useTheme } from '../context/ThemeContext';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from "../context/AuthContext";

// Animations
const float = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  50% { 
    transform: translateY(-12px) rotate(2deg); 
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.4);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 0 8px rgba(255, 107, 107, 0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const glow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 8px rgba(255, 107, 107, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(255, 107, 107, 0.8));
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Styled Components
const LoginContainer = styled(Box)(({ theme, isDarkMode }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  padding: '32px 0',
  background: isDarkMode
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isDarkMode
      ? 'radial-gradient(circle at 20% 80%, rgba(255, 107, 107, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(156, 39, 176, 0.15) 0%, transparent 50%)'
      : 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '80px',
    height: '80px',
    background: 'rgba(255, 107, 107, 0.1)',
    borderRadius: '50%',
    animation: `${float} 4s ease-in-out infinite`,
  },
}));

const LoginCard = styled(Paper)(({ theme, isDarkMode }) => ({
  padding: '48px',
  borderRadius: '24px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: isDarkMode
    ? '0 30px 60px rgba(0, 0, 0, 0.3)'
    : '0 30px 60px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  animation: `${fadeIn} 0.8s ease-out`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 107, 107, 0.1), transparent)',
    animation: `${shimmer} 3s ease-in-out infinite`,
  },
  [theme.breakpoints.down('sm')]: {
    padding: '32px 24px',
    margin: '0 16px',
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: '48px',
  position: 'relative',
}));

const FloatingIcon = styled(School)(({ theme }) => ({
  fontSize: '4rem',
  color: '#FF6B6B',
  marginBottom: '24px',
  animation: `${float} 3s ease-in-out infinite`,
  filter: 'drop-shadow(0 8px 16px rgba(255, 107, 107, 0.4))',
  '&:hover': {
    animation: `${glow} 2s ease-in-out infinite`,
  },
}));

const WelcomeTitle = styled(Typography)(({ theme, isDarkMode }) => ({
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 900,
  fontSize: '3rem',
  background: isDarkMode
    ? 'linear-gradient(135deg, #fff 0%, #e3f2fd 50%, #bbdefb 100%)'
    : 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 30%, #FFB3BA 60%, #FF6B6B 100%)',
  backgroundSize: '300% 300%',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  marginBottom: '12px',
  letterSpacing: '1px',
  textShadow: isDarkMode 
    ? '0 8px 16px rgba(255, 255, 255, 0.1), 0 4px 8px rgba(255, 255, 255, 0.05)'
    : '0 8px 16px rgba(255, 107, 107, 0.3), 0 4px 8px rgba(255, 107, 107, 0.2)',
  animation: `${slideInLeft} 0.8s ease-out, ${gradientShift} 4s ease-in-out infinite`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isDarkMode
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%)'
      : 'linear-gradient(135deg, rgba(255, 107, 107, 0.08) 0%, transparent 50%)',
    borderRadius: '12px',
    zIndex: -1,
    filter: 'blur(20px)',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.2rem',
    letterSpacing: '0.5px',
  },
}));

const SubTitle = styled(Typography)(({ theme, isDarkMode }) => ({
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontSize: '1.1rem',
  fontWeight: 500,
  color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 107, 107, 0.9)',
  marginBottom: '16px',
  letterSpacing: '0.5px',
  textAlign: 'center',
  lineHeight: 1.6,
  textShadow: isDarkMode 
    ? '0 2px 4px rgba(255, 255, 255, 0.1)'
    : '0 2px 4px rgba(255, 107, 107, 0.2)',
  animation: `${slideInLeft} 1s ease-out`,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
    letterSpacing: '0.3px',
  },
}));

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  animation: `${fadeIn} 1.2s ease-out`,
}));

const StyledTextField = styled(TextField)(({ theme, isDarkMode }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    background: isDarkMode
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
    backdropFilter: 'blur(10px)',
    border: isDarkMode
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(255, 107, 107, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      borderColor: '#FF6B6B',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(255, 107, 107, 0.15)',
    },
    '&.Mui-focused': {
      borderColor: '#FF6B6B',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(255, 107, 107, 0.25)',
    },
    '& fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputLabel-root': {
    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 107, 107, 0.8)',
    fontWeight: 600,
    '&.Mui-focused': {
      color: '#FF6B6B',
    },
  },
  '& .MuiInputBase-input': {
    color: isDarkMode ? '#fff' : 'black',
    fontWeight: 500,
  },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': {
    color: '#FF6B6B',
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  padding: '16px 32px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
  color: '#fff',
  fontSize: '1.1rem',
  fontWeight: 700,
  textTransform: 'none',
  boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.6s ease',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, #FF8E8E 0%, #FF6B6B 100%)',
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 35px rgba(255, 107, 107, 0.5)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(-1px)',
  },
  '&:disabled': {
    background: 'rgba(255, 107, 107, 0.3)',
    transform: 'none',
    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.2)',
  },
  animation: `${pulse} 3s ease-in-out infinite`,
}));

const ForgotPasswordLink = styled(Link)(({ theme, isDarkMode }) => ({
  color: isDarkMode ? '#fff' : '#FF6B6B',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  padding: '8px 16px',
  borderRadius: '12px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  '&:hover': {
    background: 'rgba(255, 107, 107, 0.1)',
    transform: 'translateY(-2px)',
    textDecoration: 'none',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}));

const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  '& .MuiAlert-root': {
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
    fontWeight: 600,
  },
}));

const ModernDialog = styled(Dialog)(({ theme, isDarkMode }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '24px',
    background: isDarkMode
      ? 'linear-gradient(135deg, rgba(30, 30, 46, 0.95) 0%, rgba(45, 45, 61, 0.9) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
    backdropFilter: 'blur(20px)',
    border: isDarkMode
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(255, 107, 107, 0.2)',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    minWidth: '400px',
    [theme.breakpoints.down('sm')]: {
      minWidth: '300px',
      margin: '16px',
    },
  },
}));

const DialogTitleStyled = styled(DialogTitle)(({ theme, isDarkMode }) => ({
  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
  color: '#fff',
  fontWeight: 700,
  fontSize: '1.5rem',
  padding: '24px 32px',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: '32px',
  '& .MuiTextField-root': {
    marginBottom: '20px',
  },
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: '24px 32px',
  gap: '16px',
  justifyContent: 'center',
}));

const ActionButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  ...(variant === 'contained' ? {
    background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
    color: '#fff',
    boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #FF8E8E 0%, #FF6B6B 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 35px rgba(255, 107, 107, 0.4)',
    },
  } : {
    color: theme.palette.text.primary,
    '&:hover': {
      background: 'rgba(255, 107, 107, 0.1)',
      transform: 'translateY(-2px)',
    },
  }),
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(4px)',
  borderRadius: '16px',
  zIndex: 1,
}));

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
          role: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
          gradeId: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"]
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
    <LoginContainer isDarkMode={isDarkMode}>
      <Container maxWidth="sm">
        <LoginCard elevation={0} isDarkMode={isDarkMode}>
          {loading && (
            <LoadingOverlay>
              <CircularProgress 
                size={60} 
                sx={{ 
                  color: '#FF6B6B',
                  filter: 'drop-shadow(0 4px 8px rgba(255, 107, 107, 0.3))',
                }} 
              />
            </LoadingOverlay>
          )}
          
          <HeaderSection>
            <FloatingIcon />
            <WelcomeTitle isDarkMode={isDarkMode}>
              Chào mừng trở lại
            </WelcomeTitle>
            <SubTitle isDarkMode={isDarkMode}>
              Đăng nhập để tiếp tục hành trình học tập
            </SubTitle>
          </HeaderSection>

          <StyledForm onSubmit={handleSubmit}>
            <StyledTextField 
              fullWidth 
              label="Tên đăng nhập" 
              variant="outlined" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              disabled={loading}
              isDarkMode={isDarkMode}
              InputProps={{ 
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ) 
              }}
            />
            
            <StyledTextField 
              fullWidth 
              label="Mật khẩu" 
              type={showPassword ? 'text' : 'password'} 
              variant="outlined" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              disabled={loading}
              isDarkMode={isDarkMode}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => setShowPassword(!showPassword)} 
                      disabled={loading}
                      sx={{ color: '#FF6B6B' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <LoginButton 
              type="submit" 
              fullWidth 
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </LoginButton>
          </StyledForm>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <ForgotPasswordLink 
              component="button" 
              variant="body2" 
              onClick={handleForgotPasswordClick} 
              disabled={loading || forgotPasswordLoading}
              isDarkMode={isDarkMode}
            >
              Quên mật khẩu?
            </ForgotPasswordLink>
          </Box>
        </LoginCard>
      </Container>

      <StyledSnackbar 
        open={!!error || !!success}
        autoHideDuration={6000} 
        onClose={() => { setError(''); setSuccess(''); }} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => { setError(''); setSuccess(''); }}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {error || success}
        </Alert>
      </StyledSnackbar>

      <ModernDialog 
        open={forgotPasswordOpen} 
        onClose={handleForgotPasswordClose}
        isDarkMode={isDarkMode}
      >
        <DialogTitleStyled isDarkMode={isDarkMode}>
          <LockReset />
          Khôi phục mật khẩu
        </DialogTitleStyled>
        
        <StyledDialogContent>
          {forgotPasswordStep === 'inputEmail' && (
            <Box>
              <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6 }}>
                Nhập email của bạn để nhận mã OTP đặt lại mật khẩu.
              </Typography>
              <StyledTextField
                autoFocus
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                disabled={forgotPasswordLoading}
                error={!!forgotPasswordError}
                helperText={forgotPasswordError}
                isDarkMode={isDarkMode}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          )}

          {forgotPasswordStep === 'inputResetDetails' && (
            <Box>
              <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6 }}>
                Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra và nhập thông tin bên dưới.
              </Typography>
              
              <StyledTextField
                autoFocus
                fullWidth
                label="Mã OTP"
                type="text"
                variant="outlined"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                disabled={forgotPasswordLoading}
                error={!!forgotPasswordError}
                helperText={forgotPasswordError}
                isDarkMode={isDarkMode}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Security />
                    </InputAdornment>
                  )
                }}
              />
              
              <StyledTextField
                fullWidth
                label="Mật khẩu mới"
                type="password"
                variant="outlined"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                disabled={forgotPasswordLoading}
                isDarkMode={isDarkMode}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  )
                }}
              />
              
              <StyledTextField
                fullWidth
                label="Xác nhận mật khẩu mới"
                type="password"
                variant="outlined"
                value={confirmPasswordInput}
                onChange={(e) => setConfirmPasswordInput(e.target.value)}
                disabled={forgotPasswordLoading}
                isDarkMode={isDarkMode}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          )}
        </StyledDialogContent>
        
        <StyledDialogActions>
          <ActionButton 
            onClick={handleForgotPasswordClose} 
            disabled={forgotPasswordLoading}
          >
            Hủy
          </ActionButton>
          
          {forgotPasswordStep === 'inputEmail' && (
            <ActionButton 
              onClick={handleSendOtp} 
              variant="contained" 
              disabled={forgotPasswordLoading}
            >
              {forgotPasswordLoading ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                'Gửi mã OTP'
              )}
            </ActionButton>
          )}
          
          {forgotPasswordStep === 'inputResetDetails' && (
            <ActionButton 
              onClick={handleResetPasswordSubmit} 
              variant="contained" 
              disabled={forgotPasswordLoading}
            >
              {forgotPasswordLoading ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                'Đặt lại mật khẩu'
              )}
            </ActionButton>
          )}
        </StyledDialogActions>
      </ModernDialog>
    </LoginContainer>
  );
};

export default Login;