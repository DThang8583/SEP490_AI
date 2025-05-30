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
  Stack,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { HourglassTop, InboxOutlined } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext'; // Assuming AuthContext is in this path
import { useTheme } from '../context/ThemeContext'; // Assuming ThemeContext is in this path
import { useNavigate } from 'react-router-dom'; // Added useNavigate

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

const PendingLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate(); // Get navigate function

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Or your preferred default
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  // New state for filters
  const [gradeIdFilter, setGradeIdFilter] = useState('');
  const [moduleIdFilter, setModuleIdFilter] = useState('');

  // New state for search term
  const [searchTerm, setSearchTerm] = useState('');

  // State for dropdown options
  const [grades, setGrades] = useState([]);
  const [modules, setModules] = useState([]);
  const [loadingFilterOptions, setLoadingFilterOptions] = useState(true);

  // Use useCallback for the fetch function to stabilize dependencies
  const fetchPendingLessons = useCallback(async (page = 1) => {
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
      let url = `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans?Status=2&userId=${userInfo.id}&Page=${page}&PageSize=${pageSize}`;

      // Add filters if they have values
      if (gradeIdFilter) {
          url += `&GradeId=${gradeIdFilter}`;
      }
      if (moduleIdFilter) {
          url += `&ModuleId=${moduleIdFilter}`;
      }
      // Add search term if it has a value
      if (searchTerm) {
          url += `&SearchTerm=${encodeURIComponent(searchTerm)}`;
      }
      // TODO: Add SortColumn and SortOrder if needed later

      const response = await axios.get(
        url,
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
        throw new Error(response.data.message || "Failed to fetch pending lessons.");
      }
    } catch (err) {
      console.error("Error fetching pending lessons:", err);
      setError(err.message || "An error occurred while fetching lessons.");
      setLessons([]); // Clear lessons on error
      setTotalPages(0);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }, [userInfo?.id, pageSize, gradeIdFilter, moduleIdFilter, searchTerm]);

  // Effect to fetch filter options (Grades and Modules)
  useEffect(() => {
      const fetchFilterOptions = async () => {
          setLoadingFilterOptions(true);
          try {
              const token = localStorage.getItem('accessToken');
              if (!token) return; // Don't fetch if no token

              // Fetch Grades
              const gradesResponse = await axios.get(
                  `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades`,
                  { headers: { 'Authorization': `Bearer ${token}` } }
              );
              if (gradesResponse.data.code === 0) {
                  setGrades(gradesResponse.data.data || []); 

                  // Get grade from localStorage and set corresponding gradeId
                  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                  if (userInfo?.grade) {
                    const gradeNumber = userInfo.grade.replace('Lớp ', '');
                    const matchingGrade = gradesResponse.data.data.find(g => g.gradeNumber === parseInt(gradeNumber));
                    if (matchingGrade) {
                      setGradeIdFilter(matchingGrade.gradeId);
                    }
                  }
              } else {
                  console.error("Failed to fetch grades for filter:", gradesResponse.data.message);
                  setGrades([]);
              }

              // Fetch Modules based on selected Grade
              if (gradeIdFilter) {
                  const modulesResponse = await axios.get(
                      `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades/${gradeIdFilter}/modules`,
                      { headers: { 'Authorization': `Bearer ${token}` } }
                  );
                  if (modulesResponse.data.code === 0) {
                      setModules(modulesResponse.data.data.modules || []); 
                  } else {
                      console.error(`Failed to fetch modules for grade ${gradeIdFilter}:`, modulesResponse.data.message);
                      setModules([]);
                  }
              } else {
                 setModules([]);
              }

          } catch (error) {
              console.error("Error fetching filter options:", error);
          } finally {
              setLoadingFilterOptions(false);
          }
      };

      fetchFilterOptions();
  }, [gradeIdFilter]); // Dependency array includes gradeIdFilter to refetch modules when grade changes

  useEffect(() => {
    fetchPendingLessons(currentPage);
  }, [fetchPendingLessons, currentPage, gradeIdFilter, moduleIdFilter, searchTerm]); // Added filter states to dependencies

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Set page state, useEffect will trigger fetch
  };

  // Handle navigation to detail page
  const handleNavigateToDetail = (lessonPlanId) => {
    if (lessonPlanId) {
      // Adjust the path as needed for your detail route
      navigate(`/Giáo-án-đang-chờ/${lessonPlanId}`); 
    } else {
      console.warn("Cannot navigate: Lesson Plan ID is missing.");
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

  return (
    <Box sx={{ 
        py: 4, 
        minHeight: 'calc(100vh - 64px)',
        background: isDarkMode
          ? 'linear-gradient(135deg, rgb(18, 18, 18) 0%, rgb(30, 30, 30) 100%)'
          : 'linear-gradient(135deg, rgb(245, 247, 250) 0%, rgb(255, 255, 255) 100%)', // Subtle gradient
     }}>
      <Container maxWidth="lg">
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={1.5} 
          mb={3} // Add margin below the title
          sx={{ px: { xs: 2, sm: 3, md: 0 } }} // Add horizontal padding matching Paper on small screens
         > 
          <HourglassTop sx={{ color: 'warning.main', fontSize: '2.2rem' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Giáo án Đang Chờ Duyệt
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

          {/* Filter Controls */}
          <Grid container spacing={2} mb={3}>
             <Grid item xs={12} sm={12} md={gradeIdFilter ? 3 : 4}> {/* Grade filter */}
                <FormControl fullWidth size="small">
                   <Select
                      value={gradeIdFilter}
                      disabled={true}
                      displayEmpty
                   >
                      {grades.map((grade) => (
                         <MenuItem key={grade.gradeId} value={grade.gradeId}>{`Lớp ${grade.gradeNumber}`}</MenuItem>
                      ))}
                   </Select>
                </FormControl>
             </Grid>
             {/* Conditionally render Module filter based on gradeIdFilter */}
             {gradeIdFilter ? (
               <Grid item xs={12} sm={12} md={3}> {/* Module filter */}
                  <FormControl fullWidth size="small" disabled={loadingFilterOptions || !gradeIdFilter}>
                     <InputLabel>Lọc theo Chủ đề</InputLabel>
                     <Select
                        value={moduleIdFilter}
                        label="Lọc theo Chủ đề"
                        onChange={(e) => {
                            setModuleIdFilter(e.target.value);
                            setCurrentPage(1); // Reset page to 1
                         }}
                     >
                        <MenuItem value=""><em>Tất cả Chủ đề</em></MenuItem>
                        {modules.map((module) => (
                           <MenuItem key={module.moduleId} value={module.moduleId}>{module.name}</MenuItem>
                        ))}
                     </Select>
                  </FormControl>
               </Grid>
             ) : null} {/* Ensure Grid item is null when not rendered */}
             
             <Grid item xs={12} sm={12} md={gradeIdFilter ? 6 : 8}> {/* Search filter */}
                <TextField
                   fullWidth
                   size="small"
                   label="Tìm kiếm Giáo án"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   onKeyPress={(e) => {
                      // Optional: Trigger fetch on Enter key press
                      if (e.key === 'Enter') {
                         setCurrentPage(1); // Reset page and trigger fetch via useEffect
                      }
                   }}
                   InputLabelProps={{ shrink: true }}
                />
             </Grid>
          </Grid>

          {loading ? (
             renderSkeletons()
          ) : !error && lessons.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                 <InboxOutlined sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}/>
                 <Typography sx={{ color: 'text.secondary' }}>
                   Không có Giáo án nào đang chờ duyệt.
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
                           borderRadius: '8px', // Rounded corners for button
                           mb: 0.5, // Small margin between items
                           '&:hover': { 
                             backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)' 
                           }
                         }}
                      >
                        <ListItemIcon sx={{ minWidth: 40, color: 'warning.main' }}>
                          <HourglassTop />
                        </ListItemIcon>
                        <ListItemText 
                          primary={lesson.lesson || 'Không có tiêu đề'} 
                          secondary={`Chủ đề: ${lesson.module || 'N/A'} | Gửi lúc: ${(lesson.createdAt)}`}
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

export default PendingLessons; 