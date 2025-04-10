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
    Container,
    Button,
    Fade,
} from '@mui/material';
import MarkAsReadIcon from '@mui/icons-material/Done';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { styled } from '@mui/material/styles';

const StyledListItem = styled(ListItem)(({ theme, isRead }) => ({
    backgroundColor: isRead ? theme.palette.background.paper : theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1.5),
    padding: theme.spacing(2),
    boxShadow: isRead ? '0 2px 4px rgba(0,0,0,0.05)' : '0 3px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backgroundColor: theme.palette.grey[100],
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

    const handleMarkAllAsRead = async () => {
        try {
            await api.markAllNotificationsAsRead();
            setNotifications(notifications.map((notification) => ({ ...notification, isRead: true })));
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
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
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
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
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Notifications
                                {unreadCount > 0 && (
                                    <Badge badgeContent={unreadCount} color="error" sx={{ ml: 2 }}>
                                        <Typography variant="h4" component="span" />
                                    </Badge>
                                )}
                            </Typography>
                            {unreadCount > 0 && (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleMarkAllAsRead}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '20px',
                                        padding: '6px 16px',
                                    }}
                                >
                                    Mark all as read
                                </Button>
                            )}
                        </Box>

                        <Divider sx={{ mb: 3, borderColor: 'rgba(0,0,0,0.1)' }} />

                        {notifications.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 6 }}>
                                <Typography variant="h6" color="text.secondary">
                                    No notifications available.
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    You're all caught up! Check back later for updates.
                                </Typography>
                            </Box>
                        ) : (
                            <List>
                                {notifications.map((notification, index) => (
                                    <Fade in={true} timeout={500 + index * 100} key={notification.id}>
                                        <StyledListItem
                                            isRead={notification.isRead}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    flexGrow: 1,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        backgroundColor: notification.isRead ? 'grey.200' : 'primary.light',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <AssignmentIcon
                                                        sx={{
                                                            color: notification.isRead ? 'grey.500' : 'primary.main',
                                                        }}
                                                    />
                                                </Box>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            fontWeight: notification.isRead ? 400 : 500,
                                                            color: notification.isRead ? 'text.secondary' : 'text.primary',
                                                        }}
                                                    >
                                                        {notification.message}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(notification.createdAt).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {!notification.isRead && (
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMarkAsRead(notification.id);
                                                        }}
                                                        color="primary"
                                                        title="Mark as read"
                                                        sx={{
                                                            '&:hover': {
                                                                backgroundColor: 'primary.light',
                                                            },
                                                        }}
                                                    >
                                                        <MarkAsReadIcon />
                                                    </IconButton>
                                                )}
                                                {notification.isRead && (
                                                    <Chip
                                                        label="Read"
                                                        size="small"
                                                        color="success"
                                                        variant="outlined"
                                                        sx={{
                                                            borderRadius: '12px',
                                                            fontWeight: 500,
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        </StyledListItem>
                                    </Fade>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
};

export default Notification;