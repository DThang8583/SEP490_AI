import React, { useState, useEffect, useMemo } from 'react';
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
  CircularProgress,
  Alert,
  Chip,
  TextField,
  InputAdornment,
  Container,
  Card,
  CardContent,
  Grid,
  Fade,
  Avatar,
  IconButton,
  Tooltip,
  Pagination,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  MenuBook as MenuBookIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  Subject as SubjectIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';
import Paging from '../../../Components/Common/Paging';
import { useTheme } from '@mui/material/styles';

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
  background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(8),
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
  color: '#2c3e50',
  marginBottom: theme.spacing(3),
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(253, 121, 168, 0.3)',
  animation: `${fadeIn} 0.6s ease-out`,
}));

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  background: '#ffffff',
  border: '1px solid rgba(116, 185, 255, 0.1)',
  animation: `${fadeIn} 0.8s ease-out`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(116, 185, 255, 0.15)',
    '& .stats-icon': {
      animation: `${float} 2s ease-in-out infinite`,
    },
  },
}));

const SearchCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(116, 185, 255, 0.15)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
  border: '2px solid rgba(116, 185, 255, 0.1)',
  animation: `${fadeIn} 1s ease-out`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(116, 185, 255, 0.2)',
    borderColor: 'rgba(116, 185, 255, 0.3)',
  },
}));

const LessonCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: '16px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(116, 185, 255, 0.15)',
    borderColor: '#74b9ff',
  },
  animation: `${fadeIn} 1s ease-out`,
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
        borderColor: '#74b9ff',
        boxShadow: '0 4px 20px rgba(116, 185, 255, 0.1)',
      },
      '&.Mui-focused': {
        borderColor: '#74b9ff',
        boxShadow: '0 0 0 3px rgba(116, 185, 255, 0.1)',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#74b9ff',
      fontWeight: 500,
      '&.Mui-focused': {
        color: '#74b9ff',
      },
    },
  },
}));

const StyledChip = styled(Chip)(({ chiptype }) => {
  const colors = {
    approved: {
      background: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)',
      color: '#ffffff',
    },
    rejected: {
      background: 'linear-gradient(135deg, #e17055 0%, #d63031 100%)',
      color: '#ffffff',
    },
    pending: {
      background: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
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

const TotalLessons = () => {
  const [lessonPlans, setLessonPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const theme = useTheme();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchLessonPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');

      // Fetch all lesson plans to get the total count of non-drafts
      const totalCountResponse = await axios.get(
        'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            Page: 1,
            PageSize: 999, // Fetch all to count non-drafts
            SearchTerm: searchTerm, // Apply search term to total count fetch as well
          },
        }
      );

      let nonDraftTotal = 0;
      let allItems = [];
      if (totalCountResponse.data?.code === 0 && totalCountResponse.data?.data?.items) {
        allItems = totalCountResponse.data.data.items;
        nonDraftTotal = allItems.filter(plan => plan.status !== 'Draft').length;
      }
      setTotalCount(nonDraftTotal);

      // Filter drafts from all items
      const nonDraftItems = allItems.filter(plan => plan.status !== 'Draft');

      // Calculate the number of pages based on non-draft items
      const calculatedTotalPages = Math.ceil(nonDraftTotal / itemsPerPage);
      setTotalPages(calculatedTotalPages);

      // Get the items for the current page
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedItems = nonDraftItems.slice(startIndex, endIndex);
      setLessonPlans(paginatedItems);

    } catch (err) {
      console.error('Error fetching lesson plans:', err);
      setError('Không thể tải danh sách giáo án. Vui lòng thử lại sau.');
      setLessonPlans([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonPlans();
  }, [page, itemsPerPage, searchTerm]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <StyledChip
            chiptype="approved"
            icon={<CheckCircleIcon sx={{ fontSize: '18px' }} />}
            label="✅ Đã duyệt"
            size="small"
          />
        );
      case 'Rejected':
        return (
          <StyledChip
            chiptype="rejected"
            icon={<CancelIcon sx={{ fontSize: '18px' }} />}
            label="❌ Từ chối"
            size="small"
          />
        );
      case 'Pending':
    return (
          <StyledChip
            chiptype="pending"
            icon={<PendingIcon sx={{ fontSize: '18px' }} />}
            label="⏳ Chờ duyệt"
        size="small"
      />
    );
      default:
        return null;
    }
  };

  // Search results info
  const searchResultsInfo = useMemo(() => {
    if (!searchTerm) return '';
    return `Tìm thấy ${totalCount} kết quả cho "${searchTerm}"`;
  }, [searchTerm, totalCount]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading && lessonPlans.length === 0) {
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
          <MenuBookIcon sx={{ fontSize: 60, color: '#ffffff', animation: `${pulse} 2s infinite` }} />
          <Typography variant="h6" color="#ffffff" fontWeight="600">
            Đang tải danh sách giáo án...
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
            <MenuBookIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                📖 Quản lý giáo án
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                Danh sách tất cả giáo án đã được tạo trong hệ thống
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
                  color: '#74b9ff',
                  bgcolor: 'rgba(116, 185, 255, 0.1)',
                  p: 2,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MenuBookIcon sx={{ fontSize: 40 }} />
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#74b9ff', mb: 1 }}>
                {totalCount}
              </Typography>
              <Typography variant="body1" color="text.secondary" fontWeight="600">
                📚 Tổng số giáo án
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
              background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
              color: '#ffffff',
            }}>
              <SearchIcon sx={{ fontSize: 24 }} />
              <Typography variant="h6" fontWeight="600">
                Tìm kiếm giáo án
      </Typography>
            </Box>
          </Box>

          <SearchContainer>
        <TextField
              className="search-field"
          fullWidth
              label="🔍 Nhập tên giáo viên, bài học, chủ đề..."
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Ví dụ: Nguyễn Thị Lan, Phép cộng, Toán học..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#74b9ff', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: searchInput && (
                  <InputAdornment position="end">
                    <Tooltip title="Xóa tìm kiếm">
                      <IconButton
                        onClick={handleClearSearch}
                        size="small"
                        sx={{
                          color: '#e17055',
                          '&:hover': {
                            backgroundColor: 'rgba(225, 112, 85, 0.1)',
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
                backgroundColor: 'rgba(116, 185, 255, 0.05)',
                border: '1px solid rgba(116, 185, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <FilterIcon sx={{ color: '#74b9ff', fontSize: 18 }} />
                <Typography variant="body2" color="#74b9ff" fontWeight="500">
                  {searchResultsInfo}
          </Typography>
      </Box>
            )}
          </SearchContainer>
        </CardContent>
      </SearchCard>

      {loading && <LinearProgress sx={{ mb: 2, height: 6, borderRadius: 3 }} />}

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      {/* Lessons List */}
      <Box>
        <Typography variant="h6" sx={{ mb: 3, color: '#ffffff', fontWeight: 600 }}>
          📋 Danh sách giáo án ({totalCount} giáo án)
        </Typography>
        
        <Grid container spacing={2}>
          {lessonPlans.map((plan, index) => (
            <Grid item xs={12} key={plan.lessonPlanId}>
              <Fade in={true} timeout={500 + index * 100}>
                <LessonCard>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
                          fontSize: '20px',
                          fontWeight: 'bold',
                        }}
                      >
                        {(page - 1) * itemsPerPage + index + 1}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                          📖 {plan.lesson}
                        </Typography>
                      </Box>
                      {getStatusChip(plan.status)}
                    </Box>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon sx={{ fontSize: 16, color: '#74b9ff' }} />
                          <Typography variant="body2" color="text.secondary">
                            <strong>Giáo viên:</strong> 👩‍🏫 {plan.fullname}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SubjectIcon sx={{ fontSize: 16, color: '#74b9ff' }} />
                          <Typography variant="body2" color="text.secondary">
                            <strong>Chủ đề:</strong> {plan.module}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ClassIcon sx={{ fontSize: 16, color: '#74b9ff' }} />
                          <Typography variant="body2" color="text.secondary">
                           🎓 Khối {plan.grade}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarIcon sx={{ fontSize: 16, color: '#74b9ff' }} />
                          <Typography variant="body2" color="text.secondary">
                            <strong>Ngày tạo:</strong> {(plan.createdAt)}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Rejection Reason */}
                    {plan.disapprovedReason && (
                      <Box sx={{ 
                        mt: 2, 
                        p: 2, 
                        borderRadius: '12px',
                        backgroundColor: 'rgba(225, 112, 85, 0.05)',
                        border: '1px solid rgba(225, 112, 85, 0.1)',
                      }}>
                        <Typography variant="body2" color="#e17055" fontWeight="500">
                          <strong>💬 Lý do từ chối:</strong> {plan.disapprovedReason}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </LessonCard>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {lessonPlans.length === 0 && !loading && (
          <Card sx={{ textAlign: 'center', py: 6, mt: 3 }}>
            <CardContent>
              <MenuBookIcon sx={{ fontSize: 80, color: '#74b9ff', opacity: 0.5, mb: 2 }} />
              <Typography variant="h5" color="#74b9ff" fontWeight="600" gutterBottom>
                {searchTerm ? 'Không tìm thấy giáo án nào' : 'Chưa có giáo án nào'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {searchTerm 
                  ? `Không có kết quả cho "${searchTerm}". Thử từ khóa khác?`
                  : 'Hệ thống chưa có giáo án nào. Vui lòng thêm giáo án mới.'
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
              backgroundColor: '#74b9ff',
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

export default TotalLessons; 