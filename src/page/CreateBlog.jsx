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
  useTheme
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

      if (response.data && response.data.code === 0) {
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
    <Box
      sx={{
        py: 4,
        minHeight: 'calc(100vh - 64px)',
        background: isDarkMode
          ? 'linear-gradient(135deg, rgb(18, 18, 18) 0%, rgb(30, 30, 30) 100%)'
          : 'linear-gradient(135deg, rgb(245, 247, 250) 0%, rgb(255, 255, 255) 100%)',
      }}
    >
      <Container maxWidth="md">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/danh-sach-bai-dang')}
          sx={{ 
            mb: 3,
            color: isDarkMode ? '#fff' : '#000',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            }
          }}
        >
          Quay lại
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '12px',
            backgroundColor: isDarkMode ? 'rgba(40, 40, 40, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 700,
            color: isDarkMode ? '#fff' : '#000',
            fontFamily: 'sans-serif',
            textShadow: isDarkMode ? 'none' : '1px 1px 2px rgba(0,0,0,0.1)',
          }}>
            Đăng bài mới
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Tiêu đề bài viết"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? '#fff' : '#000',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : '#d0d0d0',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#fff' : '#000',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? '#fff' : '#000',
                    },
                    '& input': {
                      color: isDarkMode ? '#fff' : '#000',
                    },
                  },
                }}
              />

              <FormControl fullWidth required>
                <InputLabel id="category-label" sx={{ color: isDarkMode ? '#fff' : '#000' }}>Danh mục</InputLabel>
                <Select
                  labelId="category-label"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  label="Danh mục"
                  disabled={loadingCategories}
                  sx={{
                    '& .MuiSelect-select': {
                      color: isDarkMode ? '#fff' : '#000',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : '#d0d0d0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? '#fff' : '#000',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? '#fff' : '#000',
                    },
                  }}
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
              </FormControl>

              <TextField
                label="Nội dung bài viết"
                name="body"
                value={formData.body}
                onChange={handleChange}
                required
                fullWidth
                multiline
                rows={10}
                variant="outlined"
                sx={{
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? '#fff' : '#000',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : '#d0d0d0',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#fff' : '#000',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? '#fff' : '#000',
                    },
                    '& textarea': {
                      color: isDarkMode ? '#fff' : '#000',
                    },
                  },
                }}
              />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/danh-sach-bai-dang')}
                  disabled={loading}
                  sx={{
                    color: isDarkMode ? '#fff' : '#000',
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : '#000',
                    '&:hover': {
                      borderColor: isDarkMode ? '#fff' : '#000',
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || loadingCategories}
                  sx={{ 
                    minWidth: '120px',
                    bgcolor: isDarkMode ? '#fff' : '#000',
                    color: isDarkMode ? '#000' : '#fff',
                    '&:hover': { 
                      bgcolor: isDarkMode ? '#e0e0e0' : '#333',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Đăng bài'}
                </Button>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateBlog; 