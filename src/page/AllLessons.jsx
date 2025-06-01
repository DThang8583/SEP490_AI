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
  useTheme,
  Fade,
  Zoom
} from '@mui/material';
import { School as SchoolIcon, Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const cardHover = keyframes`
  0% {
    transform: translateY(0px) scale(1);
  }
  100% {
    transform: translateY(-8px) scale(1.02);
  }
`;

// Styled Components
const MainContainer = styled(Box)(({ theme, isDarkMode }) => ({
  minHeight: 'calc(100vh - 64px)',
  background: isDarkMode
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    : 'linear-gradient(135deg, #2196F3 0%, #21CBF3 50%, #2196F3 100%)',
  position: 'relative',
  overflow: 'hidden',
  paddingTop: '32px',
  paddingBottom: '32px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isDarkMode
      ? 'radial-gradient(circle at 20% 80%, rgba(33, 150, 243, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(156, 39, 176, 0.1) 0%, transparent 50%)'
      : 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
}));

const HeaderSection = styled(Paper)(({ theme, isDarkMode }) => ({
  padding: '32px',
  marginBottom: '32px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(33, 150, 243, 0.2)',
  boxShadow: isDarkMode
    ? '0 20px 40px rgba(0, 0, 0, 0.3)'
    : '0 20px 40px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  animation: `${fadeIn} 0.8s ease-out`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.1), transparent)',
    animation: `${shimmer} 3s ease-in-out infinite`,
  },
}));

const MainTitle = styled(Typography)(({ theme, isDarkMode }) => ({
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 800,
  fontSize: '2.5rem',
  background: isDarkMode
    ? 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)'
    : 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '0.5px',
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem',
  },
}));

const SearchField = styled(TextField)(({ theme, isDarkMode }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    '& fieldset': {
      borderColor: isDarkMode 
        ? 'rgba(255, 255, 255, 0.2)' 
        : 'rgba(33, 150, 243, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: isDarkMode 
        ? 'rgba(255, 255, 255, 0.4)' 
        : 'rgba(33, 150, 243, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2196F3',
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    fontWeight: 600,
  },
  '& .MuiInputBase-input': {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  },
}));

const CreateButton = styled(Button)(({ theme, isDarkMode }) => ({
  background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
  color: '#fff',
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 700,
  fontSize: '1rem',
  padding: '12px 24px',
  borderRadius: '12px',
  boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(33, 150, 243, 0.4)',
    background: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
  },
}));

const LessonCard = styled(Card)(({ theme, isDarkMode }) => ({
  height: '100%',
  borderRadius: '16px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(33, 150, 243, 0.2)',
  boxShadow: isDarkMode
    ? '0 12px 30px rgba(0, 0, 0, 0.2)'
    : '0 12px 30px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: isDarkMode
      ? '0 20px 50px rgba(0, 0, 0, 0.4)'
      : '0 20px 50px rgba(33, 150, 243, 0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.1), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover::before': {
    left: '100%',
  },
}));

const FloatingBubble = styled(Box)(({ theme, size, top, left, delay, isDarkMode }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  background: isDarkMode
    ? `rgba(33, 150, 243, ${Math.random() * 0.1 + 0.05})`
    : `rgba(33, 150, 243, ${Math.random() * 0.08 + 0.02})`,
  top: top,
  left: left,
  animation: `${float} ${Math.random() * 8 + 8}s ease-in-out infinite`,
  animationDelay: delay,
  zIndex: 1,
  pointerEvents: 'none',
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '60vh',
  animation: `${float} 2s ease-in-out infinite`,
}));

const StyledPagination = styled(Pagination)(({ theme, isDarkMode }) => ({
  '& .MuiPaginationItem-root': {
    color: isDarkMode ? '#fff' : '#2196F3',
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    fontWeight: 600,
    backgroundColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    border: isDarkMode 
      ? '1px solid rgba(255, 255, 255, 0.1)' 
      : '1px solid rgba(33, 150, 243, 0.2)',
    margin: '0 4px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: isDarkMode 
        ? 'rgba(255, 255, 255, 0.2)' 
        : 'rgba(33, 150, 243, 0.1)',
      transform: 'translateY(-2px)',
    },
    '&.Mui-selected': {
      backgroundColor: '#2196F3',
      color: '#fff',
      boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)',
    },
  },
}));

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
      <MainContainer isDarkMode={isDarkMode}>
        <LoadingContainer>
          <CircularProgress size={60} sx={{ color: '#2196F3' }} />
        </LoadingContainer>
      </MainContainer>
    );
  }

  if (error) {
    return (
      <MainContainer isDarkMode={isDarkMode}>
        <StyledContainer maxWidth="lg">
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: '12px', 
              fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
              mt: 4 
            }}
          >
            {error}
          </Alert>
        </StyledContainer>
      </MainContainer>
    );
  }

  return (
    <MainContainer isDarkMode={isDarkMode}>
      {/* Floating Bubbles */}
      {[...Array(12)].map((_, index) => (
        <FloatingBubble
          key={index}
          size={Math.random() * 80 + 40}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          delay={`${Math.random() * 5}s`}
          isDarkMode={isDarkMode}
        />
      ))}

      <StyledContainer maxWidth="lg">
        <Fade in timeout={800}>
          <HeaderSection elevation={0} isDarkMode={isDarkMode}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              alignItems={{ xs: 'flex-start', sm: 'center' }} 
              spacing={2}
            >
              <Stack direction="row" alignItems="center" spacing={2} flexGrow={1}>
                <SchoolIcon sx={{ fontSize: 40, color: '#2196F3' }} />
                <MainTitle variant="h4" component="h1" isDarkMode={isDarkMode}>
                  Danh sách bài đăng
                </MainTitle>
              </Stack>
              
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                <SearchField
                  inputRef={searchInputRef}
                  label="Tìm kiếm bài đăng"
                  variant="outlined"
                  size="small"
                  value={currentSearchTerm}
                  onChange={handleSearch}
                  isDarkMode={isDarkMode}
                  sx={{ minWidth: { xs: '100%', sm: '280px' } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#2196F3' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <CreateButton
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateBlog}
                  isDarkMode={isDarkMode}
                >
                  Đăng bài
                </CreateButton>
              </Stack>
            </Stack>
          </HeaderSection>
        </Fade>

        <Grid container spacing={3}>
          {blogs.map((blog, index) => (
            <Grid item xs={12} sm={6} md={4} key={blog.blogId}>
              <Zoom in timeout={1000 + index * 100}>
                <LessonCard
                  elevation={0}
                  isDarkMode={isDarkMode}
                  onClick={() => handleViewLesson(blog.blogId)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2.5}>
                      <Typography 
                        variant="h6" 
                        component="h2" 
                        sx={{ 
                          fontWeight: 700,
                          fontSize: '1.2rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: 1.4,
                          color: isDarkMode ? '#fff' : '#2196F3',
                          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                          minHeight: '2.8em',
                        }}
                      >
                        {blog.title}
                      </Typography>
                      
                      <Typography 
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          minHeight: '4.5em',
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
                          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                          lineHeight: 1.5,
                        }}
                      >
                        {blog.body}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <Stack spacing={0.5}>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                              fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                              fontSize: '0.75rem',
                            }}
                          >
                            {blog.publicationDate}
                          </Typography>
                          <Chip
                            label={blog.name || 'Ẩn danh'}
                            size="small"
                            sx={{
                              background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                              color: '#fff',
                              fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              height: '24px',
                            }}
                          />
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
                            fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                            fontWeight: 600,
                            borderColor: '#2196F3',
                            color: '#2196F3',
                            backgroundColor: isDarkMode 
                              ? 'rgba(33, 150, 243, 0.1)' 
                              : 'rgba(33, 150, 243, 0.05)',
                            '&:hover': {
                              borderColor: '#1976D2',
                              backgroundColor: isDarkMode 
                                ? 'rgba(33, 150, 243, 0.2)' 
                                : 'rgba(33, 150, 243, 0.1)',
                              transform: 'translateY(-2px)',
                            }
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </Box>
                    </Stack>
                  </CardContent>
                </LessonCard>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {pagination.totalPages > 1 && (
          <Fade in timeout={1500}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 6,
              mb: 2,
            }}>
              <StyledPagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                isDarkMode={isDarkMode}
              />
            </Box>
          </Fade>
        )}

        <Fade in timeout={2000}>
          <Box sx={{ 
            mt: 3, 
            textAlign: 'center',
            p: 3,
            borderRadius: '16px',
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
            backdropFilter: 'blur(10px)',
            border: isDarkMode
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(33, 150, 243, 0.2)',
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                fontWeight: 600,
              }}
            >
              Tổng số bài viết: {pagination.totalRecords} | Trang {pagination.currentPage} / {pagination.totalPages}
            </Typography>
          </Box>
        </Fade>
      </StyledContainer>
    </MainContainer>
  );
};

export default AllLessons;
