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
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  Card,
  CardContent,
  Fade,
  Zoom,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Snackbar,
  Tooltip,
} from '@mui/material';
import { 
  Cancel, 
  InboxOutlined,
  Search as SearchIcon,
  MenuBook as MenuBookIcon,
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
  Dangerous as RejectedIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { styled, keyframes } from '@mui/material/styles';

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
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 0 8px rgba(244, 67, 54, 0);
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
    filter: drop-shadow(0 0 5px rgba(244, 67, 54, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 15px rgba(244, 67, 54, 0.6));
  }
`;

// Styled Components
const MainContainer = styled(Box)(({ theme, isDarkMode }) => ({
  minHeight: 'calc(100vh - 64px)',
  background: isDarkMode
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    : 'linear-gradient(135deg, #F44336 0%, #EF5350 50%, #F44336 100%)',
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
      ? 'radial-gradient(circle at 20% 80%, rgba(244, 67, 54, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(156, 39, 176, 0.1) 0%, transparent 50%)'
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
    background: 'linear-gradient(90deg, transparent, rgba(244, 67, 54, 0.1), transparent)',
    animation: `${shimmer} 3s ease-in-out infinite`,
  },
}));

const FloatingIcon = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  background: 'linear-gradient(135deg, #F44336 0%, #EF5350 100%)',
  marginBottom: '16px',
  animation: `${float} 3s ease-in-out infinite`,
  boxShadow: '0 12px 30px rgba(244, 67, 54, 0.4)',
  border: '4px solid rgba(255, 255, 255, 0.2)',
  '& .MuiSvgIcon-root': {
    fontSize: '2.5rem',
    color: '#fff',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
  },
}));

const GradientTitle = styled(Typography)(({ theme, isDarkMode }) => ({
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 800,
  fontSize: '2.5rem',
  background: isDarkMode
    ? 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)'
    : 'linear-gradient(135deg, #F44336 0%, #C62828 100%)',
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
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontSize: '1.25rem',
  fontWeight: 500,
  color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(244, 67, 54, 0.8)',
  marginBottom: '24px',
  letterSpacing: '0.3px',
  lineHeight: 1.6,
}));

const GradeChip = styled(Chip)(({ theme, isDarkMode }) => ({
  background: 'linear-gradient(135deg, #F44336 0%, #EF5350 100%)',
  color: '#fff',
  fontWeight: 700,
  fontSize: '1rem',
  padding: '8px 16px',
  height: 'auto',
  borderRadius: '16px',
  boxShadow: '0 8px 25px rgba(244, 67, 54, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '& .MuiChip-label': {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  },
  '& .MuiChip-icon': {
    color: '#fff',
    marginLeft: '8px',
  },
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
    : '1px solid rgba(244, 67, 54, 0.2)',
  boxShadow: isDarkMode
    ? '0 15px 35px rgba(0, 0, 0, 0.2)'
    : '0 15px 35px rgba(0, 0, 0, 0.08)',
  animation: `${slideInUp} 0.8s ease-out`,
}));

const StyledTextField = styled(TextField)(({ theme, isDarkMode }) => ({
  '& .MuiInputLabel-root': {
    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(244, 67, 54, 0.8)',
    fontWeight: 600,
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
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
        : 'rgba(244, 67, 54, 0.2)',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: isDarkMode
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(244, 67, 54, 0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#F44336',
      boxShadow: '0 0 0 3px rgba(244, 67, 54, 0.1)',
    },
    '& .MuiInputBase-input': {
      color: isDarkMode ? '#fff' : '#2C3E50',
      fontWeight: 600,
      fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
  },
}));

const StyledFormControl = styled(FormControl)(({ theme, isDarkMode }) => ({
  '& .MuiInputLabel-root': {
    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(244, 67, 54, 0.8)',
    fontWeight: 600,
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
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
        : 'rgba(244, 67, 54, 0.2)',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: isDarkMode
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(244, 67, 54, 0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#F44336',
      boxShadow: '0 0 0 3px rgba(244, 67, 54, 0.1)',
    },
    '& .MuiSelect-select': {
      color: isDarkMode ? '#fff' : '#2C3E50',
      fontWeight: 600,
      fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
  },
}));

const LessonCard = styled(Card)(({ theme, isDarkMode }) => ({
  marginBottom: '16px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(244, 67, 54, 0.1)',
  boxShadow: isDarkMode
    ? '0 8px 25px rgba(0, 0, 0, 0.2)'
    : '0 8px 25px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(244, 67, 54, 0.1), transparent)',
    transition: 'left 0.6s ease',
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: isDarkMode
      ? '0 16px 40px rgba(0, 0, 0, 0.3)'
      : '0 16px 40px rgba(0, 0, 0, 0.1)',
    '&::before': {
      left: '100%',
    },
  },
}));

const LessonIcon = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  background: 'linear-gradient(135deg, #F44336 0%, #EF5350 100%)',
  boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)',
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
    color: '#fff',
  },
}));

const EmptyStateContainer = styled(Paper)(({ theme, isDarkMode }) => ({
  padding: '48px 32px',
  textAlign: 'center',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(244, 67, 54, 0.2)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  marginTop: '24px',
  animation: `${slideInUp} 0.8s ease-out`,
}));

const EmptyIcon = styled(InboxOutlined)(({ theme }) => ({
  fontSize: '4rem',
  color: '#F44336',
  marginBottom: '16px',
  animation: `${float} 3s ease-in-out infinite`,
  filter: 'drop-shadow(0 8px 16px rgba(244, 67, 54, 0.3))',
}));

const EmptyStateText = styled(Typography)(({ theme, isDarkMode }) => ({
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontSize: '1.25rem',
  fontWeight: 600,
  color: isDarkMode ? '#fff' : '#F44336',
  marginBottom: '8px',
}));

const EmptyStateSubText = styled(Typography)(({ theme, isDarkMode }) => ({
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontSize: '1rem',
  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(244, 67, 54, 0.7)',
}));

const FloatingBubble = styled(Box)(({ theme, size, top, left, delay, isDarkMode }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  background: isDarkMode
    ? `rgba(244, 67, 54, ${Math.random() * 0.1 + 0.05})`
    : `rgba(244, 67, 54, ${Math.random() * 0.08 + 0.02})`,
  top: top,
  left: left,
  animation: `${float} ${Math.random() * 8 + 8}s ease-in-out infinite`,
  animationDelay: delay,
  zIndex: 1,
  pointerEvents: 'none',
}));

const DeleteButton = styled(IconButton)(({ theme, isDarkMode }) => ({
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)',
  border: '1px solid rgba(244, 67, 54, 0.2)',
  borderRadius: '12px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(244, 67, 54, 0.1) 100%)',
    transform: 'scale(1.05)',
    boxShadow: '0 8px 25px rgba(244, 67, 54, 0.3)',
  },
  '& .MuiSvgIcon-root': {
    color: '#F44336',
    fontSize: '1.2rem',
  },
}));

const StyledDialog = styled(Dialog)(({ theme, isDarkMode }) => ({
  '& .MuiDialog-paper': {
    background: isDarkMode
      ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: isDarkMode
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(244, 67, 54, 0.2)',
    boxShadow: isDarkMode
      ? '0 20px 40px rgba(0, 0, 0, 0.5)'
      : '0 20px 40px rgba(0, 0, 0, 0.15)',
  },
  '& .MuiDialogTitle-root': {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    fontWeight: 700,
    color: isDarkMode ? '#fff' : '#2C3E50',
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  '& .MuiDialogContent-root': {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(44, 62, 80, 0.8)',
  },
}));

const DeleteConfirmButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #F44336 0%, #EF5350 100%)',
  color: '#fff',
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 700,
  borderRadius: '12px',
  padding: '10px 24px',
  boxShadow: '0 8px 25px rgba(244, 67, 54, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'linear-gradient(135deg, #D32F2F 0%, #F44336 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(244, 67, 54, 0.4)',
  },
  '&:disabled': {
    opacity: 0.7,
    transform: 'none',
  },
}));

const CancelButton = styled(Button)(({ theme, isDarkMode }) => ({
  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(44, 62, 80, 0.7)',
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 600,
  borderRadius: '12px',
  padding: '10px 24px',
  border: isDarkMode 
    ? '1px solid rgba(255, 255, 255, 0.1)' 
    : '1px solid rgba(244, 67, 54, 0.2)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(244, 67, 54, 0.05)',
  },
}));

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
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  // Filters
  const [gradeIdFilter, setGradeIdFilter] = useState('');
  const [moduleIdFilter, setModuleIdFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter options
  const [modules, setModules] = useState([]);
  const [loadingFilterOptions, setLoadingFilterOptions] = useState(true);

  // Delete states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Use useCallback for the fetch lessons function
  const fetchRejectedLessons = useCallback(async (page = 1) => {
    if (!userInfo?.id || !gradeIdFilter) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication token not found.');
      }

      let url = `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans?Status=4&userId=${userInfo.id}&Page=${page}&PageSize=${pageSize}`;

      url += `&GradeId=${gradeIdFilter}`;

      if (moduleIdFilter) {
          url += `&ModuleId=${moduleIdFilter}`;
      }
      if (searchTerm) {
          url += `&SearchTerm=${encodeURIComponent(searchTerm)}`;
      }

      const response = await axios.get(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 15000,
        }
      );

      if (response.data && response.data.code === 0) {
        const responseData = response.data.data;
        setLessons(responseData.items || []);
        setCurrentPage(responseData.currentPage || 1);
        setTotalPages(responseData.totalPages || 0);
        setTotalRecords(responseData.totalRecords || 0);
      } else {
        throw new Error(response.data.message || 'Failed to fetch rejected lessons.');
      }
    } catch (err) {
      console.error('Error fetching rejected lessons:', err);
      setError(err.message || 'An error occurred while fetching lessons.');
      setLessons([]);
      setTotalPages(0);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }, [userInfo?.id, pageSize, gradeIdFilter, moduleIdFilter, searchTerm]);

  // Effect to fetch filter options
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

                let userGradeId = null;
                if (userInfo?.grade) {
                    const gradeNumberMatch = userInfo.grade.match(/\d+/);
                    if (gradeNumberMatch && gradeNumberMatch[0]) {
                        userGradeId = parseInt(gradeNumberMatch[0], 10);
                        if(isNaN(userGradeId)) userGradeId = null;
                    }
                } else if (userInfo?.gradeId) {
                    userGradeId = userInfo.gradeId;
                }

                if (userGradeId !== null) {
                    setGradeIdFilter(userGradeId);

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

        if (userInfo) {
             fetchModulesForUserGrade();
        }

   }, [userInfo]);

  useEffect(() => {
    fetchRejectedLessons(currentPage);
  }, [fetchRejectedLessons, currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Handle navigation to detail page
  const handleNavigateToDetail = (lessonPlanId) => {
    if (lessonPlanId) {
      navigate(`/Giáo-án-đã-từ-chối/${lessonPlanId}`);
    } else {
      console.warn('Cannot navigate: Lesson ID is missing.');
    }
  };

  // Handle delete lesson
  const handleDeleteLesson = async (lessonPlanId) => {
    setDeleting(true);
    setDeleteError('');
    
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication token not found.');
      }

      const response = await axios.delete(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans/${lessonPlanId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 15000,
        }
      );

      if (response.data && (response.data.code === 0 || response.status === 200)) {
        setDeleteSuccess(true);
        // Remove the deleted lesson from the list
        setLessons(prevLessons => prevLessons.filter(lesson => lesson.lessonPlanId !== lessonPlanId));
        // Update total records
        setTotalRecords(prev => prev - 1);
        
        // If current page becomes empty and it's not the first page, go to previous page
        if (lessons.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        
        setDeleteDialogOpen(false);
        setLessonToDelete(null);
      } else {
        throw new Error(response.data?.message || 'Failed to delete lesson.');
      }
    } catch (err) {
      console.error('Error deleting lesson:', err);
      setDeleteError(err.message || 'An error occurred while deleting the lesson.');
    } finally {
      setDeleting(false);
    }
  };

  // Handle opening delete confirmation dialog
  const handleOpenDeleteDialog = (lesson, event) => {
    event.stopPropagation(); // Prevent card click navigation
    setLessonToDelete(lesson);
    setDeleteDialogOpen(true);
  };

  // Handle closing delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    if (!deleting) {
      setDeleteDialogOpen(false);
      setLessonToDelete(null);
      setDeleteError('');
    }
  };

  // Handle closing success snackbar
  const handleCloseSuccessSnackbar = () => {
    setDeleteSuccess(false);
  };

  const renderSkeletons = () => (
    <Box>
      {[...Array(pageSize)].map((_, index) => (
        <Card key={index} sx={{ mb: 2, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="circular" width={48} height={48} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="40%" height={24} />
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );

  return (
    <MainContainer isDarkMode={isDarkMode}>
      {/* Floating Bubbles */}
      {[...Array(6)].map((_, index) => (
        <FloatingBubble
          key={index}
          size={Math.random() * 60 + 30}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          delay={`${Math.random() * 5}s`}
          isDarkMode={isDarkMode}
        />
      ))}

      <StyledContainer maxWidth="lg">
        <Fade in timeout={1200}>
          <HeaderCard elevation={0} isDarkMode={isDarkMode}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <FloatingIcon>
                <RejectedIcon />
              </FloatingIcon>
              <GradientTitle isDarkMode={isDarkMode}>
                Giáo Án Bị Từ Chối
              </GradientTitle>
              <SubTitle isDarkMode={isDarkMode}>
                Danh sách các giáo án đã bị từ chối cần chỉnh sửa lại
              </SubTitle>
              {userInfo?.grade && (
                <GradeChip
                  icon={<SchoolIcon />}
                  label={userInfo.grade.replace('Lớp ', '')}
                  isDarkMode={isDarkMode}
                />
              )}
            </Box>
          </HeaderCard>
        </Fade>

        <Zoom in timeout={1400}>
          <ControlsCard elevation={0} isDarkMode={isDarkMode}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={3}>
              {(modules.length > 0 || loadingFilterOptions) && gradeIdFilter && (
                <Grid item xs={12} md={4}>
                  <StyledFormControl fullWidth size="small" disabled={loadingFilterOptions} isDarkMode={isDarkMode}>
                    <InputLabel>Lọc theo Chủ đề</InputLabel>
                    {loadingFilterOptions ? (
                      <Skeleton variant="rectangular" height={40} sx={{ borderRadius: '12px' }} />
                    ) : (
                      <Select
                        value={moduleIdFilter}
                        label="Lọc theo Chủ đề"
                        onChange={(e) => {
                          setModuleIdFilter(e.target.value);
                          setCurrentPage(1);
                        }}
                        startAdornment={<MenuBookIcon sx={{ mr: 1, color: '#F44336' }} />}
                      >
                        <MenuItem value=""><em>Tất cả Chủ đề</em></MenuItem>
                        {modules.map((module) => (
                          <MenuItem key={module.moduleId} value={module.moduleId}>
                            {module.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </StyledFormControl>
                </Grid>
              )}
              
              <Grid item xs={12} md={((modules.length > 0 || loadingFilterOptions) && gradeIdFilter) ? 8 : 12}>
                <StyledTextField
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
                  disabled={!gradeIdFilter && !loadingFilterOptions}
                  isDarkMode={isDarkMode}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#F44336' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </ControlsCard>
        </Zoom>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '20px',
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            border: isDarkMode
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(244, 67, 54, 0.2)',
            boxShadow: isDarkMode
              ? '0 20px 40px rgba(0, 0, 0, 0.3)'
              : '0 20px 40px rgba(0, 0, 0, 0.1)',
          }}
        >
          {loading || (loadingFilterOptions && !gradeIdFilter) ? (
            renderSkeletons()
          ) : !error && lessons.length === 0 ? (
            <EmptyStateContainer elevation={0} isDarkMode={isDarkMode}>
              <EmptyIcon />
              <EmptyStateText isDarkMode={isDarkMode}>
                Không có Giáo án nào bị từ chối
              </EmptyStateText>
              <EmptyStateSubText isDarkMode={isDarkMode}>
                Các giáo án bị từ chối sẽ xuất hiện ở đây
              </EmptyStateSubText>
            </EmptyStateContainer>
          ) : !error && lessons.length > 0 ? (
            <>
              <Box sx={{ mb: 3 }}>
                {lessons.map((lesson, index) => (
                  <Fade in timeout={800 + index * 100} key={lesson.lessonPlanId}>
                    <LessonCard 
                      isDarkMode={isDarkMode}
                      onClick={() => handleNavigateToDetail(lesson.lessonPlanId)}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <LessonIcon>
                            <Cancel />
                          </LessonIcon>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                                fontWeight: 700,
                                color: isDarkMode ? '#fff' : '#2C3E50',
                                mb: 1,
                              }}
                            >
                              {lesson.lesson || 'Không có tiêu đề'}
                            </Typography>
                            <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <MenuBookIcon sx={{ fontSize: '1rem', color: '#F44336' }} />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(44, 62, 80, 0.7)',
                                    fontWeight: 500,
                                  }}
                                >
                                  {lesson.module || 'N/A'}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTimeIcon sx={{ fontSize: '1rem', color: '#F44336' }} />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(44, 62, 80, 0.7)',
                                    fontWeight: 500,
                                  }}
                                >
                                  {lesson.createdAt}
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Tooltip title="Xóa giáo án" arrow>
                              <DeleteButton
                                isDarkMode={isDarkMode}
                                onClick={(e) => handleOpenDeleteDialog(lesson, e)}
                                size="small"
                              >
                                <DeleteIcon />
                              </DeleteButton>
                            </Tooltip>
                            <Chip
                              label="Bị từ chối"
                              sx={{
                                background: 'linear-gradient(135deg, #F44336 0%, #EF5350 100%)',
                                color: '#fff',
                                fontWeight: 600,
                                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                              }}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </LessonCard>
                  </Fade>
                ))}
              </Box>
              
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={totalPages} 
                    page={currentPage} 
                    onChange={handlePageChange} 
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                        fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                      },
                      '& .Mui-selected': {
                        backgroundColor: 'rgba(244, 67, 54, 0.2) !important',
                        color: '#F44336 !important',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: 'rgba(244, 67, 54, 0.3) !important',
                        }
                      }
                    }}
                  />
                </Box>
              )}
            </>
          ) : null}
        </Paper>
      </StyledContainer>

      {/* Delete Confirmation Dialog */}
      <StyledDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
        isDarkMode={isDarkMode}
      >
        <DialogTitle>
          <WarningIcon sx={{ color: '#F44336' }} />
          Xác nhận xóa Giáo án
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa giáo án "{lessonToDelete?.lesson}" không? 
            Hành động này không thể hoàn tác.
          </DialogContentText>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: '12px' }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <CancelButton 
            onClick={handleCloseDeleteDialog} 
            disabled={deleting}
            isDarkMode={isDarkMode}
          >
            Hủy
          </CancelButton>
          <DeleteConfirmButton
            onClick={() => handleDeleteLesson(lessonToDelete?.lessonPlanId)}
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
          >
            {deleting ? 'Đang xóa...' : 'Xóa'}
          </DeleteConfirmButton>
        </DialogActions>
      </StyledDialog>

      {/* Success Snackbar */}
      <Snackbar
        open={deleteSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccessSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSuccessSnackbar} 
          severity="success" 
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
            fontWeight: 600,
          }}
        >
          Xóa giáo án thành công!
        </Alert>
      </Snackbar>
    </MainContainer>
  );
};

export default RejectedLessons; 