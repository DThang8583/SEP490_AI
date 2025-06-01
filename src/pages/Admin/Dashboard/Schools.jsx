import React, { useState, useEffect } from 'react';
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
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Divider,
  Avatar,
  Tooltip,
  Grid,
  Badge,
} from '@mui/material';
import {
  useTheme
} from '@mui/material/styles';
import {
  School as SchoolIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Place as PlaceIcon,
  Domain as DomainIcon,
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

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
`;

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

// Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1e1e2e 0%, #2d2d3d 50%, #1e1e2e 100%)'
    : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #e3f2fd 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)'
      : 'radial-gradient(circle at 20% 80%, rgba(33, 150, 243, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(30, 136, 229, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(30, 136, 229, 0.08) 100%)',
  backdropFilter: 'blur(15px)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(33, 150, 243, 0.2)'
    : '1px solid rgba(33, 150, 243, 0.3)',
  borderRadius: '24px',
  padding: theme.spacing(4),
  margin: theme.spacing(3),
  marginBottom: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(33, 150, 243, 0.1)',
  animation: `${fadeIn} 0.6s ease-out`,
}));

const StatsCard = styled(Card)(({ theme, color }) => ({
  borderRadius: '20px',
  background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
  border: `1px solid ${color}25`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(10px)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${color}20, transparent)`,
    transition: 'left 0.6s ease',
  },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 15px 30px ${color}30`,
    '&::before': {
      left: '100%',
    },
  },
  animation: `${fadeIn} 0.8s ease-out`,
}));

const SchoolCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(42, 42, 55, 0.8) 0%, rgba(42, 42, 55, 0.4) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)',
  backdropFilter: 'blur(15px)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 255, 255, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(33, 150, 243, 0.2)',
  },
  animation: `${slideIn} 0.6s ease-out`,
}));

const ModernTable = styled(TableContainer)(({ theme }) => ({
  borderRadius: '20px',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(42, 42, 55, 0.8) 0%, rgba(42, 42, 55, 0.4) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)',
  backdropFilter: 'blur(15px)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 255, 255, 0.3)',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  animation: `${fadeIn} 1s ease-out`,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 150, 243, 0.1) 100%)'
    : 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
  '& .MuiTableCell-head': {
    fontWeight: 700,
    fontSize: '0.95rem',
    color: theme.palette.mode === 'dark' ? '#fff' : '#1976d2',
    borderBottom: `2px solid ${theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.3)' : 'rgba(33, 150, 243, 0.2)'}`,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(33, 150, 243, 0.1)'
      : 'rgba(33, 150, 243, 0.05)',
    transform: 'scale(1.01)',
  },
  '&:nth-of-type(even)': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.02)'
      : 'rgba(33, 150, 243, 0.02)',
  },
}));

const ActionButton = styled(IconButton)(({ theme, variant = 'default' }) => ({
  borderRadius: '12px',
  padding: '8px',
  transition: 'all 0.3s ease',
  background: variant === 'delete' 
    ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
  border: variant === 'delete'
    ? '1px solid rgba(244, 67, 54, 0.3)'
    : '1px solid rgba(33, 150, 243, 0.3)',
  '&:hover': {
    transform: 'scale(1.1)',
    background: variant === 'delete'
      ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(244, 67, 54, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 150, 243, 0.1) 100%)',
    boxShadow: variant === 'delete'
      ? '0 8px 25px rgba(244, 67, 54, 0.3)'
      : '0 8px 25px rgba(33, 150, 243, 0.3)',
  },
}));

const RefreshButton = styled(IconButton)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
  color: '#fff',
  padding: '12px',
  borderRadius: '16px',
  '&:hover': {
    background: 'linear-gradient(135deg, #21CBF3 0%, #2196F3 100%)',
    transform: 'scale(1.1)',
  },
  animation: `${pulse} 2s ease-in-out infinite`,
}));

const AddButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
  color: '#fff',
  borderRadius: '16px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #45a049 0%, #4CAF50 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(76, 175, 80, 0.4)',
  },
  animation: `${float} 3s ease-in-out infinite`,
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(33, 150, 243, 0.2)',
    '&:hover': {
      border: theme.palette.mode === 'dark'
        ? '1px solid rgba(255, 255, 255, 0.2)'
        : '1px solid rgba(33, 150, 243, 0.4)',
    },
    '&.Mui-focused': {
      border: `2px solid ${theme.palette.primary.main}`,
      boxShadow: `0 0 20px ${theme.palette.primary.main}40`,
    },
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8),
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(42, 42, 55, 0.6) 0%, rgba(42, 42, 55, 0.2) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
  borderRadius: '20px',
  backdropFilter: 'blur(10px)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(33, 150, 243, 0.2)',
  animation: `${fadeIn} 1s ease-out`,
}));

const Schools = () => {
  const theme = useTheme();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteSchool = async (schoolId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const url = `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/schools/${schoolId}`;
      
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('Delete API Response:', response.data);
      
      if (response.data.code === 0) {
        fetchSchools();
        setError('');
      } else {
        setError(response.data.message || 'Failed to delete school');
      }
    } catch (error) {
      console.error('Error deleting school:', error);
      setError('Không thể xóa trường');
    }
  };

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const url = `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/schools?Page=${currentPage}&PageSize=${pageSize}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('API Response:', response.data);
      
      if (response.data.code === 0) {
        setSchools(response.data.data.items);
        setTotalRecords(response.data.data.totalRecords);
        setError('');
      } else {
        setError('Failed to fetch schools data');
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
      setError('Không thể tải danh sách trường');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [currentPage, pageSize]);

  return (
    <PageContainer>
      {/* Header Section */}
      <HeaderSection>
        <Box sx={{ 
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 3,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar sx={{
              width: 70,
              height: 70,
              background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
              fontSize: '2rem',
              animation: `${float} 3s ease-in-out infinite`,
              boxShadow: '0 8px 25px rgba(33, 150, 243, 0.4)',
            }}>
              <SchoolIcon sx={{ fontSize: '2rem' }} />
            </Avatar>
            <Box>
              <Typography variant="h3" sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}>
                Trường học
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'text.secondary',
                fontWeight: 500,
              }}>
                Hệ thống quản lý thông tin trường học
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Làm mới dữ liệu">
              <RefreshButton 
                onClick={fetchSchools}
                disabled={loading}
              >
                <RefreshIcon />
              </RefreshButton>
            </Tooltip>
            {totalRecords === 0 && (
              <AddButton startIcon={<AddIcon />}>
                Thêm trường mới
              </AddButton>
            )}
          </Box>
        </Box>
      </HeaderSection>

      {/* Main Content */}
      <Box sx={{ 
        maxWidth: '1400px',
        margin: '0 auto',
        px: 3,
      }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              '& .MuiAlert-icon': {
                fontSize: '1.5rem',
              },
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {error}
            </Typography>
          </Alert>
        )}

        {/* Table Section */}
        {loading ? (
          <EmptyState>
            <CircularProgress size={60} sx={{ mb: 2, color: '#2196F3' }} />
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Đang tải dữ liệu...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Vui lòng chờ trong giây lát
            </Typography>
          </EmptyState>
        ) : schools.length === 0 ? (
          <EmptyState>
            <Avatar sx={{
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)',
              fontSize: '2.5rem',
              mb: 3,
              mx: 'auto',
            }}>
              <SchoolIcon sx={{ fontSize: '2.5rem' }} />
            </Avatar>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
              Chưa có trường học nào
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Hệ thống chưa có dữ liệu trường học. Hãy thêm trường học đầu tiên!
            </Typography>
            <AddButton startIcon={<AddIcon />}>
              Thêm trường học đầu tiên
            </AddButton>
          </EmptyState>
        ) : (
          <ModernTable>
            <Table>
              <StyledTableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên trường</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                  <TableCell>Phường/Xã</TableCell>
                  <TableCell>Quận/Huyện</TableCell>
                  <TableCell>Thành phố</TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {schools.map((school, index) => (
                  <StyledTableRow 
                    key={school.schoolId}
                    sx={{
                      animation: `${slideIn} ${0.6 + index * 0.1}s ease-out`,
                    }}
                  >
                    <TableCell>
                      <Chip 
                        label={school.schoolId}
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{
                          width: 40,
                          height: 40,
                          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                          fontSize: '1rem',
                        }}>
                          <SchoolIcon />
                        </Avatar>
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 600,
                          color: 'text.primary',
                        }}>
                          {school.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{
                        color: 'text.secondary',
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {school.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon sx={{ fontSize: 16, color: '#FF5722' }} />
                        <Typography variant="body2" color="text.primary">
                          {school.address}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={school.ward}
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(156, 39, 176, 0.05) 100%)',
                          color: '#9C27B0',
                          border: '1px solid rgba(156, 39, 176, 0.3)',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={school.district}
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)',
                          color: '#FF9800',
                          border: '1px solid rgba(255, 152, 0, 0.3)',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={school.city}
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
                          color: '#4CAF50',
                          border: '1px solid rgba(76, 175, 80, 0.3)',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </ModernTable>
        )}
      </Box>
    </PageContainer>
  );
};

export default Schools; 