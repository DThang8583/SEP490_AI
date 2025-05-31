import React, { useState, useEffect, useCallback } from 'react';
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
  Button,
  TextField,
  InputAdornment,
  useTheme
} from '@mui/material';
import { School as SchoolIcon, Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

const AllLessons = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const { blogId } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalRecords: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const searchInputRef = React.useRef(null);

  // Auto focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const fetchBlogs = async (page = 1, pageSize = 10, currentSearchTerm = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await axios.get(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/blogs?Page=${page}&PageSize=${pageSize}${currentSearchTerm ? `&searchTerm=${encodeURIComponent(currentSearchTerm)}` : ''}`,
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

  const fetchBlogDetails = async (blogId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('Authentication token not found.');
        return null;
      }

      const response = await axios.get(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/blogs/${blogId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.code === 0) {
        console.log('Blog details:', response.data.data);
        return response.data.data;
      } else {
        console.error('Failed to fetch blog details:', response.data?.message);
        return null;
      }
    } catch (error) {
      console.error('Error fetching blog details:', error);
      return null;
    }
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(currentSearchTerm);
    }, 500); // Wait for 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [currentSearchTerm]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setCurrentSearchTerm(value);
    setPagination({ ...pagination, currentPage: 1 }); // Reset to first page when searching
  };

  useEffect(() => {
    fetchBlogs(pagination.currentPage, pagination.pageSize, debouncedSearchTerm);
  }, [pagination.currentPage, pagination.pageSize, debouncedSearchTerm]); // Use debouncedSearchTerm instead of currentSearchTerm

  const handlePageChange = (event, newPage) => {
    fetchBlogs(newPage, pagination.pageSize, debouncedSearchTerm); // Use debouncedSearchTerm
  };

  const handleViewLesson = (blogId) => {
    navigate(`/chi-tiet-bai-dang/${blogId}`);
  };

  const handleCreateBlog = () => {
    navigate('/tao-bai-dang');
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
          <SchoolIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Danh sách bài đăng
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            <TextField
              inputRef={searchInputRef}
              label="Tìm kiếm bài đăng"
              variant="outlined"
              size="small"
              value={currentSearchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{
                ml: 2,
                backgroundColor: isDarkMode ? theme.palette.primary.main : '#FFFFFF',
                color: isDarkMode ? '#FFFFFF' : theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: isDarkMode ? theme.palette.primary.dark : '#FF5252',
                  color: '#FFFFFF'
                }
              }}
              startIcon={<AddIcon />}
              onClick={handleCreateBlog}
            >
              Đăng bài
            </Button>
          </Box>
        </Stack>

        <Grid container spacing={2}>
          {blogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog.blogId}>
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
                    cursor: 'pointer',
                  },
                }}
                onClick={() => handleViewLesson(blog.blogId)}
              >
                <CardContent>
                  <Stack spacing={2}>
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
                        color: isDarkMode ? '#FFFFFF' : 'inherit'
                      }}
                    >
                      {blog.title}
                    </Typography>
                    
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
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit'
                      }}
                    >
                      {blog.body}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          {blog.publicationDate}
                        </Typography>
                        <Typography variant="caption" color="primary" sx={{ fontWeight: 500 }}>
                          {blog.name || 'Ẩn danh'}
                        </Typography>
                      </Stack>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewLesson(blog.blogId);
                        }}
                        sx={{ 
                          borderRadius: '8px',
                          textTransform: 'none',
                          minWidth: '100px',
                          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'inherit',
                          color: isDarkMode ? '#FFFFFF' : 'inherit',
                          '&:hover': {
                            borderColor: isDarkMode ? '#FFFFFF' : 'inherit',
                            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'inherit'
                          }
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
            Tổng số bài viết: {pagination.totalRecords} | Trang {pagination.currentPage} / {pagination.totalPages}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AllLessons;
