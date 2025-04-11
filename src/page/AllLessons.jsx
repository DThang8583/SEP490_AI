import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Pagination,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Divider,
  Button
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const AllLessons = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalRecords: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const fetchLessons = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await axios.get(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/teacher-lessons?Page=${page}&PageSize=${pageSize}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.code === 0) {
        setLessons(response.data.data.items);
        setPagination({
          currentPage: response.data.data.currentPage,
          pageSize: response.data.data.pageSize,
          totalPages: response.data.data.totalPages,
          totalRecords: response.data.data.totalRecords,
          hasNextPage: response.data.data.hasNextPage,
          hasPreviousPage: response.data.data.hasPreviousPage
        });
      } else {
        throw new Error(response.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách bài giảng:', err);
      setError(err.message || 'Không thể tải danh sách bài giảng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handlePageChange = (event, newPage) => {
    fetchLessons(newPage, pagination.pageSize);
  };

  const handleViewLesson = (lessonId) => {
    navigate(`/lesson/${lessonId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        py: 4,
        minHeight: 'calc(100vh - 64px)',
        background: isDarkMode
          ? 'linear-gradient(135deg, rgb(18, 18, 18) 0%, rgb(30, 30, 30) 100%)'
          : 'linear-gradient(135deg, rgb(245, 247, 250) 0%, rgb(255, 255, 255) 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={2} mb={4}>
          <SchoolIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Danh sách bài giảng
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          {lessons.map((lesson) => (
            <Grid item xs={12} sm={6} md={4} key={lesson.id}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: '12px',
                  backgroundColor: isDarkMode ? 'rgba(40, 40, 40, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                  boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography 
                        variant="h6" 
                        component="h2" 
                        sx={{ 
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: 1.3,
                        }}
                      >
                        {lesson.lesson}
                      </Typography>
                      <Chip
                        label={lesson.status === 0 ? 'Nháp' : lesson.status === 1 ? 'Chờ duyệt' : 'Đã duyệt'}
                        color={lesson.status === 0 ? 'default' : lesson.status === 1 ? 'warning' : 'success'}
                        size="small"
                        sx={{ borderRadius: '8px' }}
                      />
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '4.5em',
                      }}
                    >
                      {lesson.module}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(lesson.createdAt), 'dd/MM/yyyy')}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewLesson(lesson.id)}
                        sx={{ 
                          borderRadius: '8px',
                          textTransform: 'none',
                          minWidth: '100px'
                        }}
                      >
                        Xem chi tiết
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  color: isDarkMode ? '#fff' : 'inherit',
                  '&.Mui-selected': {
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : undefined,
                  },
                },
              }}
            />
          </Box>
        )}

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Tổng số bài giảng: {pagination.totalRecords} | Trang {pagination.currentPage} / {pagination.totalPages}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AllLessons;