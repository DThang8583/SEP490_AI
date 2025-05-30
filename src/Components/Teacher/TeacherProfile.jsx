import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  Button,
  TextField,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  School as SchoolIcon,
  Key as KeyIcon,
  CameraAlt as CameraAltIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { keyframes } from '@mui/system';
import axios from 'axios';
import { format } from 'date-fns';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const TeacherProfile = () => {
  const { userInfo, updateUserInfo } = useAuth();
  const { isDarkMode } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    wardId: 0,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = React.useRef(null);
  const [usernameOrEmailInput, setUsernameOrEmailInput] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Lấy userId từ localStorage
        const userInfoStr = localStorage.getItem('userInfo');
        if (!userInfoStr) {
          setError('Không tìm thấy thông tin người dùng');
          setLoading(false);
          return;
        }
        
        const userInfoObj = JSON.parse(userInfoStr);
        const userId = userInfoObj.id;
        
        if (!userId) {
          setError('Không tìm thấy ID người dùng');
          setLoading(false);
          return;
        }
        
        // Lấy token
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setError('Vui lòng đăng nhập lại');
          setLoading(false);
          return;
        }
        
        // Gọi API lấy thông tin người dùng
        const response = await axios.get(
          `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users/${userId}/update`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
        
        if (response.data && response.data.code === 0 && response.data.data) {
          const userData = response.data.data;
          
          // Kiểm tra và cập nhật dateOfBirth
          const validDateOfBirth = userData.dateOfBirth === '01/01/0001' ? '2025-04-10' : userData.dateOfBirth;
          
          // Save gradeId to localStorage
          if (userData.grade) {
            localStorage.setItem('Grade', userData.grade);
          }
          console.log("gradeId",userData.grade)
          // Cập nhật profile với dữ liệu từ API
          setProfile({
            id: userData.userId,
            fullname: userData.fullname,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            address: userData.address,
            dateOfBirth: validDateOfBirth,
            gender: userData.gender === 1 ? 'Male' : 'Female',
            role: userData.role,
            school: userData.school,
            grade: userData.grade,
            imgURL: userData.imgURL,
            username: userData.username,
            manager: userData.manager,
            wardId: userData.wardId,
          });
          
          // Update AuthContext with the full user data including imgURL
          if (updateUserInfo) {
            updateUserInfo(userData);
          }
          
          // Cập nhật form data
          setFormData({
            fullName: userData.fullname,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            address: userData.address,
            dateOfBirth: validDateOfBirth,
            gender: userData.gender === 1 ? 'Male' : 'Female',
            wardId: userData.wardId,
          });
          
          setLoading(false);
        } else {
          throw new Error(response.data?.message || 'Có lỗi xảy ra');
        }
      } catch (error) {
        console.error('Error updating profile:', {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            data: error.config?.data
          }
        });
        setError(error.response?.data?.message || 'Không thể tải thông tin người dùng');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      // Lấy userId từ localStorage
      const userInfoStr = localStorage.getItem('userInfo');
      if (!userInfoStr) {
        setError('Không tìm thấy thông tin người dùng');
        return;
      }
      
      const userInfoObj = JSON.parse(userInfoStr);
      const userId = userInfoObj.id;
      
      if (!userId) {
        setError('Không tìm thấy ID người dùng');
        return;
      }
      
      // Lấy token
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('Vui lòng đăng nhập lại');
        return;
      }
      
      // Chuyển đổi định dạng dateOfBirth
      const dateObj = new Date(formData.dateOfBirth);

      if (isNaN(dateObj.getTime())) {
        setError('Ngày sinh không hợp lệ. Vui lòng nhập đúng định dạng.');
        return;
      }

      const formattedDateOfBirth = format(dateObj, 'yyyy-MM-dd');

      // Chuẩn bị dữ liệu gửi đi
      const updateData = {
        fullname: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        dateOfBirth: formattedDateOfBirth,
        gender: formData.gender === 'Male' ? 1 : 2,
        wardId: formData.wardId,
      };
      
      console.log(updateData);
      
      // Gọi API cập nhật thông tin
      const response = await axios.put(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users/${userId}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Check for success response
      if (response.status === 200 && response.data.code === 0 || response.data.code === 22) {
        setSuccess('Cập nhật thông tin thành công');
        setEditMode(false);
        
        // Cập nhật profile với dữ liệu mới
        setProfile(prev => ({
          ...prev,
          fullname: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          dateOfBirth: formattedDateOfBirth,
          gender: formData.gender === 'Male' ? 1 : 2,
        }));
      } else {
        setError(response.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin.');
      }
    } catch (error) {
      console.error('Error updating profile:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
      setError(error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật thông tin.');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Mật khẩu mới không khớp');
      return;
    }

    try {
      // Lấy username hoặc email từ trường nhập liệu
      if (!usernameOrEmailInput) {
          setError('Vui lòng nhập Username hoặc Email.');
          return;
      }
      const usernameOrEmail = usernameOrEmailInput;
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
          setError('Vui lòng đăng nhập lại để đổi mật khẩu.');
          return;
      }

      const response = await axios.put(
          'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users',
          {
              usernameOrEmail: usernameOrEmail,
              newPassword: passwordData.newPassword,
              confirmedPassword: passwordData.confirmPassword,
          },
          {
              headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
              },
          }
      );

      console.log('Change Password API Response:', response);
      console.log('Change Password API Response Code:', response.data?.code);

      // Giả định code 0 hoặc 22 là thành công dựa trên các API khác
      if (response.data && (response.data.code === 0 || response.data.code === 22)) {
        setSuccess('Đổi mật khẩu thành công');
        setChangePasswordMode(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        // Xóa thông báo lỗi nếu có
        setError('');
      } else {
        // Xử lý phản hồi lỗi từ API
        setError(response.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
        setSuccess(''); // Xóa thông báo thành công nếu có
      }

    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.response?.data?.message || 'Đã xảy ra lỗi khi gọi API đổi mật khẩu.');
      setSuccess(''); // Xóa thông báo thành công nếu có
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Kiểm tra kích thước file (giới hạn 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError('Kích thước ảnh không được vượt quá 5MB');
          return;
        }

        // Kiểm tra định dạng file
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          setError('Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF');
          return;
        }

        // Hiển thị preview ngay lập tức
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          // Cập nhật profile state tạm thời với ảnh mới để hiển thị ngay
          setProfile(prev => ({
            ...prev,
            imgURL: reader.result
          }));
          
          // Cập nhật AuthContext với ảnh mới ngay lập tức
          if (updateUserInfo) {
              updateUserInfo({
                  ...userInfo,
                  imgURL: reader.result
              });
          }
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('file', file);

        // Lấy token
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setError('Vui lòng đăng nhập lại để tải ảnh lên.');
          return;
        }

        console.log('Attempting image upload...');
        // Gọi API để tải ảnh lên
        const uploadResponse = await axios.post(
          `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users/profile-img`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        console.log('Upload API Response:', uploadResponse);
        console.log('Upload API Response Code:', uploadResponse.data?.code);

        // Check for success response (adjust based on actual API response structure)
        if (uploadResponse.status === 200 && (uploadResponse.data.code === 0 || uploadResponse.data.code === 22)) {
          console.log('Image upload successful, setting success state.');
          // Ảnh đã được hiển thị preview, chỉ cần hiển thị thông báo thành công từ API
          setSuccess('Cập nhật ảnh đại diện thành công');
          // Nếu API trả về URL ảnh mới, bạn có thể cập nhật lại state profile và AuthContext tại đây
          if (uploadResponse.data.data?.imgURL) {
            setProfile(prev => ({ ...prev, imgURL: uploadResponse.data.data.imgURL }));
            if (updateUserInfo) {
              updateUserInfo({
                ...userInfo,
                imgURL: uploadResponse.data.data.imgURL
              });
            }
          }
        } else {
          // Xử lý phản hồi lỗi từ API
          console.log('Image upload API returned error code/status.', uploadResponse.data);
          setError(uploadResponse.data?.message || 'Không thể tải ảnh lên.');
          // Có thể rollback ảnh preview về ảnh cũ nếu upload lỗi nặng
        }

      } catch (error) {
        console.error('Error uploading image:', error);
        setError(error.response?.data?.message || 'Đã xảy ra lỗi khi tải ảnh lên.');
        // Có thể rollback ảnh preview về ảnh cũ nếu có lỗi
      }
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgb(18, 18, 18) 0%, rgb(30, 30, 30) 100%)'
            : 'linear-gradient(135deg, rgb(248, 249, 250) 0%, rgb(255, 255, 255) 100%)',
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: isDarkMode ? '#ffffff' : '#2D3436',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CircularProgress size={24} />
          Đang tải thông tin...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgb(18, 18, 18) 0%, rgb(30, 30, 30) 100%)'
          : 'linear-gradient(135deg, rgb(248, 249, 250) 0%, rgb(255, 255, 255) 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: '24px',
            background: isDarkMode 
              ? 'rgba(30, 30, 30, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{
                fontWeight: 700,
                color: isDarkMode ? '#ffffff' : '#2D3436',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <PersonIcon sx={{ color: 'rgb(255, 107, 107)' }} />
              Thông tin cá nhân
            </Typography>
            <Box>
              <Button
                onClick={() => setChangePasswordMode(true)}
                startIcon={<KeyIcon />}
                sx={{
                  mr: 2,
                  color: isDarkMode ? '#ffffff' : '#2D3436',
                  textTransform: 'none',
                  borderRadius: '12px',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                Đổi mật khẩu
              </Button>
              {!editMode && (
                <IconButton 
                  onClick={handleEdit}
                  sx={{ 
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
              )}
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={imagePreview || profile?.imgURL || "/static/images/avatar/1.jpg"}
                  sx={{ 
                    width: 120, 
                    height: 120,
                    border: '4px solid rgb(255, 107, 107)',
                    animation: `${float} 3s ease-in-out infinite`,
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                  onClick={handleImageClick}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'rgb(255, 107, 107)',
                    borderRadius: '50%',
                    p: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgb(255, 82, 82)',
                    },
                  }}
                  onClick={handleImageClick}
                >
                  <CameraAltIcon sx={{ color: '#ffffff', fontSize: 20 }} />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2, 
                  mb: 3,
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  borderRadius: '12px',
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <SchoolIcon sx={{ color: 'rgb(255, 107, 107)' }} />
                  Vai trò: {profile?.role || 'N/A'}
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <SchoolIcon sx={{ color: 'rgb(255, 107, 107)' }} />
                  Trường học: {profile?.school || 'N/A'}
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <SchoolIcon sx={{ color: 'rgb(255, 107, 107)' }} />
                  Lớp: {profile?.grade || 'N/A'}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Họ và tên"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={!editMode}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'rgb(255, 107, 107)' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    '&:hover': {
                      backgroundColor: editMode ? (isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 'inherit',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!editMode}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'rgb(255, 107, 107)' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    '&:hover': {
                      backgroundColor: editMode ? (isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 'inherit',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                disabled={!editMode}
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1, color: 'rgb(255, 107, 107)' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    '&:hover': {
                      backgroundColor: editMode ? (isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 'inherit',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Địa chỉ"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!editMode}
                InputProps={{
                  startAdornment: <LocationIcon sx={{ mr: 1, color: 'rgb(255, 107, 107)' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    '&:hover': {
                      backgroundColor: editMode ? (isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 'inherit',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày sinh"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                disabled={!editMode}
                InputProps={{
                  startAdornment: <CalendarIcon sx={{ mr: 1, color: 'rgb(255, 107, 107)' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    '&:hover': {
                      backgroundColor: editMode ? (isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 'inherit',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Giới tính"
                value={formData.gender === 'Male' ? 'Nam' : 'Nữ'}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value === 'Nam' ? 'Male' : 'Female' })}
                disabled={!editMode}
                select
                InputProps={{
                  startAdornment: formData.gender === 'Male' ? (
                    <MaleIcon sx={{ mr: 1, color: 'rgb(255, 107, 107)' }} />
                  ) : (
                    <FemaleIcon sx={{ mr: 1, color: 'rgb(255, 107, 107)' }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    '&:hover': {
                      backgroundColor: editMode ? (isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 'inherit',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                  },
                }}
              >
                <MenuItem value="Nam">Nam</MenuItem>
                <MenuItem value="Nữ">Nữ</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {editMode && (
            <Grid item xs={12}>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => setEditMode(false)}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  Hủy
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSave}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    backgroundColor: 'rgb(255, 107, 107)',
                    '&:hover': {
                      backgroundColor: 'rgb(255, 82, 82)',
                      transform: 'translateY(-2px)',
                    },
                    boxShadow: '0 4px 20px rgba(255, 107, 107, 0.3)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Lưu thay đổi
                </Button>
              </Box>
            </Grid>
          )}
        </Paper>

        {/* Change Password Dialog */}
        <Dialog open={changePasswordMode} onClose={() => setChangePasswordMode(false)}>
          <DialogTitle>Đổi mật khẩu</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Username hoặc Email"
              value={usernameOrEmailInput}
              onChange={(e) => setUsernameOrEmailInput(e.target.value)}
              sx={{ mt: 1, mb: 2 }}
            />
            <TextField
              fullWidth
              label="Mật khẩu mới"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Xác nhận mật khẩu mới"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setChangePasswordMode(false)}>Hủy</Button>
            <Button onClick={handleChangePassword} variant="contained">
              Đổi mật khẩu
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={!!error || !!success}
          autoHideDuration={6000}
          onClose={() => {
            setError('');
            setSuccess('');
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => {
              setError('');
              setSuccess('');
            }}
            severity={error ? 'error' : 'success'}
            sx={{ width: '100%' }}
          >
            {error || success}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default TeacherProfile; 
