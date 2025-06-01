import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  Pagination,
  TextField,
  Button,
  IconButton,
  Paper,
  Avatar,
  InputAdornment,
} from '@mui/material';
import {
  Quiz as QuizIcon,
  School as SchoolIcon,
  Timer as TimerIcon,
  Assignment as AssignmentIcon,
  Search as SearchIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  DeleteOutline as DeleteOutlineIcon,
  Psychology as PsychologyIcon,
  EmojiEvents as EmojiEventsIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
import { styled, keyframes } from '@mui/material/styles';
import CreateExerciseModal from '../../Components/CreateExerciseModal';

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

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.4);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 0 8px rgba(255, 107, 107, 0);
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

const glow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 5px rgba(255, 107, 107, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 15px rgba(255, 107, 107, 0.6));
  }
`;

// Styled Components
const MainContainer = styled(Box)(({ theme, isDarkMode }) => ({
  minHeight: 'calc(100vh - 64px)',
  background: isDarkMode
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
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
      ? 'radial-gradient(circle at 20% 80%, rgba(255, 107, 107, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(156, 39, 176, 0.1) 0%, transparent 50%)'
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
    background: 'linear-gradient(90deg, transparent, rgba(255, 107, 107, 0.1), transparent)',
    animation: `${shimmer} 3s ease-in-out infinite`,
  },
}));

const FloatingIcon = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
  marginBottom: '16px',
  animation: `${float} 3s ease-in-out infinite`,
  boxShadow: '0 12px 30px rgba(255, 107, 107, 0.4)',
  border: '4px solid rgba(255, 255, 255, 0.2)',
  '& .MuiSvgIcon-root': {
    fontSize: '2.5rem',
    color: '#fff',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
  },
}));

const GradientTitle = styled(Typography)(({ theme, isDarkMode }) => ({
  fontFamily: 'sans-serif',
  fontWeight: 800,
  fontSize: '2.5rem',
  background: isDarkMode
    ? 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)'
    : 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
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
  fontFamily: 'sans-serif',
  fontSize: '1.25rem',
  fontWeight: 500,
  color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 107, 107, 0.8)',
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
    : '1px solid rgba(255, 107, 107, 0.2)',
  boxShadow: isDarkMode
    ? '0 15px 35px rgba(0, 0, 0, 0.2)'
    : '0 15px 35px rgba(0, 0, 0, 0.08)',
  animation: `${slideInUp} 0.8s ease-out`,
}));

const StyledTextField = styled(TextField)(({ theme, isDarkMode }) => ({
  '& .MuiInputLabel-root': {
    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 107, 107, 0.8)',
    fontWeight: 600,
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
        : 'rgba(255, 107, 107, 0.2)',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: isDarkMode
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(255, 107, 107, 0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FF6B6B',
      boxShadow: '0 0 0 3px rgba(255, 107, 107, 0.1)',
    },
    '& .MuiInputBase-input': {
      color: isDarkMode ? '#fff' : '#2C3E50',
      fontWeight: 600,
    },
  },
}));

const ActionButton = styled(Button)(({ theme, variant = 'primary' }) => ({
  background: variant === 'primary' 
    ? 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)'
    : 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
  color: '#fff',
  borderRadius: '12px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '0.95rem',
  boxShadow: variant === 'primary' 
    ? '0 6px 20px rgba(255, 107, 107, 0.3)'
    : '0 6px 20px rgba(33, 150, 243, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: variant === 'primary' 
      ? 'linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%)'
      : 'linear-gradient(135deg, #21CBF3 0%, #2196F3 100%)',
    transform: 'translateY(-2px)',
    boxShadow: variant === 'primary' 
      ? '0 8px 25px rgba(255, 107, 107, 0.4)'
      : '0 8px 25px rgba(33, 150, 243, 0.4)',
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
}));

const ExamList = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useCustomTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for delete loading (optional, for individual item loading)
  const [deletingId, setDeletingId] = useState(null);

  // Handlers for modal
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Lấy danh sách bài quiz
  // Wrap fetchQuizzes in useCallback
  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);

      // Get user info from localStorage and extract gradeId
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      let userGradeId = null;
      if (userInfo && userInfo.grade) {
        const gradeMatch = userInfo.grade.match(/\d+/);
        userGradeId = gradeMatch ? parseInt(gradeMatch[0], 10) : null;
        console.log('User Grade ID from localStorage:', userGradeId);
      }

      if (userGradeId === null) {
          console.warn('User grade information not found in localStorage. Cannot filter quizzes by grade.');
          // Optionally, set an error or display a message to the user
          // setError('Không thể lấy thông tin khối lớp của người dùng.');
          // return; // Exit the function if gradeId is required
      }

      const response = await axios.get(`https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/quizzes`, {
        params: {
          Page: page,
          PageSize: pageSize,
          SearchTerm: searchTerm,
          ...(userGradeId !== null && { GradeId: userGradeId }) // Add GradeId parameter if available
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Include auth token
        }
      });
      console.log("API Quizzes response:", response.data);
      
      if (response.data && response.data.code === 0 && response.data.data) {
        const fetchedQuizzes = response.data.data.items || [];

        // Client-side filtering based on userFullName
        const userFullName = JSON.parse(localStorage.getItem('userInfo'))?.fullName || '';
        const filteredQuizzes = userFullName
          ? fetchedQuizzes.filter(quiz => quiz.name && quiz.name.includes(userFullName))
          : []; // If userFullName is empty, show no quizzes

        setQuizzes(filteredQuizzes); // Update state with filtered quizzes
        // Note: totalPages, totalRecords might not be accurate after client-side filtering
        // You might need to adjust pagination logic or rely solely on the filtered list length
        setTotalPages(response.data.data.totalPages || 1); // Keep original pagination data for now
        setTotalRecords(response.data.data.totalRecords || 0);
        console.log("Filtered quizzes:", filteredQuizzes);
      } else {
        setError(response.data.message || 'Không thể tải danh sách bài quiz');
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách bài quiz:', err);
      setError(err.message || 'Lỗi khi tải danh sách bài quiz');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchTerm]); // Dependencies for useCallback

  // Add handleDeleteQuiz function
  const handleDeleteQuiz = async (quizId, quizName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài tập "${quizName}" không?`)) {
      setDeletingId(quizId);
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError("Authentication token not found. Please log in.");
          setDeletingId(null);
          return;
        }

        const response = await axios.delete(
          `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/quizzes/${quizId}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        console.log(response.data.code)
        if (response.data.code === 0 || response.data.code === 31) {
          alert(`Đã xóa bài tập "${quizName}" thành công.`);
          // Refresh the list after successful deletion
          fetchQuizzes();
        } else {
          setError(response.data.message || `Lỗi khi xóa bài tập "${quizName}".`);
        }
      } catch (err) {
        console.error('Error deleting quiz:', err);
        setError(err.message || `Lỗi khi xóa bài tập "${quizName}".`);
      } finally {
        setDeletingId(null);
      }
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]); // Depend on fetchQuizzes (useCallback)

  const handleQuizClick = (quizId) => {
    navigate(`/bai-tap/${quizId}`);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(1); // Reset về trang 1 khi thay đổi pageSize
  };

  const handleSearch = () => {
    setPage(1); // Reset về trang 1 khi tìm kiếm
    // The search will be triggered automatically by the useEffect due to searchTerm change
  };

  // Get user's full name from localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const userFullName = userInfo?.fullName || '';
  console.log('User Full Name from localStorage:', userFullName);

  return (
    <MainContainer isDarkMode={isDarkMode}>
      <StyledContainer maxWidth="lg">
        <HeaderCard elevation={0} isDarkMode={isDarkMode}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FloatingIcon>
              <EmojiEventsIcon />
            </FloatingIcon>
            <GradientTitle isDarkMode={isDarkMode}>
              Bài Tập Đã Tạo
            </GradientTitle>
            <SubTitle isDarkMode={isDarkMode}>
              Quản lý và xem lại các bài tập bạn đã tạo bằng AI
            </SubTitle>
          </Box>
        </HeaderCard>

        {/* Search and Filter Section */}
        <ControlsCard elevation={0} isDarkMode={isDarkMode}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <StyledTextField
                label="Tìm kiếm bài kiểm tra"
                variant="outlined"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                isDarkMode={isDarkMode}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 107, 107, 0.5)' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <ActionButton 
                variant="primary"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                fullWidth={isMobile}
              >
                Tìm kiếm
              </ActionButton>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledTextField
                select
                label="Số bài/trang"
                value={pageSize}
                onChange={handlePageSizeChange}
                size="small"
                fullWidth
                isDarkMode={isDarkMode}
                SelectProps={{
                  native: true,
                }}
              >
                <option value={5}>5 bài/trang</option>
                <option value={10}>10 bài/trang</option>
                <option value={20}>20 bài/trang</option>
                <option value={50}>50 bài/trang</option>
              </StyledTextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ActionButton 
                variant="secondary"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleOpenModal}
                fullWidth={isMobile}
              >
                Tạo bài tập AI
              </ActionButton>
            </Grid>
          </Grid>
        </ControlsCard>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : quizzes.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            Không có bài kiểm tra nào
          </Alert>
        ) : (
          <>
            <Grid container spacing={3}>
              {quizzes.map((quiz) => (
                <Grid item xs={12} sm={6} md={4} key={quiz.quizId}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '16px',
                      backgroundColor: isDarkMode ? 'rgba(40, 40, 40, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(12px)',
                      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                      boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(0,0,0,0.05)',
                      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: isDarkMode ? '0 12px 40px rgba(0,0,0,0.3)' : '0 12px 40px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    {/* CardActionArea wraps the clickable part */}
                    <CardActionArea onClick={() => handleQuizClick(quiz.quizId)}>
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                          <QuizIcon color="primary" />
                          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                            {quiz.quizName}
                          </Typography>
                        </Stack>
                        
                        <Divider sx={{ mb: 2 }} />
                        
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SchoolIcon fontSize="small" color="action" />
                            {/* Use optional chaining for safety */}
                            <Typography variant="body2" color="text.secondary">
                              {userFullName && quiz.name.includes(userFullName) ? quiz.name : ''}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AssignmentIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                             {quiz.lessonName}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </CardActionArea>

                    {/* Action bar at the bottom of the card */}
                    <Box sx={{ 
                        px: 3, // padding horizontal
                        pb: 2, // padding bottom
                        display: 'flex', 
                        justifyContent: 'space-between', // Align items to start and end
                        alignItems: 'center', // Vertically center items
                        mt: -1 // Negative margin to pull it closer to the content above if needed
                    }}>
                        {/* Chip for View Details */}
                        <Chip 
                            label="Xem chi tiết" 
                            color="primary" 
                            size="small"
                            sx={{ 
                              backgroundColor: 'rgba(255, 107, 107, 0.1)',
                              color: '#FF6B6B', // Primary color or a distinct color
                              fontWeight: 600,
                              cursor: 'pointer', // Indicate it's clickable
                              '&:hover': {
                                backgroundColor: 'rgba(255, 107, 107, 0.2)',
                              }
                            }}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card click from triggering
                                handleQuizClick(quiz.quizId);
                            }}
                        />

                        {/* Delete Button */}
                        <IconButton 
                            aria-label="delete quiz" 
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card click from triggering
                                handleDeleteQuiz(quiz.quizId, quiz.quizName);
                            }}
                            disabled={deletingId === quiz.quizId || loading} // Disable while deleting or main loading
                            sx={{
                                color: theme.palette.error.main, // Use error color for delete
                                '&:hover': {
                                    backgroundColor: isDarkMode ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 0, 0, 0.05)',
                                },
                                '&.Mui-disabled': {
                                   color: theme.palette.action.disabled, // Style for disabled state
                                }
                            }}
                        >
                            {deletingId === quiz.quizId ? <CircularProgress size={20} color="inherit" /> : <DeleteOutlineIcon />}
                        </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary"
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  },
                  '& .Mui-selected': {
                    backgroundColor: 'rgba(255, 107, 107, 0.2) !important', // Use rgba for transparency
                    color: '#FF6B6B !important', // Use hex code for precise color
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 107, 0.3) !important', // Darker on hover
                    }
                  }
                }}
              />
            </Box>
          </>
        )}
      </StyledContainer>

      {/* Render the modal component */}
      <CreateExerciseModal 
        open={isModalOpen}
        handleClose={handleCloseModal}
        // Add a prop to trigger list refresh after creating a quiz
        onQuizCreated={fetchQuizzes}
      />
    </MainContainer>
  );
};

export default ExamList;