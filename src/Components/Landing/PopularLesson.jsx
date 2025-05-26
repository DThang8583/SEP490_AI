import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, Container } from '@mui/material';
import { keyframes } from '@mui/system';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const PopularLesson = () => {
  const location = useLocation();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập dữ liệu Giáo án phổ biến
    const mockLessons = [
      {
        id: 1,
        title: 'Toán học cơ bản',
        description: 'Khóa học cơ bản về toán học cho học sinh tiểu học',
        image: 'https://source.unsplash.com/random/800x600?math',
        author: 'Nguyễn Văn A',
        rating: 4.5,
        students: 1200
      },
      {
        id: 2,
        title: 'Vật lý 10',
        description: 'Khóa học vật lý cơ bản cho học sinh lớp 10',
        image: 'https://source.unsplash.com/random/800x600?physics',
        author: 'Trần Thị B',
        rating: 4.8,
        students: 800
      },
      {
        id: 3,
        title: 'Hóa học cơ bản',
        description: 'Khóa học hóa học cơ bản cho học sinh THCS',
        image: 'https://source.unsplash.com/random/800x600?chemistry',
        author: 'Lê Văn C',
        rating: 4.2,
        students: 600
      }
    ];

    // Giả lập thời gian tải
    setTimeout(() => {
      setLessons(mockLessons);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Box sx={{ py: 8, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container>
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 4,
          }}
        >
          Giáo án phổ biến 🌟
        </Typography>

        <Grid container spacing={4}>
          {lessons.map((lesson) => (
            <Grid item xs={12} sm={6} md={4} key={lesson.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                  },
                  animation: `${float} 4s ease-in-out infinite`,
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={lesson.image}
                  alt={lesson.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {lesson.title}
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {lesson.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Giảng viên: {lesson.author}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                      ⭐ {lesson.rating}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      👥 {lesson.students} học viên
                    </Typography>
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    sx={{
                      backgroundColor: '#FF6B6B',
                      '&:hover': {
                        backgroundColor: '#FF5252',
                      }
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default PopularLesson;
