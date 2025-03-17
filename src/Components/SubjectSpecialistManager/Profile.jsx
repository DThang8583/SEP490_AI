// src/Components/SubjectSpecialistManager/Profile.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { Box, Typography, TextField, Button, Divider } from '@mui/material';

const Profile = () => {
    const [profile, setProfile] = useState({ name: '', email: '' });
    const [password, setPassword] = useState({ current: '', new: '' });

    useEffect(() => {
        api.getProfile().then((res) => setProfile(res.data));
    }, []);

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPassword({ ...password, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = () => {
        api.updateProfile(profile).then(() => alert('Profile updated successfully!'));
    };

    const handleChangePassword = () => {
        api.changePassword(password).then(() => {
            alert('Password changed successfully!');
            setPassword({ current: '', new: '' });
        });
    };

    return (
        <Box sx={{
            p: 4,
            maxWidth: '800px',
            margin: '0 auto',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5'
        }}>
            <Box sx={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: '40px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease'
            }}>
                <Typography variant="h4" sx={{
                    mb: 4,
                    fontWeight: 700,
                    color: '#2c3e50',
                    borderBottom: '3px solid #06A9AE',
                    paddingBottom: '10px',
                    display: 'inline-block'
                }}>
                    Thông tin cá nhân
                </Typography>

                <Box sx={{ mb: 4 }}>
                    <TextField
                        label="Họ và tên"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        fullWidth
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: '#06A9AE',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#06A9AE',
                                }
                            }
                        }}
                        variant="outlined"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        fullWidth
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: '#06A9AE',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#06A9AE',
                                }
                            }
                        }}
                        variant="outlined"
                    />
                    <Button
                        onClick={handleUpdateProfile}
                        variant="contained"
                        sx={{
                            backgroundColor: '#06A9AE',
                            '&:hover': {
                                backgroundColor: '#058286',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(6, 169, 174, 0.3)'
                            },
                            px: 4,
                            py: 1.5,
                            borderRadius: '8px',
                            transition: 'all 0.3s ease',
                            textTransform: 'none',
                            fontSize: '16px'
                        }}
                    >
                        Cập nhật thông tin
                    </Button>
                </Box>

                <Divider sx={{ my: 4, borderColor: '#e0e0e0' }} />

                <Typography variant="h5" sx={{
                    mb: 3,
                    fontWeight: 700,
                    color: '#2c3e50',
                    borderBottom: '3px solid #06A9AE',
                    paddingBottom: '10px',
                    display: 'inline-block'
                }}>
                    Đổi mật khẩu
                </Typography>
                <TextField
                    label="Mật khẩu hiện tại"
                    name="current"
                    type="password"
                    value={password.current}
                    onChange={handlePasswordChange}
                    fullWidth
                    sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: '#06A9AE',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#06A9AE',
                            }
                        }
                    }}
                    variant="outlined"
                />
                <TextField
                    label="Mật khẩu mới"
                    name="new"
                    type="password"
                    value={password.new}
                    onChange={handlePasswordChange}
                    fullWidth
                    sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: '#06A9AE',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#06A9AE',
                            }
                        }
                    }}
                    variant="outlined"
                />
                <Button
                    onClick={handleChangePassword}
                    variant="contained"
                    sx={{
                        backgroundColor: '#06A9AE',
                        '&:hover': {
                            backgroundColor: '#058286',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(6, 169, 174, 0.3)'
                        },
                        px: 4,
                        py: 1.5,
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        textTransform: 'none',
                        fontSize: '16px'
                    }}
                >
                    Đổi mật khẩu
                </Button>
            </Box>
        </Box>
    );
};

export default Profile;