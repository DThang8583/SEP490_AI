import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  CircularProgress, 
  Alert, 
  Paper,
  Button,
  Divider,
  Grid,
  Stack,
  Skeleton,
  IconButton,
  Tooltip,
  Pagination,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Chip
} from '@mui/material';
import { 
  School as SchoolIcon, 
  Event as EventIcon, 
  Description, 
  Add as AddIcon,
  Upload as UploadIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return 'Invalid Date';
  }
};

const AllLessons = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const { isDarkMode } = useTheme();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);

  const fetchAllLessons = useCallback(async (page = 1) => {
    if (!userInfo?.id) {
      setError("User not logged in or user ID not found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      // API endpoint for fetching all lessons
      const response = await axios.get(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/teacher-lessons?userId=${userInfo.id}&Page=${page}&PageSize=${pageSize}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          timeout: 15000
        }
      );
        
      if (response.data && response.data.code === 0) {
        setLessons(response.data.data || []);
        setTotalPages(Math.ceil((response.data.totalRecords || 0) / pageSize));
      } else {
        throw new Error(response.data.message || "Failed to fetch lessons.");
      }
    } catch (err) {
      console.error("Error fetching lessons:", err);
      setError(err.message || "An error occurred while fetching lessons.");
      setLessons([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [userInfo?.id]);

  useEffect(() => {
    fetchAllLessons(currentPage);
  }, [fetchAllLessons, currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleNavigateToDetail = (lessonId) => {
    if (lessonId) {
      navigate(`/lesson-detail/${lessonId}`);
    } else {
      console.warn("Cannot navigate: Lesson ID is missing");
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 1:
        return <Chip icon={<EditIcon />} label="Nháp" color="default" size="small" />;
      case 2:
        return <Chip icon={<PendingIcon />} label="Đang chờ duyệt" color="warning" size="small" />;
      case 3:
        return <Chip icon={<CheckCircleIcon />} label="Đã chấp nhận" color="success" size="small" />;
      case 4:
        return <Chip icon={<CancelIcon />} label="Đã từ chối" color="error" size="small" />;
      default:
        return <Chip label="Không xác định" size="small" />;
    }
  };

  const renderSkeletonList = () => (
    <List>
      {[...Array(5)].map((_, index) => (
        <ListItem key={index} divider>
          <ListItemIcon>
            <Skeleton variant="circular" width={40} height={40} />
          </ListItemIcon>
          <ListItemText
            primary={<Skeleton variant="text" width="60%" />}
            secondary={<Skeleton variant="text" width="40%" />}
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ 
      py: 4, 
      minHeight: 'calc(100vh - 64px)',
      background: isDarkMode
        ? 'linear-gradient(135deg, rgb(18, 18, 18) 0%, rgb(30, 30, 30) 100%)'
        : 'linear-gradient(135deg, rgb(245, 247, 250) 0%, rgb(255, 255, 255) 100%)',
    }}>
      <Container maxWidth="lg">
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          mb={3}
          sx={{ px: { xs: 2, sm: 3, md: 0 } }} 
        >
          <Stack direction="row" alignItems="center" spacing={1.5} mb={{ xs: 2, sm: 0 }}> 
            <SchoolIcon sx={{ color: 'primary.main', fontSize: '2.2rem' }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Các Bài Giảng
            </Typography>
          </Stack>
          <Tooltip title="Đăng lên bài giảng mới">
            <Button 
              variant="contained"
              color="primary"
              startIcon={<UploadIcon />}
              onClick={() => navigate('/upload-lesson')}
              sx={{ 
                minWidth: '200px',
                py: 1.5,
                boxShadow: 3,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '8px',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                }
              }}
            >
              Đăng lên bài giảng
            </Button>
          </Tooltip>
        </Stack>

        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, 
            borderRadius: '16px',
            backgroundColor: isDarkMode ? 'rgba(40, 40, 40, 0.85)' : 'rgba(255, 255, 255, 0.85)', 
            backdropFilter: 'blur(12px)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
            boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(0,0,0,0.05)',
          }}
        >
          {loading ? (
            renderSkeletonList()
          ) : error ? (
            <Alert severity="error" sx={{ my: 2 }}>{`Lỗi tải danh sách: ${error}`}</Alert>
          ) : lessons.length > 0 ? (
            <>
              <List>
                {lessons.map((lesson) => (
                  <ListItem 
                    key={lesson.id} 
                    divider
                    sx={{ 
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      }
                    }}
                  >
                    <ListItemButton onClick={() => handleNavigateToDetail(lesson.id)}>
                      <ListItemIcon>
                        <Description color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {lesson.lesson || 'Không có tiêu đề'}
                          </Typography>
                        }
                        secondary={
                          <Stack direction="row" spacing={2} alignItems="center" mt={0.5}>
                            <Typography variant="body2" color="text.secondary">
                              {lesson.module || 'Không có chủ đề'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(lesson.createdAt)}
                            </Typography>
                            {getStatusChip(lesson.status)}
                          </Stack>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination 
                    count={totalPages} 
                    page={currentPage} 
                    onChange={handlePageChange} 
                    color="primary" 
                    size="large"
                  />
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Bạn chưa có bài giảng nào
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => navigate('/upload-lesson')}
                sx={{ mt: 2 }}
              >
                Tạo bài giảng mới
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AllLessons; 