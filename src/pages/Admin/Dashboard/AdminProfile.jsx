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
  Card,
  CardContent,
  Tooltip,
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
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';

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
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
  position: 'relative',
  padding: theme.spacing(4, 0),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)'
      : 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
  backdropFilter: 'blur(20px)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '24px',
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)',
  animation: `${fadeIn} 0.6s ease-out`,
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  borderRadius: '24px',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(42, 42, 55, 0.9) 0%, rgba(42, 42, 55, 0.6) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 20px 40px rgba(102, 126, 234, 0.1)',
  overflow: 'hidden',
  position: 'relative',
  animation: `${fadeIn} 0.8s ease-out`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
  },
}));

const AvatarSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.02) 100%)'
    : 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.04) 100%)',
  borderRadius: '20px',
  margin: theme.spacing(2),
  animation: `${slideIn} 1s ease-out`,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 160,
  height: 160,
  border: `4px solid transparent`,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%) padding-box, linear-gradient(135deg, #667eea, #764ba2) border-box',
  marginBottom: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
  animation: `${float} 3s ease-in-out infinite`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
  },
}));

const CameraButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: 8,
  right: 8,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  width: 48,
  height: 48,
  border: `3px solid ${theme.palette.background.paper}`,
  '&:hover': {
    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    transform: 'scale(1.1)',
  },
  animation: `${pulse} 2s ease-in-out infinite`,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(255, 255, 255, 0.9)',
    },
    '&.Mui-focused': {
      background: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(255, 255, 255, 1)',
      boxShadow: '0 0 20px rgba(102, 126, 234, 0.3)',
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
  },
}));

const ActionButton = styled(Button)(({ theme, variant = 'default' }) => ({
  borderRadius: '16px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: 600,
  minWidth: '120px',
  transition: 'all 0.3s ease',
  ...(variant === 'primary' && {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
    },
  }),
  ...(variant === 'secondary' && {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.8)',
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(102, 126, 234, 0.3)'}`,
    '&:hover': {
      background: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(255, 255, 255, 1)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)',
    },
  }),
  ...(variant === 'danger' && {
    background: 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)',
    color: '#fff',
    boxShadow: '0 8px 25px rgba(255, 71, 87, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #ff3742 0%, #ff4757 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 35px rgba(255, 71, 87, 0.4)',
    },
  }),
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1e1e2e 0%, #2d2d3d 50%, #1e1e2e 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
}));

const ModernDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '24px',
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(42, 42, 55, 0.95) 0%, rgba(42, 42, 55, 0.9) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
    backdropFilter: 'blur(20px)',
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(102, 126, 234, 0.2)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  },
}));

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
  }, [userInfo, updateUserInfo]);

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

      if (formData.dateOfBirth && isNaN(dateObj.getTime())) {
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
          {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
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
      <LoadingContainer>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress 
            size={60} 
            sx={{ 
              color: '#fff', 
              mb: 3,
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))',
            }} 
          />
          <Typography variant="h5" sx={{ 
            color: '#fff',
            fontWeight: 600,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          }}>
            Đang tải thông tin...
          </Typography>
          <Typography variant="body1" sx={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            mt: 1,
          }}>
            Vui lòng chờ trong giây lát
          </Typography>
        </Box>
      </LoadingContainer>
    );
  }

  if (error && !success) {
    return (
        <PageContainer>
          <Container maxWidth="md">
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)',
                  border: '1px solid rgba(244, 67, 54, 0.3)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {error}
                </Typography>
              </Alert>
            </Box>
          </Container>
        </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <HeaderSection>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 3,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{
                width: 60,
                height: 60,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: '1.5rem',
              }}>
                <AccountCircleIcon sx={{ fontSize: '2rem' }} />
              </Avatar>
              <Box>
                <Typography variant="h3" sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5,
                }}>
                  Thông tin tài khoản
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 500,
                }}>
                  Quản lý thông tin cá nhân và bảo mật
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {!editMode && (
                <Tooltip title="Chỉnh sửa thông tin">
                  <ActionButton
                    variant="secondary"
                    onClick={handleEdit}
                    startIcon={<EditIcon />}
                  >
                    Chỉnh sửa
                  </ActionButton>
                </Tooltip>
              )}
              <Tooltip title="Đổi mật khẩu">
                <ActionButton
                  variant="primary"
                  onClick={() => setChangePasswordMode(true)}
                  startIcon={<LockIcon />}
                >
                  Đổi mật khẩu
                </ActionButton>
              </Tooltip>
            </Box>
          </Box>
        </HeaderSection>

        <ProfileCard>
          <CardContent sx={{ p: 0 }}>
            <Grid container>
              <Grid item xs={12} md={4}>
                <AvatarSection>
                  <Box sx={{ position: 'relative' }}>
                    <StyledAvatar
                      src={imagePreview || profile?.imgURL || "/static/images/avatar/1.jpg"}
                    >
                      <PersonIcon sx={{ fontSize: 80 }} />
                    </StyledAvatar>
                    {editMode && (
                      <CameraButton onClick={handleImageClick}>
                        <CameraAltIcon />
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          style={{ display: 'none' }}
                        />
                      </CameraButton>
                    )}
                  </Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 1,
                    textAlign: 'center',
                  }}>
                    {profile?.fullname || 'N/A'}
                  </Typography>
                  <Typography variant="h6" sx={{
                    color: 'text.secondary',
                    mb: 1,
                    textAlign: 'center',
                  }}>
                    {profile?.role || 'N/A'}
                  </Typography>
                  {profile?.school && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      mt: 2,
                    }}>
                      <SchoolIcon sx={{ color: '#667eea' }} />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profile.school}
                      </Typography>
                    </Box>
                  )}
                </AvatarSection>
              </Grid>

              <Grid item xs={12} md={8}>
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700,
                    mb: 3,
                    color: 'text.primary',
                  }}>
                    Thông tin chi tiết
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Họ và tên"
                        value={formData.fullname}
                        onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: <PersonIcon sx={{ mr: 1, color: theme.palette.action.active }} />,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: <EmailIcon sx={{ mr: 1, color: theme.palette.action.active }} />,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Số điện thoại"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: <PhoneIcon sx={{ mr: 1, color: theme.palette.action.active }} />,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Ngày sinh"
                        type={editMode ? "date" : "text"}
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: <CalendarIcon sx={{ mr: 1, color: theme.palette.action.active }} />,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <StyledTextField
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
                      >
                        <MenuItem value={1}>Nam</MenuItem>
                        <MenuItem value={2}>Nữ</MenuItem>
                      </StyledTextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Địa chỉ"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: <LocationIcon sx={{ mr: 1, color: theme.palette.action.active }} />,
                        }}
                      />
                    </Grid>
                  </Grid>

                  {editMode && (
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <ActionButton 
                        variant="secondary" 
                        onClick={() => setEditMode(false)}
                        startIcon={<CancelIcon />}
                      >
                        Hủy
                      </ActionButton>
                      <ActionButton 
                        variant="primary" 
                        onClick={handleSave}
                        startIcon={<SaveIcon />}
                      >
                        Lưu thay đổi
                      </ActionButton>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </ProfileCard>

        {/* Change Password Dialog */}
        <ModernDialog 
          open={changePasswordMode} 
          onClose={() => setChangePasswordMode(false)} 
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            textAlign: 'center',
            py: 3,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <LockIcon />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Đổi mật khẩu
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2 }}>
             <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
               Vui lòng nhập thông tin để đổi mật khẩu tài khoản của bạn.
             </Typography>
            <StyledTextField
              fullWidth
              label="Username hoặc Email"
              value={usernameOrEmailInput}
              onChange={(e) => setUsernameOrEmailInput(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <AccountCircleIcon sx={{ mr: 1, color: theme.palette.action.active }} />,
              }}
            />
            <StyledTextField
              fullWidth
              label="Mật khẩu mới"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: theme.palette.action.active }} />,
              }}
            />
            <StyledTextField
              fullWidth
              label="Xác nhận mật khẩu mới"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: theme.palette.action.active }} />,
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <ActionButton 
              variant="secondary" 
              onClick={() => setChangePasswordMode(false)}
              startIcon={<CancelIcon />}
            >
              Hủy
            </ActionButton>
            <ActionButton 
              variant="primary" 
              onClick={handleChangePassword}
              startIcon={<KeyIcon />}
            >
              Đổi mật khẩu
            </ActionButton>
          </DialogActions>
        </ModernDialog>

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
            sx={{ 
              width: '100%',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
            }}
          >
            {error || success}
          </Alert>
        </Snackbar>
      </Container>
    </PageContainer>
  );
};

export default AdminProfile; 