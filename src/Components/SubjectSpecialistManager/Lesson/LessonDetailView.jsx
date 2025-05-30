import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    Divider,
    CircularProgress,
    Alert,
    Fade,
    Chip,
} from '@mui/material';
import {
    Check as CheckIcon,
    Close as CloseIcon,
    ArrowBack as ArrowBackIcon,
    Article as ArticleIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Bookmark as BookmarkIcon,
    Event as EventIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// API URL
const TEACHER_LESSONS_API_URL = 'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans';

// Styled components
const StatusBadge = styled(Chip)(({ status }) => ({
    backgroundColor: status === 'Approved' ? 'rgba(0, 171, 85, 0.08)' : 'rgba(255, 72, 66, 0.08)',
    color: status === 'Approved' ? '#00AB55' : '#FF4842',
    fontWeight: 600,
    borderRadius: 16,
    '.MuiChip-icon': {
        color: status === 'Approved' ? '#00AB55' : '#FF4842',
    }
}));

const DetailSection = styled(Box)(({ isDarkMode }) => ({
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: isDarkMode 
        ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
        : '0 2px 8px rgba(0, 0, 0, 0.04)',
    borderLeft: `4px solid #06A9AE`,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: isDarkMode 
            ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
            : '0 4px 12px rgba(0, 0, 0, 0.08)',
    }
}));

const DetailHeading = styled(Typography)({
    fontWeight: 700,
    color: '#06A9AE',
    marginBottom: 12,
    display: 'flex',
    alignItems: 'center',
    '&::before': {
        content: '""',
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: '#06A9AE',
        marginRight: 8
    }
});

const DetailContent = styled(Typography)(({ isDarkMode }) => ({
    color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#637381',
    whiteSpace: 'pre-wrap',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    padding: '0 8px'
}));

const LessonDetailView = ({ lessonId, onBack, isDarkMode }) => {
    const [lessonDetail, setLessonDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) throw new Error('Không tìm thấy access token. Vui lòng đăng nhập lại.');

                const response = await axios.get(`${TEACHER_LESSONS_API_URL}/${lessonId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                if (response.data.code === 0) {
                    setLessonDetail(response.data.data);
                } else {
                    setError('Không thể tải thông tin chi tiết. Vui lòng thử lại sau.');
                }
            } catch (err) {
                console.error('Error fetching lesson detail:', err);
                setError('Không thể tải thông tin chi tiết. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [lessonId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress size={50} sx={{ color: '#06A9AE' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={onBack}
                    sx={{ mb: 2 }}
                >
                    Quay lại
                </Button>
                <Alert severity="error" sx={{ mb: 3, borderLeft: '4px solid #FF4842', borderRadius: 2 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!lessonDetail) {
        return (
            <Box sx={{ p: 3 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={onBack}
                    sx={{ mb: 2 }}
                >
                    Quay lại
                </Button>
                <Typography color="text.secondary">Không tìm thấy thông tin giáo án</Typography>
            </Box>
        );
    }

    return (
        <Fade in timeout={500}>
            <Box sx={{ py: 3, px: { xs: 2, md: 3 } }}>
                <Paper
                    sx={{
                        p: { xs: 2, md: 4 },
                        borderRadius: 3,
                        boxShadow: isDarkMode 
                            ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
                            : '0 10px 30px rgba(0, 0, 0, 0.08)',
                        background: isDarkMode ? '#1E1E1E' : '#FFFFFF',
                        mb: 3,
                        overflow: 'hidden',
                        position: 'relative'
                    }}
                >
                    {/* Add a colored top border */}
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '6px',
                        background: 'linear-gradient(90deg, #06A9AE 0%, #1976d2 100%)'
                    }} />

                    {/* Header with back button */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, mt: 1 }}>
                        <Button
                            variant="contained"
                            startIcon={<ArrowBackIcon />}
                            onClick={onBack}
                            sx={{
                                mr: 2,
                                bgcolor: isDarkMode ? '#2D3436' : 'white',
                                color: '#06A9AE',
                                boxShadow: isDarkMode 
                                    ? '0 3px 10px rgba(0, 0, 0, 0.2)' 
                                    : '0 3px 10px rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    bgcolor: isDarkMode 
                                        ? 'rgba(45, 52, 54, 0.8)' 
                                        : 'rgba(6, 169, 174, 0.1)',
                                }
                            }}
                        >
                            Quay lại
                        </Button>

                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 700, 
                                flex: 1, 
                                color: isDarkMode ? '#fff' : '#212B36' 
                            }}
                        >
                            Chi tiết giáo án
                        </Typography>

                        <StatusBadge
                            label={lessonDetail.status === 'Approved' ? 'Đã duyệt' : 'Đã từ chối'}
                            status={lessonDetail.status}
                            size="medium"
                            icon={lessonDetail.status === 'Approved' ? <CheckIcon /> : <CloseIcon />}
                            sx={{ fontSize: '0.9rem', fontWeight: 700, px: 2, py: 1 }}
                        />
                    </Box>

                    <Divider sx={{ 
                        mb: 4,
                        bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' 
                    }} />

                    {/* Title section */}
                    <Box sx={{
                        mb: 4,
                        p: 3,
                        borderRadius: 2,
                        bgcolor: isDarkMode 
                            ? 'rgba(6, 169, 174, 0.1)' 
                            : 'rgba(6, 169, 174, 0.05)',
                        border: `1px solid ${isDarkMode ? 'rgba(6, 169, 174, 0.2)' : 'rgba(6, 169, 174, 0.1)'}`
                    }}>
                        <Typography 
                            variant="h4" 
                            sx={{
                                fontWeight: 700,
                                color: '#06A9AE',
                                textAlign: 'center',
                                mb: 2
                            }}
                        >
                            {lessonDetail.lesson || 'Không có tiêu đề'}
                        </Typography>
                    </Box>

                    {/* Basic information section */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <PersonIcon sx={{ color: '#1976d2' }} />
                                    <Box>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#637381' }}
                                        >
                                            Giáo viên
                                        </Typography>
                                        <Typography 
                                            variant="body1" 
                                            fontWeight={600}
                                            sx={{ color: isDarkMode ? '#fff' : '#212B36' }}
                                        >
                                            {lessonDetail.fullname || 'Không xác định'}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <BookmarkIcon sx={{ color: '#1976d2' }} />
                                    <Box>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#637381' }}
                                        >
                                            Chủ đề
                                        </Typography>
                                        <Typography 
                                            variant="body1" 
                                            fontWeight={600}
                                            sx={{ color: isDarkMode ? '#fff' : '#212B36' }}
                                        >
                                            {lessonDetail.module || 'Không xác định'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <SchoolIcon sx={{ color: '#1976d2' }} />
                                    <Box>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#637381' }}
                                        >
                                            Khối
                                        </Typography>
                                        <Typography 
                                            variant="body1" 
                                            fontWeight={600}
                                            sx={{ color: isDarkMode ? '#fff' : '#212B36' }}
                                        >
                                            {lessonDetail.grade || 'Không xác định'}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <EventIcon sx={{ color: '#1976d2' }} />
                                    <Box>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#637381' }}
                                        >
                                            Ngày tạo
                                        </Typography>
                                        <Typography 
                                            variant="body1" 
                                            fontWeight={600}
                                            sx={{ color: isDarkMode ? '#fff' : '#212B36' }}
                                        >
                                            {lessonDetail.createdAt || 'Không xác định'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Rejection reason section */}
                    {lessonDetail.status === 'Rejected' && (
                        <Box sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: 2,
                            bgcolor: isDarkMode 
                                ? 'rgba(255, 72, 66, 0.15)' 
                                : 'rgba(255, 72, 66, 0.05)',
                            border: `1px solid ${isDarkMode ? 'rgba(255, 72, 66, 0.3)' : 'rgba(255, 72, 66, 0.2)'}`,
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2
                        }}>
                            <CloseIcon sx={{ color: '#FF4842', mt: 0.5 }} />
                            <Box>
                                <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                        fontWeight: 700, 
                                        color: '#FF4842', 
                                        mb: 1 
                                    }}
                                >
                                    Lý do từ chối
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#637381' 
                                    }}
                                >
                                    {lessonDetail.disapprovedReason || 'Không có lý do'}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {/* Content section header */}
                    <Box sx={{
                        mb: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <ArticleIcon sx={{ color: '#06A9AE' }} />
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 700, 
                                color: isDarkMode ? '#fff' : '#212B36' 
                            }}
                        >
                            Nội dung giáo án
                        </Typography>
                        <Divider 
                            sx={{ 
                                flex: 1, 
                                ml: 2,
                                bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' 
                            }} 
                        />
                    </Box>

                    {/* Lesson content sections */}
                    {!lessonDetail.startUp && !lessonDetail.knowledge && !lessonDetail.goal &&
                        !lessonDetail.schoolSupply && !lessonDetail.practice && !lessonDetail.apply &&
                        !lessonDetail.description && (
                            <Box sx={{
                                p: 4,
                                textAlign: 'center',
                                bgcolor: isDarkMode 
                                    ? 'rgba(255,255,255,0.05)' 
                                    : 'rgba(0,0,0,0.02)',
                                borderRadius: 2,
                                border: `1px dashed ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
                            }}>
                                <Typography 
                                    sx={{ 
                                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#637381' 
                                    }}
                                >
                                    Không có nội dung chi tiết
                                </Typography>
                            </Box>
                        )}

                    {/* Hiển thị các phần chi tiết của giáo án */}
                    {lessonDetail.startUp && (
                        <DetailSection isDarkMode={isDarkMode}>
                            <DetailHeading variant="subtitle1">Khởi động</DetailHeading>
                            <DetailContent isDarkMode={isDarkMode}>{lessonDetail.startUp}</DetailContent>
                        </DetailSection>
                    )}

                    {lessonDetail.goal && (
                        <DetailSection isDarkMode={isDarkMode}>
                            <DetailHeading variant="subtitle1">Mục tiêu</DetailHeading>
                            <DetailContent isDarkMode={isDarkMode}>{lessonDetail.goal}</DetailContent>
                        </DetailSection>
                    )}

                    {lessonDetail.knowledge && (
                        <DetailSection isDarkMode={isDarkMode}>
                            <DetailHeading variant="subtitle1">Kiến thức</DetailHeading>
                            <DetailContent isDarkMode={isDarkMode}>{lessonDetail.knowledge}</DetailContent>
                        </DetailSection>
                    )}

                    {lessonDetail.schoolSupply && (
                        <DetailSection isDarkMode={isDarkMode}>
                            <DetailHeading variant="subtitle1">Đồ dùng học tập</DetailHeading>
                            <DetailContent isDarkMode={isDarkMode}>{lessonDetail.schoolSupply}</DetailContent>
                        </DetailSection>
                    )}

                    {lessonDetail.practice && (
                        <DetailSection isDarkMode={isDarkMode}>
                            <DetailHeading variant="subtitle1">Thực hành</DetailHeading>
                            <DetailContent isDarkMode={isDarkMode}>{lessonDetail.practice}</DetailContent>
                        </DetailSection>
                    )}

                    {lessonDetail.apply && (
                        <DetailSection isDarkMode={isDarkMode}>
                            <DetailHeading variant="subtitle1">Ứng dụng</DetailHeading>
                            <DetailContent isDarkMode={isDarkMode}>{lessonDetail.apply}</DetailContent>
                        </DetailSection>
                    )}

                    {lessonDetail.description && (
                        <DetailSection isDarkMode={isDarkMode}>
                            <DetailHeading variant="subtitle1">Mô tả thêm</DetailHeading>
                            <DetailContent isDarkMode={isDarkMode}>{lessonDetail.description}</DetailContent>
                        </DetailSection>
                    )}
                </Paper>
            </Box>
        </Fade>
    );
};

export default LessonDetailView; 