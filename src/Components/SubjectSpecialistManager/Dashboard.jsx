// src/Components/SubjectSpecialistManager/Dashboard.jsx
import React from 'react';
import { Box, Typography, Paper, Grid, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    },
}));

const Dashboard = ({ sidebarOpen }) => {
    const sidebarWidth = sidebarOpen ? 60 : 240; // sidebarOpen = true: thu nhỏ, false: mở rộng

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f6f9fc 0%, #e9ecef 100%)',
                position: 'absolute', // Lấp đầy toàn bộ màn hình
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1100, // Đặt dưới Sidebar (zIndex: 1200)
            }}
        >
            <Box
                sx={{
                    py: 4,
                    ml: `${sidebarWidth}px`,
                    transition: 'margin-left 0.3s ease',
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 4,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            background: 'linear-gradient(45deg, #2196F3, #00BCD4)',
                            backgroundClip: 'text',
                            textFillColor: 'transparent',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            animation: 'fadeIn 0.5s ease-in',
                            '@keyframes fadeIn': {
                                '0%': { opacity: 0, transform: 'translateY(-20px)' },
                                '100%': { opacity: 1, transform: 'translateY(0)' },
                            },
                        }}
                    >
                        Subject Specialist Manager Dashboard
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <StyledPaper>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: '#1976d2',
                                            fontWeight: 600,
                                            flex: 1,
                                        }}
                                    >
                                        Welcome Back!
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: '#546e7a',
                                        lineHeight: 1.7,
                                        fontSize: '1.1rem',
                                    }}
                                >
                                    Use the sidebar to navigate through your tasks and manage your responsibilities efficiently.
                                </Typography>
                            </StyledPaper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <StyledPaper>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: '#1976d2',
                                            fontWeight: 600,
                                            flex: 1,
                                        }}
                                    >
                                        Quick Actions
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: '#546e7a',
                                        lineHeight: 1.7,
                                        fontSize: '1.1rem',
                                    }}
                                >
                                    Access your most important tools and features right from this dashboard.
                                </Typography>
                            </StyledPaper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default Dashboard;