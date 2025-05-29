import React from 'react';
import { Box, Typography, Button, Grid, Container, Paper } from '@mui/material';
import { School, EmojiEvents, Psychology, Speed, ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { keyframes } from '@mui/system';
import { useTheme } from '../../context/ThemeContext';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shine = keyframes`
  0% { background-position: -100% 50%; }
  100% { background-position: 200% 50%; }
`;

const LandingPic = () => {
  const { isDarkMode } = useTheme();
  
  const features = [
    {
      icon: <School sx={{ fontSize: 40 }} />,
      title: 'Tạo bài học thông minh',
      description: 'Nội dung được cá nhân hóa bởi AI',
      color: '#FF6B6B'
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      title: 'Học mà chơi, chơi mà học',
      description: 'Tăng cường tương tác, giảm nhàm chán',
      color: '#4ECDC4'
    },
    {
      icon: <Psychology sx={{ fontSize: 40 }} />,
      title: 'Kho bài tập đa dạng',
      description: 'Luyện tập với nhiều dạng bài',
      color: '#FFD93D'
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Theo dõi kết quả học tập',
      description: 'Báo cáo chi tiết giúp bạn hiểu rõ hơn',
      color: '#6C5CE7'
    }
  ];

  return (
    <Box
      sx={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
          : 'linear-gradient(135deg, #f0f7ff 0%, #e6f3ff 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: 8,
        marginTop:'10px'
      }}
    >
      {/* Decorative background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: isDarkMode
            ? 'linear-gradient(45deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1))'
            : 'linear-gradient(45deg, rgba(255, 107, 107, 0.15), rgba(78, 205, 196, 0.15))',
          animation: `${pulse} 8s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: isDarkMode
            ? 'linear-gradient(45deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1))'
            : 'linear-gradient(45deg, rgba(255, 107, 107, 0.15), rgba(78, 205, 196, 0.15))',
          animation: `${pulse} 6s ease-in-out infinite`,
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left side: Content */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  letterSpacing: '2px',
                  color: '#FF6B6B',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  mb: 2,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-8px',
                    left: 0,
                    width: '50px',
                    height: '3px',
                    backgroundColor: '#FF6B6B',
                    borderRadius: '2px',
                  }
                }}
              >
                Học tập thông minh hơn
              </Typography>
              <Typography
                variant="h2"
                fontWeight="bold"
                sx={{
                  mb: 3,
                  color: isDarkMode ? '#ffffff' : '#2D3436',
                  animation: `${pulse} 2s ease-in-out infinite`,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Học tập vui vẻ với AI
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  fontSize: '1.1rem',
                  lineHeight: '1.8',
                  color: isDarkMode ? '#b0b0b0' : '#2D3436',
                  opacity: 0.9,
                }}
              >
                Khám phá cách học mới thú vị với công nghệ AI.
                Hệ thống sẽ tạo ra những bài học sinh động và hấp dẫn,
                giúp việc học tập trở nên thú vị và hiệu quả hơn.
              </Typography>

              {/* Feature cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        p: 2,
                        borderRadius: '15px',
                        backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
                        boxShadow: isDarkMode 
                          ? '0 4px 20px rgba(0,0,0,0.2)'
                          : '0 4px 20px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: isDarkMode
                            ? '0 8px 30px rgba(0,0,0,0.3)'
                            : '0 8px 30px rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <Box
                        sx={{
                          color: feature.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '60px',
                          height: '60px',
                          borderRadius: '15px',
                          backgroundColor: `${feature.color}15`,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            mb: 0.5,
                            color: isDarkMode ? '#ffffff' : '#2D3436',
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: isDarkMode ? '#b0b0b0' : '#636E72',
                            opacity: 0.8,
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  backgroundColor: '#FF6B6B',
                  color: 'white',
                  padding: '15px 40px',
                  borderRadius: '30px',
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  boxShadow: '0 8px 20px rgba(255, 107, 107, 0.3)',
                  '&:hover': {
                    backgroundColor: '#FF5252',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 30px rgba(255, 107, 107, 0.4)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                 Đăng nhập ngay
              </Button>
            </Box>
          </Grid>

          {/* Right side: Interactive elements */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', height: '100%', minHeight: '500px' }}>
              {/* Floating cards */}
              <Paper
                elevation={8}
                sx={{
                  position: 'absolute',
                  top: '10%',
                  left: '5%',
                  width: '45%',
                  p: 3,
                  borderRadius: '20px',
                  backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
                    : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  boxShadow: isDarkMode
                    ? '0 20px 40px rgba(0,0,0,0.2)'
                    : '0 20px 40px rgba(0,0,0,0.1)',
                  animation: `${float} 6s ease-in-out infinite`,
                  transform: 'rotate(-2deg)',
                  border: isDarkMode
                    ? '1px solid rgba(255, 107, 107, 0.1)'
                    : '1px solid rgba(255, 107, 107, 0.1)',
                }}
              >
                <Typography variant="h5" sx={{ mb: 2, color: isDarkMode ? '#ffffff' : '#2D3436' }}>
                  Học tập thông minh
                </Typography>
                <Typography variant="body1" sx={{ color: isDarkMode ? '#b0b0b0' : '#636E72' }}>
                  Sử dụng AI để tạo ra những bài học phù hợp với trình độ của bạn
                </Typography>
              </Paper>

              <Paper
                elevation={8}
                sx={{
                  position: 'absolute',
                  bottom: '10%',
                  left: '5%',
                  width: '45%',
                  p: 3,
                  borderRadius: '20px',
                  backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
                    : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  boxShadow: isDarkMode
                    ? '0 20px 40px rgba(0,0,0,0.2)'
                    : '0 20px 40px rgba(0,0,0,0.1)',
                  animation: `${float} 6s ease-in-out infinite`,
                  animationDelay: '2s',
                  transform: 'rotate(2deg)',
                  border: isDarkMode
                    ? '1px solid rgba(78, 205, 196, 0.1)'
                    : '1px solid rgba(78, 205, 196, 0.1)',
                }}
              >
                <Typography variant="h5" sx={{ mb: 2, color: isDarkMode ? '#ffffff' : '#2D3436' }}>
                  Theo dõi tiến độ
                </Typography>
                <Typography variant="body1" sx={{ color: isDarkMode ? '#b0b0b0' : '#636E72' }}>
                  Xem kết quả học tập và cải thiện hiệu quả
                </Typography>
              </Paper>

              {/* Decorative elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '20%',
                  right: '5%',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: isDarkMode
                    ? 'linear-gradient(45deg, rgba(255, 107, 107, 0.2), rgba(255, 142, 142, 0.2))'
                    : 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
                  opacity: 0.2,
                  animation: `${pulse} 3s ease-in-out infinite`,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '30%',
                  left: '5%',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: isDarkMode
                    ? 'linear-gradient(45deg, rgba(78, 205, 196, 0.2), rgba(110, 231, 224, 0.2))'
                    : 'linear-gradient(45deg, #4ECDC4, #6EE7E0)',
                  opacity: 0.2,
                  animation: `${pulse} 4s ease-in-out infinite`,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPic;
