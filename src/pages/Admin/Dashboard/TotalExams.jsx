import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Pagination,
  TextField,
  InputAdornment,
  Container,
  Fade,
  Avatar,
  Badge,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Quiz as QuizIcon,
  Group as GroupIcon,
  Timer as TimerIcon,
  Assessment as AssessmentIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  Subject as SubjectIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';

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

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
`;

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(8),
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
  color: '#2c3e50',
  marginBottom: theme.spacing(3),
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(255, 154, 158, 0.3)',
  animation: `${fadeIn} 0.6s ease-out`,
}));

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  background: '#ffffff',
  border: '1px solid rgba(102, 126, 234, 0.1)',
  animation: `${fadeIn} 0.8s ease-out`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)',
    '& .stats-icon': {
      animation: `${float} 2s ease-in-out infinite`,
    },
  },
}));

const SearchCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
  border: '2px solid rgba(102, 126, 234, 0.1)',
  animation: `${fadeIn} 1s ease-out`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.2)',
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  '& .search-field': {
    '& .MuiOutlinedInput-root': {
      borderRadius: '16px',
      backgroundColor: '#ffffff',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: '#667eea',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)',
      },
      '&.Mui-focused': {
        borderColor: '#667eea',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#667eea',
      fontWeight: 500,
      '&.Mui-focused': {
        color: '#667eea',
      },
    },
  },
}));

const ExamCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: '16px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)',
    borderColor: '#667eea',
  },
  animation: `${fadeIn} 1s ease-out`,
}));

const StyledChip = styled(Chip)(({ chiptype }) => {
  const colors = {
    approved: {
      background: 'linear-gradient(135deg, #00d2d3 0%, #54a0ff 100%)',
      color: '#ffffff',
    },
    rejected: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      color: '#ffffff',
    },
    pending: {
      background: 'linear-gradient(135deg, #ffa726 0%, #ffcc02 100%)',
      color: '#ffffff',
    },
    easy: {
      background: 'linear-gradient(135deg, #00d2d3 0%, #54a0ff 100%)',
      color: '#ffffff',
    },
    medium: {
      background: 'linear-gradient(135deg, #ffa726 0%, #ffcc02 100%)',
      color: '#ffffff',
    },
    hard: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      color: '#ffffff',
    },
  };

  return {
    ...(colors[chiptype] || colors.pending),
    fontWeight: 600,
    padding: '4px 8px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    border: 'none',
  };
});

const TotalExams = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/quizzes`,
        {
          params: {
            Page: page,
            PageSize: pageSize,
            searchTerm: searchTerm,
          }
        }
      );
      
      if (response.data.code === 0) {
        setExams(response.data.data.items);
        setTotalPages(response.data.data.totalPages);
        setTotalRecords(response.data.data.totalRecords);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [page, pageSize, searchTerm]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
  };

  const getDifficultyChip = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return (
          <StyledChip
            chiptype="easy"
            label="😊 Dễ"
            size="small"
          />
        );
      case 'hard':
        return (
          <StyledChip
            chiptype="hard"
            label="😰 Khó"
            size="small"
          />
        );
      default:
        return (
          <StyledChip
            chiptype="medium"
            label="🤔 Trung bình"
            size="small"
          />
        );
    }
  };

  // Search results info
  const searchResultsInfo = useMemo(() => {
    if (!searchTerm) return '';
    return `Tìm thấy ${totalRecords} kết quả cho "${searchTerm}"`;
  }, [searchTerm, totalRecords]);

  if (loading && exams.length === 0) {
    return (
      <StyledContainer maxWidth="xl">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 3,
        }}>
          <QuizIcon sx={{ fontSize: 60, color: '#ffffff', animation: `${pulse} 2s infinite` }} />
          <Typography variant="h6" color="#ffffff" fontWeight="600">
            Đang tải danh sách bài tập đã tạo...
          </Typography>
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="xl">
      {/* Header Section */}
      <HeaderCard>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <QuizIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                📚 Quản lý bài tập đã tạo
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                Danh sách tất cả bài tập đã tạo trong hệ thống
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </HeaderCard>

      {/* Stats Section */}
      <Grid container spacing={2} sx={{ mb: 3, justifyContent: 'center' }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mb: 2
              }}>
                <Box className="stats-icon" sx={{ 
                  color: '#667eea',
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  p: 2,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <QuizIcon sx={{ fontSize: 40 }} />
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#667eea', mb: 1 }}>
                {totalRecords}
              </Typography>
              <Typography variant="body1" color="text.secondary" fontWeight="600">
                📝 Tổng số bài tập đã tạo
              </Typography>
            </CardContent>
          </StatsCard>
        </Grid>
      </Grid>

      {/* Enhanced Search Section */}
      <SearchCard>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              p: 2,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
            }}>
              <SearchIcon sx={{ fontSize: 24 }} />
              <Typography variant="h6" fontWeight="600">
                Tìm kiếm bài tập đã tạo
              </Typography>
            </Box>
          </Box>
          
          <SearchContainer>
            <TextField
              className="search-field"
              fullWidth
              label="🔍 Nhập tên bài tập đã tạo, bài học, hoặc tên giáo viên..."
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Ví dụ: Phép cộng, Toán học khối 1..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#667eea', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: searchInput && (
                  <InputAdornment position="end">
                    <Tooltip title="Xóa tìm kiếm">
                      <IconButton
                        onClick={handleClearSearch}
                        size="small"
                        sx={{
                          color: '#ff6b6b',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 107, 107, 0.1)',
                          },
                        }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            
            {/* Search Results Info */}
            {searchResultsInfo && (
              <Box sx={{ 
                mt: 2, 
                p: 2, 
                borderRadius: '12px',
                backgroundColor: 'rgba(102, 126, 234, 0.05)',
                border: '1px solid rgba(102, 126, 234, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <FilterIcon sx={{ color: '#667eea', fontSize: 18 }} />
                <Typography variant="body2" color="#667eea" fontWeight="500">
                  {searchResultsInfo}
                </Typography>
              </Box>
            )}
          </SearchContainer>
        </CardContent>
      </SearchCard>

      {loading && <LinearProgress sx={{ mb: 2, height: 6, borderRadius: 3 }} />}

      {/* Exams List */}
      <Box>
        <Typography variant="h6" sx={{ mb: 3, color: '#ffffff', fontWeight: 600 }}>
          📋 Danh sách bài tập đã tạo ({totalRecords} bài tập đã tạo)
        </Typography>
        
        <Grid container spacing={2}>
          {exams.map((exam, index) => (
            <Grid item xs={12} key={exam.quizId}>
              <Fade in={true} timeout={500 + index * 100}>
                <ExamCard>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          fontSize: '20px',
                          fontWeight: 'bold',
                        }}
                      >
                        {exam.quizId}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                          📝 {exam.quizName}
                        </Typography>
                      </Box>
                    </Box>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SubjectIcon sx={{ fontSize: 16, color: '#667eea' }} />
                          <Typography variant="body2" color="text.secondary">
                            <strong>Bài học:</strong> {exam.lessonName}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ClassIcon sx={{ fontSize: 16, color: '#667eea' }} />
                          <Typography variant="body2" color="text.secondary">
                            <strong>Khối:</strong> 🎓 Khối {exam.grade}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SchoolIcon sx={{ fontSize: 16, color: '#667eea' }} />
                          <Typography variant="body2" color="text.secondary">
                            <strong>Chủ đề:</strong> {exam.moduleName}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon sx={{ fontSize: 16, color: '#667eea' }} />
                          <Typography variant="body2" color="text.secondary">
                            <strong>Giáo viên:</strong> 👩‍🏫 {exam.name}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </ExamCard>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {exams.length === 0 && !loading && (
          <Card sx={{ textAlign: 'center', py: 6, mt: 3 }}>
            <CardContent>
              <QuizIcon sx={{ fontSize: 80, color: '#667eea', opacity: 0.5, mb: 2 }} />
              <Typography variant="h5" color="#667eea" fontWeight="600" gutterBottom>
                {searchTerm ? 'Không tìm thấy bài tập đã tạo nào' : 'Chưa có bài tập đã tạo nào'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {searchTerm 
                  ? `Không có kết quả cho "${searchTerm}". Thử từ khóa khác?`
                  : 'Hệ thống chưa có bài tập đã tạo nào. Vui lòng thêm bài tập đã tạo mới.'
                }
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ 
          mt: 4, 
          display: 'flex', 
          justifyContent: 'center',
          '& .MuiPagination-root': {
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          },
          '& .MuiPaginationItem-root': {
            fontWeight: 600,
            '&.Mui-selected': {
              backgroundColor: '#667eea',
              color: '#ffffff',
            },
          },
        }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </StyledContainer>
  );
};

export default TotalExams; 