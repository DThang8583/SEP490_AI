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
    Grid,
    Divider,
    Collapse,
    Container,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SendIcon from '@mui/icons-material/Send';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

const StyledListItem = styled(ListItem)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    boxShadow: '0 3px 6px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 6px 12px rgba(0,0,0,0.12)',
    },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    minWidth: 120,
    transition: 'all 0.2s ease',
    '&.Mui-selected': {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.main,
        borderRadius: theme.shape.borderRadius,
    },
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1.2, 3),
    textTransform: 'none',
    transition: 'all 0.2s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
}));

const StatusChip = styled(Typography)(({ status, theme }) => ({
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
    backgroundColor:
        status === 'approved'
            ? 'rgba(84, 214, 44, 0.16)'
            : status === 'rejected'
                ? 'rgba(255, 72, 66, 0.16)'
                : 'rgba(255, 193, 7, 0.16)',
    color:
        status === 'approved' ? '#229A16' : status === 'rejected' ? '#B71D18' : '#B78103',
}));

const LessonReview = ({ sidebarOpen }) => {
    const [lessonsByGrade, setLessonsByGrade] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [newComment, setNewComment] = useState('');

    const sidebarWidth = sidebarOpen ? 60 : 240; // sidebarOpen = true: thu nhỏ, false: mở rộng

    const grades = [
        { id: 1, label: 'Khối 1' },
        { id: 2, label: 'Khối 2' },
        { id: 3, label: 'Khối 3' },
        { id: 4, label: 'Khối 4' },
        { id: 5, label: 'Khối 5' },
    ];

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const fetchedLessons = await Promise.all(
                    grades.map(async (grade) => {
                        const res = await api.getLessons({ grade: grade.id });
                        return { gradeId: grade.id, lessons: res.data };
                    })
                );
                setLessonsByGrade(fetchedLessons);
                setSelectedGrade(grades[0].id);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bài học:', error);
            }
        };
        fetchLessons();
    }, []);

    const handleGradeChange = (event, newValue) => {
        setSelectedGrade(newValue);
        setSelectedLesson(null);
    };

    const handleLessonClick = (lesson) => {
        if (selectedLesson && selectedLesson.id === lesson.id) {
            setSelectedLesson(null);
        } else {
            setSelectedLesson(lesson);
        }
        setNewComment('');
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
                message: `Có bình luận mới cho bài học "${selectedLesson.title}": ${newComment}`,
                recipient: selectedLesson.teacherEmail,
            });
        } catch (error) {
            console.error('Lỗi khi thêm bình luận:', error);
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
                message: `Bài học "${selectedLesson.title}" của bạn đã được phê duyệt.`,
                recipient: selectedLesson.teacherEmail,
            });
            alert('Bài học đã được phê duyệt thành công!');
        } catch (error) {
            console.error('Lỗi khi phê duyệt bài học:', error);
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
                message: `Bài học "${selectedLesson.title}" của bạn đã bị từ chối. Vui lòng chỉnh sửa và gửi lại.`,
                recipient: selectedLesson.teacherEmail,
            });
            alert('Bài học đã bị từ chối. Thông báo đã được gửi đến giáo viên.');
        } catch (error) {
            console.error('Lỗi khi từ chối bài học:', error);
        }
    };

    const selectedGradeLessons = lessonsByGrade.find((g) => g.gradeId === selectedGrade)?.lessons || [];

    // Nhóm bài học theo trạng thái
    const groupedLessons = {
        approved: selectedGradeLessons.filter((lesson) => lesson.status === 'approved'),
        pending: selectedGradeLessons.filter((lesson) => lesson.status === 'pending'),
        rejected: selectedGradeLessons.filter((lesson) => lesson.status === 'rejected'),
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
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
                <Container maxWidth="lg">
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                mb: 4,
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Xem xét bài giảng
                        </Typography>

                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
                            <Tabs
                                value={selectedGrade}
                                onChange={handleGradeChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{
                                    '& .MuiTabs-scrollButtons': {
                                        '&.Mui-disabled': { opacity: 0.3 },
                                    },
                                }}
                            >
                                {grades.map((grade) => (
                                    <StyledTab key={grade.id} label={grade.label} value={grade.id} />
                                ))}
                            </Tabs>
                        </Box>

                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    p: 2,
                                    fontWeight: 700,
                                    color: (theme) => theme.palette.primary.main,
                                }}
                            >
                                Danh sách bài giảng - {grades.find((g) => g.id === selectedGrade)?.label}
                            </Typography>
                            <Divider sx={{ mb: 3 }} />

                            {/* Danh sách tổng */}
                            <Box>
                                {/* Đã phê duyệt */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#229A16', mb: 2 }}>
                                        Đã phê duyệt
                                    </Typography>
                                    {groupedLessons.approved.length === 0 ? (
                                        <Box
                                            sx={{
                                                p: 4,
                                                textAlign: 'center',
                                                backgroundColor: (theme) => theme.palette.grey[50],
                                                borderRadius: 2,
                                            }}
                                        >
                                            <Typography variant="body1" color="text.secondary">
                                                Không có bài học nào đã được phê duyệt.
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <List sx={{ p: 0 }}>
                                            {groupedLessons.approved.map((lesson) => (
                                                <LessonItem
                                                    key={lesson.id}
                                                    lesson={lesson}
                                                    selectedLesson={selectedLesson}
                                                    handleLessonClick={handleLessonClick}
                                                    handleAddComment={handleAddComment}
                                                    handleApproveLesson={handleApproveLesson}
                                                    handleRejectLesson={handleRejectLesson}
                                                    newComment={newComment}
                                                    setNewComment={setNewComment}
                                                />
                                            ))}
                                        </List>
                                    )}
                                </Box>

                                {/* Đang chờ */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#B78103', mb: 2 }}>
                                        Đang chờ
                                    </Typography>
                                    {groupedLessons.pending.length === 0 ? (
                                        <Box
                                            sx={{
                                                p: 4,
                                                textAlign: 'center',
                                                backgroundColor: (theme) => theme.palette.grey[50],
                                                borderRadius: 2,
                                            }}
                                        >
                                            <Typography variant="body1" color="text.secondary">
                                                Không có bài học nào đang chờ phê duyệt.
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <List sx={{ p: 0 }}>
                                            {groupedLessons.pending.map((lesson) => (
                                                <LessonItem
                                                    key={lesson.id}
                                                    lesson={lesson}
                                                    selectedLesson={selectedLesson}
                                                    handleLessonClick={handleLessonClick}
                                                    handleAddComment={handleAddComment}
                                                    handleApproveLesson={handleApproveLesson}
                                                    handleRejectLesson={handleRejectLesson}
                                                    newComment={newComment}
                                                    setNewComment={setNewComment}
                                                />
                                            ))}
                                        </List>
                                    )}
                                </Box>

                                {/* Đã từ chối */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#B71D18', mb: 2 }}>
                                        Đã từ chối
                                    </Typography>
                                    {groupedLessons.rejected.length === 0 ? (
                                        <Box
                                            sx={{
                                                p: 4,
                                                textAlign: 'center',
                                                backgroundColor: (theme) => theme.palette.grey[50],
                                                borderRadius: 2,
                                            }}
                                        >
                                            <Typography variant="body1" color="text.secondary">
                                                Không có bài học nào bị từ chối.
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <List sx={{ p: 0 }}>
                                            {groupedLessons.rejected.map((lesson) => (
                                                <LessonItem
                                                    key={lesson.id}
                                                    lesson={lesson}
                                                    selectedLesson={selectedLesson}
                                                    handleLessonClick={handleLessonClick}
                                                    handleAddComment={handleAddComment}
                                                    handleApproveLesson={handleApproveLesson}
                                                    handleRejectLesson={handleRejectLesson}
                                                    newComment={newComment}
                                                    setNewComment={setNewComment}
                                                />
                                            ))}
                                        </List>
                                    )}
                                </Box>
                            </Box>
                        </Paper>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
};

// Component con để hiển thị từng bài học
const LessonItem = ({
    lesson,
    selectedLesson,
    handleLessonClick,
    handleAddComment,
    handleApproveLesson,
    handleRejectLesson,
    newComment,
    setNewComment,
}) => {
    return (
        <>
            <StyledListItem onClick={() => handleLessonClick(lesson)}>
                <Grid container alignItems="center" spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                mb: 1,
                            }}
                        >
                            {lesson.title}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: (theme) => theme.palette.text.secondary,
                                display: 'flex',
                                gap: 2,
                                flexWrap: 'wrap',
                            }}
                        >
                            <span>👤 Giáo viên: {lesson.teacherName || 'Không xác định'}</span>
                            <span>📚 Lớp: {lesson.className || 'N/A'}</span>
                            <span>📝 Khối: {lesson.grade}</span>
                            <span>📅 Ngày gửi: {lesson.submittedAt ? new Date(lesson.submittedAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, alignItems: 'center' }}>
                            <StatusChip status={lesson.status}>
                                {lesson.status === 'approved' ? 'Đã phê duyệt' : lesson.status === 'pending' ? 'Đang chờ' : 'Đã từ chối'}
                            </StatusChip>
                            <IconButton>
                                {selectedLesson && selectedLesson.id === lesson.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
            </StyledListItem>

            <Collapse in={selectedLesson && selectedLesson.id === lesson.id} timeout="auto" unmountOnExit>
                <Box sx={{ p: 3, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '0 0 12px 12px', mb: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        Nội dung bài học
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {lesson.content || 'Không có nội dung.'}
                    </Typography>

                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        Bình luận
                    </Typography>
                    <List sx={{ mb: 2 }}>
                        {(lesson.comments || []).map((comment) => (
                            <Paper
                                key={comment.id}
                                elevation={1}
                                sx={{
                                    p: 2,
                                    mb: 1,
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    borderRadius: 2,
                                }}
                            >
                                <Typography variant="body2">{comment.text}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(comment.createdAt).toLocaleString('vi-VN')}
                                </Typography>
                            </Paper>
                        ))}
                    </List>

                    <TextField
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        label="Thêm bình luận"
                        fullWidth
                        multiline
                        rows={2}
                        sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <ActionButton
                            onClick={() => handleAddComment(lesson.id)}
                            variant="contained"
                            color="primary"
                            startIcon={<SendIcon />}
                            disabled={!newComment.trim()}
                        >
                            Thêm bình luận
                        </ActionButton>

                        {lesson.status === 'pending' && (
                            <>
                                <ActionButton
                                    onClick={() => handleApproveLesson(lesson.id)}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<CheckIcon />}
                                >
                                    Phê duyệt
                                </ActionButton>
                                <ActionButton
                                    onClick={() => handleRejectLesson(lesson.id)}
                                    variant="outlined"
                                    color="error"
                                    startIcon={<CloseIcon />}
                                >
                                    Từ chối
                                </ActionButton>
                            </>
                        )}
                    </Box>
                </Box>
            </Collapse>
        </>
    );
};

export default LessonReview;