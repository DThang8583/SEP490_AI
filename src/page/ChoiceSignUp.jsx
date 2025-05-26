import React from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Grid,
  IconButton
} from '@mui/material';
import { 
  School,
  Person,
  Business,
  ArrowForward,
  AdminPanelSettings,
  SupervisorAccount
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@mui/system';
import { useTheme } from '../context/ThemeContext';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const ChoiceSignUp = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const options = [
    {
      title: "Người quản lý chuyên môn",
      description: "Đăng ký tài khoản để quản lý và đánh giá nội dung Giáo án",
      icon: <SupervisorAccount sx={{ fontSize: 40 }} />,
      color: "rgb(76, 175, 80)",
      hoverColor: "rgb(56, 142, 60)",
      path: "/signup-manager",
      features: [
        "Quản lý nội dung Giáo án",
        "Đánh giá chất lượng Giáo án",
        "Phê duyệt nội dung",
        "Quản lý giáo viên"
      ]
    },
    {
      title: "Giáo viên",
      description: "Đăng ký tài khoản để tạo và quản lý Giáo án",
      icon: <School sx={{ fontSize: 40 }} />,
      color: "rgb(255, 107, 107)",
      hoverColor: "rgb(255, 82, 82)",
      path: "/signup-teacher",
      features: [
        "Tạo Giáo án",
        "Quản lý học sinh",
        "Tương tác với phụ huynh",
        "Phân tích kết quả học tập"
      ]
    },
    {
      title: "Admin",
      description: "Đăng nhập để quản lý hệ thống",
      icon: <AdminPanelSettings sx={{ fontSize: 40 }} />,
      color: "rgb(33, 150, 243)",
      hoverColor: "rgb(25, 118, 210)",
      path: "/admin-signup",
      features: [
        "Quản lý người dùng",
        "Quản lý nội dung",
        "Phân tích dữ liệu",
        "Cấu hình hệ thống"
      ]
    }
  ];

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
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <School 
            sx={{ 
              fontSize: 60, 
              color: '#FF6B6B',
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
            Chọn loại tài khoản
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Đăng ký tài khoản phù hợp với nhu cầu của bạn để bắt đầu hành trình học tập
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {options.map((option, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: isDarkMode 
                    ? 'rgba(30, 30, 30, 0.8)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: '24px',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 8px 30px ${option.color.replace('rgb', 'rgba').replace(')', ', 0.15)')}`,
                  },
                }}
              >
                <Box
                  sx={{
                    color: option.color,
                    mb: 2,
                    backgroundColor: option.color.replace('rgb', 'rgba').replace(')', ', 0.15)'),
                    p: 2,
                    borderRadius: '16px',
                  }}
                >
                  {option.icon}
                </Box>
                
                <Typography 
                  variant="h5" 
                  component="h2" 
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                    textAlign: 'center',
                    mb: 1
                  }}
                >
                  {option.title}
                </Typography>

                <Typography 
                  variant="body1" 
                  sx={{
                    color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                    textAlign: 'center',
                    mb: 2,
                    lineHeight: 1.6
                  }}
                >
                  {option.description}
                </Typography>

                <Box sx={{ mb: 3, width: '100%' }}>
                  {option.features.map((feature, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1.5,
                        color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          color: option.color,
                          transform: 'translateX(5px)',
                        }
                      }}
                    >
                      <ArrowForward sx={{ fontSize: 16, mr: 1, color: option.color }} />
                      <Typography variant="body2" sx={{ fontWeight: 400 }}>{feature}</Typography>
                    </Box>
                  ))}
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate(option.path)}
                  endIcon={<ArrowForward />}
                  sx={{
                    backgroundColor: option.color,
                    color: '#ffffff',
                    px: 4,
                    py: 1.2,
                    borderRadius: '12px',
                    '&:hover': {
                      backgroundColor: option.hoverColor,
                      transform: 'translateY(-2px)',
                    },
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    boxShadow: `0 4px 20px ${option.color.replace('rgb', 'rgba').replace(')', ', 0.3)')}`,
                    transition: 'all 0.2s ease',
                  }}
                >
                  Đăng ký ngay
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ChoiceSignUp;
