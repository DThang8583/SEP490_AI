import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import LandingPicture from '../../image/landingPic.jpg';

const LandingPic = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '700px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Hình nền */}
      <Box
        component="img"
        src={LandingPicture}
        alt="landingPic"
        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Nội dung mô tả */}
      <Box
        sx={{
          position: 'absolute',
          textAlign: 'center',
          color: 'white',
          padding: '20px 40px',
          borderRadius: '10px',
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          🚀 Khám phá công nghệ tạo bài giảng bằng AI! ✨
        </Typography>
        <Typography variant="h6">
          🌟 Nhanh chóng - Hiệu quả - Chuyên nghiệp 🌟
        </Typography>
      </Box>

      {/* Nút chuyển trang */}
      <Button
        variant="contained"
        onClick={() => navigate('/CreateLesson')}
        sx={{
          position: 'absolute',
          bottom: '50px',
          backgroundColor: '#ff7f50',
          fontSize: '18px',
          fontWeight: 'bold',
          padding: '12px 24px',
          borderRadius: '8px',
          textTransform: 'none',
          boxShadow: '2px 2px 10px rgba(0,0,0,0.3)',
          '&:hover': {
            backgroundColor: '#ff6347',
          },
        }}
      >
        Bắt đầu ngay 🚀
      </Button>
    </Box>
  );
};

export default LandingPic;
