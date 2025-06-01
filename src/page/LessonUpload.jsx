import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  Divider,
  Stack,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  Zoom
} from '@mui/material';
import {
  ArrowBack,
  Save as SaveIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Title as TitleIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Create as CreateIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useTheme } from '../context/ThemeContext';

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

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

// Styled Components
const MainContainer = styled(Box)(({ theme, isDarkMode }) => ({
  minHeight: 'calc(100vh - 64px)',
  background: isDarkMode
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    : 'linear-gradient(135deg, #2196F3 0%, #21CBF3 50%, #2196F3 100%)',
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
      ? 'radial-gradient(circle at 20% 80%, rgba(33, 150, 243, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(156, 39, 176, 0.1) 0%, transparent 50%)'
      : 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
}));

const LessonInfoCard = styled(Card)(({ theme, isDarkMode }) => ({
  height: '100%',
  borderRadius: '20px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(76, 175, 80, 0.95) 0%, rgba(76, 175, 80, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  border: isDarkMode
    ? '1px solid rgba(76, 175, 80, 0.2)'
    : '1px solid rgba(76, 175, 80, 0.3)',
  boxShadow: isDarkMode
    ? '0 20px 40px rgba(0, 0, 0, 0.3)'
    : '0 20px 40px rgba(76, 175, 80, 0.2)',
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
    background: 'linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.1), transparent)',
    animation: `${shimmer} 3s ease-in-out infinite`,
  },
}));

const FormCard = styled(Paper)(({ theme, isDarkMode }) => ({
  padding: '40px',
  borderRadius: '20px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(33, 150, 243, 0.2)',
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
    background: 'linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.1), transparent)',
    animation: `${shimmer} 3s ease-in-out infinite`,
  },
}));

const MainTitle = styled(Typography)(({ theme, isDarkMode }) => ({
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 800,
  fontSize: '1.8rem',
  background: isDarkMode
    ? 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)'
    : 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '0.5px',
  marginBottom: '24px',
  [theme.breakpoints.down('md')]: {
    fontSize: '1.5rem',
  },
}));

const LessonTitle = styled(Typography)(({ theme, isDarkMode }) => ({
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 700,
  fontSize: '1.3rem',
  color: isDarkMode ? '#4CAF50' : '#2E7D32',
  marginBottom: '16px',
}));

const StyledTextField = styled(TextField)(({ theme, isDarkMode }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    '& fieldset': {
      borderColor: isDarkMode 
        ? 'rgba(255, 255, 255, 0.2)' 
        : 'rgba(33, 150, 243, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: isDarkMode 
        ? 'rgba(255, 255, 255, 0.4)' 
        : 'rgba(33, 150, 243, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2196F3',
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    fontWeight: 600,
  },
  '& .MuiInputBase-input': {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  },
}));

const StyledFormControl = styled(FormControl)(({ theme, isDarkMode }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    '& fieldset': {
      borderColor: isDarkMode 
        ? 'rgba(255, 255, 255, 0.2)' 
        : 'rgba(33, 150, 243, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: isDarkMode 
        ? 'rgba(255, 255, 255, 0.4)' 
        : 'rgba(33, 150, 243, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2196F3',
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    fontWeight: 600,
  },
}));

const SubmitButton = styled(Button)(({ theme, isDarkMode }) => ({
  background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
  color: '#fff',
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 700,
  fontSize: '1rem',
  padding: '16px 32px',
  borderRadius: '12px',
  boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  minWidth: '200px',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(33, 150, 243, 0.4)',
    background: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
  },
  '&:disabled': {
    opacity: 0.7,
    transform: 'none',
  },
}));

const BackButton = styled(Button)(({ theme, isDarkMode }) => ({
  marginBottom: '24px',
  color: isDarkMode ? '#ffffff' : '#2D3436',
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 600,
  borderRadius: '12px',
  padding: '12px 24px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
  backdropFilter: 'blur(10px)',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(33, 150, 243, 0.2)',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(33, 150, 243, 0.1)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.15)',
  },
}));

const SuccessChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
  color: '#fff',
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 700,
  animation: `${pulse} 2s ease-in-out infinite`,
}));

const FloatingBubble = styled(Box)(({ theme, size, top, left, delay, isDarkMode }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  background: isDarkMode
    ? `rgba(33, 150, 243, ${Math.random() * 0.1 + 0.05})`
    : `rgba(33, 150, 243, ${Math.random() * 0.08 + 0.02})`,
  top: top,
  left: left,
  animation: `${float} ${Math.random() * 8 + 8}s ease-in-out infinite`,
  animationDelay: delay,
  zIndex: 1,
  pointerEvents: 'none',
}));

const LessonUpload = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  // Lấy dữ liệu Giáo án từ state
  const lessonData = location.state?.lessonData || {};
  
  // Log để kiểm tra dữ liệu
  console.log("Dữ liệu Giáo án:", lessonData);
  console.log("Các thuộc tính của lessonData:", Object.keys(lessonData));
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('1'); // Mặc định là "Học tập" với ID = 1
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false); // Không cần loading categories nữa
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Không cần fetch categories nữa - chỉ sử dụng category "Học tập"
  useEffect(() => {
    // Set category cố định là "Học tập" 
    setSelectedCategory('1'); // Giả sử ID của "Học tập" là 1
    setCategoriesLoading(false);
  }, []);

  // Thiết lập tiêu đề và nội dung mặc định dựa trên dữ liệu Giáo án
  useEffect(() => {
    console.log("Đang thiết lập tiêu đề với dữ liệu Giáo án:", lessonData);
    
    if (lessonData && lessonData.lesson) {
      // Thiết lập tiêu đề mặc định dựa trên tiêu đề Giáo án
      setTitle(`Giáo án: ${lessonData.lesson}`);
      
      // Không tự động điền nội dung bài viết
      // Người dùng sẽ tự nhập nội dung
    }
  }, [lessonData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      setError('Vui lòng chọn danh mục');
      return;
    }
    
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề');
      return;
    }
    
    if (!body.trim()) {
      setError('Vui lòng nhập nội dung bài viết');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }
      
      const userId = JSON.parse(localStorage.getItem('userInfo'))?.id;
      if (!userId) {
        throw new Error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      }
      
      console.log("Đang gửi bài viết với lessonPlanId:", lessonData.lessonPlanId);
      console.log("API Request Body:", {
        title,
        body,
        categoryId: parseInt(selectedCategory),
        teacherLessonId: lessonData.lessonPlanId,
        userId: userId
      });
      
      const response = await axios.post(
        'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/blogs',
        {
          title,
          body,
          categoryId: parseInt(selectedCategory),
          teacherLessonId: lessonData.lessonPlanId,
          userId: userId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.code === 0) {
        setSnackbar({
          open: true,
          message: 'Đăng bài viết thành công!',
          severity: 'success'
        });
        
        // Quay lại trang trước sau khi đăng thành công
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } else if (response.data.message === 'Created successfully!') {
        setSnackbar({
          open: true,
          message: 'Đăng bài viết thành công!',
          severity: 'success'
        });
        
        // Quay lại trang trước sau khi đăng thành công
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Lỗi khi đăng bài viết');
      }
    } catch (err) {
      console.error('Lỗi khi gửi bài viết:', err);
      setError(err.message || 'Lỗi khi đăng bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Kiểm tra xem có dữ liệu Giáo án hay không
  const hasLessonData = lessonData && Object.keys(lessonData).length > 0;
  console.log("hasLessonData:", hasLessonData);
  console.log("lessonData.lesson:", lessonData?.lesson);
  console.log("lessonData.module:", lessonData?.module);
  console.log("lessonData.id:", lessonData?.id);
  console.log("lessonData.teacherLessonId:", lessonData?.lessonPlanId);

  return (
    <MainContainer isDarkMode={isDarkMode}>
      {/* Floating Bubbles */}
      {[...Array(12)].map((_, index) => (
        <FloatingBubble
          key={index}
          size={Math.random() * 80 + 40}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          delay={`${Math.random() * 5}s`}
          isDarkMode={isDarkMode}
        />
      ))}

      <StyledContainer maxWidth="lg">
        <Fade in timeout={800}>
          <BackButton
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
            isDarkMode={isDarkMode}
        >
          Quay lại
          </BackButton>
        </Fade>

        <Grid container spacing={4}>
          {/* Lesson Information Card */}
          <Grid item xs={12} md={4}>
            <Zoom in timeout={1000}>
              <LessonInfoCard elevation={0} isDarkMode={isDarkMode}>
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <SchoolIcon sx={{ fontSize: 32, color: '#4CAF50' }} />
                    <Typography 
                      variant="h6" 
                      component="h2" 
              sx={{ 
                        fontWeight: 700,
                        fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                        color: isDarkMode ? '#4CAF50' : '#2E7D32',
              }}
            >
                    Thông tin Giáo án
                  </Typography>
                </Stack>
                  <Divider sx={{ mb: 3, borderColor: 'rgba(76, 175, 80, 0.3)' }} />
                
                {hasLessonData ? (
                    <Stack spacing={3}>
                      <LessonTitle variant="subtitle1" isDarkMode={isDarkMode}>
                      {lessonData.lesson || 'Không có tiêu đề'}
                      </LessonTitle>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
                          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                          mb: 2 
                        }}
                      >
                      Chủ đề: {lessonData.module || 'N/A'}
                    </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <SuccessChip 
                          icon={<CheckCircleIcon />}
                      label="Đã chấp nhận" 
                      size="small" 
                    />
                      </Box>
                    </Stack>
                ) : (
                    <Alert 
                      severity="warning"
                      sx={{ 
                        borderRadius: '12px',
                        fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                      }}
                    >
                    Không tìm thấy thông tin Giáo án. Vui lòng quay lại trang chi tiết Giáo án.
                  </Alert>
                )}
              </CardContent>
              </LessonInfoCard>
            </Zoom>
          </Grid>

          {/* Form Section */}
          <Grid item xs={12} md={8}>
            <Zoom in timeout={1200}>
              <FormCard elevation={0} isDarkMode={isDarkMode}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                  <CreateIcon sx={{ fontSize: 32, color: '#2196F3' }} />
                  <MainTitle variant="h5" component="h1" isDarkMode={isDarkMode}>
                    Đăng bài viết mới
                  </MainTitle>
                </Stack>

                {error && (
                  <Fade in timeout={500}>
                    <Alert 
                      severity="error" 
              sx={{
                        mb: 3,
                        borderRadius: '12px',
                        fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                      }}
                    >
                  {error}
                </Alert>
                  </Fade>
              )}

              <form onSubmit={handleSubmit}>
                  <Stack spacing={4}>
                    {/* Category Selection - Hiển thị cố định "Học tập" */}
                    <Fade in timeout={1400}>
                      <StyledTextField
                        label="Danh mục"
                        variant="outlined"
                        fullWidth
                        value="Học tập"
                        disabled
                        isDarkMode={isDarkMode}
                        InputProps={{
                          startAdornment: <CategoryIcon sx={{ mr: 1, color: '#2196F3' }} />,
                        }}
                        sx={{
                          '& .MuiInputBase-input.Mui-disabled': {
                            WebkitTextFillColor: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                      />
                    </Fade>

                    {/* Title Input */}
                    <Fade in timeout={1600}>
                      <StyledTextField
                    label="Tiêu đề"
                    variant="outlined"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                        isDarkMode={isDarkMode}
                    InputProps={{
                          startAdornment: <TitleIcon sx={{ mr: 1, color: '#2196F3' }} />,
                    }}
                  />
                    </Fade>

                    {/* Content Input */}
                    <Fade in timeout={1800}>
                      <StyledTextField
                    label="Nội dung bài viết"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={10}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                        isDarkMode={isDarkMode}
                    InputProps={{
                          startAdornment: <DescriptionIcon sx={{ mr: 1, color: '#2196F3', alignSelf: 'flex-start', mt: 1 }} />,
                    }}
                  />
                    </Fade>

                    {/* Submit Button */}
                    <Fade in timeout={2000}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <SubmitButton
                      type="submit"
                      variant="contained"
                          disabled={loading || !hasLessonData}
                          isDarkMode={isDarkMode}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    >
                      {loading ? 'Đang đăng...' : 'Đăng bài viết'}
                        </SubmitButton>
                  </Box>
                    </Fade>
                </Stack>
              </form>
              </FormCard>
            </Zoom>
          </Grid>
        </Grid>
      </StyledContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainContainer>
  );
};

export default LessonUpload; 