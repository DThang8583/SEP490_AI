// src/Components/SubjectSpecialistManager/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Drawer, ListItem, Toolbar, Box, Snackbar, Alert, Typography, Avatar, Divider, List, Tooltip, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../api';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = ({ open }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();

    const handleNavigation = (path, action) => {
        action ? action() : navigate(path);
    };

    const handleLogout = () => {
        logout();
        setSnackbarOpen(true);
        setTimeout(() => navigate('/login'), 1000);
    };

    const menuItems = [
        { text: 'Tổng quan', path: '/manager/dashboard', icon: <DashboardIcon /> },
        { text: 'Giáo án đã xem xét', path: '/manager/lesson-review', icon: <LibraryBooksIcon /> },
        { text: 'Phê duyệt nội dung', path: '/manager/content-approval', icon: <CheckCircleIcon /> },
        { text: 'Xuất giáo án', path: '/manager/lesson-export', icon: <FileDownloadIcon /> },
        { text: 'Khung chương trình', path: '/manager/curriculum-framework', icon: <AccountTreeIcon /> },
        { text: 'Phân tích chương trình', path: '/manager/curriculum-analysis', icon: <AnalyticsIcon /> },
    ];

    const profileItems = [
        { text: 'Trang cá nhân', path: '/manager/profile', icon: <PersonIcon /> },
        { text: 'Đăng xuất', path: '/login', icon: <LogoutIcon />, action: handleLogout },
    ];

    const handleMouseEnter = () => {
        setIsCollapsed(false);
    };

    const handleMouseLeave = () => {
        setIsCollapsed(true);
    };

    return (
        <>
            <Drawer
                variant="permanent"
                open={open}
                anchor="left"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                sx={{
                    width: isCollapsed ? 76 : 260,
                    flexShrink: 0,
                    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 1100,
                    '& .MuiDrawer-paper': {
                        width: isCollapsed ? 76 : 260,
                        background: isDarkMode ? '#1E1E1E' : '#06A9AE',
                        borderRight: 'none',
                        color: '#fff',
                        position: 'fixed',
                        height: '100vh',
                        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.15)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                    },
                }}
            >
                <Toolbar sx={{
                    minHeight: '72px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    px: isCollapsed ? 1 : 2
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        width: '100%',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                    }} onClick={() => navigate('/manager/dashboard')}>
                        <Avatar
                            sx={{
                                bgcolor: isDarkMode ? '#2D3436' : 'white',
                                color: isDarkMode ? '#06A9AE' : '#1565C0',
                                width: 40,
                                height: 40,
                                mr: isCollapsed ? 0 : 2,
                                transition: 'margin 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer',
                            }}
                        >
                            <SchoolIcon />
                        </Avatar>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                letterSpacing: '0.5px',
                                opacity: isCollapsed ? 0 : 1,
                                width: isCollapsed ? 0 : 'auto',
                                overflow: 'hidden',
                                maxHeight: '30px',
                                whiteSpace: 'nowrap',
                                transition: 'opacity 0.3s, width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer',
                                color: isDarkMode ? '#ffffff' : '#ffffff',
                            }}
                        >
                            Manager
                        </Typography>
                    </Box>
                </Toolbar>

                <Divider sx={{ bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)', mt: 1, mb: 2 }} />

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: 'calc(100% - 90px)',
                    px: isCollapsed ? 1 : 1,
                    py: 1,
                    position: 'relative',
                }}>
                    <List sx={{ width: '100%', p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Tooltip
                                    key={item.text}
                                    title={isCollapsed ? item.text : ''}
                                    placement="right"
                                    arrow
                                >
                                    <ListItem
                                        button
                                        onClick={() => handleNavigation(item.path, item.action)}
                                        sx={{
                                            borderRadius: '12px',
                                            mb: 1,
                                            px: isCollapsed ? 1 : 1.5,
                                            py: 1.5,
                                            background: isActive 
                                                ? isDarkMode 
                                                    ? 'rgba(255,255,255,0.1)' 
                                                    : 'rgba(255,255,255,0.15)'
                                                : 'transparent',
                                            backdropFilter: 'blur(10px)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            width: isCollapsed ? '50px' : '100%',
                                            display: 'flex',
                                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                                            cursor: 'pointer',
                                            '&::before': isActive ? {
                                                content: '""',
                                                position: 'absolute',
                                                left: 0,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                width: '4px',
                                                height: '70%',
                                                backgroundColor: '#fff',
                                                borderRadius: '0 4px 4px 0',
                                            } : {},
                                            '&:hover': {
                                                background: isDarkMode 
                                                    ? 'rgba(255,255,255,0.05)' 
                                                    : 'rgba(255,255,255,0.1)',
                                                transform: 'translateY(-2px)',
                                                transition: 'all 0.3s',
                                            }
                                        }}
                                    >
                                        <Box sx={{
                                            color: 'white',
                                            minWidth: isCollapsed ? 'auto' : 35,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: isCollapsed ? 0 : 1.5,
                                            transition: 'margin 0.4s',
                                            cursor: 'pointer',
                                        }}>
                                            {item.icon}
                                        </Box>

                                        <Typography
                                            sx={{
                                                fontSize: '0.95rem',
                                                fontWeight: isActive ? 600 : 400,
                                                opacity: isCollapsed ? 0 : 1,
                                                maxWidth: isCollapsed ? 0 : '220px',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                color: isActive ? '#fff' : 'rgba(255,255,255,0.85)',
                                                transition: 'opacity 0.4s, max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                cursor: 'pointer',
                                                marginRight: 0.5,
                                                pl: 0
                                            }}
                                        >
                                            {item.text}
                                        </Typography>
                                    </ListItem>
                                </Tooltip>
                            );
                        })}
                    </List>

                    <List sx={{ width: '100%', p: 0, mt: 'auto' }}>
                        <Divider sx={{ bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)', my: 2 }} />

                        {/* Theme Toggle Button */}
                        <Tooltip
                            title={isCollapsed ? (isDarkMode ? 'Chế độ sáng' : 'Chế độ tối') : ''}
                            placement="right"
                            arrow
                        >
                            <ListItem
                                button
                                onClick={toggleTheme}
                                sx={{
                                    borderRadius: '12px',
                                    mb: 1,
                                    px: 2,
                                    py: 1.5,
                                    background: isDarkMode 
                                        ? 'rgba(255, 255, 255, 0.05)' 
                                        : 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        background: isDarkMode 
                                            ? 'rgba(255, 255, 255, 0.15)' 
                                            : 'rgba(255, 255, 255, 0.25)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: isDarkMode 
                                            ? '0 4px 8px rgba(0,0,0,0.3)' 
                                            : '0 4px 8px rgba(0,0,0,0.2)',
                                        transition: 'all 0.3s',
                                    }
                                }}
                            >
                                <Box sx={{
                                    color: 'white',
                                    minWidth: 35,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: isCollapsed ? 0 : 2.5,
                                    transition: 'margin 0.4s, color 0.3s',
                                    cursor: 'pointer',
                                }}>
                                    {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                                </Box>

                                <Typography
                                    sx={{
                                        fontSize: '0.95rem',
                                        fontWeight: 600,
                                        opacity: isCollapsed ? 0 : 1,
                                        maxWidth: isCollapsed ? 0 : '220px',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        color: '#FFFFFF',
                                        transition: 'opacity 0.4s, max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s',
                                        cursor: 'pointer',
                                        marginRight: 1
                                    }}
                                >
                                    {isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
                                </Typography>
                            </ListItem>
                        </Tooltip>

                        {profileItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Tooltip
                                    key={item.text}
                                    title={isCollapsed ? item.text : ''}
                                    placement="right"
                                    arrow
                                >
                                    <ListItem
                                        button
                                        onClick={() => handleNavigation(item.path, item.action)}
                                        sx={{
                                            borderRadius: '12px',
                                            mb: 1,
                                            px: 2,
                                            py: 1.5,
                                            background: item.text === 'Đăng xuất' 
                                                ? isDarkMode 
                                                    ? 'rgba(255, 255, 255, 0.05)' 
                                                    : 'rgba(255, 255, 255, 0.1)'
                                                : (isActive 
                                                    ? isDarkMode 
                                                        ? 'rgba(255,255,255,0.1)' 
                                                        : 'rgba(255,255,255,0.15)'
                                                    : 'transparent'),
                                            backdropFilter: 'blur(10px)',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                background: item.text === 'Đăng xuất' 
                                                    ? isDarkMode 
                                                        ? 'rgba(255, 255, 255, 0.15)' 
                                                        : 'rgba(255, 255, 255, 0.25)'
                                                    : isDarkMode 
                                                        ? 'rgba(255,255,255,0.05)' 
                                                        : 'rgba(255,255,255,0.1)',
                                                transform: item.text === 'Đăng xuất' ? 'translateY(-2px)' : 'none',
                                                boxShadow: item.text === 'Đăng xuất' 
                                                    ? isDarkMode 
                                                        ? '0 4px 8px rgba(0,0,0,0.3)' 
                                                        : '0 4px 8px rgba(0,0,0,0.2)'
                                                    : 'none',
                                                transition: 'all 0.3s',
                                            }
                                        }}
                                    >
                                        <Box sx={{
                                            color: item.text === 'Đăng xuất' ? '#FFFFFF' : 'white',
                                            minWidth: 35,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: isCollapsed ? 0 : 2.5,
                                            transition: 'margin 0.4s, color 0.3s',
                                            cursor: 'pointer',
                                        }}>
                                            {item.icon}
                                        </Box>

                                        <Typography
                                            sx={{
                                                fontSize: '0.95rem',
                                                fontWeight: item.text === 'Đăng xuất' ? 600 : (isActive ? 600 : 400),
                                                opacity: isCollapsed ? 0 : 1,
                                                maxWidth: isCollapsed ? 0 : '220px',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                color: item.text === 'Đăng xuất' ? '#FFFFFF' : (isActive ? '#fff' : 'rgba(255,255,255,0.85)'),
                                                transition: 'opacity 0.4s, max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s',
                                                cursor: 'pointer',
                                                marginRight: 1
                                            }}
                                        >
                                            {item.text}
                                        </Typography>
                                    </ListItem>
                                </Tooltip>
                            );
                        })}
                    </List>
                </Box>
            </Drawer>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => setSnackbarOpen(false)}
                    sx={{ 
                        width: '100%', 
                        boxShadow: isDarkMode 
                            ? '0 4px 12px rgba(0,0,0,0.3)' 
                            : '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                >
                    Đăng xuất thành công!
                </Alert>
            </Snackbar>
        </>
    );
};

export default Sidebar;