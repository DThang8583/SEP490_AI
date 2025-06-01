import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
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
  Avatar,
  Fade,
  Zoom,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Psychology as CommandIcon,
  School as SchoolIcon,
  Search as SearchIcon,
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { styled, keyframes } from '@mui/material/styles';

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

// Styled Components
const MainContainer = styled(Box)(({ theme, isDarkMode }) => ({
  minHeight: 'calc(100vh - 64px)',
  background: isDarkMode
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    : 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 50%, #9C27B0 100%)',
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
      ? 'radial-gradient(circle at 20% 80%, rgba(156, 39, 176, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(103, 58, 183, 0.1) 0%, transparent 50%)'
      : 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
}));

const HeaderCard = styled(Paper)(({ theme, isDarkMode }) => ({
  padding: '48px 32px',
  marginBottom: '32px',
  textAlign: 'center',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 255, 255, 0.3)',
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
    background: 'linear-gradient(90deg, transparent, rgba(156, 39, 176, 0.1), transparent)',
    animation: `${shimmer} 3s ease-in-out infinite`,
  },
}));

const FloatingIcon = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
  marginBottom: '16px',
  animation: `${float} 3s ease-in-out infinite`,
  boxShadow: '0 12px 30px rgba(156, 39, 176, 0.4)',
  border: '4px solid rgba(255, 255, 255, 0.2)',
  '& .MuiSvgIcon-root': {
    fontSize: '2.5rem',
    color: '#fff',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
  },
}));

const GradientTitle = styled(Typography)(({ theme, isDarkMode }) => ({
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 800,
  fontSize: '2.5rem',
  background: isDarkMode
    ? 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)'
    : 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  marginBottom: '16px',
  letterSpacing: '0.5px',
  textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem',
  },
}));

const SubTitle = styled(Typography)(({ theme, isDarkMode }) => ({
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontSize: '1.25rem',
  fontWeight: 500,
  color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(156, 39, 176, 0.8)',
  marginBottom: '24px',
  letterSpacing: '0.3px',
  lineHeight: 1.6,
}));

const ControlsCard = styled(Paper)(({ theme, isDarkMode }) => ({
  padding: '24px',
  marginBottom: '32px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(156, 39, 176, 0.2)',
  boxShadow: isDarkMode
    ? '0 15px 35px rgba(0, 0, 0, 0.2)'
    : '0 15px 35px rgba(0, 0, 0, 0.08)',
  animation: `${slideInUp} 0.8s ease-out`,
}));

const StyledTextField = styled(TextField)(({ theme, isDarkMode }) => ({
  '& .MuiInputLabel-root': {
    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(156, 39, 176, 0.8)',
    fontWeight: 600,
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  },
  '& .MuiOutlinedInput-root': {
    background: isDarkMode
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '& fieldset': {
      borderColor: isDarkMode
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(156, 39, 176, 0.2)',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: isDarkMode
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(156, 39, 176, 0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#9C27B0',
      boxShadow: '0 0 0 3px rgba(156, 39, 176, 0.1)',
    },
    '& .MuiInputBase-input': {
      color: isDarkMode ? '#fff' : '#2C3E50',
      fontWeight: 600,
      fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
  },
}));

const CommandCard = styled(Card)(({ theme, isDarkMode }) => ({
  marginBottom: '16px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(156, 39, 176, 0.1)',
  boxShadow: isDarkMode
    ? '0 8px 25px rgba(0, 0, 0, 0.2)'
    : '0 8px 25px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(156, 39, 176, 0.1), transparent)',
    transition: 'left 0.6s ease',
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: isDarkMode
      ? '0 16px 40px rgba(0, 0, 0, 0.3)'
      : '0 16px 40px rgba(0, 0, 0, 0.1)',
    '&::before': {
      left: '100%',
    },
  },
}));

const CommandIcon_Styled = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
  boxShadow: '0 4px 15px rgba(156, 39, 176, 0.3)',
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
    color: '#fff',
  },
}));

const FloatingBubble = styled(Box)(({ theme, size, top, left, delay, isDarkMode }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  background: isDarkMode
    ? `rgba(156, 39, 176, ${Math.random() * 0.1 + 0.05})`
    : `rgba(156, 39, 176, ${Math.random() * 0.08 + 0.02})`,
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
  minHeight: '400px',
  animation: `${float} 2s ease-in-out infinite`,
}));

const EmptyStateContainer = styled(Paper)(({ theme, isDarkMode }) => ({
  padding: '48px 32px',
  textAlign: 'center',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(156, 39, 176, 0.2)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  marginTop: '24px',
  animation: `${slideInUp} 0.8s ease-out`,
}));

const CommandManager = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const { userInfo } = useAuth();
  const { isDarkMode } = useTheme();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch prompts from API
  const fetchPrompts = useCallback(async () => {
    if (!userInfo?.id) {
      setError('Không tìm thấy thông tin người dùng');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication token not found.');
      }

      const response = await axios.get(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users/${userInfo.id}/prompts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 15000,
        }
      );

      if (response.data && response.data.code === 0) {
        setPrompts(response.data.data || []);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch prompts.');
      }
    } catch (err) {
      console.error('Error fetching prompts:', err);
      setError(err.message || 'An error occurred while fetching prompts.');
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  }, [userInfo?.id]);

  // Filter prompts based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPrompts(prompts);
    } else {
      const filtered = prompts.filter(prompt => 
        prompt.lessonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPrompts(filtered);
    }
    setCurrentPage(1); // Reset to first page when filtering
  }, [prompts, searchTerm]);

  // Calculate pagination
  useEffect(() => {
    setTotalPages(Math.ceil(filteredPrompts.length / pageSize));
  }, [filteredPrompts.length, pageSize]);

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredPrompts.slice(startIndex, endIndex);
  };

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (loading) {
    return (
      <MainContainer isDarkMode={isDarkMode}>
        <LoadingContainer>
          <CircularProgress size={60} sx={{ color: '#9C27B0' }} />
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
      {[...Array(6)].map((_, index) => (
        <FloatingBubble
          key={index}
          size={Math.random() * 60 + 30}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          delay={`${Math.random() * 5}s`}
          isDarkMode={isDarkMode}
        />
      ))}

      <StyledContainer maxWidth="lg">
        <Fade in timeout={1200}>
          <HeaderCard elevation={0} isDarkMode={isDarkMode}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <FloatingIcon>
                <CommandIcon />
              </FloatingIcon>
              <GradientTitle isDarkMode={isDarkMode}>
                Quản Lý Lệnh
              </GradientTitle>
              <SubTitle isDarkMode={isDarkMode}>
                Danh sách các lệnh và mẫu câu đã tạo cho việc tạo giáo án
              </SubTitle>
              {userInfo?.grade && (
                <Chip
                  icon={<SchoolIcon />}
                  label={userInfo.grade.replace('Lớp ', '')}
                  sx={{
                    background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    padding: '8px 16px',
                    height: 'auto',
                    borderRadius: '16px',
                    boxShadow: '0 8px 25px rgba(156, 39, 176, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    '& .MuiChip-label': {
                      fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                    },
                    '& .MuiChip-icon': {
                      color: '#fff',
                      marginLeft: '8px',
                    },
                  }}
                />
              )}
            </Box>
          </HeaderCard>
        </Fade>

        <Zoom in timeout={1400}>
          <ControlsCard elevation={0} isDarkMode={isDarkMode}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  size="small"
                  label="Tìm kiếm theo tên bài học hoặc nội dung"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  isDarkMode={isDarkMode}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#9C27B0' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </ControlsCard>
        </Zoom>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '20px',
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            border: isDarkMode
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(156, 39, 176, 0.2)',
            boxShadow: isDarkMode
              ? '0 20px 40px rgba(0, 0, 0, 0.3)'
              : '0 20px 40px rgba(0, 0, 0, 0.1)',
          }}
        >
          {filteredPrompts.length === 0 ? (
            <EmptyStateContainer elevation={0} isDarkMode={isDarkMode}>
              <CommandIcon sx={{ 
                fontSize: '4rem', 
                color: '#9C27B0', 
                marginBottom: '16px',
                animation: `${float} 3s ease-in-out infinite`,
                filter: 'drop-shadow(0 8px 16px rgba(156, 39, 176, 0.3))',
              }} />
              <Typography
                sx={{
                  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: isDarkMode ? '#fff' : '#9C27B0',
                  marginBottom: '8px',
                }}
              >
                {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có lệnh nào'}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                  fontSize: '1rem',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(156, 39, 176, 0.7)',
                }}
              >
                {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Các lệnh tạo giáo án sẽ xuất hiện ở đây'}
              </Typography>
            </EmptyStateContainer>
          ) : (
            <>
              <Box sx={{ mb: 3 }}>
                {getCurrentPageItems().map((prompt, index) => (
                  <Fade in timeout={800 + index * 100} key={prompt.promptId}>
                    <CommandCard isDarkMode={isDarkMode}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <CommandIcon_Styled>
                            <CommandIcon />
                          </CommandIcon_Styled>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                                fontWeight: 700,
                                color: isDarkMode ? '#fff' : '#2C3E50',
                                mb: 2,
                              }}
                            >
                              {prompt.lessonName || 'Không có tiêu đề'}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                              <AccessTimeIcon sx={{ fontSize: '1rem', color: '#9C27B0' }} />
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(44, 62, 80, 0.7)',
                                  fontWeight: 500,
                                }}
                              >
                                {prompt.createdAt}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                              <DescriptionIcon sx={{ fontSize: '1rem', color: '#9C27B0', mt: 0.5 }} />
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                                  color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(44, 62, 80, 0.8)',
                                  lineHeight: 1.6,
                                  flex: 1,
                                }}
                              >
                                {prompt.description || 'Không có mô tả'}
                              </Typography>
                            </Box>

                            
                          </Box>
                        </Box>
                      </CardContent>
                    </CommandCard>
                  </Fade>
                ))}
              </Box>
              
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={totalPages} 
                    page={currentPage} 
                    onChange={handlePageChange} 
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                        fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                      },
                      '& .Mui-selected': {
                        backgroundColor: 'rgba(156, 39, 176, 0.2) !important',
                        color: '#9C27B0 !important',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: 'rgba(156, 39, 176, 0.3) !important',
                        }
                      }
                    }}
                  />
                </Box>
              )}

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
                  : '1px solid rgba(156, 39, 176, 0.2)',
              }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 600,
                  }}
                >
                  Tổng số lệnh: {filteredPrompts.length} | Trang {currentPage} / {totalPages}
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </StyledContainer>
    </MainContainer>
  );
};

export default CommandManager;
