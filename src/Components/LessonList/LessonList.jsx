import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Card, CardMedia, CardContent, Typography, Grid, TextField } from '@mui/material';
import { Link } from 'react-router-dom'; // Thêm Link để điều hướng

const LessonList = () => {
  const [lessons, setLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Gọi API để lấy dữ liệu
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axios.get('https://67c0f8e861d8935867e1970b.mockapi.io/AITools');
        setLessons(response.data);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    fetchLessons();
  }, []);

  // Hàm lọc bài giảng theo tên
  const filteredLessons = lessons.filter(lesson =>
    lesson.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: 4, mt: 8 }}>
      {/* Thanh tìm kiếm */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm bài giảng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: '300px',
            backgroundColor: 'white',
            borderRadius: 1,
          }}
        />
      </Box>

      {/* Danh sách bài giảng */}
      <Grid container spacing={4}>
        {filteredLessons.map((lesson) => (
          <Grid item xs={12} sm={6} md={4} key={lesson.id}>
            <Link to={`/Lesson/${lesson.id}`} style={{ textDecoration: 'none' }}>
              <Card
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  boxShadow: 3,
                  '&:hover img': {
                    transform: 'scale(1.1)',
                    transition: 'transform 0.3s ease',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={lesson.image}  // Hình ảnh từ API
                  alt={lesson.name}  // Tên bài giảng
                  sx={{
                    height: 200,
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                  }}
                />
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" component="div">
                    {lesson.name}  {/* Tên bài giảng */}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LessonList;
