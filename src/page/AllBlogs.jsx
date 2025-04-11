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
  Divider
} from '@mui/material';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { format } from 'date-fns';

const AllBlogs = () => {
  const { isDarkMode } = useTheme();
  const [blogs, setBlogs] = useState([]);
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

  const fetchBlogs = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await axios.get(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/blogs?Page=${page}&PageSize=${pageSize}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.code === 0) {
        setBlogs(response.data.data.items);
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
      console.error('Lỗi khi tải danh sách bài viết:', err);
      setError(err.message || 'Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handlePageChange = (event, newPage) => {
    fetchBlogs(newPage, pagination.pageSize);
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
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
          Danh sách bài viết
        </Typography>

        <Grid container spacing={3}>
          {blogs.map((blog) => (
            <Grid item xs={12} key={blog.blogId}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: '16px',
                  backgroundColor: isDarkMode ? 'rgba(40, 40, 40, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                  boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(0,0,0,0.05)',
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                        {blog.title}
                      </Typography>
                      <Chip
                        label={blog.category}
                        color="primary"
                        size="small"
                        sx={{ borderRadius: '8px' }}
                      />
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                      {blog.body}
                    </Typography>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Ngày đăng: {blog.publicationDate}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID bài giảng: {blog.teacherLessonId}
                      </Typography>
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
            Tổng số bài viết: {pagination.totalRecords} | Trang {pagination.currentPage} / {pagination.totalPages}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AllBlogs; 