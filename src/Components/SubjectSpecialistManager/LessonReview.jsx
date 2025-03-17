// src/Components/SubjectSpecialistManager/LessonReview.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    List,
    ListItem,
    TextField,
    Button,
    Paper,
    IconButton,
    Card,
    CardContent,
    Stack,
    Divider,
    Collapse,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
    },
    borderRadius: '12px',
    border: '1px solid rgba(0,0,0,0.08)',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    minWidth: 120,
    '&.Mui-selected': {
        color: theme.palette.primary.main,
    },
}));

const StatusChip = styled(Typography)(({ status, theme }) => ({
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
    backgroundColor: status === 'approved'
        ? 'rgba(84, 214, 44, 0.16)'
        : status === 'rejected'
            ? 'rgba(255, 72, 66, 0.16)'
            : 'rgba(255, 193, 7, 0.16)',
    color: status === 'approved'
        ? '#229A16'
        : status === 'rejected'
            ? '#B71D18'
            : '#B78103',
}));

const LessonReview = ({ sidebarOpen }) => {
    const [lessonsByGrade, setLessonsByGrade] = useState([]); // Danh sách bài học theo khối lớp
    const [selectedGrade, setSelectedGrade] = useState(null); // Khối lớp được chọn
    const [selectedLesson, setSelectedLesson] = useState(null); // Bài học được chọn để xem chi tiết
    const [newComment, setNewComment] = useState(''); // Bình luận mới

    const sidebarWidth = sidebarOpen ? 240 : 0; // Chiều rộng của Sidebar khi mở/đóng

    // Danh sách các khối lớp (Grade 1 đến Grade 5)
    const grades = [
        { id: 1, label: 'Grade 1' },
        { id: 2, label: 'Grade 2' },
        { id: 3, label: 'Grade 3' },
        { id: 4, label: 'Grade 4' },
        { id: 5, label: 'Grade 5' },
    ];

    // Lấy danh sách bài học theo khối lớp
    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const fetchedLessons = await Promise.all(
                    grades.map(async (grade) => {
                        // Giả sử API hỗ trợ lấy lessons theo grade
                        const res = await api.getLessons({ grade: grade.id });
                        return { gradeId: grade.id, lessons: res.data };
                    })
                );
                setLessonsByGrade(fetchedLessons);
                // Mặc định chọn khối lớp 1
                setSelectedGrade(grades[0].id);
            } catch (error) {
                console.error('Error fetching lessons:', error);
            }
        };
        fetchLessons();
    }, []);

    const handleGradeChange = (event, newValue) => {
        setSelectedGrade(newValue);
        setSelectedLesson(null); // Reset bài học được chọn khi chuyển khối lớp
    };

    const handleLessonClick = (lesson) => {
        if (selectedLesson && selectedLesson.id === lesson.id) {
            setSelectedLesson(null); // Đóng nếu đã mở
        } else {
            setSelectedLesson(lesson); // Mở bài học được chọn
        }
        setNewComment(''); // Reset comment khi chọn bài học mới
    };

    const handleAddComment = async (lessonId) => {
        if (!newComment.trim()) return;
        try {
            const res = await api.postComment({ lessonId, text: newComment });
            const updatedLessons = lessonsByGrade.map((gradeData) => {
                if (gradeData.gradeId === selectedGrade) {
                    return {
                        ...gradeData,
                        lessons: gradeData.lessons.map((lesson) =>
                            lesson.id === lessonId
                                ? { ...lesson, comments: [...(lesson.comments || []), res.data] }
                                : lesson
                        ),
                    };
                }
                return gradeData;
            });
            setLessonsByGrade(updatedLessons);
            setNewComment('');
            await api.sendNotification({
                message: `New comment added to lesson "${selectedLesson.title}": ${newComment}`,
                recipient: selectedLesson.teacherEmail, // Giả sử có teacherEmail
            });
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleApproveLesson = async (lessonId) => {
        try {
            await api.approveLesson(lessonId);
            const updatedLessons = lessonsByGrade.map((gradeData) => {
                if (gradeData.gradeId === selectedGrade) {
                    return {
                        ...gradeData,
                        lessons: gradeData.lessons.map((lesson) =>
                            lesson.id === lessonId ? { ...lesson, status: 'approved' } : lesson
                        ),
                    };
                }
                return gradeData;
            });
            setLessonsByGrade(updatedLessons);
            setSelectedLesson({ ...selectedLesson, status: 'approved' });
            await api.sendNotification({
                message: `Your lesson "${selectedLesson.title}" has been approved.`,
                recipient: selectedLesson.teacherEmail,
            });
            alert('Lesson approved successfully!');
        } catch (error) {
            console.error('Error approving lesson:', error);
        }
    };

    const handleRejectLesson = async (lessonId) => {
        try {
            await api.rejectLesson(lessonId);
            const updatedLessons = lessonsByGrade.map((gradeData) => {
                if (gradeData.gradeId === selectedGrade) {
                    return {
                        ...gradeData,
                        lessons: gradeData.lessons.map((lesson) =>
                            lesson.id === lessonId ? { ...lesson, status: 'rejected' } : lesson
                        ),
                    };
                }
                return gradeData;
            });
            setLessonsByGrade(updatedLessons);
            setSelectedLesson({ ...selectedLesson, status: 'rejected' });
            await api.sendNotification({
                message: `Your lesson "${selectedLesson.title}" has been rejected. Please revise and resubmit.`,
                recipient: selectedLesson.teacherEmail,
            });
            alert('Lesson rejected. Notification sent to teacher.');
        } catch (error) {
            console.error('Error rejecting lesson:', error);
        }
    };

    // Lấy danh sách bài học cho khối lớp được chọn
    const selectedGradeLessons = lessonsByGrade.find((g) => g.gradeId === selectedGrade)?.lessons || [];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
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
                    fontSize: { xs: '1.5rem', sm: '2rem' },
                    textShadow: '0 2px 4px rgba(0,0,0,0.08)'
                }}
            >
                Lesson Review
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    mb: 3,
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <Tabs
                    value={selectedGrade}
                    onChange={handleGradeChange}
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTabs-indicator': {
                            height: 3,
                            borderRadius: '3px'
                        }
                    }}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {grades.map((grade) => (
                        <StyledTab key={grade.id} label={grade.label} value={grade.id} />
                    ))}
                </Tabs>
            </Paper>

            <Paper
                elevation={0}
                sx={{
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e', mb: 3 }}>
                        Lesson Review List - Grade {selectedGrade}
                    </Typography>

                    <List sx={{ p: 0 }}>
                        {selectedGradeLessons.length === 0 ? (
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: 8,
                                    color: 'text.secondary',
                                    backgroundColor: 'rgba(0,0,0,0.02)',
                                    borderRadius: '12px'
                                }}
                            >
                                <Typography variant="h6">
                                    No lessons available
                                </Typography>
                                <Typography variant="body2">
                                    There are no lessons to review for Grade {selectedGrade}
                                </Typography>
                            </Box>
                        ) : (
                            selectedGradeLessons.map((lesson) => (
                                <StyledCard key={lesson.id} onClick={() => handleLessonClick(lesson)}>
                                    <CardContent sx={{
                                        p: 3,
                                        '&:last-child': { pb: 3 }
                                    }}>
                                        <Box>
                                            <Typography variant="h6">{lesson.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Teacher: {lesson.teacherName || 'Unknown'} | Grade: {lesson.grade} | Class: {lesson.className || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Topic: {lesson.topic || 'N/A'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <StatusChip status={lesson.status}>
                                                {lesson.status}
                                            </StatusChip>
                                            <IconButton>
                                                {selectedLesson && selectedLesson.id === lesson.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            </IconButton>
                                        </Box>
                                    </CardContent>

                                    {/* Chi tiết bài học (hiển thị khi nhấn vào) */}
                                    <Collapse in={selectedLesson && selectedLesson.id === lesson.id} timeout="auto" unmountOnExit>
                                        <Divider />
                                        <Box sx={{ p: 3, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '0 0 12px 12px' }}>
                                            <Typography variant="h6" sx={{ mb: 1 }}>
                                                Lesson Content
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 2 }}>
                                                {lesson.content || 'No content available.'}
                                            </Typography>

                                            <Typography variant="h6" sx={{ mb: 1 }}>
                                                Comments
                                            </Typography>
                                            <List sx={{ mb: 2 }}>
                                                {(lesson.comments || []).map((comment) => (
                                                    <Paper key={comment.id} elevation={1} sx={{ p: 1, mb: 1 }}>
                                                        <Typography variant="body2">{comment.text}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(comment.createdAt).toLocaleString()}
                                                        </Typography>
                                                    </Paper>
                                                ))}
                                            </List>

                                            <TextField
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                label="Add Comment"
                                                fullWidth
                                                multiline
                                                rows={2}
                                                sx={{ mb: 2 }}
                                            />
                                            <Button
                                                onClick={() => handleAddComment(lesson.id)}
                                                variant="contained"
                                                endIcon={<SendIcon />}
                                                sx={{
                                                    mb: 2,
                                                    mr: 1,
                                                    borderRadius: '8px',
                                                    textTransform: 'none',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                    '&:hover': {
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
                                                    }
                                                }}
                                                disabled={!newComment.trim()}
                                            >
                                                Add Comment
                                            </Button>

                                            {lesson.status === 'pending' && (
                                                <Stack direction="row" spacing={2}>
                                                    <Button
                                                        onClick={() => handleApproveLesson(lesson.id)}
                                                        variant="contained"
                                                        color="primary"
                                                        sx={{ borderRadius: 2, textTransform: 'none' }}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleRejectLesson(lesson.id)}
                                                        variant="outlined"
                                                        color="error"
                                                        sx={{ borderRadius: 2, textTransform: 'none' }}
                                                    >
                                                        Reject
                                                    </Button>
                                                </Stack>
                                            )}
                                        </Box>
                                    </Collapse>
                                </StyledCard>
                            ))
                        )}
                    </List>
                </Box>
            </Paper>
        </Box>
    );
};

export default LessonReview;