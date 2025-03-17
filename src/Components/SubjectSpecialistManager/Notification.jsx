// src/Components/SubjectSpecialistManager/Notification.jsx
import React, { useState, useEffect } from 'react';
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
    },
}));

const Notification = ({ sidebarOpen }) => {
    const [notifications, setNotifications] = useState([]); // Danh sách thông báo từ hệ thống

    const sidebarWidth = sidebarOpen ? 240 : 0; // Chiều rộng của Sidebar khi mở/đóng

    // Lấy danh sách thông báo từ hệ thống
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                // Giả sử API hỗ trợ lấy thông báo cho Subject Specialist Manager
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
            // Gọi API để đánh dấu thông báo là đã đọc
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

    // Tính số lượng thông báo chưa đọc
    const unreadCount = notifications.filter((notification) => !notification.isRead).length;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(to right bottom, #f8f9fa, #e9ecef)',
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
                            <StyledListItem key={notification.id} isRead={notification.isRead}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="body1">{notification.message}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </Typography>
                                </Box>
                                {!notification.isRead && (
                                    <IconButton
                                        onClick={() => handleMarkAsRead(notification.id)}
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
    );
};

export default Notification;