import React from 'react';
import { Box, Typography, Button, Grid, Paper, Container, Divider } from '@mui/material';
import { CheckCircle, School, EmojiEvents, Psychology, Speed, Star, Group, Security, Support } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ReasonPic1 from '../../image/Reason1.png';
import ReasonPic2 from '../../image/Reason2.jpg';
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

const Reason = () => {
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

  const reasons = [
    {
      icon: <School sx={{ fontSize: 40 }} />,
      title: 'Phương pháp học tập hiện đại',
      description: 'Áp dụng các phương pháp học tập tiên tiến, giúp học sinh tiếp thu kiến thức một cách hiệu quả và thú vị.',
      color: '#FF6B6B'
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      title: 'Nội dung đa dạng',
      description: 'Cung cấp nhiều bài học và bài tập phong phú, phù hợp với nhiều trình độ khác nhau.',
      color: '#4ECDC4'
    },
    {
      icon: <Psychology sx={{ fontSize: 40 }} />,
      title: 'Học tập tương tác',
      description: 'Tạo môi trường học tập tương tác, giúp học sinh phát triển kỹ năng tư duy và sáng tạo.',
      color: '#FFD93D'
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Tiến bộ nhanh chóng',
      description: 'Theo dõi và đánh giá tiến độ học tập, giúp học sinh cải thiện hiệu quả học tập.',
      color: '#6C5CE7'
    }
  ];

  return (
    <Box
      sx={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
          : 'linear-gradient(135deg, #f0f7ff 0%, #e6f3ff 100%)',
        minHeight: '150vh',
        py: 8,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        {/* Phần 1: Hero Section */}
        <Grid container spacing={6} alignItems="center" sx={{ mb: 12 }}>
      {/* Bên trái: Hình ảnh minh họa */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', width: '100%', maxWidth: '500px', mx: 'auto' }}>
              {/* Hình ảnh chính */}
        <Paper
                elevation={8}
          sx={{
            width: '100%',
                  borderRadius: '30px',
            overflow: 'hidden',
            position: 'relative',
                  zIndex: 2,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  animation: `${float} 6s ease-in-out infinite`,
                  transform: 'rotate(-2deg)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1))',
            zIndex: 1,
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '75%',
                    overflow: 'hidden',
                  }}
                >
                  <img 
                    src={ReasonPic1} 
                    alt="reason" 
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      }
                    }} 
                  />
                </Box>
        </Paper>

              {/* Hình ảnh phụ */}
        <Paper
                elevation={12}
          sx={{
                  width: '60%',
                  borderRadius: '20px',
            overflow: 'hidden',
            position: 'absolute',
                  bottom: '-30px',
                  right: '-30px',
                  zIndex: 3,
                  boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                  animation: `${pulse} 4s ease-in-out infinite`,
                  transform: 'rotate(3deg)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1))',
                    zIndex: 1,
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '75%',
                    overflow: 'hidden',
                  }}
                >
                  <img 
                    src={ReasonPic2} 
                    alt="reason" 
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      }
                    }} 
                  />
                </Box>
        </Paper>

              {/* Decorative elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '20%',
                  right: '-20px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#FF6B6B',
                  opacity: 0.2,
                  animation: `${pulse} 3s ease-in-out infinite`,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '30%',
                  left: '-20px',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#4ECDC4',
                  opacity: 0.2,
                  animation: `${pulse} 4s ease-in-out infinite`,
                }}
              />
      </Box>
          </Grid>

      {/* Bên phải: Nội dung mô tả */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  letterSpacing: '2px',
                  color: isDarkMode ? '#FF8E8E' : '#FF6B6B',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  mb: 2,
                  position: 'relative',
                  textShadow: isDarkMode ? '0 0 10px rgba(255, 142, 142, 0.3)' : 'none',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-8px',
                    left: 0,
                    width: '50px',
                    height: '3px',
                    backgroundColor: isDarkMode ? '#FF8E8E' : '#FF6B6B',
                    borderRadius: '2px',
                    boxShadow: isDarkMode ? '0 0 10px rgba(255, 142, 142, 0.3)' : 'none',
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
                  textShadow: isDarkMode ? '0 0 15px rgba(255, 255, 255, 0.2)' : 'none',
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
                  color: isDarkMode ? '#e0e0e0' : '#2D3436',
                  textShadow: isDarkMode ? '0 0 8px rgba(255, 255, 255, 0.1)' : 'none',
                  opacity: isDarkMode ? 1 : 0.9,
                }}
              >
                Khám phá cách học mới thú vị với công nghệ AI.  
                Hệ thống sẽ tạo ra những bài học sinh động và hấp dẫn,  
                giúp việc học tập trở nên thú vị và hiệu quả hơn.  
        </Typography>

              {/* Danh sách tính năng */}
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
                          ? `0 4px 20px rgba(0,0,0,0.2), 0 0 15px ${feature.color}20`
                          : '0 4px 20px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: isDarkMode
                            ? `0 8px 30px rgba(0,0,0,0.3), 0 0 20px ${feature.color}30`
                            : '0 8px 30px rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <Box
                        sx={{
                          color: isDarkMode ? `${feature.color}ff` : feature.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '60px',
                          height: '60px',
                          borderRadius: '15px',
                          backgroundColor: isDarkMode ? `${feature.color}20` : `${feature.color}15`,
                          boxShadow: isDarkMode ? `0 0 15px ${feature.color}30` : 'none',
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
                            textShadow: isDarkMode ? '0 0 10px rgba(255, 255, 255, 0.2)' : 'none',
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: isDarkMode ? '#e0e0e0' : '#636E72',
                            textShadow: isDarkMode ? '0 0 8px rgba(255, 255, 255, 0.1)' : 'none',
                            opacity: isDarkMode ? 1 : 0.8,
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
                to="/register"
                variant="contained"
                size="large"
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
                Bắt đầu học ngay
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Phần 2: Thống kê */}
        <Box sx={{ mb: 12 }}>
          <Typography
            variant="h3"
            align="center"
            sx={{
              mb: 6,
              fontWeight: 'bold',
              color: isDarkMode ? '#ffffff' : '#2D3436',
              textShadow: isDarkMode ? '0 0 15px rgba(255, 255, 255, 0.2)' : 'none',
            }}
          >
            Con số ấn tượng
          </Typography>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: '20px',
                    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
                    boxShadow: isDarkMode 
                      ? '0 4px 20px rgba(0,0,0,0.2), 0 0 15px rgba(255, 107, 107, 0.1)'
                      : '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: isDarkMode
                        ? '0 8px 30px rgba(0,0,0,0.3), 0 0 20px rgba(255, 107, 107, 0.2)'
                        : '0 8px 30px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <Box
                    sx={{
                      color: isDarkMode ? '#FF8E8E' : '#FF6B6B',
                      mb: 2,
                      textShadow: isDarkMode ? '0 0 10px rgba(255, 142, 142, 0.3)' : 'none',
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      color: isDarkMode ? '#ffffff' : '#2D3436',
                      textShadow: isDarkMode ? '0 0 15px rgba(255, 255, 255, 0.2)' : 'none',
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: isDarkMode ? '#e0e0e0' : '#636E72',
                      textShadow: isDarkMode ? '0 0 8px rgba(255, 255, 255, 0.1)' : 'none',
                      opacity: isDarkMode ? 1 : 0.8,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Phần 3: Lý do chọn chúng tôi */}
        <Box>
          <Typography
            variant="h3"
            align="center"
            sx={{
              mb: 6,
              fontWeight: 'bold',
              color: isDarkMode ? '#ffffff' : '#2D3436',
              textShadow: isDarkMode ? '0 0 15px rgba(255, 255, 255, 0.2)' : 'none',
            }}
          >
            Tại sao chọn chúng tôi?
          </Typography>
          <Grid container spacing={4}>
            {reasons.map((reason, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: '20px',
                    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
                    boxShadow: isDarkMode 
                      ? `0 4px 20px rgba(0,0,0,0.2), 0 0 15px ${reason.color}20`
                      : '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: isDarkMode
                        ? `0 8px 30px rgba(0,0,0,0.3), 0 0 20px ${reason.color}30`
                        : '0 8px 30px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <Box
                    sx={{
                      color: isDarkMode ? `${reason.color}ff` : reason.color,
                      mb: 2,
                      textShadow: isDarkMode ? `0 0 10px ${reason.color}30` : 'none',
                    }}
                  >
                    {reason.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      color: isDarkMode ? '#ffffff' : '#2D3436',
                      textShadow: isDarkMode ? '0 0 10px rgba(255, 255, 255, 0.2)' : 'none',
                    }}
                  >
                    {reason.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: isDarkMode ? '#e0e0e0' : '#636E72',
                      textShadow: isDarkMode ? '0 0 8px rgba(255, 255, 255, 0.1)' : 'none',
                      opacity: isDarkMode ? 1 : 0.8,
                    }}
                  >
                    {reason.description}
                  </Typography>
                </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      </Container>
    </Box>
  );
};

export default Reason;
