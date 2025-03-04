import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Divider, Grid, Card, CardContent, CardMedia } from '@mui/material';

const LessonDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [lesson, setLesson] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState(1); // Quản lý phần mô tả được chọn
  const [otherLessons, setOtherLessons] = useState([]); // Danh sách bài giảng khác

  useEffect(() => {
    const fetchLessonDetail = async () => {
      try {
        const response = await axios.get(`https://67c0f8e861d8935867e1970b.mockapi.io/AITools/${id}`);
        setLesson(response.data);
      } catch (error) {
        console.error('Error fetching lesson detail:', error);
      }
    };

    const fetchOtherLessons = async () => {
      try {
        const response = await axios.get('https://67c0f8e861d8935867e1970b.mockapi.io/AITools');
        setOtherLessons(response.data.filter((lesson) => lesson.id !== id)); // Lọc bài giảng không phải bài hiện tại
      } catch (error) {
        console.error('Error fetching other lessons:', error);
      }
    };

    fetchLessonDetail();
    fetchOtherLessons();
  }, [id]);

  if (!lesson) {
    return <Typography variant="h6">Đang tải...</Typography>;
  }

  const handleSelectDescription = (descNumber) => {
    setSelectedDescription(descNumber); // Cập nhật phần mô tả được chọn
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography
        variant="h3"
        sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center', color: '#333',mt:8 }} // Chỉnh màu tiêu đề
      >
        {lesson.name}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* Cấu trúc phân chia phần lựa chọn nút mô tả và bài giảng khác */}
      <Box sx={{ display: 'flex' }}>
        {/* Phần bên trái: Nút lựa chọn mô tả và các bài giảng khác */}
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '20%', marginRight: 3 }}>
          {/* Nút lựa chọn mô tả */}
          <Button
            variant="contained"
            fullWidth
            sx={{
              mb: 2,
              fontSize: '18px',
              textAlign: 'left',
              backgroundColor: selectedDescription === 1 ? 'orange' : 'transparent',
              padding: '12px',
              borderRadius: '8px',
              color: selectedDescription === 1 ? 'white' : '#333',
            }}
            onClick={() => handleSelectDescription(1)}
          >
            Trải nghiệm
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{
              mb: 2,
              fontSize: '18px',
              textAlign: 'left',
              backgroundColor: selectedDescription === 2 ? 'orange' : 'transparent',
              padding: '12px',
              borderRadius: '8px',
              color: selectedDescription === 2 ? 'white' : '#333',
            }}
            onClick={() => handleSelectDescription(2)}
          >
            Hình thành kiến thức mới
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{
              mb: 2,
              fontSize: '18px',
              textAlign: 'left',
              backgroundColor: selectedDescription === 3 ? 'orange' : 'transparent',
              padding: '12px',
              borderRadius: '8px',
              color: selectedDescription === 3 ? 'white' : '#333',
            }}
            onClick={() => handleSelectDescription(3)}
          >
            Thực hành, Luyện tập
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{
              mb: 2,
              fontSize: '18px',
              textAlign: 'left',
              backgroundColor: selectedDescription === 4 ? 'orange' : 'transparent',
              padding: '12px',
              borderRadius: '8px',
              color: selectedDescription === 4 ? 'white' : '#333',
            }}
            onClick={() => handleSelectDescription(4)}
          >
            Vận dụng
          </Button>
          {/* Các bài giảng khác */}
          <Typography variant="h5" sx={{ textAlign: 'center', mt:4, fontSize: '18px' }}>
            Các bài giảng khác
          </Typography>
          <Divider sx={{ my: 4, borderColor: 'black', height: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {otherLessons.slice(0, 3).map((otherLesson) => (
              <Card
                key={otherLesson.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column', // Hình ảnh ở trên, tên ở dưới
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 2,
                  boxShadow: 3,
                  width: '80%',
                  marginBottom: 1,
                  marginLeft:4.5
                }}
                component={Link}
                to={`/Lesson/${otherLesson.id}`}
                style={{ textDecoration: 'none' }}
              >
                <CardMedia
                  component="img"
                  image={otherLesson.image}
                  alt={otherLesson.name}
                  sx={{
                    width: '100%',
                    height: 150,
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
                <CardContent sx={{ textAlign: 'center', padding: 1 }}>
                  <Typography variant="body1" sx={{ fontSize: '14px', color: '#333' }}>
                    {otherLesson.name}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Phần bên phải: Nội dung mô tả */}
        <Box sx={{ width: '75%' }}>
          {selectedDescription === 1 && (
            <Typography
              variant="h6"
              sx={{ fontSize: '20px', lineHeight: 1.6, color: '#555' }}
            >
              {lesson.description1}
            </Typography>
          )}
          {selectedDescription === 2 && (
            <Typography
              variant="h6"
              sx={{ fontSize: '20px', lineHeight: 1.6, color: '#555' }}
            >
              {lesson.description2}
            </Typography>
          )}
          {selectedDescription === 3 && (
            <Typography
              variant="h6"
              sx={{ fontSize: '20px', lineHeight: 1.6, color: '#555' }}
            >
              {lesson.description3}
            </Typography>
          )}
          {selectedDescription === 4 && (
            <Typography
              variant="h6"
              sx={{ fontSize: '20px', lineHeight: 1.6, color: '#555' }}
            >
              {lesson.description4}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LessonDetail;
