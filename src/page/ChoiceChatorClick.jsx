import React from "react";
import { Box, Button, Typography, Container, Paper, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { keyframes } from '@mui/system';
import { useTheme } from '../context/ThemeContext';
import { 
  RocketLaunch, 
  Psychology,
  AutoAwesome,
  ArrowForward
} from '@mui/icons-material';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const bubbleFloat = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(20px, 20px) rotate(180deg); }
  100% { transform: translate(0, 0) rotate(360deg); }
`;

const bubbleFloat2 = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-20px, -20px) rotate(-180deg); }
  100% { transform: translate(0, 0) rotate(-360deg); }
`;

const ChoiceChatorClick = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const options = [
    {
      title: "Tạo Giáo án nhanh",
      description: "Tạo Giáo án với các mẫu có sẵn, phù hợp cho các bài học cơ bản",
      icon: <RocketLaunch sx={{ fontSize: 40 }} />,
      color: "rgb(76, 175, 80)",
      hoverColor: "rgb(56, 142, 60)",
      path: "/CreateLesson",
      features: [
        "Mẫu Giáo án đa dạng",
        "Tạo nhanh trong vài phút",
        "Phù hợp cho bài học cơ bản",
        "Dễ dàng chỉnh sửa"
      ]
    },
    {
      title: "Tạo Giáo án theo ý muốn",
      description: "Tương tác với AI để tạo Giáo án tùy chỉnh theo nhu cầu của bạn",
      icon: <Psychology sx={{ fontSize: 40 }} />,
      color: "rgb(255, 107, 107)",
      hoverColor: "rgb(255, 82, 82)",
      path: "/CreateLessonByChat",
      features: [
        "Tương tác thông minh với AI",
        "Tùy chỉnh chi tiết",
        "Phù hợp cho bài học nâng cao",
        "Hỗ trợ đa dạng chủ đề"
      ]
    }
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 6,
        backgroundColor: isDarkMode ? 'rgb(18, 18, 18)' : 'rgb(248, 249, 250)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* RGB Bubbles */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgb(255, 0, 0), rgb(0, 255, 0))',
          opacity: 0.1,
          animation: `${bubbleFloat} 15s infinite ease-in-out`,
          filter: 'blur(20px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgb(0, 255, 0), rgb(0, 0, 255))',
          opacity: 0.1,
          animation: `${bubbleFloat2} 20s infinite ease-in-out`,
          filter: 'blur(20px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '20%',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgb(0, 0, 255), rgb(255, 0, 0))',
          opacity: 0.1,
          animation: `${bubbleFloat} 18s infinite ease-in-out`,
          filter: 'blur(20px)',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 700,
              color: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(45, 52, 54)',
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Tạo Giáo án Thông Minh
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
              maxWidth: '500px',
              mx: 'auto',
              fontWeight: 400
            }}
          >
            Chọn phương thức tạo Giáo án phù hợp với nhu cầu của bạn
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {options.map((option, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: isDarkMode ? 'rgb(30, 30, 30)' : 'rgb(255, 255, 255)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 8px 30px ${option.color.replace('rgb', 'rgba').replace(')', ', 0.15)')}`,
                  },
                  borderRadius: '16px',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Box
                  sx={{
                    color: option.color,
                    mb: 2,
                    animation: `${float} 3s ease-in-out infinite`,
                    backgroundColor: option.color.replace('rgb', 'rgba').replace(')', ', 0.15)'),
                    p: 2,
                    borderRadius: '12px',
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
                    color: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(45, 52, 54)',
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
                      <AutoAwesome sx={{ fontSize: 16, mr: 1, color: option.color }} />
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
                    color: 'rgb(255, 255, 255)',
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
                  }}
                >
                  Bắt đầu ngay
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ChoiceChatorClick;