import React from 'react';
import { Box, Typography, Button, Grid, Container, Paper } from '@mui/material';
import { School, EmojiEvents, Psychology, Speed, ArrowForward, Star, Group, Security, Support } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { keyframes } from '@mui/system';
import LandingPic from './LandingPic';
import Reason from './Reason';
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

const Home = () => {
  const { isDarkMode } = useTheme();

  const features = [
    {
      icon: <School sx={{ fontSize: 40 }} />,
      title: 'Bài học sinh động',
      description: 'Nội dung được thiết kế trực quan, dễ hiểu',
      color: '#FF6B6B'
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      title: 'Học tập vui vẻ',
      description: 'Phương pháp học tập thông qua trò chơi',
      color: '#4ECDC4'
    },
    {
      icon: <Psychology sx={{ fontSize: 40 }} />,
      title: 'Nhiều trò chơi học tập',
      description: 'Tương tác đa dạng, hấp dẫn',
      color: '#FFD93D'
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Tiến bộ nhanh chóng',
      description: 'Theo dõi và đánh giá tiến độ học tập',
      color: '#6C5CE7'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Học sinh đang học', icon: <Group sx={{ fontSize: 40 }} /> },
    { number: '4.9/5', label: 'Đánh giá từ phụ huynh', icon: <Star sx={{ fontSize: 40 }} /> },
    { number: '100%', label: 'Bảo mật thông tin', icon: <Security sx={{ fontSize: 40 }} /> },
    { number: '24/7', label: 'Hỗ trợ trực tuyến', icon: <Support sx={{ fontSize: 40 }} /> }
  ];

  return (
    <Box sx={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' }}>
      <LandingPic />
      <Reason />
      
      {/* Features Section */}
      <Box
        sx={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
            : 'linear-gradient(135deg, #f0f7ff 0%, #e6f3ff 100%)',
          position: 'relative',
          overflow: 'hidden',
          py: 8,
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
          <Typography
            variant="h3"
            align="center"
            sx={{
              mb: 6,
              fontWeight: 'bold',
              color: isDarkMode ? '#ffffff' : '#2D3436',
            }}
          >
            Tính năng nổi bật
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: '20px',
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
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      color: isDarkMode ? '#ffffff' : '#2D3436',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: isDarkMode ? '#b0b0b0' : '#636E72',
                      opacity: 0.8,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box
        sx={{
          background: isDarkMode ? '#1a1a1a' : '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          py: 8,
        }}
      >
      </Box>
    </Box>
  );
};

export default Home; 