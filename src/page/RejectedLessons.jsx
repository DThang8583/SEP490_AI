import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
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
import { Cancel, InboxOutlined } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

// Function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Invalid Date';
  }
};

const RejectedLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Default page size
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0); // Thêm totalRecords cho đồng nhất

  // New state for filters
  // gradeIdFilter sẽ được set tự động từ userInfo.grade
  const [gradeIdFilter, setGradeIdFilter] = useState('');
  const [moduleIdFilter, setModuleIdFilter] = useState('');

  // New state for search term
  const [searchTerm, setSearchTerm] = useState('');

  // State for dropdown options
  // const [grades, setGrades] = useState([]); // Không cần state này nữa
  const [modules, setModules] = useState([]);
  const [loadingFilterOptions, setLoadingFilterOptions] = useState(true);

  // Log userInfo to debug grade display
  console.log('RejectedLessons - userInfo:', userInfo);
  console.log('RejectedLessons - userInfo.grade:', userInfo?.grade);

  // Use useCallback for the fetch lessons function
  const fetchRejectedLessons = useCallback(async (page = 1) => {
    // Chỉ fetch lessons nếu có userInfo.id và gradeIdFilter đã được set
    if (!userInfo?.id || !gradeIdFilter) {
      // Nếu chưa có gradeIdFilter (ví dụ, component mới mount và userInfo chưa có grade),
      // giữ trạng thái loading cho đến khi gradeIdFilter được set trong useEffect
      // console.log('Skipping fetch lessons: userInfo.id or gradeIdFilter missing', { userId: userInfo?.id, gradeIdFilter });
      // setLoading(false); // Không set false ở đây để tránh nhấp nháy loading
      return;
    }

    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication token not found.');
      }

      // Added Page and PageSize parameters, and changed status to Status=4
      let url = `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans?Status=4&userId=${userInfo.id}&Page=${page}&PageSize=${pageSize}`;

      // Add filters if they have values
      // gradeIdFilter luôn có giá trị sau khi được set từ userInfo
      url += `&GradeId=${gradeIdFilter}`;

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
            Authorization: `Bearer ${token}`,
          },
          timeout: 15000, // 15 second timeout
        }
      );

      if (response.data && response.data.code === 0) {
        // Extract data from the pagination structure
        const responseData = response.data.data;
        setLessons(responseData.items || []);
        setCurrentPage(responseData.currentPage || 1);
        setTotalPages(responseData.totalPages || 0);
        setTotalRecords(responseData.totalRecords || 0); // Cập nhật totalRecords
      } else {
        throw new Error(response.data.message || 'Failed to fetch rejected lessons.');
      }
    } catch (err) {
      console.error('Error fetching rejected lessons:', err);
      setError(err.message || 'An error occurred while fetching lessons.');
      setLessons([]); // Clear lessons on error
      setTotalPages(0);
      setTotalRecords(0); // Reset totalRecords on error
    } finally {
      setLoading(false);
    }
  }, [userInfo?.id, pageSize, gradeIdFilter, moduleIdFilter, searchTerm]); // Thêm filter states vào dependencies


  // Effect để lấy gradeId từ userInfo và fetch Modules (giống PendingLessons)
  useEffect(() => {
        const fetchModulesForUserGrade = async () => {
            setLoadingFilterOptions(true); // Bắt đầu load options
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                  setError("Authentication token not found. Please log in.");
                  setLoadingFilterOptions(false);
                  return;
                }

                // Lấy gradeId từ userInfo
                // Giả định userInfo.grade có định dạng "Lớp X" và gradeId là X
                // Nếu userInfo có gradeId trực tiếp, sử dụng userInfo.gradeId
                let userGradeId = null;
                if (userInfo?.grade) {
                    const gradeNumberMatch = userInfo.grade.match(/\d+/); // Tìm số trong chuỗi "Lớp X"
                    if (gradeNumberMatch && gradeNumberMatch[0]) {
                        // Giả định gradeId trùng với số lớp
                        userGradeId = parseInt(gradeNumberMatch[0], 10);
                        if(isNaN(userGradeId)) userGradeId = null; // Đảm bảo là số hợp lệ
                    }
                } else if (userInfo?.gradeId) { // Nếu userInfo có sẵn gradeId
                    userGradeId = userInfo.gradeId;
                }


                if (userGradeId !== null) {
                    setGradeIdFilter(userGradeId); // Set gradeIdFilter

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
                    setModules([]); // Clear modules if gradeId is not available
                    setGradeIdFilter(''); // Ensure gradeIdFilter is empty
                }

            } catch (error) {
                console.error("Error fetching modules for user grade:", error);
                setError(`Lỗi khi tải danh sách chủ đề: ${error.message}`);
                setModules([]);
                 setGradeIdFilter('');
            } finally {
                setLoadingFilterOptions(false); // Kết thúc load options
            }
        };

        // Chỉ fetch khi userInfo có sẵn
        if (userInfo) {
             fetchModulesForUserGrade();
        }

   }, [userInfo]); // Dependency array chỉ cần userInfo


  // Effect để fetch lessons khi các filter hoặc trang thay đổi
  useEffect(() => {
    // fetchRejectedLessons sẽ tự kiểm tra gradeIdFilter trước khi fetch
    fetchRejectedLessons(currentPage);
  }, [fetchRejectedLessons, currentPage]); // Dependency array chỉ cần fetchLessons và currentPage


  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Set page state, useEffect sẽ trigger fetch
  };

  // Handle navigation to detail page
  const handleNavigateToDetail = (lessonPlanId) => {
    if (lessonPlanId) {
      navigate(`/Giáo-án-đã-từ-chối/${lessonPlanId}`);
    } else {
      console.warn('Cannot navigate: Lesson ID is missing.');
    }
  };

  const renderSkeletons = () => (
    <List>
      {[...Array(pageSize)].map((_, index) => (
        <ListItem key={index} divider>
          <ListItemIcon>
            <Skeleton variant="circular" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary={<Skeleton variant="text" width="60%" />} secondary={<Skeleton variant="text" width="40%" />} />
        </ListItem>
      ))}
    </List>
  );

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
        <Stack direction="row" alignItems="center" spacing={1.5} mb={3} sx={{ px: { xs: 2, sm: 3, md: 0 } }}>
          <Cancel sx={{ color: 'error.main', fontSize: '2.2rem' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Giáo án Bị Từ Chối
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
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`, // Giữ border cho consistency
            boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(0,0,0,0.05)',
          }}
        >
          {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

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
                           ))
                        }
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
                   Không có Giáo án nào bị từ chối.
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
                        <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                          <Cancel />
                        </ListItemIcon>
                        <ListItemText
                          primary={lesson.lesson || 'Không có tiêu đề'}
                          secondary={`Chủ đề: ${lesson.module || 'N/A'} | Từ chối lúc: ${(lesson.createdAt)}`}
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

export default RejectedLessons; 