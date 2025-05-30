import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Button,
    Stack,
    Alert,
    Fade,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Chip
} from '@mui/material';
import {
    Check as CheckIcon,
    Close as CloseIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTheme } from '../../../context/ThemeContext';

const TEACHER_LESSONS_API = 'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans';

// Colors matching the app theme
const COLORS = {
    primary: '#06A9AE',
    secondary: '#1976d2',
    success: '#00AB55',
    error: '#FF4842',
    warning: '#FFAB00',
    background: {
        default: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
        paper: '#FFFFFF',
        secondary: 'rgba(0, 0, 0, 0.02)',
    },
    text: {
        primary: '#212B36',
        secondary: '#637381',
    },
};

const STATUS_COLORS = {
    Pending: {
        color: COLORS.warning,
        bgColor: 'rgba(255, 171, 0, 0.08)',
        label: 'Đang chờ'
    },
    Approved: {
        color: COLORS.success,
        bgColor: 'rgba(0, 171, 85, 0.08)',
        label: 'Đã duyệt'
    },
    Rejected: {
        color: COLORS.error,
        bgColor: 'rgba(255, 72, 66, 0.08)',
        label: 'Đã từ chối'
    }
};

// Styled components
const ActionButton = styled(Button)(({ isDarkMode }) => ({
    borderRadius: 16,
    padding: '6px 16px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.875rem',
    boxShadow: isDarkMode 
        ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
        : '0 2px 8px rgba(0, 0, 0, 0.1)',
    '&:hover': {
        boxShadow: isDarkMode 
            ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
            : '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
}));

const StatusChip = styled(Chip)(({ status }) => ({
    backgroundColor: STATUS_COLORS[status]?.bgColor,
    color: STATUS_COLORS[status]?.color,
    fontWeight: 600,
    borderRadius: 16,
    padding: '0 8px',
}));

const DetailSection = styled(Box)(({ isDarkMode }) => ({
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.01)',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
}));

const DetailHeading = styled(Typography)(({ isDarkMode }) => ({
    fontWeight: 600,
    color: isDarkMode ? '#fff' : COLORS.text.primary,
    marginBottom: 8,
}));

const DetailContent = styled(Typography)(({ isDarkMode }) => ({
    color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary,
    whiteSpace: 'pre-wrap',
    fontSize: '0.9rem',
}));

const ContentApprovalDetail = ({ lessonId, onBack, onApprove, onReject }) => {
    const { isDarkMode } = useTheme();
    const [lessonDetail, setLessonDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openRejectDialog, setOpenRejectDialog] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${TEACHER_LESSONS_API}/${lessonId}`);
                setLessonDetail(response.data.data);
            } catch (err) {
                setError('Không thể tải thông tin chi tiết. Vui lòng thử lại sau.');
                console.error('Error fetching lesson detail:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [lessonId]);

    const handleOpenRejectDialog = () => {
        setOpenRejectDialog(true);
    };

    const handleCloseRejectDialog = () => {
        setOpenRejectDialog(false);
        setRejectReason('');
    };

    const handleRejectConfirm = () => {
        if (rejectReason.trim() === '') {
            return; // Don't allow empty reason
        }

        // Pass the reason to parent component for rejection
        onReject(lessonDetail.lessonPlanId, rejectReason.trim());
        handleCloseRejectDialog();
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress size={50} sx={{ color: COLORS.primary }} />
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
                <Alert severity="error" sx={{ mb: 3, borderLeft: `4px solid ${COLORS.error}`, borderRadius: 2 }}>
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
                        p: 3,
                        borderRadius: 2,
                        boxShadow: isDarkMode 
                            ? '0 8px 24px rgba(0, 0, 0, 0.2)' 
                            : '0 8px 24px rgba(0, 0, 0, 0.08)',
                        background: isDarkMode ? '#1E1E1E' : COLORS.background.paper,
                        mb: 3
                    }}
                >
                    {/* Header with back button */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={onBack}
                            sx={{ 
                                mr: 2,
                                color: isDarkMode ? '#fff' : 'inherit',
                                borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'inherit',
                                '&:hover': {
                                    borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'inherit',
                                }
                            }}
                        >
                            Quay lại
                        </Button>

                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 700, 
                                flex: 1,
                                color: isDarkMode ? '#fff' : COLORS.text.primary 
                            }}
                        >
                            Chi tiết giáo án
                        </Typography>

                        <StatusChip
                            label={STATUS_COLORS[lessonDetail.status]?.label || lessonDetail.status}
                            status={lessonDetail.status}
                            size="small"
                            sx={{ fontSize: '0.875rem' }}
                        />
                    </Box>

                    <Divider sx={{ 
                        mb: 3,
                        bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' 
                    }} />

                    {/* Summary information */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
                        gap: 3,
                        mb: 3,
                        bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0, 0, 0, 0.02)',
                        p: 2,
                        borderRadius: 2
                    }}>
                        <Box>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary 
                                }} 
                                gutterBottom
                            >
                                Giáo viên
                            </Typography>
                            <Typography 
                                variant="body1" 
                                fontWeight={600}
                                sx={{ color: isDarkMode ? '#fff' : COLORS.text.primary }}
                            >
                                {lessonDetail.fullname}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary 
                                }} 
                                gutterBottom
                            >
                                Chủ đề
                            </Typography>
                            <Typography 
                                variant="body1" 
                                fontWeight={600}
                                sx={{ color: isDarkMode ? '#fff' : COLORS.text.primary }}
                            >
                                {lessonDetail.module}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary 
                                }} 
                                gutterBottom
                            >
                                Khối
                            </Typography>
                            <Typography 
                                variant="body1" 
                                fontWeight={600}
                                sx={{ color: isDarkMode ? '#fff' : COLORS.text.primary }}
                            >
                                {lessonDetail.grade}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary 
                                }} 
                                gutterBottom
                            >
                                Bài
                            </Typography>
                            <Typography 
                                variant="body1" 
                                fontWeight={600}
                                sx={{ color: isDarkMode ? '#fff' : COLORS.text.primary }}
                            >
                                {lessonDetail.lesson}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary 
                                }} 
                                gutterBottom
                            >
                                Số tiết
                            </Typography>
                            <Typography 
                                variant="body1" 
                                fontWeight={600}
                                sx={{ color: isDarkMode ? '#fff' : COLORS.text.primary }}
                            >
                                {lessonDetail.totalPeriods}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary 
                                }} 
                                gutterBottom
                            >
                                Ngày tạo
                            </Typography>
                            <Typography 
                                variant="body1" 
                                fontWeight={600}
                                sx={{ color: isDarkMode ? '#fff' : COLORS.text.primary }}
                            >
                                {lessonDetail.createdAt}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Detail sections */}
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            mb: 2, 
                            fontWeight: 600, 
                            color: isDarkMode ? '#fff' : COLORS.text.primary 
                        }}
                    >
                        Nội dung giáo án
                    </Typography>

                    <DetailSection isDarkMode={isDarkMode}>
                        <DetailHeading variant="subtitle1" isDarkMode={isDarkMode}>Khởi động</DetailHeading>
                        <DetailContent isDarkMode={isDarkMode}>{lessonDetail.startUp}</DetailContent>
                    </DetailSection>

                    <DetailSection isDarkMode={isDarkMode}>
                        <DetailHeading variant="subtitle1" isDarkMode={isDarkMode}>Kiến thức</DetailHeading>
                        <DetailContent isDarkMode={isDarkMode}>{lessonDetail.knowledge}</DetailContent>
                    </DetailSection>

                    <DetailSection isDarkMode={isDarkMode}>
                        <DetailHeading variant="subtitle1" isDarkMode={isDarkMode}>Mục tiêu</DetailHeading>
                        <DetailContent isDarkMode={isDarkMode}>{lessonDetail.goal}</DetailContent>
                    </DetailSection>

                    <DetailSection isDarkMode={isDarkMode}>
                        <DetailHeading variant="subtitle1" isDarkMode={isDarkMode}>Đồ dùng học tập</DetailHeading>
                        <DetailContent isDarkMode={isDarkMode}>{lessonDetail.schoolSupply}</DetailContent>
                    </DetailSection>

                    <DetailSection isDarkMode={isDarkMode}>
                        <DetailHeading variant="subtitle1" isDarkMode={isDarkMode}>Thực hành</DetailHeading>
                        <DetailContent isDarkMode={isDarkMode}>{lessonDetail.practice}</DetailContent>
                    </DetailSection>

                    <DetailSection isDarkMode={isDarkMode}>
                        <DetailHeading variant="subtitle1" isDarkMode={isDarkMode}>Ứng dụng</DetailHeading>
                        <DetailContent isDarkMode={isDarkMode}>{lessonDetail.apply}</DetailContent>
                    </DetailSection>
                </Paper>

                {/* Action buttons at the bottom */}
                <Paper sx={{
                    p: 3,
                    borderRadius: 2,
                    boxShadow: isDarkMode 
                        ? '0 4px 12px rgba(0, 0, 0, 0.2)' 
                        : '0 4px 12px rgba(0, 0, 0, 0.08)',
                    background: isDarkMode ? '#1E1E1E' : COLORS.background.paper,
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Stack direction="row" spacing={2}>
                        <ActionButton
                            variant="contained"
                            color="success"
                            startIcon={<CheckIcon />}
                            onClick={() => onApprove(lessonDetail.lessonPlanId)}
                            disabled={lessonDetail.status === "Approved"}
                            sx={{ px: 4, py: 1 }}
                            isDarkMode={isDarkMode}
                        >
                            Duyệt
                        </ActionButton>
                        <ActionButton
                            variant="contained"
                            color="error"
                            startIcon={<CloseIcon />}
                            onClick={handleOpenRejectDialog}
                            disabled={lessonDetail.status === "Rejected"}
                            sx={{ px: 4, py: 1 }}
                            isDarkMode={isDarkMode}
                        >
                            Từ chối
                        </ActionButton>
                    </Stack>
                </Paper>

                {/* Reject Reason Dialog */}
                <Dialog
                    open={openRejectDialog}
                    onClose={handleCloseRejectDialog}
                    PaperProps={{
                        style: {
                            borderRadius: '16px',
                            padding: '8px',
                            maxWidth: '500px',
                            background: isDarkMode ? '#1E1E1E' : '#FFFFFF',
                        }
                    }}
                >
                    <DialogTitle sx={{
                        fontWeight: 600,
                        color: COLORS.error,
                        textAlign: 'center',
                        pt: 3
                    }}>
                        Từ chối giáo án
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ 
                            mb: 2,
                            color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit'
                        }}>
                            Vui lòng nhập lý do từ chối giáo án này:
                        </DialogContentText>
                        <TextField
                            autoFocus
                            fullWidth
                            multiline
                            rows={4}
                            label="Lý do từ chối"
                            variant="outlined"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            sx={{ 
                                mt: 1,
                                '& .MuiOutlinedInput-root': {
                                    color: isDarkMode ? '#fff' : 'inherit',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'inherit',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'inherit',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: COLORS.error,
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
                                },
                            }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
                        <Button
                            onClick={handleCloseRejectDialog}
                            variant="outlined"
                            sx={{ 
                                borderRadius: 2, 
                                px: 3,
                                color: isDarkMode ? '#fff' : 'inherit',
                                borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'inherit',
                                '&:hover': {
                                    borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'inherit',
                                }
                            }}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleRejectConfirm}
                            color="error"
                            variant="contained"
                            disabled={rejectReason.trim() === ''}
                            sx={{ borderRadius: 2, px: 3 }}
                        >
                            Xác nhận
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Fade>
    );
};

export default ContentApprovalDetail; 