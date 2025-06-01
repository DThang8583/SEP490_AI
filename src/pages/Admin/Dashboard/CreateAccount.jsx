// src/pages/Admin/CreateAccount.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Container,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  SupervisorAccount as RoleIcon,
  School as SchoolIcon,
  Class as GradeIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useTheme } from '../../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateAccount = () => {
  const navigate = useNavigate();
  const theme = useMuiTheme();
  const { isDarkMode } = useTheme();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    roleId: '',
    schoolId: '',
    gradeId: '',
  });

  const [grades, setGrades] = useState([]);
  const [roles, setRoles] = useState([]);
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        // Fetch school info
        const schoolResponse = await axios.get(
          'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/schools/1'
        );
        if (schoolResponse.data?.code === 0) {
          setSchoolInfo(schoolResponse.data.data);
          setFormData(prev => ({ ...prev, schoolId: schoolResponse.data.data.schoolId.toString() }));
        }

        // Fetch grades
        const gradesResponse = await axios.get(
          'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades'
        );
        if (gradesResponse.data?.code === 0) {
          setGrades(gradesResponse.data.data);
        }

        // Fetch roles
        const rolesResponse = await axios.get(
          'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/roles'
        );
        if (rolesResponse.data?.code === 0) {
          setRoles(rolesResponse.data.data);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error('Error fetching data:', err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    const errors = {};
    
    // Username validation
    if (formData.username.length < 3) {
      errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
    }

    // Password validation
    if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (!/(?=.*[0-9])/.test(formData.password)) {
      errors.password = 'Mật khẩu phải chứa ít nhất 1 số';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }

    // Role validation
    if (!formData.roleId) {
      errors.roleId = 'Vui lòng chọn vai trò';
    }

    // Grade validation
    if (!formData.gradeId) {
      errors.gradeId = 'Vui lòng chọn khối';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear success/error messages
    if (success) setSuccess('');
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const submitData = {
        ...formData,
        roleId: parseInt(formData.roleId),
        schoolId: parseInt(formData.schoolId),
        gradeId: parseInt(formData.gradeId),
      };

      console.log('Submit data:', submitData);

      const response = await axios.post(
        'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users',
        submitData
      );
      
      if (response.data.code === 0 || response.data.code === 21) {
        setSuccess('Tài khoản đã được tạo thành công!');
        setFormData({
          username: '',
          password: '',
          email: '',
          roleId: '',
          schoolId: formData.schoolId, // Keep school ID
          gradeId: '',
        });
        setValidationErrors({});
        setError('');
        
        // Auto navigate back after success
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } else {
        console.log('Error response data:', response.data);
        setError('Có lỗi xảy ra khi tạo tài khoản.');
      }
    } catch (err) {
      console.log('Error response:', err.response?.data);
      console.log('Error details:', err);
      setError('Không thể tạo tài khoản. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '50vh',
          flexDirection: 'column',
          gap: 2,
        }}>
          <CircularProgress size={50} sx={{ color: theme.palette.primary.main }} />
          <Typography variant="h6" color="primary">Đang tải dữ liệu...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: isDarkMode 
        ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 4
    }}>
      <Container maxWidth="md">
        {/* Header */}
        <Card sx={{ 
          mb: 3, 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: '#ffffff',
          borderRadius: 3,
          boxShadow: isDarkMode 
            ? `0 4px 20px rgba(255, 107, 107, 0.3)`
            : `0 4px 20px rgba(255, 107, 107, 0.2)`
        }}>
          <CardContent sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                variant="contained"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                  borderRadius: 2
                }}
              >
                Quay lại
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PersonAddIcon sx={{ fontSize: 32 }} />
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h4" component="h1" fontWeight="600">
                    Tạo tài khoản mới
                  </Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    Thêm tài khoản giáo viên hoặc quản trị viên
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Success/Error Messages */}
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 2, 
              borderRadius: 2,
              boxShadow: '0 2px 10px rgba(76, 175, 80, 0.2)',
              backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.1)' : undefined,
              color: isDarkMode ? '#4caf50' : undefined,
            }}
          >
            {success}
          </Alert>
        )}

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2, 
              borderRadius: 2,
              boxShadow: '0 2px 10px rgba(244, 67, 54, 0.2)',
              backgroundColor: isDarkMode ? 'rgba(244, 67, 54, 0.1)' : undefined,
              color: isDarkMode ? '#f44336' : undefined,
            }}
          >
            {error}
          </Alert>
        )}
        
        {/* Form */}
        <Card sx={{ 
          borderRadius: 3, 
          boxShadow: isDarkMode 
            ? '0 8px 32px rgba(0,0,0,0.3)'
            : '0 8px 32px rgba(0,0,0,0.1)',
          backgroundColor: theme.palette.background.paper
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="600" color="primary" gutterBottom>
                Thông tin tài khoản
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Vui lòng điền đầy đủ thông tin để tạo tài khoản mới
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tên đăng nhập"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    error={!!validationErrors.username}
                    helperText={validationErrors.username}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      }
                    }}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    error={!!validationErrors.email}
                    helperText={validationErrors.email}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      }
                    }}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Mật khẩu"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    error={!!validationErrors.password}
                    helperText={validationErrors.password}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      }
                    }}
                    InputProps={{
                      startAdornment: <LockIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />,
                      endAdornment: (
                        <IconButton
                          onClick={(e) => { e.preventDefault(); setShowPassword(!showPassword); }}
                          edge="end"
                        >
                          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl 
                    fullWidth 
                    required 
                    error={!!validationErrors.roleId}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      }
                    }}
                  >
                    <InputLabel>Vai trò</InputLabel>
                    <Select
                      name="roleId"
                      value={formData.roleId}
                      onChange={handleChange}
                      label="Vai trò"
                      startAdornment={<RoleIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.roleId} value={role.roleId}>
                          {role.roleName}
                        </MenuItem>
                      ))}
                    </Select>
                    {validationErrors.roleId && (
                      <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 1 }}>
                        {validationErrors.roleId}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl 
                    fullWidth 
                    required 
                    error={!!validationErrors.gradeId}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      }
                    }}
                  >
                    <InputLabel>Khối lớp</InputLabel>
                    <Select
                      name="gradeId"
                      value={formData.gradeId}
                      onChange={handleChange}
                      label="Khối lớp"
                      startAdornment={<GradeIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />}
                    >
                      {grades.map((grade) => (
                        <MenuItem key={grade.gradeId} value={grade.gradeId}>
                          Khối {grade.gradeNumber}
                        </MenuItem>
                      ))}
                    </Select>
                    {validationErrors.gradeId && (
                      <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 1 }}>
                        {validationErrors.gradeId}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Trường học"
                    value={schoolInfo ? `${schoolInfo.name} ` : 'Đang tải...'}
                    disabled
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: theme.palette.text.secondary,
                      }
                    }}
                    InputProps={{
                      startAdornment: <SchoolIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                      sx={{ 
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        fontSize: '16px',
                        fontWeight: 600,
                        boxShadow: `0 4px 20px ${theme.palette.primary.main}30`,
                        '&:hover': {
                          boxShadow: `0 6px 25px ${theme.palette.primary.main}40`,
                        }
                      }}
                    >
                      {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default CreateAccount;