import React, { useState, useEffect } from 'react';
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
  Button
} from '@mui/material';
import {
  Quiz as QuizIcon,
  School as SchoolIcon,
  Timer as TimerIcon,
  Assignment as AssignmentIcon,
  Search as SearchIcon,
  AddCircleOutline as AddCircleOutlineIcon
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
import CreateExerciseModal from '../CreateExerciseModal';

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

  // Handlers for modal
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Lấy danh sách bài quiz
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/quizzes`, {
          params: {
            Page: page,
            PageSize: pageSize,
            SearchTerm: searchTerm
          }
        });
        console.log("API Quizzes response:", response.data);
        
        if (response.data && response.data.code === 0 && response.data.data) {
          setQuizzes(response.data.data.items || []);
          setTotalPages(response.data.data.totalPages || 1);
          setTotalRecords(response.data.data.totalRecords || 0);
          console.log("Danh sách bài quiz:", response.data.data.items);
        } else {
          setError('Không thể tải danh sách bài quiz');
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách bài quiz:', err);
        setError('Lỗi khi tải danh sách bài quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [page, pageSize, searchTerm]);

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
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 4,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Danh sách bài bài tập đã tạo
        </Typography>

        {/* Search and Filter Section */}
        <Box sx={{ mb: 4, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Tìm kiếm bài kiểm tra"
            variant="outlined"
            size="small"
            fullWidth={isMobile}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Button 
            variant="contained" 
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            sx={{ 
              background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF8E53, #FF6B6B)',
              }
            }}
          >
            Tìm kiếm
          </Button>
          <TextField
            select
            label="Số bài/trang"
            value={pageSize}
            onChange={handlePageSizeChange}
            size="small"
            SelectProps={{
              native: true,
            }}
            sx={{ minWidth: 120 }}
          >
            <option value={5}>5 bài/trang</option>
            <option value={10}>10 bài/trang</option>
            <option value={20}>20 bài/trang</option>
            <option value={50}>50 bài/trang</option>
          </TextField>
          <Button 
            variant="contained" 
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleOpenModal}
            sx={{ 
              background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #21CBF3, #2196F3)',
              }
            }}
          >
            Tạo bài tập AI
          </Button>
        </Box>

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
                            <Typography variant="body2" color="text.secondary">
                              {JSON.parse(localStorage.getItem('userInfo'))?.fullName || 'Unknown User'}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AssignmentIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                             {quiz.lessonName}
                            </Typography>
                          </Box>
                        </Stack>
                        
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                          <Chip 
                            label="Xem chi tiết" 
                            color="primary" 
                            size="small"
                            sx={{ 
                              backgroundColor: 'rgba(255, 107, 107, 0.1)',
                              color: '#FF6B6B',
                              fontWeight: 600,
                              '&:hover': {
                                backgroundColor: 'rgba(255, 107, 107, 0.2)',
                              }
                            }}
                          />
                        </Box>
                      </CardContent>
                    </CardActionArea>
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
                    backgroundColor: 'rgba(255, 107, 107, 0.2) !important',
                    color: '#FF6B6B !important',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 107, 0.3) !important',
                    }
                  }
                }}
              />
            </Box>
          </>
        )}
      </Container>

      {/* Render the modal component */}
      <CreateExerciseModal 
        open={isModalOpen}
        handleClose={handleCloseModal}
      />
    </Box>
  );
};

export default ExamList;