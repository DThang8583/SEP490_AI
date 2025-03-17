// src/Components/SubjectSpecialistManager/Sidebar.jsx
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Box, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close'; // Icon nút đóng
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Sidebar = ({ open, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Debug: Kiểm tra giá trị open
    console.log('Sidebar render, open:', open);

    const menuItems = [
        { text: 'Dashboard', path: '/manager/dashboard', icon: <DashboardIcon /> },
        { text: 'Lesson Review', path: '/manager/lesson-review', icon: <LibraryBooksIcon /> },
        { text: 'Content Approval', path: '/manager/content-approval', icon: <CheckCircleIcon /> },
        { text: 'Curriculum Analysis', path: '/manager/curriculum-analysis', icon: <AnalyticsIcon /> },
        { text: 'Curriculum Framework', path: '/manager/curriculum-framework', icon: <AccountTreeIcon /> },
        { text: 'Lesson Export', path: '/manager/lesson-export', icon: <FileDownloadIcon /> },
        { text: 'Profile', path: '/manager/profile', icon: <PersonIcon /> },
        { text: 'Notifications', path: '/manager/notifications', icon: <NotificationsIcon /> },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        // Không đóng Sidebar ở đây để giữ trạng thái mở khi chuyển trang
    };

    return (
        <Drawer
            variant="persistent"
            open={open}
            anchor="left"
            sx={{
                width: 240,
                flexShrink: 0,
                transition: 'width 0.3s ease-in-out',
                display: open ? 'block' : 'none',
                [`& .MuiDrawer-paper`]: {
                    width: 240,
                    backgroundColor: '#ffffff', // Đổi màu nền sang trắng
                    borderRight: '1px solid rgba(0, 0, 0, 0.08)',
                    zIndex: 1000,
                    position: 'fixed',
                    height: '100vh',
                    transition: 'all 0.3s ease-in-out',
                    boxShadow: '2px 0 8px rgba(0,0,0,0.05)', // Thêm shadow nhẹ
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
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 600,
                    color: '#1976d2'
                }}>
                    <DashboardIcon />
                    <span>Subject Manager</span>
                </Box>
                {open && (
                    <IconButton
                        onClick={() => toggleSidebar(false)}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                )}
            </Toolbar>
            <Box sx={{
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
            }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                                margin: '4px 12px',
                                borderRadius: '10px',
                                backgroundColor: location.pathname === item.path ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                                color: location.pathname === item.path ? '#1976d2' : '#555',
                                transition: 'all 0.2s ease-in-out',
                                position: 'relative',
                                '&:hover': {
                                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                    color: '#1976d2',
                                    transform: 'translateX(4px)',
                                    '& .MuiListItemIcon-root': {
                                        color: '#1976d2',
                                    },
                                },
                                '&::before': location.pathname === item.path ? {
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
                            <ListItemIcon
                                sx={{
                                    color: location.pathname === item.path ? '#1976d2' : '#666',
                                    minWidth: '40px',
                                    transition: 'color 0.2s ease-in-out',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{
                                    '& .MuiTypography-root': {
                                        fontSize: '0.9rem',
                                        fontWeight: location.pathname === item.path ? 600 : 500,
                                        transition: 'all 0.2s ease-in-out',
                                    },
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;