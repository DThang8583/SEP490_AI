// src/Components/SubjectSpecialistManager/Notification.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import {
    Box,
    Typography,
    List,
    ListItem,
    Paper,
    Divider,
    IconButton,
    Chip,
    Badge,
} from '@mui/material';
import MarkAsReadIcon from '@mui/icons-material/Done';
import { styled } from '@mui/material/styles';

const StyledListItem = styled(ListItem)(({ theme, isRead }) => ({
    backgroundColor: isRead ? theme.palette.background.paper : theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2),
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: theme.palette.grey[200],
        cursor: 'pointer',
    },
}));

const Notification = ({ sidebarOpen }) => {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    // sidebarOpen = true: thu nhỏ, false: mở rộng
    const sidebarWidth = sidebarOpen ? 60 : 240;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.getNotifications();
                setNotifications(res.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await api.markNotificationAsRead(notificationId);
            setNotifications(
                notifications.map((notification) =>
                    notification.id === notificationId ? { ...notification, isRead: true } : notification
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleNotificationClick = (notification) => {
        if (notification.type === 'lesson_submission' && notification.lessonId) {
            navigate(`/manager/lesson-review/${notification.lessonId}`);
        }
    };

    const unreadCount = notifications.filter((notification) => !notification.isRead).length;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(to right bottom, #f8f9fa, #e9ecef)',
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
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mx: 2 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 4,
                            fontWeight: 600,
                            color: '#1976d2',
                        }}
                    >
                        Notifications
                        {unreadCount > 0 && (
                            <Badge badgeContent={unreadCount} color="error" sx={{ ml: 2 }}>
                                <Typography variant="h4" component="span" />
                            </Badge>
                        )}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    {notifications.length === 0 ? (
                        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                            No notifications available.
                        </Typography>
                    ) : (
                        <List>
                            {notifications.map((notification) => (
                                <StyledListItem
                                    key={notification.id}
                                    isRead={notification.isRead}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body1">{notification.message}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                    {!notification.isRead && (
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsRead(notification.id);
                                            }}
                                            color="primary"
                                            title="Mark as read"
                                        >
                                            <MarkAsReadIcon />
                                        </IconButton>
                                    )}
                                    {notification.isRead && (
                                        <Chip label="Read" size="small" color="success" variant="outlined" />
                                    )}
                                </StyledListItem>
                            ))}
                        </List>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default Notification;