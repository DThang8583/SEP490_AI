import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';

// Danh sách bài giảng Toán học (Cấp 1)
const mathLessons = [
  {
    id: 1,
    title: 'Số và Phép tính',
    description: 'Học cách nhận diện số và các phép tính cơ bản.',
  },
  {
    id: 2,
    title: 'Hình học vui nhộn',
    description: 'Khám phá các hình khối và không gian xung quanh.',
  },
  {
    id: 3,
    title: 'Giải toán ứng dụng',
    description: 'Giải các bài toán thực tế một cách đơn giản và thú vị.',
  },
];

const LessonPopular = () => {
  const [lessonsWithImages, setLessonsWithImages] = useState([]);

  useEffect(() => {
    fetch('https://67c0f8e861d8935867e1970b.mockapi.io/AITools')
      .then((response) => response.json())
      .then((data) => {
        // Chỉ lấy 5 hình đầu tiên từ API
        const imageUrls = data.slice(0, 5).map((item) => item.image);

        // Kết hợp hình ảnh vào danh sách bài giảng
        const updatedLessons = mathLessons.map((lesson, index) => ({
          ...lesson,
          image: imageUrls[index % imageUrls.length] || 'https://source.unsplash.com/400x250/?math', // Lặp lại hình hoặc dùng ảnh mặc định
        }));

        setLessonsWithImages(updatedLessons);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
        // Nếu lỗi, dùng ảnh mặc định
        const updatedLessons = mathLessons.map((lesson) => ({
          ...lesson,
          image: 'https://source.unsplash.com/400x250/?math',
        }));
        setLessonsWithImages(updatedLessons);
      });
  }, []);

  return (
    <Box sx={{ padding: '50px 100px' }}> {/* Nền cam nhạt */}
      {/* Tiêu đề */}
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        marginBottom="30px"
      >
        Một số bài giảng Toán 
      </Typography>

      {/* Danh sách bài giảng dưới dạng Grid */}
      <Grid container spacing={3}>
        {lessonsWithImages.map((lesson) => (
          <Grid item xs={12} sm={6} md={4} key={lesson.id}>
            <Card
              sx={{
                borderRadius: '16px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                backgroundColor: '#FFD580', // Cam nhạt
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' }, // Hiệu ứng phóng to khi di chuột vào
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={lesson.image}
                alt={lesson.title}
                sx={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#8B4513' }}>
                  {lesson.title}
                </Typography>
                <Typography variant="body2" color="black">
                  {lesson.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LessonPopular;
