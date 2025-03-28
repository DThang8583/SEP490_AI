// src/Components/SubjectSpecialistManager/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Drawer, MenuItem, Toolbar, Box, Snackbar, Alert, Typography, Badge } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../api';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = ({ open }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0); // State để lưu số lượng thông báo chưa đọc
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy số lượng thông báo chưa đọc khi component mount
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const res = await api.getNotifications();
                const unread = res.data.filter((notification) => !notification.isRead).length;
                setUnreadCount(unread);
            } catch (error) {
                console.error('Error fetching unread notifications:', error);
            }
        };
        fetchUnreadCount();
    }, []);

    const handleNavigation = (path, action) => {
        if (action) {
            action();
        } else {
            navigate(path);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await api.logout();
            if (response.success) {
                setSnackbarOpen(true);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const menuItems = [
        { text: 'Tổng quan', path: '/manager/dashboard', icon: <DashboardIcon /> },
        { text: 'Xem xét bài giảng', path: '/manager/lesson-review', icon: <LibraryBooksIcon /> },
        { text: 'Phê duyệt nội dung', path: '/manager/content-approval', icon: <CheckCircleIcon /> },
        { text: 'Phân tích chương trình', path: '/manager/curriculum-analysis', icon: <AnalyticsIcon /> },
        { text: 'Khung chương trình', path: '/manager/curriculum-framework', icon: <AccountTreeIcon /> },
        { text: 'Xuất bài giảng', path: '/manager/lesson-export', icon: <FileDownloadIcon /> },
        { text: 'Trang cá nhân', path: '/manager/profile', icon: <PersonIcon /> },
        {
            text: 'Notifications',
            path: '/manager/notifications',
            icon: (
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            ),
        },
        { text: 'Log out', path: '/login', icon: <LogoutIcon />, action: handleLogout },
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
                variant="persistent"
                open={open}
                anchor="left"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                sx={{
                    width: isCollapsed ? 60 : 240,
                    flexShrink: 0,
                    transition: 'width 0.3s ease-in-out',
                    zIndex: 1200,
                    [`& .MuiDrawer-paper`]: {
                        width: isCollapsed ? 60 : 240,
                        backgroundColor: '#ffffff',
                        borderRight: 'none',
                        zIndex: 1200,
                        position: 'fixed',
                        height: '100vh',
                        transition: 'width 0.3s ease-in-out',
                        boxShadow: isCollapsed ? 'none' : '2px 0 8px rgba(0,0,0,0.05)',
                        overflowX: 'hidden',
                    },
                }}
            >
                <Toolbar
                    sx={{
                        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0 16px',
                        height: '64px',
                    }}
                />
                <Box
                    sx={{
                        overflow: 'auto',
                        mt: 2,
                        height: 'calc(100vh - 64px)',
                        '&::-webkit-scrollbar': {
                            width: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#888',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: '#555',
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                        }}
                    >
                        {menuItems.map((item) => (
                            <MenuItem
                                key={item.text}
                                onClick={() => handleNavigation(item.path, item.action)}
                                sx={{
                                    margin: '4px 0',
                                    padding: '8px 16px',
                                    borderRadius: '10px',
                                    backgroundColor: location.pathname === item.path ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                                    color: location.pathname === item.path ? '#1976d2' : '#555',
                                    transition: 'all 0.2s ease-in-out',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    minHeight: '48px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                        color: '#1976d2',
                                        transform: isCollapsed ? 'none' : 'translateX(4px)',
                                        '& .icon-container': {
                                            color: '#1976d2',
                                        },
                                    },
                                    '&::before': location.pathname === item.path && !isCollapsed ? {
                                        content: '""',
                                        position: 'absolute',
                                        left: '-12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: '4px',
                                        height: '60%',
                                        backgroundColor: '#1976d2',
                                        borderRadius: '0 4px 4px 0',
                                    } : {},
                                }}
                            >
                                <Box
                                    className="icon-container"
                                    sx={{
                                        color: location.pathname === item.path ? '#1976d2' : '#666',
                                        minWidth: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'color 0.2s ease-in-out',
                                    }}
                                >
                                    {item.icon}
                                </Box>
                                <Typography
                                    sx={{
                                        position: 'absolute',
                                        left: '56px',
                                        opacity: isCollapsed ? 0 : 1,
                                        visibility: isCollapsed ? 'hidden' : 'visible',
                                        width: isCollapsed ? 0 : 'auto',
                                        transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out, width 0.3s ease-in-out',
                                        transitionDelay: isCollapsed ? '0s' : '0.1s',
                                        fontSize: '0.9rem',
                                        fontWeight: location.pathname === item.path ? 600 : 500,
                                    }}
                                >
                                    {item.text}
                                </Typography>
                            </MenuItem>
                        ))}
                    </Box>
                </Box>
            </Drawer>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => setSnackbarOpen(false)}
                >
                    Logged out successfully!
                </Alert>
            </Snackbar>
        </>
    );
};

export default Sidebar;