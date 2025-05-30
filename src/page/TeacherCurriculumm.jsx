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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TeacherCurriculumm = () => {
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
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate(); // Get the navigate function

  // Function to convert grade text to number
  const convertGradeToNumber = (gradeText) => {
    if (!gradeText) return null;
    const match = gradeText.match(/Lớp\s*(\d+)/);
    return match ? parseInt(match[1]) : null;
  };

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
    if (sortColumn === column) {
      // Cycle through sort directions: asc -> desc -> no sort
      setSortDir(prevDir => {
        if (prevDir === null) return 0;
        if (prevDir === 0) return 1;
        return null; // Reset to no sort
      });
    } else {
      // New column, default to ascending sort
      setSortColumn(column);
      setSortDir(0);
    }
  };

  // Function for viewing requirements
  const handleViewRequirements = () => {
    const grade = localStorage.getItem('Grade');
    // Navigate to the TeacherRequirements page, passing the grade if necessary
    navigate('/yeu-cau-can-dat', { state: { grade } });
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true); // Set loading to true when fetching modules
        const gradeText = localStorage.getItem('Grade');
        if (!gradeText) {
          setError('Grade not found in localStorage');
          setLoading(false);
          return;
        }

        const gradeNumber = convertGradeToNumber(gradeText);
        if (!gradeNumber) {
          setError('Invalid grade format');
          setLoading(false);
          return;
        }

        const params = {
          PageNumber: 1,
          PageSize: 999,
        };

        if (sortColumn) {
          params.SortColumn = sortColumn;
          // API expects 0 for ascending, 1 for descending
          if (sortDir !== null) {
              params.SortDir = sortDir;
          }
           // If sortDir is null, don't send SortDir parameter, rely on API default or leave unsorted
        }

        const response = await axios.get(
          'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules',
          { params }
        );

        if (response.data.code === 0) {
          const filteredModules = response.data.data.items.filter(
            module => module.gradeNumber === gradeNumber
          );
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
  }, [sortColumn, sortDir]); // Depend on sortColumn and sortDir

  useEffect(() => {
    const filtered = modules.filter(module => module.semester === parseInt(semester));
    setFilteredModules(filtered);
  }, [semester, modules]);

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
              color: theme.palette.primary.main,
              fontFamily: 'Times New Roman, serif',
              textShadow: isDarkMode ? 'none' : '1px 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            Sách Giáo Khoa Toán {localStorage.getItem('Grade')}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{
              fontFamily: 'Times New Roman, serif',
              color: theme.palette.text.secondary,
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
              <SchoolIcon sx={{ color: theme.palette.primary.main }} />
              <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
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
              <MenuBookIcon sx={{ color: theme.palette.primary.main }} />
              <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                Chương trình: {commonInfo.curriculum} {commonInfo.gradeNumber}
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
              <BookIcon sx={{ color: theme.palette.primary.main }} />
              <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                Sách: {commonInfo.book}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Container for Semester Toggle and Requirements Button */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between', // Space out items horizontally
            alignItems: 'center', // Vertically align items
            flexWrap: 'wrap', // Allow wrapping on smaller screens
            gap: 2, // Add some space between items
          }}>
            <ToggleButtonGroup
              value={semester}
              exclusive
              onChange={handleSemesterChange}
              aria-label="semester selection"
              sx={{
                '& .MuiToggleButton-root': {
                  color: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                  px: 4,
                  py: 1,
                  fontWeight: 500,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
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
                bgcolor: theme.palette.primary.main,
                '&:hover': { bgcolor: theme.palette.primary.dark },
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
              <TableRow sx={{ bgcolor: theme.palette.primary.main }}>
                <TableCell sx={{ width: '50px' }} />
                <TableCell 
                  sx={{
                    color: theme.palette.primary.contrastText,
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
                        color: theme.palette.primary.contrastText + ' !important',
                      },
                    }}
                  >
                    Chủ đề
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold', fontSize: '1rem' }}>Mô tả</TableCell>
                <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold', fontSize: '1rem' }}>Tổng số tiết</TableCell>
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
                      <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
                        {expandedRows[module.moduleId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                      Chủ đề {module.moduleId}: {module.name}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{module.desciption}</TableCell>
                    <TableCell sx={{ fontWeight: 500, color: theme.palette.text.primary }}>{module.totalPeriods}</TableCell>
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
                          display: 'flex', // Use flexbox for layout
                          flexDirection: 'column', // Stack children vertically
                          alignItems: 'flex-start', // Align items to the start (left)
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
                                color: theme.palette.primary.main,
                              }}>
                                Danh sách bài học:
                              </Typography>
                              <Table size="small" sx={{ mb: 2 }}>
                                <TableBody>
                                  {lessons[module.moduleId].map((lesson) => (
                                    <TableRow key={lesson.lessonId}>
                                      <TableCell sx={{ fontWeight: 500, color: theme.palette.text.primary, borderBottom: 'none' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <SubjectIcon sx={{ color: theme.palette.primary.main }} />
                                          {lesson.name}
                                        </Box>
                                      </TableCell>
                                      <TableCell sx={{ color: theme.palette.text.primary, borderBottom: 'none' }}>
                                        Tổng số tiết: <Box component="span" sx={{ color: '#ff5252', fontWeight: 'normal' }}>{lesson.totalPeriods}</Box>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          ) : (
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
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
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              Không tìm thấy chủ đề nào cho học kỳ {semester}.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default TeacherCurriculumm;
