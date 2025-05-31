import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Typography,
    Button,
    Divider,
    Box,
    Avatar,
    Grid,
    CircularProgress,
    Fade,
    Alert,
    Card,
    CardContent,
    Snackbar,
    IconButton,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { Edit, Lock, Person, Email, Phone, Cake, School, LocationOn, SupervisorAccount, Badge, Class, CameraAlt, Save, Cancel } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '@mui/material/styles';

const Profile = ({ sidebarOpen }) => {
    const { userInfo, updateUserInfo } = useAuth();
    const theme = useTheme();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        fullname: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: 1,
        address: ''
    });
    const [updateLoading, setUpdateLoading] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const sidebarWidth = sidebarOpen ? 60 : 240;

    // Convert DD/MM/YYYY to YYYY-MM-DD
    const convertDateToAPI = (dateStr) => {
        if (!dateStr) return '';
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        return dateStr;
    };

    // Convert YYYY-MM-DD to DD/MM/YYYY
    const convertDateFromAPI = (dateStr) => {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
    };

    // Convert gender string to number
    const convertGenderToAPI = (genderStr) => {
        if (genderStr === 'Male' || genderStr === 'Nam') return 1;
        if (genderStr === 'Female' || genderStr === 'Nữ') return 2;
        return 1; // default
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));

                if (!accessToken || !userInfo || !userInfo.id) {
                    setError('Vui lòng đăng nhập để xem thông tin cá nhân.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users/${userInfo.id}`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );

                const userData = response.data.data;
                setProfile(userData);

                // Initialize edit data
                setEditData({
                    fullname: userData.fullname || '',
                    email: userData.email || '',
                    phoneNumber: userData.phoneNumber || '',
                    dateOfBirth: convertDateToAPI(userData.dateOfBirth) || '',
                    gender: convertGenderToAPI(userData.gender),
                    address: userData.address || ''
                });

                if (userData.grade && !isNaN(userData.grade)) {
                    const gradeResponse = await axios.get(
                        'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades'
                    );
                    const grades = gradeResponse.data.data;
                    const userGrade = grades.find((g) => g.gradeId === userData.grade)?.gradeNumber || userData.grade;
                    userData.gradeNumber = userGrade;
                }
            } catch (err) {
                console.error('Lỗi khi lấy thông tin hồ sơ:', err);
                setError('Không thể tải thông tin. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEditToggle = () => {
        console.log('Edit button clicked, current isEditing:', isEditing);
        if (isEditing) {
            // Reset form data when canceling
            setEditData({
                fullname: profile.fullname || '',
                email: profile.email || '',
                phoneNumber: profile.phoneNumber || '',
                dateOfBirth: convertDateToAPI(profile.dateOfBirth) || '',
                gender: convertGenderToAPI(profile.gender),
                address: profile.address || ''
            });
        }
        setIsEditing(!isEditing);
        setError('');
        setSuccess('');
        console.log('Set isEditing to:', !isEditing);
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            setUpdateLoading(true);
            setError('');
            setSuccess('');

            const accessToken = localStorage.getItem('accessToken');
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));

            if (!accessToken || !userInfo || !userInfo.id) {
                setError('Vui lòng đăng nhập để cập nhật thông tin.');
                return;
            }

            const updatePayload = {
                fullname: editData.fullname,
                email: editData.email,
                phoneNumber: editData.phoneNumber,
                dateOfBirth: editData.dateOfBirth, // Already in YYYY-MM-DD format
                gender: editData.gender, // 1 or 2
                address: editData.address
            };

            console.log('Update payload:', updatePayload);

            const response = await axios.put(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users/${userInfo.id}/update`,
                updatePayload,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            console.log('Update response:', response);

            if (response.status === 200 && response.data.code === 0) {
                // Update local profile state
                const updatedProfile = {
                    ...profile,
                    fullname: editData.fullname,
                    email: editData.email,
                    phoneNumber: editData.phoneNumber,
                    dateOfBirth: convertDateFromAPI(editData.dateOfBirth),
                    gender: editData.gender === 1 ? 'Male' : 'Female',
                    address: editData.address
                };
                setProfile(updatedProfile);

                // Update AuthContext
                if (updateUserInfo && userInfo) {
                    updateUserInfo({
                        ...userInfo,
                        fullname: editData.fullname,
                        email: editData.email
                    });
                }

                setSuccess('Cập nhật thông tin thành công!');
                setIsEditing(false);
            } else {
                setError(response.data?.message || 'Không thể cập nhật thông tin.');
            }

        } catch (err) {
            console.error('Lỗi khi cập nhật thông tin:', err);
            setError(err.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật thông tin.');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        try {
            // Kiểm tra kích thước file (giới hạn 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Kích thước ảnh không được vượt quá 5MB');
                setSuccess('');
                return;
            }

            // Kiểm tra định dạng file
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setError('Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF');
                setSuccess('');
                return;
            }

            // Hiển thị preview ngay lập tức
            const reader = new FileReader();
            reader.onloadend = () => {
                // setImagePreview(reader.result); // Profile.jsx không có state imagePreview, cập nhật trực tiếp profile
                // Cập nhật profile state tạm thời với ảnh mới để hiển thị ngay
                setProfile(prev => ({
                    ...prev,
                    imgURL: reader.result
                }));

                // Cập nhật AuthContext với ảnh mới ngay lập tức
                if (updateUserInfo && userInfo) {
                    updateUserInfo({ ...userInfo, imgURL: reader.result });
                }
            };
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('file', file);

            const accessToken = localStorage.getItem('accessToken');
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));

            const uploadResponse = await axios.post(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users/profile-img`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            console.log('Upload API Response:', uploadResponse);
            console.log('Upload API Response Code:', uploadResponse.data?.code);

            // Check for success response (adjust based on actual API response structure)
            if (uploadResponse.status === 200 && (uploadResponse.data.code === 0 || uploadResponse.data.code === 22)) {
                console.log('Image upload successful.');
                setSuccess('Cập nhật ảnh đại diện thành công');
                setError(''); // Clear error message
                // Nếu API trả về URL ảnh mới, bạn có thể cập nhật lại state profile và AuthContext tại đây
                if (uploadResponse.data.data?.imgURL) {
                    setProfile(prev => ({ ...prev, imgURL: uploadResponse.data.data.imgURL }));
                    if (updateUserInfo && userInfo) {
                        updateUserInfo({ ...userInfo, imgURL: uploadResponse.data.data.imgURL });
                    }
                }
            } else {
                // Xử lý phản hồi lỗi từ API
                console.log('Image upload API returned error code/status.', uploadResponse.data);
                setError(uploadResponse.data?.message || 'Không thể tải ảnh lên.');
                setSuccess(''); // Clear success message
                // Có thể rollback ảnh preview về ảnh cũ nếu upload lỗi nặng
                // Để rollback, bạn cần lưu ảnh cũ trước khi set preview
            }

        } catch (err) {
            console.error('Lỗi khi tải ảnh lên:', err);
            setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải ảnh lên.');
            setSuccess(''); // Clear success message
        }
    };

    const ProfileItem = ({ icon, label, value, isEditing, field, type = 'text', options }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
            <Box sx={{
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'rgba(6, 169, 174, 0.1)',
                color: '#06A9AE'
            }}>
                {icon}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    {label}
                </Typography>
                {isEditing && field ? (
                    type === 'select' ? (
                        <FormControl fullWidth variant="outlined" size="small" sx={{ mt: 0.5 }}>
                            <Select
                                value={editData[field]}
                                onChange={(e) => handleInputChange(field, e.target.value)}
                                sx={{ 
                                    minWidth: 120,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1
                                    }
                                }}
                            >
                                {options?.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : (
                        <TextField
                            value={editData[field]}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            type={type}
                            fullWidth
                            variant="outlined"
                            size="small"
                            sx={{ 
                                mt: 0.5,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1
                                }
                            }}
                        />
                    )
                ) : (
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {value || 'N/A'}
                    </Typography>
                )}
            </Box>
        </Box>
    );

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                    : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1100,
                overflowY: 'auto',
                display: 'flex',
                alignItems: 'center',
                padding: '20px',
            }}
        >
            <Fade in={!loading}>
                <Box
                    sx={{
                        py: 2,
                        ml: `${sidebarWidth}px`,
                        transition: 'margin-left 0.3s ease',
                        width: '100%',
                    }}
                >
                    <Container maxWidth="lg" sx={{ py: 2 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                                <CircularProgress size={50} sx={{ color: '#06A9AE' }} />
                            </Box>
                        ) : error ? (
                            <Alert
                                severity="error"
                                sx={{
                                    maxWidth: 'sm',
                                    mx: 'auto',
                                    borderRadius: 2,
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                {error}
                            </Alert>
                        ) : (
                            <Card
                                elevation={6}
                                sx={{
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    background: theme.palette.mode === 'dark'
                                        ? 'rgba(33, 33, 33, 0.95)'
                                        : 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: theme.palette.mode === 'dark'
                                        ? '0 10px 40px rgba(0, 0, 0, 0.3)'
                                        : '0 10px 40px rgba(31, 38, 135, 0.15)',
                                    maxWidth: '1000px',
                                    margin: '0 auto',
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: 160,
                                        background: 'linear-gradient(120deg, #06A9AE 0%, #0089a3 100%)',
                                        overflow: 'visible',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        pt: 2,
                                        pb: 4,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                                        }}
                                    />

                                    <Typography
                                        variant="h4"
                                        sx={{
                                            color: 'white',
                                            fontWeight: 700,
                                            textAlign: 'center',
                                            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                            zIndex: 2,
                                            mt: 1,
                                        }}
                                    >
                                        Thông tin cá nhân
                                    </Typography>

                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: -70,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            zIndex: 10,
                                        }}
                                    >
                                        <Box sx={{ position: 'relative', mb: 1 }}>
                                            <Avatar
                                                src={profile?.imgURL || 'https://via.placeholder.com/150'}
                                                alt="Ảnh đại diện"
                                                sx={{
                                                    width: 120,
                                                    height: 120,
                                                    border: '5px solid white',
                                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    backgroundColor: 'white',
                                                    '&:hover': {
                                                        transform: 'scale(1.05)',
                                                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                                                    },
                                                }}
                                                onClick={() => fileInputRef.current.click()}
                                            />

                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 8,
                                                    right: 8,
                                                    backgroundColor: '#06A9AE',
                                                    borderRadius: '50%',
                                                    width: 36,
                                                    height: 36,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                                    border: '2px solid white',
                                                    transition: 'all 0.3s ease',
                                                    zIndex: 1,
                                                    '&:hover': {
                                                        backgroundColor: '#048b8f',
                                                        transform: 'scale(1.1)',
                                                    },
                                                }}
                                                onClick={() => fileInputRef.current.click()}
                                            >
                                                <CameraAlt sx={{ fontSize: 18, color: 'white' }} />
                                            </Box>
                                        </Box>

                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<CameraAlt />}
                                            onClick={() => fileInputRef.current.click()}
                                            sx={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                color: '#06A9AE',
                                                fontSize: '0.8rem',
                                                py: 0.8,
                                                px: 2,
                                                borderRadius: '25px',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                                                border: '1px solid rgba(6, 169, 174, 0.2)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: '#06A9AE',
                                                    color: 'white',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 6px 20px rgba(6, 169, 174, 0.3)',
                                                },
                                            }}
                                        >
                                            Thay đổi ảnh đại diện
                                        </Button>

                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                        />
                                    </Box>
                                </Box>

                                <CardContent sx={{
                                    pt: 12,
                                    px: { xs: 2, sm: 3 },
                                    pb: 2
                                }}>
                                    <Box sx={{ mt: { xs: 2, sm: 1 }, mb: 3, textAlign: 'center' }}>
                                        <Typography variant="h4" sx={{
                                            fontWeight: 700,
                                            mb: 0.5,
                                            color: theme.palette.mode === 'dark' ? '#fff' : '#1a1a1a'
                                        }}>
                                            {profile.fullname}
                                        </Typography>
                                        <Typography variant="h6" sx={{
                                            color: '#06A9AE',
                                            fontWeight: 500,
                                            mb: 1
                                        }}>
                                            {profile.role}
                                        </Typography>
                                        <Typography variant="body1" sx={{
                                            color: 'text.secondary',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1
                                        }}>
                                            <School sx={{ fontSize: 18 }} />
                                            {profile.school}
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Box>
                                                <ProfileItem
                                                    icon={<Person />}
                                                    label="Họ và tên"
                                                    value={profile.fullname}
                                                    isEditing={isEditing}
                                                    field="fullname"
                                                />
                                                <ProfileItem
                                                    icon={<Email />}
                                                    label="Email"
                                                    value={profile.email}
                                                    isEditing={isEditing}
                                                    field="email"
                                                    type="email"
                                                />
                                                <ProfileItem
                                                    icon={<Phone />}
                                                    label="Số điện thoại"
                                                    value={profile.phoneNumber}
                                                    isEditing={isEditing}
                                                    field="phoneNumber"
                                                />
                                                <ProfileItem
                                                    icon={<Cake />}
                                                    label="Ngày sinh"
                                                    value={profile.dateOfBirth}
                                                    isEditing={isEditing}
                                                    field="dateOfBirth"
                                                    type="date"
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box>
                                                <ProfileItem
                                                    icon={<Badge />}
                                                    label="Giới tính"
                                                    value={profile.gender === 'Male' ? 'Nam' : profile.gender === 'Female' ? 'Nữ' : profile.gender}
                                                    isEditing={isEditing}
                                                    field="gender"
                                                    type="select"
                                                    options={[
                                                        { value: 1, label: 'Nam' },
                                                        { value: 2, label: 'Nữ' },
                                                    ]}
                                                />
                                                <ProfileItem
                                                    icon={<Class />}
                                                    label="Khối"
                                                    value={profile.gradeNumber || profile.grade}
                                                    isEditing={false}
                                                />
                                                <ProfileItem
                                                    icon={<School />}
                                                    label="Trường"
                                                    value={profile.school}
                                                    isEditing={false}
                                                />
                                                <ProfileItem
                                                    icon={<LocationOn />}
                                                    label="Địa chỉ"
                                                    value={profile.address}
                                                    isEditing={isEditing}
                                                    field="address"
                                                />
                                                {profile.manager !== 'N/A' && (
                                                    <ProfileItem
                                                        icon={<SupervisorAccount />}
                                                        label="Tổ trưởng"
                                                        value={profile.manager}
                                                        isEditing={false}
                                                    />
                                                )}
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 3 }} />

                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: { xs: 'center', sm: 'space-between' },
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        gap: 2,
                                    }}>
                                        <Box sx={{
                                            display: 'flex',
                                            gap: 2,
                                            flexWrap: { xs: 'wrap', sm: 'nowrap' },
                                            justifyContent: { xs: 'center', sm: 'flex-start' },
                                            width: '100%',
                                        }}>
                                            {isEditing ? (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<Save />}
                                                        onClick={handleSaveProfile}
                                                        disabled={updateLoading}
                                                        sx={{
                                                            py: 1.2,
                                                            fontWeight: 500,
                                                            minWidth: { xs: '100%', sm: '160px' },
                                                            borderRadius: '8px',
                                                            backgroundColor: '#06A9AE',
                                                            boxShadow: theme.palette.mode === 'dark'
                                                                ? '0 4px 12px rgba(6, 169, 174, 0.4)'
                                                                : '0 4px 12px rgba(6, 169, 174, 0.2)',
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                backgroundColor: '#048b8f',
                                                                boxShadow: theme.palette.mode === 'dark'
                                                                    ? '0 6px 15px rgba(6, 169, 174, 0.5)'
                                                                    : '0 6px 15px rgba(6, 169, 174, 0.3)',
                                                            },
                                                        }}
                                                    >
                                                        {updateLoading ? <CircularProgress size={20} color="inherit" /> : 'Lưu thông tin'}
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<Cancel />}
                                                        onClick={handleEditToggle}
                                                        disabled={updateLoading}
                                                        sx={{
                                                            py: 1.2,
                                                            fontWeight: 500,
                                                            minWidth: { xs: '100%', sm: '160px' },
                                                            borderRadius: '8px',
                                                            borderColor: '#f44336',
                                                            color: '#f44336',
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                borderColor: '#d32f2f',
                                                                backgroundColor: 'rgba(244, 67, 54, 0.04)',
                                                            },
                                                        }}
                                                    >
                                                        Hủy
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<Edit />}
                                                        onClick={(e) => {
                                                            console.log('Edit button click event:', e);
                                                            handleEditToggle();
                                                        }}
                                                        disabled={loading || !profile}
                                                        sx={{
                                                            py: 1.2,
                                                            fontWeight: 500,
                                                            minWidth: { xs: '100%', sm: '160px' },
                                                            borderRadius: '8px',
                                                            backgroundColor: '#06A9AE',
                                                            boxShadow: theme.palette.mode === 'dark'
                                                                ? '0 4px 12px rgba(6, 169, 174, 0.4)'
                                                                : '0 4px 12px rgba(6, 169, 174, 0.2)',
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                backgroundColor: '#048b8f',
                                                                boxShadow: theme.palette.mode === 'dark'
                                                                    ? '0 6px 15px rgba(6, 169, 174, 0.5)'
                                                                    : '0 6px 15px rgba(6, 169, 174, 0.3)',
                                                            },
                                                        }}
                                                    >
                                                        {loading ? 'Đang tải...' : 'Chỉnh sửa thông tin'}
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<Lock />}
                                                        onClick={() => navigate('/manager/change-password')}
                                                        sx={{
                                                            py: 1.2,
                                                            fontWeight: 500,
                                                            minWidth: { xs: '100%', sm: '160px' },
                                                            borderRadius: '8px',
                                                            borderColor: '#06A9AE',
                                                            color: '#06A9AE',
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                borderColor: '#048b8f',
                                                                backgroundColor: 'rgba(6, 169, 174, 0.04)',
                                                            },
                                                        }}
                                                    >
                                                        Đổi mật khẩu
                                                    </Button>
                                                </>
                                            )}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                    </Container>
                </Box>
            </Fade>

            {/* Snackbar for notifications */}
            <Snackbar
                open={!!error || !!success} // Open on either error or success
                autoHideDuration={6000}
                onClose={() => { setError(''); setSuccess(''); }}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => { setError(''); setSuccess(''); }}
                    severity={error ? 'error' : 'success'} // Determine severity
                    sx={{ width: '100%', bgcolor: error ? undefined : '#06A9AE', color: error ? undefined : '#fff' }}
                >
                    {error || success} {/* Display either error or success message */}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Profile;
