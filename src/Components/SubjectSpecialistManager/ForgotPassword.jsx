// src/Components/SubjectSpecialistManager/ForgotPassword.jsx
import React, { useState } from 'react';
import { api } from '../../api';
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
} from '@mui/material';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const validateForm = () => {
        const newErrors = {
            email: '',
            password: ''
        };

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!newPassword) {
            newErrors.password = 'Password is required';
        } else if (newPassword.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return !newErrors.email && !newErrors.password;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            await api.changePassword({ email, newPassword });
            setSnackbar({
                open: true,
                message: 'Password reset successfully!',
                severity: 'success'
            });
            setEmail('');
            setNewPassword('');
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Failed to reset password',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%' }}
                >
                    <Card elevation={3}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    mb: 4,
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    color: 'primary.main'
                                }}
                            >
                                Forgot Password
                            </Typography>

                            <TextField
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                sx={{ mb: 3 }}
                                error={!!errors.email}
                                helperText={errors.email}
                            />

                            <TextField
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                fullWidth
                                sx={{ mb: 4 }}
                                error={!!errors.password}
                                helperText={errors.password}
                            />

                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                fullWidth
                                size="large"
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontSize: '1.1rem'
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Reset Password'
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
};

export default ForgotPassword;