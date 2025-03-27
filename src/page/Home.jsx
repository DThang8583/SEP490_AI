import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  Container,
  Fade,
  Zoom,
  IconButton,
  Tooltip,
  Popover,
  Stack,
} from "@mui/material";
import {
  School,
  Chat,
  AutoAwesome,
  Brightness4,
  Brightness7,
  Palette,
} from "@mui/icons-material";
import { useTheme } from '../context/ThemeContext';
import { keyframes } from '@mui/system';

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const bubbleFloat = keyframes`
  0% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-20px) translateX(10px);
  }
  100% {
    transform: translateY(0) translateX(0);
  }
`;

const gradientAnimation = keyframes`
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

const colorOptions = [
  { name: 'Xanh dương', primary: '#3498DB', secondary: '#2980B9' },
  { name: 'Tím', primary: '#9B59B6', secondary: '#8E44AD' },
  { name: 'Xanh lá', primary: '#2ECC71', secondary: '#27AE60' },
  { name: 'Cam', primary: '#E67E22', secondary: '#D35400' },
  { name: 'Đỏ', primary: '#E74C3C', secondary: '#C0392B' },
];

const Home = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [colorAnchorEl, setColorAnchorEl] = useState(null);

  const handleColorClick = (event) => {
    setColorAnchorEl(event.currentTarget);
  };

  const handleColorClose = () => {
    setColorAnchorEl(null);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    handleColorClose();
  };

  const open = Boolean(colorAnchorEl);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        py: 4,
      }}
    >
      {/* Animated Background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode
            ? `linear-gradient(-45deg, ${selectedColor.secondary}, ${selectedColor.primary}, ${selectedColor.secondary}, ${selectedColor.primary})`
            : "linear-gradient(-45deg, #E0EAFC, #CFDEF3, #E0EAFC, #CFDEF3)",
          backgroundSize: "400% 400%",
          animation: `${gradientAnimation} 15s ease infinite`,
          zIndex: 0,
        }}
      />
      
      {/* Floating Bubbles */}
      {[...Array(5)].map((_, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            borderRadius: "50%",
            background: isDarkMode
              ? `rgba(${parseInt(selectedColor.primary.slice(1,3), 16)}, ${parseInt(selectedColor.primary.slice(3,5), 16)}, ${parseInt(selectedColor.primary.slice(5,7), 16)}, ${Math.random() * 0.1})`
              : `rgba(44, 62, 80, ${Math.random() * 0.05})`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `${bubbleFloat} ${Math.random() * 10 + 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            zIndex: 0,
          }}
        />
      ))}

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
          <Tooltip title="Chọn màu">
            <IconButton
              onClick={handleColorClick}
              sx={{
                color: isDarkMode ? "#ffffff" : "#2D3436",
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
                "&:hover": {
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Palette />
            </IconButton>
          </Tooltip>
          <Tooltip title={isDarkMode ? "Chế độ sáng" : "Chế độ tối"}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: isDarkMode ? "#ffffff" : "#2D3436",
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
                "&:hover": {
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
        </Box>

        <Popover
          open={open}
          anchorEl={colorAnchorEl}
          onClose={handleColorClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Stack spacing={1} sx={{ p: 1 }}>
            {colorOptions.map((color) => (
              <Button
                key={color.name}
                onClick={() => handleColorSelect(color)}
                sx={{
                  backgroundColor: color.primary,
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: color.secondary,
                  },
                }}
              >
                {color.name}
              </Button>
            ))}
          </Stack>
        </Popover>

        <Fade in timeout={1000}>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <School 
                sx={{ 
                  color: selectedColor.primary, 
                  mr: 2, 
                  fontSize: '3rem',
                  animation: `${float} 3s ease-in-out infinite`
                }} 
              />
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: isDarkMode ? "#ffffff" : "#2D3436",
                  mb: 1,
                }}
              >
                AI Math Tool
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: isDarkMode ? "rgb(176, 176, 176)" : "rgb(102, 102, 102)",
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              Công cụ hỗ trợ giảng dạy môn Toán thông minh
            </Typography>
          </Box>
        </Fade>

        <Zoom in timeout={1000}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                onClick={() => navigate("/CreateLesson")}
                sx={{
                  p: 4,
                  height: "100%",
                  cursor: "pointer",
                  backgroundColor: isDarkMode
                    ? "rgba(30, 30, 30, 0.8)"
                    : "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
                  borderRadius: "24px",
                  boxShadow: isDarkMode
                    ? "0 8px 32px rgba(0, 0, 0, 0.2)"
                    : "0 8px 32px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: isDarkMode
                      ? "0 12px 48px rgba(0, 0, 0, 0.3)"
                      : "0 12px 48px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <AutoAwesome sx={{ color: selectedColor.primary, mr: 1 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      color: isDarkMode ? "#ffffff" : "#2D3436",
                      fontWeight: 600,
                    }}
                  >
                    Tạo bài giảng nhanh
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode ? "rgb(176, 176, 176)" : "rgb(102, 102, 102)",
                  }}
                >
                  Chọn các thông tin cần thiết để tạo bài giảng theo cấu trúc chuẩn
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                onClick={() => navigate("/CreateLessonByChat")}
                sx={{
                  p: 4,
                  height: "100%",
                  cursor: "pointer",
                  backgroundColor: isDarkMode
                    ? "rgba(30, 30, 30, 0.8)"
                    : "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
                  borderRadius: "24px",
                  boxShadow: isDarkMode
                    ? "0 8px 32px rgba(0, 0, 0, 0.2)"
                    : "0 8px 32px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: isDarkMode
                      ? "0 12px 48px rgba(0, 0, 0, 0.3)"
                      : "0 12px 48px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Chat sx={{ color: selectedColor.primary, mr: 1 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      color: isDarkMode ? "#ffffff" : "#2D3436",
                      fontWeight: 600,
                    }}
                  >
                    Tạo bài giảng bằng chat
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode ? "rgb(176, 176, 176)" : "rgb(102, 102, 102)",
                  }}
                >
                  Tương tác với AI để tạo bài giảng theo ý muốn
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Zoom>
      </Container>
    </Box>
  );
};

export default Home;