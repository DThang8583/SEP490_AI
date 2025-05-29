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
  useTheme
} from '@mui/material/styles';
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
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';

const AdminProfile = () => {
  const theme = useTheme();
  const { userInfo, updateUserInfo } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
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
  const fileInputRef = useRef(null);
  const [usernameOrEmailInput, setUsernameOrEmailInput] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
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
        
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setError('Vui lòng đăng nhập lại');
          setLoading(false);
          return;
        }
        
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
          
          const validDateOfBirth = userData.dateOfBirth === '01/01/0001' ? '' : format(new Date(userData.dateOfBirth), 'yyyy-MM-dd');
          
          setProfile({
            id: userData.userId,
            fullname: userData.fullname,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            address: userData.address,
            dateOfBirth: validDateOfBirth,
            gender: userData.gender,
            role: userData.role,
            school: userData.school,
            grade: userData.grade,
            imgURL: userData.imgURL,
            username: userData.username,
            manager: userData.manager,
            wardId: userData.wardId,
          });
          
          if (updateUserInfo) {
            updateUserInfo(userData);
          }
          
          setFormData({
            fullname: userData.fullname,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            address: userData.address,
            dateOfBirth: validDateOfBirth,
            gender: userData.gender,
            wardId: userData.wardId,
          });
          
          setLoading(false);
        } else {
          throw new Error(response.data?.message || 'Có lỗi xảy ra');
        }
      } catch (error) {
        console.error('Error fetching admin profile:', error);
        setError(error.response?.data?.message || 'Không thể tải thông tin người dùng');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userInfo, updateUserInfo]); // Added userInfo and updateUserInfo to dependencies

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
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
      
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('Vui lòng đăng nhập lại');
        return;
      }
      
      const dateObj = new Date(formData.dateOfBirth);

      if (formData.dateOfBirth && isNaN(dateObj.getTime())) { // Check if dateOfBirth is not empty before validating
        setError('Ngày sinh không hợp lệ. Vui lòng nhập đúng định dạng YYYY-MM-DD.');
        return;
      }

      const formattedDateOfBirth = formData.dateOfBirth ? format(dateObj, 'yyyy-MM-dd') : '';

      const updateData = {
        fullname: formData.fullname,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        dateOfBirth: formattedDateOfBirth,
        gender: formData.gender,
        wardId: formData.wardId,
      };
      
      console.log('Update Data:', updateData);
      
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

      if (response.status === 200 && response.data.code === 0 || response.data.code === 22) {
        setSuccess('Cập nhật thông tin thành công');
        setEditMode(false);
        
        setProfile(prev => ({
          ...prev,
          fullname: formData.fullname,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          dateOfBirth: formattedDateOfBirth,
          gender: formData.gender,
        }));
        
        // Update AuthContext with the new data
        if (updateUserInfo) {
            updateUserInfo(prevUserInfo => ({
                ...prevUserInfo,
                fullname: formData.fullname,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                dateOfBirth: formattedDateOfBirth,
                gender: formData.gender,
            }));
        }

      } else {
        setError(response.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin.');
      }
    } catch (error) {
      console.error('Error updating admin profile:', error);
      setError(error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật thông tin.');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Mật khẩu mới không khớp');
      return;
    }

    try {
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
          { // Adding current password to request if needed by API
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            // If API requires current password in body:
            // data: { ...AboveData, currentPassword: passwordData.currentPassword }
          }
      );

      console.log('Change Password API Response:', response);
      console.log('Change Password API Response Code:', response.data?.code);

      if (response.data && (response.data.code === 0 || response.data.code === 22)) {
        setSuccess('Đổi mật khẩu thành công');
        setChangePasswordMode(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setError('');
      } else {
        setError(response.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
        setSuccess('');
      }

    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.response?.data?.message || 'Đã xảy ra lỗi khi gọi API đổi mật khẩu.');
      setSuccess('');
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        if (file.size > 5 * 1024 * 1024) {
          setError('Kích thước ảnh không được vượt quá 5MB');
          return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          setError('Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF');
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setProfile(prev => ({ ...prev, imgURL: reader.result }));
          
          if (updateUserInfo) {
              updateUserInfo(prevUserInfo => ({
                  ...prevUserInfo,
                  imgURL: reader.result
              }));
          }
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('file', file);

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setError('Vui lòng đăng nhập lại để tải ảnh lên.');
          return;
        }

        console.log('Attempting image upload...');
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

        if (uploadResponse.status === 200 && (uploadResponse.data.code === 0 || uploadResponse.data.code === 22)) {
          console.log('Image upload successful.');
          setSuccess('Cập nhật ảnh đại diện thành công');
          if (uploadResponse.data.data?.imgURL) {
            setProfile(prev => ({ ...prev, imgURL: uploadResponse.data.data.imgURL }));
             if (updateUserInfo) {
              updateUserInfo(prevUserInfo => ({
                ...prevUserInfo,
                imgURL: uploadResponse.data.data.imgURL
              }));
            }
          }
        } else {
          console.log('Image upload API returned error.', uploadResponse.data);
          setError(uploadResponse.data?.message || 'Không thể tải ảnh lên.');
        }

      } catch (error) {
        console.error('Error uploading image:', error);
        setError(error.response?.data?.message || 'Đã xảy ra lỗi khi tải ảnh lên.');
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
          minHeight: 'calc(100vh - 64px)', // Adjust for AppBar height
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={40} sx={{ color: theme.palette.primary.main, mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Đang tải thông tin...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error && !success) { // Only show error if not also showing success
    return (
        <Box sx={{
            p: 3,
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: theme.palette.background.default,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Alert severity="error" sx={{ mb: 3 }}>
                {error}
            </Alert>
        </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)', // Adjust for AppBar height
        backgroundColor: theme.palette.background.default,
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <AccountCircleIcon sx={{ fontSize: 36, color: theme.palette.primary.main }} />
              Thông tin tài khoản
            </Typography>
            <Box>
              {!editMode && (
                <Button
                  variant="outlined"
                  onClick={handleEdit}
                  startIcon={<EditIcon />}
                  sx={{
                    mr: 2,
                    textTransform: 'none',
                    borderRadius: theme.shape.borderRadius,
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.divider,
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  Chỉnh sửa
                </Button>
              )}
              <Button
                variant="outlined"
                onClick={() => setChangePasswordMode(true)}
                startIcon={<LockIcon />}
                sx={{
                  textTransform: 'none',
                  borderRadius: theme.shape.borderRadius,
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.divider,
                   '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                Đổi mật khẩu
              </Button>
            </Box>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Avatar
                  src={imagePreview || profile?.imgURL || "/static/images/avatar/1.jpg"}
                  sx={{
                    width: 150,
                    height: 150,
                    border: `3px solid ${theme.palette.primary.main}`,
                  }}
                >
                  <PersonIcon sx={{ fontSize: 80 }} />
                </Avatar>
                {editMode && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 5,
                      right: 5,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '50%',
                      p: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                      display: 'flex', // Use flex to center icon
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={handleImageClick}
                  >
                    <CameraAltIcon sx={{ color: theme.palette.common.white, fontSize: 20 }} />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                  </Box>
                )}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 0.5 }}>
                {profile?.fullname || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile?.role || 'N/A'}
              </Typography>
               {profile?.school && (
                 <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                   <SchoolIcon fontSize="small" /> {profile.school}
                 </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: theme.palette.action.active }} />,
                    }}
                    variant={editMode ? "outlined" : "standard"}
                    sx={{
                        '& .MuiInputBase-input': { // Target both outlined and standard input
                            color: theme.palette.text.primary,
                        },
                         '& .MuiInputLabel-root': {
                            color: theme.palette.text.secondary,
                        },
                         '& .MuiInput-underline:before': { // Standard variant underline
                            borderBottomColor: theme.palette.divider,
                        },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                            borderBottomColor: theme.palette.text.primary,
                        },
                        '& .MuiOutlinedInput-notchedOutline': { // Outlined variant border
                            borderColor: theme.palette.divider,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                             borderColor: editMode ? theme.palette.primary.main : theme.palette.divider,
                         },
                         '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                             borderColor: theme.palette.primary.main,
                         },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!editMode}
                     InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: theme.palette.action.active }} />,
                    }}
                    variant={editMode ? "outlined" : "standard"}
                     sx={{
                        '& .MuiInputBase-input': {
                            color: theme.palette.text.primary,
                        },
                         '& .MuiInputLabel-root': {
                            color: theme.palette.text.secondary,
                        },
                         '& .MuiInput-underline:before': {
                            borderBottomColor: theme.palette.divider,
                        },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                            borderBottomColor: theme.palette.text.primary,
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider,
                        },
                         '&:hover .MuiOutlinedInput-notchedOutline': {
                             borderColor: editMode ? theme.palette.primary.main : theme.palette.divider,
                         },
                         '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                             borderColor: theme.palette.primary.main,
                         },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    disabled={!editMode}
                     InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: theme.palette.action.active }} />,
                    }}
                    variant={editMode ? "outlined" : "standard"}
                     sx={{
                        '& .MuiInputBase-input': {
                            color: theme.palette.text.primary,
                        },
                         '& .MuiInputLabel-root': {
                            color: theme.palette.text.secondary,
                        },
                         '& .MuiInput-underline:before': {
                            borderBottomColor: theme.palette.divider,
                        },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                            borderBottomColor: theme.palette.text.primary,
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider,
                        },
                         '&:hover .MuiOutlinedInput-notchedOutline': {
                             borderColor: editMode ? theme.palette.primary.main : theme.palette.divider,
                         },
                         '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                             borderColor: theme.palette.primary.main,
                         },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!editMode}
                     InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: theme.palette.action.active }} />,
                    }}
                    variant={editMode ? "outlined" : "standard"}
                     sx={{
                        '& .MuiInputBase-input': {
                            color: theme.palette.text.primary,
                        },
                         '& .MuiInputLabel-root': {
                            color: theme.palette.text.secondary,
                        },
                         '& .MuiInput-underline:before': {
                            borderBottomColor: theme.palette.divider,
                        },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                            borderBottomColor: theme.palette.text.primary,
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider,
                        },
                         '&:hover .MuiOutlinedInput-notchedOutline': {
                             borderColor: editMode ? theme.palette.primary.main : theme.palette.divider,
                         },
                         '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                             borderColor: theme.palette.primary.main,
                         },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    type={editMode ? "date" : "text"}
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    disabled={!editMode}
                     InputProps={{
                      startAdornment: <CalendarIcon sx={{ mr: 1, color: theme.palette.action.active }} />,
                    }}
                    variant={editMode ? "outlined" : "standard"}
                     sx={{
                        '& .MuiInputBase-input': {
                            color: theme.palette.text.primary,
                        },
                         '& .MuiInputLabel-root': {
                            color: theme.palette.text.secondary,
                        },
                         '& .MuiInput-underline:before': {
                            borderBottomColor: theme.palette.divider,
                        },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                            borderBottomColor: theme.palette.text.primary,
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider,
                        },
                         '&:hover .MuiOutlinedInput-notchedOutline': {
                             borderColor: editMode ? theme.palette.primary.main : theme.palette.divider,
                         },
                         '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                             borderColor: theme.palette.primary.main,
                         },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                   <TextField
                    fullWidth
                    label="Giới tính"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: parseInt(e.target.value, 10) })}
                    disabled={!editMode}
                    select
                    InputProps={{
                      startAdornment: formData.gender === 1 ? (
                        <MaleIcon sx={{ mr: 1, color: theme.palette.action.active }} />
                      ) : (
                        <FemaleIcon sx={{ mr: 1, color: theme.palette.action.active }} />
                      ),
                    }}
                    variant={editMode ? "outlined" : "standard"}
                     sx={{
                        '& .MuiInputBase-input': {
                            color: theme.palette.text.primary,
                        },
                         '& .MuiInputLabel-root': {
                            color: theme.palette.text.secondary,
                        },
                         '& .MuiInput-underline:before': {
                            borderBottomColor: theme.palette.divider,
                        },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                            borderBottomColor: theme.palette.text.primary,
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider,
                        },
                         '&:hover .MuiOutlinedInput-notchedOutline': {
                             borderColor: editMode ? theme.palette.primary.main : theme.palette.divider,
                         },
                         '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                             borderColor: theme.palette.primary.main,
                         },
                    }}
                  >
                    <MenuItem value={1}>Nam</MenuItem>
                    <MenuItem value={2}>Nữ</MenuItem>
                  </TextField>
                </Grid>
              </Grid>

              {editMode && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => setEditMode(false)}
                     sx={{
                      borderRadius: theme.shape.borderRadius,
                      textTransform: 'none',
                       color: theme.palette.text.primary,
                      borderColor: theme.palette.divider,
                       '&:hover': {
                         borderColor: theme.palette.primary.main,
                         backgroundColor: theme.palette.action.hover,
                       },
                     }}
                  >
                    Hủy
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={handleSave}
                    sx={{
                      borderRadius: theme.shape.borderRadius,
                      textTransform: 'none',
                      backgroundColor: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Lưu thay đổi
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>

        {/* Change Password Dialog */}
        <Dialog open={changePasswordMode} onClose={() => setChangePasswordMode(false)} PaperProps={{ sx: { borderRadius: theme.shape.borderRadius } }}>
          <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
            Đổi mật khẩu
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
             <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
               Vui lòng nhập thông tin để đổi mật khẩu.
             </Typography>
            <TextField
              fullWidth
              label="Username hoặc Email"
              value={usernameOrEmailInput}
              onChange={(e) => setUsernameOrEmailInput(e.target.value)}
              sx={{ mb: 2 }}
              variant="outlined"
               InputProps={{
                  startAdornment: <AccountCircleIcon sx={{ mr: 1, color: theme.palette.action.active }} />,
                }}
            />
            <TextField
              fullWidth
              label="Mật khẩu mới"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              sx={{ mb: 2 }}
              variant="outlined"
               InputProps={{
                  startAdornment: <LockIcon sx={{ mr: 1, color: theme.palette.action.active }} />,
                }}
            />
            <TextField
              fullWidth
              label="Xác nhận mật khẩu mới"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              variant="outlined"
               InputProps={{
                  startAdornment: <LockIcon sx={{ mr: 1, color: theme.palette.action.active }} />,
                }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Button onClick={() => setChangePasswordMode(false)}>
              Hủy
            </Button>
            <Button onClick={handleChangePassword} variant="contained" color="primary">
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

export default AdminProfile; 