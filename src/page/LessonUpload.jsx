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
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  Save as SaveIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Title as TitleIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Lấy danh sách danh mục khi component được mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/categories');
        if (response.data && response.data.code === 0) {
          setCategories(response.data.data || []);
          if (response.data.data && response.data.data.length > 0) {
            setSelectedCategory(response.data.data[0].categoryId);
          }
        } else {
          setError('Không thể tải danh sách danh mục');
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách danh mục:', err);
        setError('Lỗi khi tải danh sách danh mục');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
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
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 3,
            color: isDarkMode ? '#ffffff' : '#2D3436',
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          Quay lại
        </Button>

        <Grid container spacing={4}>
          {/* Thẻ thông tin Giáo án */}
          <Grid item xs={12} md={4}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: '16px',
                backgroundColor: isDarkMode ? 'rgba(40, 40, 40, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(0,0,0,0.05)',
                height: '100%'
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <SchoolIcon color="primary" />
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                    Thông tin Giáo án
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                
                {hasLessonData ? (
                  <>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {lessonData.lesson || 'Không có tiêu đề'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Chủ đề: {lessonData.module || 'N/A'}
                    </Typography>
                    <Chip 
                      label="Đã chấp nhận" 
                      color="success" 
                      size="small" 
                      sx={{ mb: 2 }}
                    />
                  </>
                ) : (
                  <Alert severity="warning">
                    Không tìm thấy thông tin Giáo án. Vui lòng quay lại trang chi tiết Giáo án.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Form đăng bài viết */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: '16px',
                backgroundColor: isDarkMode ? 'rgba(40, 40, 40, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(0,0,0,0.05)',
              }}
            >
              <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 3 }}>
                Đăng bài viết mới
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  {/* Chọn danh mục */}
                  <FormControl fullWidth>
                    <InputLabel id="category-label">Danh mục</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category-select"
                      value={selectedCategory}
                      label="Danh mục"
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      disabled={categoriesLoading}
                      startAdornment={
                        categoriesLoading ? (
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                        ) : (
                          <CategoryIcon color="primary" sx={{ mr: 1 }} />
                        )
                      }
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.categoryId} value={category.categoryId}>
                          {category.categoryName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Nhập tiêu đề */}
                  <TextField
                    label="Tiêu đề"
                    variant="outlined"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <TitleIcon color="primary" sx={{ mr: 1 }} />,
                    }}
                  />

                  {/* Nhập nội dung */}
                  <TextField
                    label="Nội dung bài viết"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={10}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <DescriptionIcon color="primary" sx={{ mr: 1 }} />,
                    }}
                  />

                  {/* Nút gửi */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      disabled={loading || !hasLessonData}
                      sx={{
                        minWidth: '200px',
                        py: 1.5,
                        boxShadow: 3,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: '8px',
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                        }
                      }}
                    >
                      {loading ? 'Đang đăng...' : 'Đăng bài viết'}
                    </Button>
                  </Box>
                </Stack>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LessonUpload; 