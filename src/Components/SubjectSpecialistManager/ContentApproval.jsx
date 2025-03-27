// src/Components/SubjectSpecialistManager/ContentApproval.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { Box, Typography, Tabs, Tab, List, ListItem, Button, CircularProgress, Paper, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

const StyledListItem = styled(ListItem)(({ theme }) => ({
    bgcolor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    mb: 2,
    p: 3,
    boxShadow: theme.shadows[1],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        boxShadow: theme.shadows[4],
        transform: 'translateY(-2px)',
        transition: 'all 0.2s ease-in-out',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '4px',
        height: '100%',
        backgroundColor: theme.palette.primary.main,
        opacity: 0.7,
    },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    minWidth: 120,
    borderRadius: theme.shape.borderRadius,
    margin: '0 8px',
    '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontWeight: 600,
    },
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 1.5,
    textTransform: 'none',
    padding: '8px 24px',
    fontWeight: 600,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: theme.shadows[2],
    },
}));

const ContentApproval = ({ sidebarOpen }) => {
    const [contentsByGrade, setContentsByGrade] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [loading, setLoading] = useState(true);

    const sidebarWidth = sidebarOpen ? 60 : 240; // sidebarOpen = true: thu nhỏ, false: mở rộng

    const grades = [
        { id: 1, label: 'Khối 1' },
        { id: 2, label: 'Khối 2' },
        { id: 3, label: 'Khối 3' },
        { id: 4, label: 'Khối 4' },
        { id: 5, label: 'Khối 5' },
    ];

    useEffect(() => {
        const fetchContents = async () => {
            try {
                setLoading(true);
                const fetchedContents = await Promise.all(
                    grades.map(async (grade) => {
                        const res = await api.getContents({ grade: grade.id });
                        return { gradeId: grade.id, contents: res.data.filter((c) => c.status === 'pending') };
                    })
                );
                setContentsByGrade(fetchedContents);
                setSelectedGrade(grades[0].id);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách nội dung:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContents();
    }, []);

    const handleGradeChange = (event, newValue) => {
        setSelectedGrade(newValue);
    };

    const handleApprove = async (id) => {
        try {
            await api.approveContent(id);
            const updatedContents = contentsByGrade.map((gradeData) => {
                if (gradeData.gradeId === selectedGrade) {
                    return {
                        ...gradeData,
                        contents: gradeData.contents.filter((c) => c.id !== id),
                    };
                }
                return gradeData;
            });
            setContentsByGrade(updatedContents);
            await api.sendNotification({
                message: `Nội dung của bạn đã được phê duyệt.`,
                recipient: contentsByGrade.find((g) => g.gradeId === selectedGrade)?.contents.find((c) => c.id === id)?.authorEmail,
            });
            alert('Nội dung đã được phê duyệt thành công!');
        } catch (error) {
            console.error('Lỗi khi phê duyệt nội dung:', error);
        }
    };

    const handleReject = async (id) => {
        try {
            await api.rejectContent(id);
            const updatedContents = contentsByGrade.map((gradeData) => {
                if (gradeData.gradeId === selectedGrade) {
                    return {
                        ...gradeData,
                        contents: gradeData.contents.filter((c) => c.id !== id),
                    };
                }
                return gradeData;
            });
            setContentsByGrade(updatedContents);
            await api.sendNotification({
                message: `Nội dung của bạn đã bị từ chối. Vui lòng chỉnh sửa và gửi lại.`,
                recipient: contentsByGrade.find((g) => g.gradeId === selectedGrade)?.contents.find((c) => c.id === id)?.authorEmail,
            });
            alert('Nội dung đã bị từ chối. Thông báo đã được gửi đến tác giả.');
        } catch (error) {
            console.error('Lỗi khi từ chối nội dung:', error);
        }
    };

    const selectedGradeContents = contentsByGrade.find((g) => g.gradeId === selectedGrade)?.contents || [];

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(to right bottom, #f8f9fa, #e9ecef)',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1100,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
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
                    px: 3,
                    ml: `${sidebarWidth}px`,
                    transition: 'margin-left 0.3s ease',
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        mb: 4,
                        fontWeight: 800,
                        color: '#1a237e',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                        letterSpacing: '-0.5px',
                    }}
                >
                    Phê duyệt nội dung
                </Typography>

                <Paper
                    elevation={0}
                    sx={{
                        mb: 4,
                        borderRadius: 3,
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <Tabs
                        value={selectedGrade}
                        onChange={handleGradeChange}
                        sx={{
                            mb: 2,
                            p: 2,
                            '& .MuiTabs-indicator': {
                                display: 'none',
                            },
                        }}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {grades.map((grade) => (
                            <StyledTab key={grade.id} label={grade.label} value={grade.id} />
                        ))}
                    </Tabs>

                    <Box sx={{ p: 3 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                mb: 3,
                                fontWeight: 700,
                                color: '#1a237e',
                            }}
                        >
                            Danh sách nội dung cần phê duyệt - Khối {selectedGrade}
                        </Typography>

                        {selectedGradeContents.length === 0 ? (
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: 6,
                                    color: 'text.secondary',
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                                    Không có nội dung đang chờ phê duyệt
                                </Typography>
                                <Typography variant="body2">
                                    Tất cả nội dung của Khối {selectedGrade} đã được xem xét.
                                </Typography>
                            </Box>
                        ) : (
                            <List sx={{ p: 0 }}>
                                {selectedGradeContents.map((content) => (
                                    <StyledListItem key={content.id}>
                                        <Box sx={{ flex: 1, mr: 3 }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    mb: 1,
                                                    fontWeight: 600,
                                                    color: '#1a237e',
                                                }}
                                            >
                                                {content.title}
                                            </Typography>
                                            {content.description && (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        lineHeight: 1.6,
                                                        maxWidth: '80ch',
                                                    }}
                                                >
                                                    {content.description}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <ActionButton
                                                onClick={() => handleApprove(content.id)}
                                                variant="contained"
                                                color="primary"
                                                startIcon={<CheckIcon />}
                                            >
                                                Phê duyệt
                                            </ActionButton>
                                            <ActionButton
                                                onClick={() => handleReject(content.id)}
                                                variant="outlined"
                                                color="error"
                                                startIcon={<CloseIcon />}
                                            >
                                                Từ chối
                                            </ActionButton>
                                        </Box>
                                    </StyledListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default ContentApproval;