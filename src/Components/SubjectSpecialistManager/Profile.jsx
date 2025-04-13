import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Edit, Lock, Person, Email, Phone, Cake, School, LocationOn, SupervisorAccount, Badge, Class } from '@mui/icons-material';

const Profile = ({ sidebarOpen }) => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const sidebarWidth = sidebarOpen ? 60 : 240;

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

    const ProfileItem = ({ icon, label, value }) => (
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
            <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    {label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {value || 'N/A'}
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
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
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: '0 10px 40px rgba(31, 38, 135, 0.15)',
                                    maxWidth: '1000px',
                                    margin: '0 auto',
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: 120,
                                        background: 'linear-gradient(120deg, #06A9AE 0%, #0089a3 100%)',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '40%',
                                            background: 'linear-gradient(transparent, rgba(0,0,0,0.2))',
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: -50,
                                            left: { xs: '50%', sm: 40 },
                                            transform: { xs: 'translateX(-50%)', sm: 'translateX(0)' },
                                        }}
                                    >
                                        <Avatar
                                            src={profile?.imgURL || 'https://via.placeholder.com/150'}
                                            alt="Ảnh đại diện"
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                border: '4px solid white',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                            }}
                                        />
                                    </Box>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            position: 'absolute',
                                            top: { xs: 20, sm: 30 },
                                            left: { xs: '50%', sm: 40 },
                                            transform: { xs: 'translateX(-50%)', sm: 'translateX(0)' },
                                            color: 'white',
                                            fontWeight: 600,
                                            textAlign: { xs: 'center', sm: 'left' },
                                        }}
                                    >
                                        Thông tin cá nhân
                                    </Typography>
                                </Box>

                                <CardContent sx={{
                                    pt: 5,
                                    px: { xs: 2, sm: 3 },
                                    pb: 2
                                }}>
                                    <Box sx={{ mt: { xs: 2, sm: 1 }, mb: 2 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                                            {profile.fullname}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            {profile.role} • {profile.school}
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Box>
                                                <ProfileItem
                                                    icon={<Person />}
                                                    label="Tên người dùng"
                                                    value={profile.username}
                                                />
                                                <ProfileItem
                                                    icon={<Email />}
                                                    label="Email"
                                                    value={profile.email}
                                                />
                                                <ProfileItem
                                                    icon={<Phone />}
                                                    label="Số điện thoại"
                                                    value={profile.phoneNumber}
                                                />
                                                <ProfileItem
                                                    icon={<Cake />}
                                                    label="Ngày sinh"
                                                    value={profile.dateOfBirth}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box>
                                                <ProfileItem
                                                    icon={<Badge />}
                                                    label="Giới tính"
                                                    value={profile.gender === 'Male' ? 'Nam' : profile.gender === 'Female' ? 'Nữ' : profile.gender}
                                                />
                                                <ProfileItem
                                                    icon={<Class />}
                                                    label="Khối"
                                                    value={profile.gradeNumber || profile.grade}
                                                />
                                                <ProfileItem
                                                    icon={<School />}
                                                    label="Trường"
                                                    value={profile.school}
                                                />
                                                <ProfileItem
                                                    icon={<LocationOn />}
                                                    label="Địa chỉ"
                                                    value={profile.address}
                                                />
                                                {profile.manager !== 'N/A' && (
                                                    <ProfileItem
                                                        icon={<SupervisorAccount />}
                                                        label="Tổ trưởng"
                                                        value={profile.manager}
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
                                            <Button
                                                variant="contained"
                                                startIcon={<Edit />}
                                                onClick={() => navigate('/manager/edit-profile')}
                                                sx={{
                                                    py: 1.2,
                                                    fontWeight: 500,
                                                    minWidth: { xs: '100%', sm: '160px' },
                                                    borderRadius: '8px',
                                                    backgroundColor: '#06A9AE',
                                                    boxShadow: '0 4px 12px rgba(6, 169, 174, 0.2)',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        backgroundColor: '#048b8f',
                                                        boxShadow: '0 6px 15px rgba(6, 169, 174, 0.3)',
                                                    },
                                                }}
                                            >
                                                Chỉnh sửa thông tin
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
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                    </Container>
                </Box>
            </Fade>
        </Box>
    );
};

export default Profile;