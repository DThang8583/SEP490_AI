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

  // New state for filters
  const [gradeIdFilter, setGradeIdFilter] = useState('');
  const [moduleIdFilter, setModuleIdFilter] = useState('');

  // New state for search term
  const [searchTerm, setSearchTerm] = useState('');

  // State for dropdown options
  const [modules, setModules] = useState([]);
  const [loadingFilterOptions, setLoadingFilterOptions] = useState(true);

  // Log userInfo to debug grade display
  console.log('DraftLessons - userInfo:', userInfo);
  console.log('DraftLessons - userInfo.grade:', userInfo?.grade);

  // Use useCallback for the fetch function to stabilize dependencies
  const fetchDraftLessons = useCallback(async (page = 1) => {
    if (!userInfo?.id || !gradeIdFilter) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      let url = `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans?Status=1&userId=${userInfo.id}&Page=${page}&PageSize=${pageSize}`;

      // Add filters if they have values
      url += `&GradeId=${gradeIdFilter}`;

      if (moduleIdFilter) {
          url += `&ModuleId=${moduleIdFilter}`;
      }
      // Add search term if it has a value
      if (searchTerm) {
          url += `&SearchTerm=${encodeURIComponent(searchTerm)}`;
      }
      // TODO: Add SortColumn and SortOrder if needed later

      // Added Page and PageSize parameters, and changed status to Status=1
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
         console.log("Raw API response data:", responseData);
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
  }, [userInfo?.id, pageSize, gradeIdFilter, moduleIdFilter, searchTerm]); // Removed lessonIdFilter from dependencies

  // Effect to fetch filter options (Grades and Modules)
  useEffect(() => {
      const fetchModulesForUserGrade = async () => {
          setLoadingFilterOptions(true);
          try {
              const token = localStorage.getItem('accessToken');
              if (!token) {
                  setError("Authentication token not found. Please log in.");
                  setLoadingFilterOptions(false);
                  return;
              }

              // Lấy gradeId từ userInfo
              let userGradeId = null;
              if (userInfo?.grade) {
                  const gradeNumberMatch = userInfo.grade.match(/\d+/); // Tìm số trong chuỗi "Lớp X"
                  if (gradeNumberMatch && gradeNumberMatch[0]) {
                      userGradeId = parseInt(gradeNumberMatch[0], 10);
                      if(isNaN(userGradeId)) userGradeId = null;
                  }
              } else if (userInfo?.gradeId) {
                  userGradeId = userInfo.gradeId;
              }

              if (userGradeId !== null) {
                  setGradeIdFilter(userGradeId);

                  // Fetch Modules dựa trên userGradeId
                  const modulesResponse = await axios.get(
                      `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades/${userGradeId}/modules`,
                      { headers: { 'Authorization': `Bearer ${token}` } }
                  );
                  if (modulesResponse.data.code === 0) {
                      setModules(modulesResponse.data.data.modules || []);
                  } else {
                      console.error(`Failed to fetch modules for grade ${userGradeId}:`, modulesResponse.data.message);
                      setError(modulesResponse.data.message || `Lỗi khi tải danh sách chủ đề cho lớp ${userInfo?.grade || userGradeId}.`);
                      setModules([]);
                  }
              } else {
                  console.warn("UserInfo or user grade not found or could not be parsed.");
                  setError("Không tìm thấy thông tin lớp của người dùng.");
                  setModules([]);
                  setGradeIdFilter('');
              }

          } catch (error) {
              console.error("Error fetching modules for user grade:", error);
              setError(`Lỗi khi tải danh sách chủ đề: ${error.message}`);
              setModules([]);
              setGradeIdFilter('');
          } finally {
              setLoadingFilterOptions(false);
          }
      };

      // Chỉ fetch khi userInfo có sẵn
      if (userInfo) {
          fetchModulesForUserGrade();
      }

  }, [userInfo]); // Dependency array chỉ cần userInfo

  useEffect(() => {
    fetchDraftLessons(currentPage);
 }, [fetchDraftLessons, currentPage]); // Removed lessonIdFilter from dependencies

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
      navigate(`/Giáo-án-nháp/${lessonPlanId}`);
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
    return dateString;
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
            Giáo án Nháp
          </Typography>
          {userInfo?.grade && (
             <Typography
               variant="h6"
               sx={{
                 fontWeight: 600,
                 ml: 2,
                 px: 2,
                 py: 0.5,
                 borderRadius: '12px',
                 backgroundColor: isDarkMode ? 'rgba(255, 107, 107, 0.15)' : 'rgba(255, 107, 107, 0.1)',
                 color: 'warning.main', // Giữ màu warning.main cho consistency
                 border: `1px solid ${isDarkMode ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 107, 107, 0.2)'}`, // Giữ border cho consistency
                 display: 'inline-flex',
                 alignItems: 'center',
                 gap: 1
               }}
             >
                Lớp: {userInfo.grade.replace('Lớp ', '')}
             </Typography>
           )}
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
             {/* Chỉ hiển thị Module filter nếu có modules hoặc đang load options và có gradeIdFilter */}
             {(modules.length > 0 || loadingFilterOptions) && gradeIdFilter && (
               <Grid item xs={12} sm={12} md={4}> {/* Module filter */}
                  <FormControl fullWidth size="small" disabled={loadingFilterOptions}>
                     <InputLabel>Lọc theo Chủ đề</InputLabel>
                     {loadingFilterOptions ? (
                         <Skeleton variant="rectangular" height={40} /> // Skeleton khi đang load
                     ) : (
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
                     )}
                  </FormControl>
               </Grid>
             )}
             {/* Search filter */}
             {/* Điều chỉnh kích thước dựa trên việc module filter có hiển thị hay không */}
             <Grid item xs={12} sm={12} md={((modules.length > 0 || loadingFilterOptions) && gradeIdFilter) ? 8 : 12}>
                <TextField
                   fullWidth
                   size="small"
                   label="Tìm kiếm Giáo án"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                         setCurrentPage(1);
                      }
                   }}
                   InputLabelProps={{ shrink: true }}
                   // Disable search nếu chưa có gradeIdFilter (trước khi load xong)
                   disabled={!gradeIdFilter && !loadingFilterOptions}
                />
             </Grid>
          </Grid>

          {/* Hiển thị loading skeleton hoặc nội dung */}
           {/* Hiển thị loading nếu đang fetch lessons HOẶC (đang fetch filter options VÀ CHƯA có gradeIdFilter) */}
          {loading || (loadingFilterOptions && !gradeIdFilter) ? (
             renderSkeletons()
          ) : !error && lessons.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                 <InboxOutlined sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}/>
                 <Typography sx={{ color: 'text.secondary' }}>
                   Không có Giáo án nháp nào.
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