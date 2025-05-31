import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  CircularProgress,
  Alert,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  LinearProgress,
  Button,
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Schedule as ScheduleIcon,
  MenuBook as MenuBookIcon,
  Subject as SubjectIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TeacherCurriculumm = () => {
  const { userInfo } = useAuth();
  console.log('userInfo:', userInfo);
  console.log('gradeId from userInfo:', userInfo?.gradeId);
  
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [lessons, setLessons] = useState({}); // Store lessons for each module
  const [lessonLoading, setLessonLoading] = useState({}); // Loading state for each module's lessons
  const [lessonError, setLessonError] = useState({}); // Error state for each module's lessons
  const [semester, setSemester] = useState('1');
  const [sortColumn, setSortColumn] = useState(null); // State for sorting column
  const [sortDir, setSortDir] = useState(null); // State for sorting direction (0: asc, 1: desc)
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonDetails, setLessonDetails] = useState(null);
  const [loadingLessonDetails, setLoadingLessonDetails] = useState(false);
  const [lessonDetailsError, setLessonDetailsError] = useState(null);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate(); // Get the navigate function

  const fetchLessons = async (moduleId) => {
    if (lessons[moduleId] || lessonLoading[moduleId]) return; // Don't fetch if already loaded or loading

    setLessonLoading(prev => ({ ...prev, [moduleId]: true }));
    setLessonError(prev => ({ ...prev, [moduleId]: null }));

    try {
      const response = await axios.get(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules/${moduleId}/lessons`
      );

      if (response.data.code === 0 && response.data.data && response.data.data.lessons) {
        setLessons(prev => ({ ...prev, [moduleId]: response.data.data.lessons }));
      } else {
        setLessonError(prev => ({ ...prev, [moduleId]: 'Failed to fetch lessons' }));
      }
    } catch (err) {
      setLessonError(prev => ({ ...prev, [moduleId]: 'Error fetching lessons: ' + err.message }));
    } finally {
      setLessonLoading(prev => ({ ...prev, [moduleId]: false }));
    }
  };

  const toggleRow = (moduleId) => {
    setExpandedRows(prev => {
      const isExpanded = !prev[moduleId];
      if (isExpanded) {
        fetchLessons(moduleId);
      }
      return { ...prev, [moduleId]: isExpanded };
    });
  };

  const handleSemesterChange = (event, newSemester) => {
    if (newSemester !== null) {
      setSemester(newSemester);
    }
  };

  // Handle sort click
  const handleSortClick = (column) => {
    setSortColumn(prevColumn => {
      let newDir = null;
      if (prevColumn === column) {
        // Cycle through sort directions: asc -> desc -> no sort
        setSortDir(prevDir => {
          newDir = (prevDir === null) ? 0 : (prevDir === 0 ? 1 : null);
          // Save sort state to localStorage
          if (newDir !== null) {
            localStorage.setItem('teacherCurriculummSortColumn', column);
            localStorage.setItem('teacherCurriculummSortDir', newDir.toString());
          } else {
            localStorage.removeItem('teacherCurriculummSortColumn');
            localStorage.removeItem('teacherCurriculummSortDir');
          }
          return newDir;
        });
        return prevColumn; // Column remains the same for cycling direction
      } else {
        // New column, default to ascending sort (0)
        newDir = 0;
        // Save sort state to localStorage
        localStorage.setItem('teacherCurriculummSortColumn', column);
        localStorage.setItem('teacherCurriculummSortDir', newDir.toString());
        setSortDir(0);
        return column;
      }
    });
  };

  // Function for viewing requirements
  const handleViewRequirements = () => {
    navigate('/yeu-cau-can-dat', { state: { gradeId: userInfo?.gradeId } });
  };

  const handleViewLesson = async (lessonId) => {
    setSelectedLesson(lessonId);
    setLoadingLessonDetails(true);
    setLessonDetailsError(null);
    try {
      const response = await axios.get(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons/${lessonId}/info`
      );
      if (response.data.code === 0) {
        setLessonDetails(response.data.data);
      } else {
        setLessonDetailsError('Failed to fetch lesson details');
      }
    } catch (err) {
      setLessonDetailsError('Error fetching lesson details: ' + err.message);
    } finally {
      setLoadingLessonDetails(false);
    }
  };

  const handleCloseLessonDetails = () => {
    setSelectedLesson(null);
    setLessonDetails(null);
    setLessonDetailsError(null);
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        if (!userInfo?.gradeId) {
          setError('Grade ID not found in user info');
          setLoading(false);
          return;
        }

        const params = {
          PageNumber: 1,
          PageSize: 999,
        };

        const response = await axios.get(
          'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules',
          { params }
        );

        if (response.data.code === 0) {
          console.log('API Response Data:', response.data.data.items);
          const filteredModules = response.data.data.items.filter(
            module => module.gradeNumber === parseInt(userInfo.gradeId, 10)
          );
          console.log('Modules filtered by gradeId:', filteredModules);
          setModules(filteredModules);
        } else {
          setError('Failed to fetch modules');
        }
      } catch (err) {
        setError('Error fetching modules: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [userInfo?.gradeId]);

  useEffect(() => {
    // Create a mutable copy for sorting
    const sortedModules = [...modules];

    // Apply client-side sorting
    if (sortColumn !== null && sortDir !== null) {
      sortedModules.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue < bValue) return sortDir === 0 ? -1 : 1; // 0: asc, 1: desc
        if (aValue > bValue) return sortDir === 0 ? 1 : -1;
        return 0;
      });
    }

    // Apply filtering by semester on the sorted list
    const filtered = sortedModules.filter(module => module.semester === parseInt(semester));
    console.log('Modules filtered and sorted:', filtered);
    setFilteredModules(filtered);
  }, [semester, modules, sortColumn, sortDir]);

  // Load sort state from localStorage on component mount
  useEffect(() => {
    const savedColumn = localStorage.getItem('teacherCurriculummSortColumn');
    const savedDir = localStorage.getItem('teacherCurriculummSortDir');

    if (savedColumn !== null) {
      setSortColumn(savedColumn);
      setSortDir(parseInt(savedDir, 10));
    } else {
      // Set default sort to moduleId ascending if no saved state
      setSortColumn('moduleId');
      setSortDir(0);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: theme.palette.background.default,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ mt: 2, color: theme.palette.text.secondary }}>
            Đang tải chương trình giảng dạy...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: theme.palette.background.default,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 600, boxShadow: 2 }}>
          <Typography variant="h6">Lỗi:</Typography>
          <Typography>{error}</Typography>
        </Alert>
      </Box>
    );
  }

  const commonInfo = modules[0] || {};

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            textAlign: 'center',
            bgcolor: theme.palette.background.paper,
            borderRadius: 3,
            border: `1px solid ${isDarkMode ? theme.palette.divider : '#d0d0d0'}`,
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              color: isDarkMode ? '#fff' : '#000',
              fontFamily: 'sans-serif',
              textShadow: isDarkMode ? 'none' : '1px 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            Sách Giáo Khoa Toán Lớp {userInfo?.gradeId}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{
              fontFamily: 'Chương trình giảng dạy',
              color: isDarkMode ? '#fff' : '#000',
              mb: 3,
              fontWeight: 500,
            }}
          >
            Chương trình giảng dạy
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 4, 
            mb: 3,
            flexWrap: 'wrap',
            bgcolor: theme.palette.background.default,
            p: 2,
            borderRadius: 2,
            border: `1px solid ${isDarkMode ? theme.palette.divider : '#e0e0e0'}`,
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              bgcolor: theme.palette.background.paper,
              p: 1.5,
              borderRadius: 2,
              boxShadow: theme.shadows[1],
              border: `1px solid ${isDarkMode ? theme.palette.divider : '#d0d0d0'}`,
            }}>
              <SchoolIcon sx={{ color: isDarkMode ? '#fff' : '#000' }} />
              <Typography sx={{ color: isDarkMode ? '#fff' : '#000', fontWeight: 500 }}>
                Lớp: {commonInfo.gradeNumber}
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              bgcolor: theme.palette.background.paper,
              p: 1.5,
              borderRadius: 2,
              boxShadow: theme.shadows[1],
              border: `1px solid ${isDarkMode ? theme.palette.divider : '#d0d0d0'}`,
            }}>
              <MenuBookIcon sx={{ color: isDarkMode ? '#fff' : '#000' }} />
              <Typography sx={{ color: isDarkMode ? '#fff' : '#000', fontWeight: 500 }}>
                Chương trình: {commonInfo.curriculum}
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              bgcolor: theme.palette.background.paper,
              p: 1.5,
              borderRadius: 2,
              boxShadow: theme.shadows[1],
              border: `1px solid ${isDarkMode ? theme.palette.divider : '#d0d0d0'}`,
            }}>
              <BookIcon sx={{ color: isDarkMode ? '#fff' : '#000' }} />
              <Typography sx={{ color: isDarkMode ? '#fff' : '#000', fontWeight: 500 }}>
                Sách: {commonInfo.book}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Container for Semester Toggle and Requirements Button */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}>
            <ToggleButtonGroup
              value={semester}
              exclusive
              onChange={handleSemesterChange}
              aria-label="semester selection"
              sx={{
                '& .MuiToggleButton-root': {
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#fff' : '#000',
                  px: 4,
                  py: 1,
                  fontWeight: 500,
                  '&.Mui-selected': {
                    backgroundColor: isDarkMode ? '#fff' : '#000',
                    color: isDarkMode ? '#000' : '#fff',
                    '&:hover': {
                      backgroundColor: isDarkMode ? '#e0e0e0' : '#333',
                    },
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                },
              }}
            >
              <ToggleButton value="1" aria-label="semester 1">
                Học kỳ 1
              </ToggleButton>
              <ToggleButton value="2" aria-label="semester 2">
                Học kỳ 2
              </ToggleButton>
            </ToggleButtonGroup>

            <Button 
              variant="contained"
              startIcon={<AssignmentIcon />}
              sx={{
                bgcolor: isDarkMode ? '#fff' : '#000',
                color: isDarkMode ? '#000' : '#fff',
                '&:hover': { 
                  bgcolor: isDarkMode ? '#e0e0e0' : '#333'
                },
              }}
              onClick={handleViewRequirements}
            >
              Xem yêu cầu cần đạt
            </Button>
          </Box>
        </Paper>

        <TableContainer 
          component={Paper} 
          sx={{ 
            boxShadow: theme.shadows[4],
            borderRadius: 3,
            overflow: 'hidden',
            border: `1px solid ${isDarkMode ? theme.palette.divider : '#d0d0d0'}`,
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: isDarkMode ? '#000' : '#fff' }}>
                <TableCell sx={{ width: '50px' }} />
                <TableCell 
                  sx={{
                    color: isDarkMode ? '#fff' : '#000',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSortClick('moduleId')}
                >
                  <TableSortLabel
                    active={sortColumn === 'moduleId'}
                    direction={sortDir === 0 ? 'asc' : (sortDir === 1 ? 'desc' : undefined)}
                    sx={{
                      '& .MuiTableSortLabel-icon': {
                        color: isDarkMode ? '#fff' : '#000' + ' !important',
                      },
                    }}
                  >
                    Chủ đề
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? '#fff' : '#000', fontWeight: 'bold', fontSize: '1rem' }}>Mô tả</TableCell>
                <TableCell sx={{ color: isDarkMode ? '#fff' : '#000', fontWeight: 'bold', fontSize: '1rem' }}>Tổng số tiết</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredModules.map((module) => (
                <React.Fragment key={module.moduleId}>
                  <TableRow 
                    hover 
                    onClick={() => toggleRow(module.moduleId)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { bgcolor: theme.palette.action.hover },
                      bgcolor: expandedRows[module.moduleId] ? theme.palette.action.selected : theme.palette.background.paper,
                      transition: 'background-color 0.2s',
                      borderBottom: `1px solid ${isDarkMode ? theme.palette.divider : '#e0e0e0'}`,
                    }}
                  >
                    <TableCell>
                      <IconButton size="small" sx={{ color: isDarkMode ? '#fff' : '#000' }}>
                        {expandedRows[module.moduleId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: isDarkMode ? '#fff' : '#000' }}>
                      Chủ đề {module.moduleId}: {module.name}
                    </TableCell>
                    <TableCell sx={{ color: isDarkMode ? '#fff' : '#000' }}>{module.desciption}</TableCell>
                    <TableCell sx={{ fontWeight: 500, color: isDarkMode ? '#fff' : '#000' }}>{module.totalPeriods}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                      <Collapse in={expandedRows[module.moduleId]} timeout="auto" unmountOnExit>
                        <Box sx={{ 
                          margin: 2,
                          p: 2,
                          bgcolor: theme.palette.action.hover,
                          borderRadius: 2,
                          border: `1px solid ${isDarkMode ? theme.palette.divider : '#d0d0d0'}`,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                        }}>
                          {lessonLoading[module.moduleId] ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                              <LinearProgress sx={{ width: '100%' }} />
                            </Box>
                          ) : lessonError[module.moduleId] ? (
                            <Alert severity="error">{lessonError[module.moduleId]}</Alert>
                          ) : lessons[module.moduleId] && lessons[module.moduleId].length > 0 ? (
                            <Box sx={{ width: '100%' }}>
                              <Typography variant="subtitle1" sx={{ 
                                fontWeight: 'bold', 
                                mb: 1,
                                color: isDarkMode ? '#fff' : '#000',
                              }}>
                                Danh sách bài học:
                              </Typography>
                              <Table size="small" sx={{ mb: 2 }}>
                                <TableBody>
                                  {lessons[module.moduleId].map((lesson) => (
                                    <TableRow key={lesson.lessonId}>
                                      <TableCell sx={{ fontWeight: 500, color: isDarkMode ? '#fff' : '#000', borderBottom: 'none' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <SubjectIcon sx={{ color: isDarkMode ? '#fff' : '#000' }} />
                                          {lesson.name}
                                        </Box>
                                      </TableCell>
                                      <TableCell sx={{ color: isDarkMode ? '#fff' : '#000', borderBottom: 'none' }}>
                                        Tổng số tiết: <Box component="span" sx={{ color: isDarkMode ? '#fff' : '#000', fontWeight: 'normal' }}>{lesson.totalPeriods}</Box>
                                      </TableCell>
                                      <TableCell sx={{ borderBottom: 'none' }}>
                                        <IconButton 
                                          size="small" 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewLesson(lesson.lessonId);
                                          }}
                                          sx={{ color: isDarkMode ? '#fff' : '#000' }}
                                        >
                                          <VisibilityIcon />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          ) : (
                            <Typography variant="body2" sx={{ color: isDarkMode ? '#fff' : '#000', mb: 2 }}>
                              Không có bài học nào cho chủ đề này.
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredModules.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: theme.palette.background.paper,
              borderRadius: 3,
              border: `1px solid ${isDarkMode ? theme.palette.divider : '#d0d0d0'}`,
              mt: 2,
              boxShadow: theme.shadows[3],
            }}
          >
            <Typography 
              variant="h6" 
              sx={{
                fontFamily: 'Times New Roman, serif',
                color: isDarkMode ? '#fff' : '#000',
                fontWeight: 500,
              }}
            >
              Không tìm thấy chủ đề nào cho học kỳ {semester}.
            </Typography>
          </Paper>
        )}

        <Dialog 
          open={selectedLesson !== null} 
          onClose={handleCloseLessonDetails}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            bgcolor: isDarkMode ? '#000' : '#fff',
            color: isDarkMode ? '#fff' : '#000',
            fontWeight: 'bold'
          }}>
            Chi tiết bài học
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {loadingLessonDetails ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : lessonDetailsError ? (
              <Alert severity="error" sx={{ mt: 2 }}>{lessonDetailsError}</Alert>
            ) : lessonDetails ? (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: isDarkMode ? '#fff' : '#000', mb: 2 }}>
                    {lessonDetails.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: theme.palette.background.default }}>
                    <Typography variant="subtitle2" sx={{ color: isDarkMode ? '#fff' : '#000' }}>Mô tả</Typography>
                    <Typography sx={{ color: isDarkMode ? '#fff' : '#000' }}>{lessonDetails.description}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: theme.palette.background.default }}>
                    <Typography variant="subtitle2" sx={{ color: isDarkMode ? '#fff' : '#000' }}>Loại bài học</Typography>
                    <Typography sx={{ color: isDarkMode ? '#fff' : '#000' }}>{lessonDetails.lessonType}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: theme.palette.background.default }}>
                    <Typography variant="subtitle2" sx={{ color: isDarkMode ? '#fff' : '#000' }}>Tổng số tiết</Typography>
                    <Typography sx={{ color: isDarkMode ? '#fff' : '#000' }}>{lessonDetails.totalPeriods}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: theme.palette.background.default }}>
                    <Typography variant="subtitle2" sx={{ color: isDarkMode ? '#fff' : '#000' }}>Chủ đề</Typography>
                    <Typography sx={{ color: isDarkMode ? '#fff' : '#000' }}>{lessonDetails.module}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: theme.palette.background.default }}>
                    <Typography variant="subtitle2" sx={{ color: isDarkMode ? '#fff' : '#000' }}>Ghi chú</Typography>
                    <Typography sx={{ color: isDarkMode ? '#fff' : '#000' }}>{lessonDetails.note}</Typography>
                  </Paper>
                </Grid>
              </Grid>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseLessonDetails} 
              sx={{ 
                color: isDarkMode ? '#fff' : '#000',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                }
              }}
            >
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default TeacherCurriculumm;
