import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Snackbar,
    Alert,
    Container,
    InputAdornment,
    IconButton,
    Fade,
    Grid,
    Avatar,
} from '@mui/material';
import { Visibility, VisibilityOff, Lock, LockReset, PersonOutline } from '@mui/icons-material';
import { motion } from 'framer-motion';

const ChangePassword = ({ sidebarOpen }) => {
    const [formData, setFormData] = useState({
        usernameOrEmail: '',
        newPassword: '',
        confirmedPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [errors, setErrors] = useState({
        usernameOrEmail: '',
        newPassword: '',
        confirmedPassword: ''
    });
    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        confirmedPassword: false
    });

    const sidebarWidth = sidebarOpen ? 60 : 240; // sidebarOpen = true: thu nhỏ, false: mở rộng

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTogglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = () => {
        const newErrors = {
            usernameOrEmail: '',
            newPassword: '',
            confirmedPassword: ''
        };

        if (!formData.usernameOrEmail) {
            newErrors.usernameOrEmail = 'Tên đăng nhập hoặc Email là bắt buộc';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'Mật khẩu mới là bắt buộc';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (!formData.confirmedPassword) {
            newErrors.confirmedPassword = 'Vui lòng xác nhận mật khẩu';
        } else if (formData.newPassword !== formData.confirmedPassword) {
            newErrors.confirmedPassword = 'Mật khẩu xác nhận không khớp';
        }

        setErrors(newErrors);
        return !newErrors.usernameOrEmail && !newErrors.newPassword && !newErrors.confirmedPassword;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Using the correct endpoint from the documentation
            const response = await axios.put(
                'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users',
                {
                    usernameOrEmail: formData.usernameOrEmail,
                    newPassword: formData.newPassword,
                    confirmedPassword: formData.confirmedPassword
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            setSnackbar({
                open: true,
                message: 'Đổi mật khẩu thành công!',
                severity: 'success'
            });

            // Reset form after successful submission
            setFormData({
                usernameOrEmail: '',
                newPassword: '',
                confirmedPassword: ''
            });
        } catch (error) {
            console.error('Password change error:', error);

            // Extract error message from response if available
            const errorMessage = error.response?.data?.errors?.toString() ||
                error.response?.data?.title ||
                error.response?.data?.errorMessage ||
                'Đổi mật khẩu không thành công';

            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const FormItem = ({ icon, label, ...props }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{
                    mr: 1,
                    display: 'flex',
                    alignItems: 'center',
                    color: '#06A9AE'
                }}>
                    {icon}
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {label}
                </Typography>
            </Box>
            {props.children}
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
            }}
        >
            <Fade in={true}>
                <Box
                    sx={{
                        py: 4,
                        ml: `${sidebarWidth}px`,
                        transition: 'margin-left 0.3s ease',
                        width: '100%',
                    }}
                >
                    <Container maxWidth="md" sx={{ py: 3 }}>
                        <Card
                            elevation={6}
                            sx={{
                                borderRadius: '16px',
                                overflow: 'hidden',
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 10px 40px rgba(31, 38, 135, 0.15)',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    height: 150,
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
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            border: '4px solid white',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                            backgroundColor: '#06A9AE',
                                        }}
                                    >
                                        <LockReset sx={{ fontSize: 40 }} />
                                    </Avatar>
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
                                    Đổi Mật Khẩu
                                </Typography>
                            </Box>

                            <CardContent sx={{ pt: 7, px: { xs: 3, sm: 4 } }}>
                                <Box sx={{ mt: { xs: 3, sm: 1 }, mb: 4 }}>
                                    <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600 }}>
                                        Điền thông tin dưới đây để thay đổi mật khẩu của bạn. Đảm bảo mật khẩu mới đủ mạnh và dễ nhớ.
                                    </Typography>
                                </Box>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={8}>
                                        <FormItem icon={<PersonOutline />} label="Tên đăng nhập hoặc Email">
                                            <TextField
                                                name="usernameOrEmail"
                                                value={formData.usernameOrEmail}
                                                onChange={handleChange}
                                                fullWidth
                                                placeholder="Nhập tên đăng nhập hoặc email của bạn"
                                                variant="outlined"
                                                error={!!errors.usernameOrEmail}
                                                helperText={errors.usernameOrEmail}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '10px',
                                                    }
                                                }}
                                            />
                                        </FormItem>

                                        <FormItem icon={<Lock />} label="Mật khẩu mới">
                                            <TextField
                                                name="newPassword"
                                                type={showPassword.newPassword ? 'text' : 'password'}
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                fullWidth
                                                placeholder="Nhập mật khẩu mới"
                                                variant="outlined"
                                                error={!!errors.newPassword}
                                                helperText={errors.newPassword}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => handleTogglePasswordVisibility('newPassword')}
                                                                edge="end"
                                                            >
                                                                {showPassword.newPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '10px',
                                                    }
                                                }}
                                            />
                                        </FormItem>

                                        <FormItem icon={<Lock />} label="Xác nhận mật khẩu">
                                            <TextField
                                                name="confirmedPassword"
                                                type={showPassword.confirmedPassword ? 'text' : 'password'}
                                                value={formData.confirmedPassword}
                                                onChange={handleChange}
                                                fullWidth
                                                placeholder="Xác nhận mật khẩu mới"
                                                variant="outlined"
                                                error={!!errors.confirmedPassword}
                                                helperText={errors.confirmedPassword}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => handleTogglePasswordVisibility('confirmedPassword')}
                                                                edge="end"
                                                            >
                                                                {showPassword.confirmedPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '10px',
                                                    }
                                                }}
                                            />
                                        </FormItem>

                                        <Box sx={{ mt: 2 }}>
                                            <Button
                                                variant="contained"
                                                onClick={handleSubmit}
                                                size="large"
                                                disabled={loading}
                                                sx={{
                                                    py: 1.5,
                                                    px: 4,
                                                    borderRadius: '10px',
                                                    backgroundColor: '#06A9AE',
                                                    '&:hover': {
                                                        backgroundColor: '#058e93',
                                                    },
                                                    boxShadow: '0 4px 10px rgba(6, 169, 174, 0.3)',
                                                    textTransform: 'none',
                                                    fontSize: '1rem',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {loading ? (
                                                    <CircularProgress size={24} color="inherit" />
                                                ) : (
                                                    'Đổi Mật Khẩu'
                                                )}
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Container>
                </Box>
            </Fade>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        borderRadius: '10px'
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ChangePassword;
