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
  useTheme
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateAccount = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
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
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      errors.password = 'Mật khẩu phải chứa ít nhất 1 chữ hoa';
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
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
          schoolId: '',
          gradeId: '',
        });
        setValidationErrors({});
      } else {
        console.log('Error response data:', response.data);
        setError('Có lỗi xảy ra khi tạo tài khoản.');
      }
    } catch (err) {
      console.log('Error response:', err.response?.data);
      console.log('Error details:', err);
      setError('Không thể tạo tài khoản. Vui lòng thử lại sau.');
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: 'calc(100vh - 64px)',
        background: isDarkMode
          ? theme.palette.background.default
          : 'linear-gradient(135deg, rgb(245, 247, 250) 0%, rgb(255, 255, 255) 100%)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            color: isDarkMode ? theme.palette.text.primary : 'rgb(102, 102, 102)',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          Quay lại
        </Button>
        <Typography variant="h4" component="h1" sx={{ color: theme.palette.text.primary }}>
          Tạo Tài Khoản Mới
        </Typography>
      </Box>
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Paper
        sx={{
          p: 3,
          backgroundColor: isDarkMode ? theme.palette.background.paper : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${isDarkMode ? theme.palette.divider : 'rgba(0, 0, 0, 0.08)'}`,
          borderRadius: '12px',
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
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
                  '& .MuiInputLabel-root': {
                    color: theme.palette.text.secondary,
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? theme.palette.divider : '#d0d0d0',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '& input': {
                      color: theme.palette.text.primary,
                    },
                  },
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
                  '& .MuiInputLabel-root': {
                    color: theme.palette.text.secondary,
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? theme.palette.divider : '#d0d0d0',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '& input': {
                      color: theme.palette.text.primary,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mật khẩu"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: theme.palette.text.secondary,
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? theme.palette.divider : '#d0d0d0',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '& input': {
                      color: theme.palette.text.primary,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!validationErrors.roleId}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: theme.palette.text.secondary,
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? theme.palette.divider : '#d0d0d0',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '& .MuiSelect-select': {
                      color: theme.palette.text.primary,
                    },
                  },
                }}
              >
                <InputLabel>Vai trò</InputLabel>
                <Select
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                  label="Vai trò"
                >
                  {roles.map((role) => (
                    <MenuItem key={role.roleId} value={role.roleId}
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {role.roleName}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.roleId && (
                  <Typography color="error" variant="caption">
                    {validationErrors.roleId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!validationErrors.gradeId}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: theme.palette.text.secondary,
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? theme.palette.divider : '#d0d0d0',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                     '& .MuiSelect-select': {
                      color: theme.palette.text.primary,
                    },
                  },
                }}
              >
                <InputLabel>Khối</InputLabel>
                <Select
                  name="gradeId"
                  value={formData.gradeId}
                  onChange={handleChange}
                  label="Khối"
                >
                  {grades.map((grade) => (
                    <MenuItem key={grade.gradeId} value={grade.gradeId}
                      sx={{ color: theme.palette.text.primary }}
                    >
                      Khối {grade.gradeNumber}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.gradeId && (
                  <Typography color="error" variant="caption">
                    {validationErrors.gradeId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Trường học"
                value={schoolInfo ? `${schoolInfo.name} - ${schoolInfo.description}` : 'Đang tải...'}
                disabled
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: isDarkMode ? theme.palette.text.secondary : 'rgba(0, 0, 0, 0.6)',
                  },
                  '& .MuiInputLabel-root': {
                    color: theme.palette.text.secondary,
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? theme.palette.divider : '#d0d0d0',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  mt: 2,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                Tạo Tài Khoản
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateAccount;