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
    const [contentsByGrade, setContentsByGrade] = useState([]); // Danh sách nội dung theo khối lớp
    const [selectedGrade, setSelectedGrade] = useState(null); // Khối lớp được chọn
    const [loading, setLoading] = useState(true);

    const sidebarWidth = sidebarOpen ? 240 : 0; // Chiều rộng của Sidebar khi mở/đóng

    // Danh sách các khối lớp (Grade 1 đến Grade 5)
    const grades = [
        { id: 1, label: 'Grade 1' },
        { id: 2, label: 'Grade 2' },
        { id: 3, label: 'Grade 3' },
        { id: 4, label: 'Grade 4' },
        { id: 5, label: 'Grade 5' },
    ];

    // Lấy danh sách nội dung theo khối lớp
    useEffect(() => {
        const fetchContents = async () => {
            try {
                setLoading(true);
                const fetchedContents = await Promise.all(
                    grades.map(async (grade) => {
                        // Giả sử API hỗ trợ lấy contents theo grade và chỉ lấy trạng thái pending
                        const res = await api.getContents({ grade: grade.id });
                        return { gradeId: grade.id, contents: res.data.filter((c) => c.status === 'pending') };
                    })
                );
                setContentsByGrade(fetchedContents);
                // Mặc định chọn khối lớp 1
                setSelectedGrade(grades[0].id);
            } catch (error) {
                console.error('Error fetching contents:', error);
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
                message: `Your content has been approved.`,
                recipient: contentsByGrade.find((g) => g.gradeId === selectedGrade)?.contents.find((c) => c.id === id)?.authorEmail,
            });
            alert('Content approved successfully!');
        } catch (error) {
            console.error('Error approving content:', error);
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
                message: `Your content has been rejected. Please revise and resubmit.`,
                recipient: contentsByGrade.find((g) => g.gradeId === selectedGrade)?.contents.find((c) => c.id === id)?.authorEmail,
            });
            alert('Content rejected. Notification sent to author.');
        } catch (error) {
            console.error('Error rejecting content:', error);
        }
    };

    // Lấy danh sách nội dung cho khối lớp được chọn
    const selectedGradeContents = contentsByGrade.find((g) => g.gradeId === selectedGrade)?.contents || [];

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(to right bottom, #f8f9fa, #e9ecef)',
                    py: 4,
                    ml: `${sidebarWidth}px`,
                    transition: 'margin-left 0.3s ease',
                    display: 'flex',
                    justifyContent: 'center',
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
                py: 4,
                px: 3,
                ml: `${sidebarWidth}px`,
                transition: 'all 0.3s ease',
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    mb: 4,
                    fontWeight: 800,
                    color: '#1a237e',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                    letterSpacing: '-0.5px'
                }}
            >
                Content Approval
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
                        Content Approval List - Grade {selectedGrade}
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
                                No Pending Contents
                            </Typography>
                            <Typography variant="body2">
                                All contents for Grade {selectedGrade} have been reviewed.
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
                                            Approve
                                        </ActionButton>
                                        <ActionButton
                                            onClick={() => handleReject(content.id)}
                                            variant="outlined"
                                            color="error"
                                            startIcon={<CloseIcon />}
                                        >
                                            Reject
                                        </ActionButton>
                                    </Box>
                                </StyledListItem>
                            ))}
                        </List>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default ContentApproval;