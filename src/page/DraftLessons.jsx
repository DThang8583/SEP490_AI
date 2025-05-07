import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  CircularProgress, 
  Alert, 
  List, 
  ListItem, 
  ListItemText,
  Paper,
  Pagination,
  ListItemIcon,
  ListItemButton,
  Skeleton,
  Stack
} from '@mui/material';
import { EditNote, DeleteOutline, Send, HourglassTop, InboxOutlined } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const DraftLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Or your preferred default
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  // Use useCallback for the fetch function to stabilize dependencies
  const fetchDraftLessons = useCallback(async (page = 1) => {
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

      // Added Page and PageSize parameters, and changed status to Status=1
      const response = await axios.get(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans?Status=1&userId=${userInfo.id}&Page=${page}&PageSize=${pageSize}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          timeout: 15000 // 15 second timeout
        }
      );
        
      if (response.data && response.data.code === 0) {
         // Extract data from the pagination structure
         const responseData = response.data.data;
         setLessons(responseData.items || []); 
         setCurrentPage(responseData.currentPage || 1);
         setTotalPages(responseData.totalPages || 0);
         setTotalRecords(responseData.totalRecords || 0);
      } else {
        throw new Error(response.data.message || "Failed to fetch draft lessons.");
      }
    } catch (err) {
      console.error("Error fetching draft lessons:", err);
      setError(err.message || "An error occurred while fetching lessons.");
      setLessons([]); // Clear lessons on error
      setTotalPages(0);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }, [userInfo?.id, pageSize]);

  useEffect(() => {
    fetchDraftLessons(currentPage);
  }, [fetchDraftLessons, currentPage]); // Use the stable fetch function

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Set page state, useEffect will trigger fetch
  };

  const handleEdit = (lesson) => {
    console.log("Edit lesson:", lesson);
    alert("Chức năng chỉnh sửa đang được phát triển.")
  };


  const handleSend = (lesson) => {
     console.log("Send lesson for approval:", lesson);
     alert("Chức năng gửi duyệt đang được phát triển.");
  };

  const handleNavigateToDetail = (lessonPlanId) => {
    if (lessonPlanId) {
      navigate(`/Bài-giảng-nháp/${lessonPlanId}`);
    } else {
      console.warn("Cannot navigate: Lesson ID is missing.");
    }
  };

  const renderSkeletons = () => (
    <List>
      {[...Array(pageSize)].map((_, index) => (
        <ListItem key={index} divider>
          <ListItemIcon>
             <Skeleton variant="circular" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary={<Skeleton variant="text" width="60%" />} 
            secondary={<Skeleton variant="text" width="40%" />}
          />
        </ListItem>
      ))}
    </List>
  );

  // Function to format date
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
          direction="row" 
          alignItems="center" 
          spacing={1.5} 
          mb={3} 
          sx={{ px: { xs: 2, sm: 3, md: 0 } }}
         > 
          <HourglassTop sx={{ color: 'primary.main', fontSize: '2.2rem' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Bài Giảng Nháp
          </Typography>
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
          {error && (
            <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
          )}

          {loading ? (
             renderSkeletons()
          ) : !error && lessons.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                 <InboxOutlined sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}/>
                 <Typography sx={{ color: 'text.secondary' }}>
                   Không có bài giảng nháp nào.
                 </Typography>
              </Box>
            ) : !error && lessons.length > 0 ? (
              <>
                <List sx={{ p: 0 }}>
                  {lessons.map((lesson) => (
                    <ListItem 
                      key={lesson.lessonPlanId} 
                      disablePadding
                    >
                      <ListItemButton 
                         onClick={() => handleNavigateToDetail(lesson.lessonPlanId)}
                         sx={{ 
                           borderRadius: '8px',
                           mb: 0.5,
                           '&:hover': { 
                             backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)' 
                           }
                         }}
                      >
                        <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                          <EditNote />
                        </ListItemIcon>
                        <ListItemText 
                          primary={lesson.lesson || 'Không có tiêu đề'} 
                          secondary={`Chủ đề: ${lesson.module || 'N/A'} | Lưu lúc: ${formatDate(lesson.createdAt)}`}
                          primaryTypographyProps={{ fontWeight: 500 }}
                          secondaryTypographyProps={{ color: 'text.secondary', fontSize: '0.85rem' }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3, mt: 2, borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}` }}>
                    <Pagination 
                      count={totalPages} 
                      page={currentPage} 
                      onChange={handlePageChange} 
                      color="primary" 
                      sx={{ 
                         '& .MuiPaginationItem-root': {
                           color: isDarkMode ? '#fff' : '',
                         },
                         '& .Mui-selected': {
                            backgroundColor: isDarkMode ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 107, 107, 0.1)',
                            fontWeight: 'bold'
                         }
                      }}
                    />
                  </Box>
                )}
              </>
            ) : null /* Fallback for unexpected state */ }
        </Paper>
      </Container>
    </Box>
  );
};

export default DraftLessons; 