// src/Components/SubjectSpecialistManager/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import {
    Container,
    Typography,
    Button,
    Divider,
    Paper,
    Box,
} from '@mui/material';

const Profile = ({ sidebarOpen }) => {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    const sidebarWidth = sidebarOpen ? 60 : 240; // sidebarOpen = true: thu nhỏ, false: mở rộng

    useEffect(() => {
        api.getProfile().then((res) => setProfile(res.data));
    }, []);

    if (!profile) return <Typography>Loading...</Typography>;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(to right bottom, #f8f9fa, #e9ecef)',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1100,
            }}
        >
            <Box
                sx={{
                    py: 4,
                    ml: `${sidebarWidth}px`,
                    transition: 'margin-left 0.3s ease',
                }}
            >
                <Container maxWidth="md">
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
                        <Typography
                            variant="h4"
                            sx={{
                                mb: 4,
                                fontWeight: 700,
                                color: '#2c3e50',
                                borderBottom: '3px solid #06A9AE',
                                pb: '10px',
                                textAlign: 'center',
                            }}
                        >
                            Thông tin cá nhân
                        </Typography>

                        <Typography sx={{ textAlign: 'left', mb: 1 }}>
                            <strong>Họ và tên:</strong> {profile.name}
                        </Typography>
                        <Typography sx={{ textAlign: 'left', mb: 1 }}>
                            <strong>Email:</strong> {profile.email}
                        </Typography>
                        <Typography sx={{ textAlign: 'left', mb: 1 }}>
                            <strong>Số điện thoại:</strong> {profile.phone}
                        </Typography>
                        <Typography sx={{ textAlign: 'left', mb: 1 }}>
                            <strong>Ngày sinh:</strong> {profile.dateOfBirth}
                        </Typography>
                        <Typography sx={{ textAlign: 'left', mb: 1 }}>
                            <strong>Giới tính:</strong> {profile.gender}
                        </Typography>
                        <Typography sx={{ textAlign: 'left', mb: 1 }}>
                            <strong>Địa chỉ:</strong> {profile.address}
                        </Typography>
                        <Typography sx={{ textAlign: 'left', mb: 1 }}>
                            <strong>Vai trò:</strong> {profile.role}
                        </Typography>
                        <Typography sx={{ textAlign: 'left', mb: 1 }}>
                            <strong>Trường:</strong> {profile.school}
                        </Typography>
                        <Typography sx={{ textAlign: 'left', mb: 1 }}>
                            <strong>Quận:</strong> {profile.ward}
                        </Typography>

                        <Divider sx={{ my: 4, borderColor: '#e0e0e0' }} />

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <Button
                                onClick={() => navigate('/manager/edit-profile')}
                                variant="contained"
                                sx={{ backgroundColor: '#06A9AE', m: 1 }}
                            >
                                Chỉnh sửa thông tin
                            </Button>
                            <Button
                                onClick={() => navigate('/manager/change-password')}
                                variant="contained"
                                sx={{ backgroundColor: '#f39c12', m: 1 }}
                            >
                                Đổi mật khẩu
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
};

export default Profile;