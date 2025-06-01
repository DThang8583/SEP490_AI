import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Fade,
  Zoom
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Create as CreateIcon, Category as CategoryIcon, Title as TitleIcon, Description as DescriptionIcon } from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
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
  fontSize: '2.5rem',
  background: isDarkMode
    ? 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)'
    : 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '0.5px',
  marginBottom: '32px',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem',
  },
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
  minWidth: '150px',
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

const CancelButton = styled(Button)(({ theme, isDarkMode }) => ({
  background: isDarkMode 
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(158, 158, 158, 0.1) 0%, rgba(158, 158, 158, 0.05) 100%)',
  color: isDarkMode ? '#fff' : '#666',
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 600,
  fontSize: '1rem',
  padding: '16px 32px',
  borderRadius: '12px',
  border: isDarkMode 
    ? '1px solid rgba(255, 255, 255, 0.2)' 
    : '1px solid rgba(158, 158, 158, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  minWidth: '150px',
  '&:hover': {
    transform: 'translateY(-2px)',
    backgroundColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(158, 158, 158, 0.1)',
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

const CreateBlog = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    categoryId: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('Không tìm thấy token xác thực');
        }

        const response = await axios.get(
          'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/categories',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        console.log('Categories response:', response.data);
        
        if (response.data && response.data.code === 0) {
          // Filter out category with ID 1
          const filteredCategories = response.data.data.filter(category => category.categoryId !== 1);
          setCategories(filteredCategories);
          console.log('Categories set to:', filteredCategories);
        } else {
          throw new Error(response.data?.message || 'Có lỗi xảy ra khi tải danh mục');
        }
      } catch (err) {
        console.error('Lỗi khi tải danh mục:', err);
        setError(err.message || 'Không thể tải danh mục');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Form change:', name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.id) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      const requestData = {
        ...formData,
        userId: Number(userInfo.id),
        categoryId: Number(formData.categoryId),
        teacherLessonId:0    };

      console.log('Submitting form data:', requestData);

      const response = await axios.post(
        'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/blogs',
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.code === 0 || response.data.code === 21) {
        setSuccess('Đăng bài thành công!');
        // Reset form
        setFormData({ title: '', body: '', categoryId: '' });
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/danh-sach-bai-dang');
        }, 2000);
      } else {
        throw new Error(response.data?.message || 'Có lỗi xảy ra khi đăng bài');
      }
    } catch (err) {
      console.error('Lỗi khi đăng bài:', err);
      setError(err.message || 'Không thể đăng bài');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainContainer isDarkMode={isDarkMode}>
      {/* Floating Bubbles */}
      {[...Array(10)].map((_, index) => (
        <FloatingBubble
          key={index}
          size={Math.random() * 80 + 40}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          delay={`${Math.random() * 5}s`}
          isDarkMode={isDarkMode}
        />
      ))}

      <StyledContainer maxWidth="md">
        <Fade in timeout={800}>
          <BackButton
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/danh-sach-bai-dang')}
            isDarkMode={isDarkMode}
          >
            Quay lại
          </BackButton>
        </Fade>

        <Zoom in timeout={1000}>
          <FormCard elevation={0} isDarkMode={isDarkMode}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 4 }}>
              <CreateIcon sx={{ fontSize: 40, color: '#2196F3' }} />
              <MainTitle variant="h4" component="h1" isDarkMode={isDarkMode}>
                Đăng bài mới
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

            {success && (
              <Fade in timeout={500}>
                <Alert 
                  severity="success" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: '12px',
                    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                  }}
                >
                  {success}
                </Alert>
              </Fade>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <Fade in timeout={1200}>
                  <StyledTextField
                    label="Tiêu đề bài viết"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    isDarkMode={isDarkMode}
                    InputProps={{
                      startAdornment: <TitleIcon sx={{ mr: 1, color: '#2196F3' }} />,
                    }}
                  />
                </Fade>

                <Fade in timeout={1400}>
                  <StyledFormControl fullWidth required isDarkMode={isDarkMode}>
                    <InputLabel id="category-label">Danh mục</InputLabel>
                    <Select
                      labelId="category-label"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      label="Danh mục"
                      disabled={loadingCategories}
                      startAdornment={
                        loadingCategories ? (
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                        ) : (
                          <CategoryIcon sx={{ mr: 1, color: '#2196F3' }} />
                        )
                      }
                    >
                      {loadingCategories ? (
                        <MenuItem disabled>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          Đang tải danh mục...
                        </MenuItem>
                      ) : categories.length > 0 ? (
                        categories.map((category) => (
                          <MenuItem key={category.categoryId} value={category.categoryId}>
                            {category.categoryName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>Không có danh mục nào</MenuItem>
                      )}
                    </Select>
                  </StyledFormControl>
                </Fade>

                <Fade in timeout={1600}>
                  <StyledTextField
                    label="Nội dung bài viết"
                    name="body"
                    value={formData.body}
                    onChange={handleChange}
                    required
                    fullWidth
                    multiline
                    rows={10}
                    variant="outlined"
                    isDarkMode={isDarkMode}
                    InputProps={{
                      startAdornment: <DescriptionIcon sx={{ mr: 1, color: '#2196F3', alignSelf: 'flex-start', mt: 1 }} />,
                    }}
                  />
                </Fade>

                <Fade in timeout={1800}>
                  <Box sx={{ display: 'flex', gap: 3, justifyContent: 'flex-end', mt: 4 }}>
                    <CancelButton
                      variant="outlined"
                      onClick={() => navigate('/danh-sach-bai-dang')}
                      disabled={loading}
                      isDarkMode={isDarkMode}
                    >
                      Hủy
                    </CancelButton>
                    <SubmitButton
                      type="submit"
                      variant="contained"
                      disabled={loading || loadingCategories}
                      isDarkMode={isDarkMode}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CreateIcon />}
                    >
                      {loading ? 'Đang đăng...' : 'Đăng bài'}
                    </SubmitButton>
                  </Box>
                </Fade>
              </Stack>
            </form>
          </FormCard>
        </Zoom>
      </StyledContainer>
    </MainContainer>
  );
};

export default CreateBlog; 