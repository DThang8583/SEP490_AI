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
    Chip,
    Container
} from '@mui/material';
import {
    Check as CheckIcon,
    Close as CloseIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTheme } from '../../../context/ThemeContext';

const TEACHER_LESSONS_API = 'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans';

// Color palette for consistency
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
    hover: {
        primary: 'rgba(6, 169, 174, 0.08)',
        secondary: 'rgba(25, 118, 210, 0.08)',
    }
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
const DashboardCard = styled(Paper)(({ theme, isDarkMode }) => ({
    borderRadius: 12,
    boxShadow: isDarkMode 
        ? '0 8px 24px rgba(0, 0, 0, 0.2)' 
        : '0 8px 24px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    background: isDarkMode ? '#1E1E1E' : COLORS.background.paper,
}));

const ActionButton = styled(Button)(({ isDarkMode }) => ({
    borderRadius: 16,
    padding: '8px 24px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.875rem',
    boxShadow: isDarkMode 
        ? '0 4px 12px rgba(0, 0, 0, 0.2)' 
        : '0 4px 12px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.2s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: isDarkMode 
            ? '0 6px 16px rgba(0, 0, 0, 0.3)' 
            : '0 6px 16px rgba(0, 0, 0, 0.12)',
    },
}));

const StatusChip = styled(Chip)(({ status, theme }) => ({
    backgroundColor: STATUS_COLORS[status]?.bgColor,
    color: STATUS_COLORS[status]?.color,
    fontWeight: 600,
    borderRadius: 16,
    padding: '0 8px',
    border: theme.palette.mode === 'dark' 
        ? `1px solid ${STATUS_COLORS[status]?.color}20`
        : 'none',
}));

const DetailSection = styled(Box)(({ isDarkMode }) => ({
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(6, 169, 174, 0.02)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: isDarkMode 
        ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
        : '0 2px 8px rgba(0, 0, 0, 0.04)',
    borderLeft: `4px solid ${COLORS.primary}`,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: isDarkMode 
            ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
            : '0 4px 12px rgba(0, 0, 0, 0.08)',
    }
}));

const DetailHeading = styled(Typography)({
    fontWeight: 700,
    color: COLORS.primary,
    marginBottom: 12,
    display: 'flex',
    alignItems: 'center',
    '&::before': {
        content: '""',
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: COLORS.primary,
        marginRight: 8
    }
});

const DetailContent = styled(Typography)(({ isDarkMode }) => ({
    color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary,
    whiteSpace: 'pre-wrap',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    padding: '0 8px'
}));

const InfoGrid = styled(Box)(({ isDarkMode }) => ({
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
    gap: 24,
    padding: 20,
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(6, 169, 174, 0.02)',
    borderRadius: 12,
    border: isDarkMode 
        ? `1px solid rgba(255,255,255,0.1)` 
        : `1px solid rgba(6, 169, 174, 0.1)`,
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
            <Container maxWidth="lg" sx={{
                minHeight: '100vh',
                background: isDarkMode 
                    ? 'linear-gradient(135deg, #1E1E1E 0%, #2D3436 100%)'
                    : 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
                py: 6,
                px: { xs: 3, md: 5 },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={50} sx={{ color: COLORS.primary }} />
                    <Typography variant="body1" sx={{ color: isDarkMode ? '#fff' : COLORS.text.primary }}>
                        Đang tải thông tin...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{
                minHeight: '100vh',
                background: isDarkMode 
                    ? 'linear-gradient(135deg, #1E1E1E 0%, #2D3436 100%)'
                    : 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
                py: 6,
                px: { xs: 3, md: 5 }
            }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={onBack}
                    sx={{ 
                        mb: 3,
                        color: isDarkMode ? '#fff' : 'inherit',
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'inherit',
                        '&:hover': {
                            borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'inherit',
                        }
                    }}
                >
                    Quay lại
                </Button>
                <Alert 
                    severity="error" 
                    sx={{ 
                        borderLeft: `4px solid ${COLORS.error}`, 
                        borderRadius: 2,
                        bgcolor: isDarkMode ? 'rgba(255, 72, 66, 0.15)' : 'rgba(255, 72, 66, 0.08)',
                    }}
                >
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!lessonDetail) {
        return (
            <Container maxWidth="lg" sx={{
                minHeight: '100vh',
                background: isDarkMode 
                    ? 'linear-gradient(135deg, #1E1E1E 0%, #2D3436 100%)'
                    : 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
                py: 6,
                px: { xs: 3, md: 5 }
            }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={onBack}
                    sx={{ 
                        mb: 3,
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
                    variant="body1"
                    sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary }}
                >
                    Không tìm thấy thông tin giáo án
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{
            minHeight: '100vh',
            background: isDarkMode 
                ? 'linear-gradient(135deg, #1E1E1E 0%, #2D3436 100%)'
                : 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
            py: 6,
            px: { xs: 3, md: 5 },
            overflowY: 'auto'
        }}>
            <Fade in timeout={500}>
                <Box>
                    <DashboardCard isDarkMode={isDarkMode} sx={{ p: 3, mb: 3 }}>
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
                                        backgroundColor: isDarkMode ? COLORS.hover.primary : COLORS.hover.primary,
                                    }
                                }}
                            >
                                Quay lại
                            </Button>

                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: 700, 
                                    flex: 1,
                                    color: isDarkMode ? '#fff' : COLORS.text.primary,
                                    lineHeight: 1.2,
                                }}
                            >
                                Chi tiết giáo án
                            </Typography>

                            <StatusChip
                                label={STATUS_COLORS[lessonDetail.status]?.label || lessonDetail.status}
                                status={lessonDetail.status}
                                size="medium"
                                sx={{ fontSize: '0.875rem', fontWeight: 700 }}
                            />
                        </Box>

                        <Divider sx={{ 
                            mb: 3,
                            bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' 
                        }} />

                        {/* Summary information */}
                        <InfoGrid isDarkMode={isDarkMode}>
                            <Box>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary,
                                        fontWeight: 500,
                                        mb: 1
                                    }} 
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
                                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary,
                                        fontWeight: 500,
                                        mb: 1
                                    }} 
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
                                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary,
                                        fontWeight: 500,
                                        mb: 1
                                    }} 
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
                                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary,
                                        fontWeight: 500,
                                        mb: 1
                                    }} 
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
                                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary,
                                        fontWeight: 500,
                                        mb: 1
                                    }} 
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
                                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary,
                                        fontWeight: 500,
                                        mb: 1
                                    }} 
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
                        </InfoGrid>

                        {/* Detail sections */}
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                mt: 4,
                                mb: 3, 
                                fontWeight: 600, 
                                color: isDarkMode ? '#fff' : COLORS.text.primary 
                            }}
                        >
                            Nội dung giáo án
                        </Typography>

                        <DetailSection isDarkMode={isDarkMode}>
                            <DetailHeading variant="subtitle1">🚀 Hoạt động Khởi động</DetailHeading>
                            <DetailContent isDarkMode={isDarkMode}>{lessonDetail.startUp}</DetailContent>
                        </DetailSection>

                        <DetailSection isDarkMode={isDarkMode}>
                            <DetailHeading variant="subtitle1">📚 Hoạt động Hình thành kiến thức</DetailHeading>
                            <DetailContent isDarkMode={isDarkMode}>{lessonDetail.knowledge}</DetailContent>
                        </DetailSection>

                        <DetailSection isDarkMode={isDarkMode}>
                            <DetailHeading variant="subtitle1">🎯 Mục tiêu</DetailHeading>
                            <DetailContent isDarkMode={isDarkMode}>{lessonDetail.goal}</DetailContent>
                        </DetailSection>

                        <DetailSection isDarkMode={isDarkMode}>
                            <DetailHeading variant="subtitle1">🛠️ Đồ dùng học tập</DetailHeading>
                            <DetailContent isDarkMode={isDarkMode}>{lessonDetail.schoolSupply}</DetailContent>
                        </DetailSection>

                        <DetailSection isDarkMode={isDarkMode}>
                            <DetailHeading variant="subtitle1">💪 Hoạt động Luyện tập</DetailHeading>
                            <DetailContent isDarkMode={isDarkMode}>{lessonDetail.practice}</DetailContent>
                        </DetailSection>

                        <DetailSection isDarkMode={isDarkMode}>
                            <DetailHeading variant="subtitle1">✨ Hoạt động Vận dụng</DetailHeading>
                            <DetailContent isDarkMode={isDarkMode}>{lessonDetail.apply}</DetailContent>
                        </DetailSection>
                    </DashboardCard>

                    {/* Action buttons at the bottom */}
                    <DashboardCard isDarkMode={isDarkMode} sx={{
                        p: 3,
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Stack direction="row" spacing={3}>
                            <ActionButton
                                variant="contained"
                                color="success"
                                startIcon={<CheckIcon />}
                                onClick={() => onApprove(lessonDetail.lessonPlanId)}
                                disabled={lessonDetail.status === "Approved"}
                                sx={{ 
                                    px: 4, 
                                    py: 1.5,
                                    fontSize: '1rem',
                                    backgroundColor: COLORS.success,
                                    '&:hover': {
                                        backgroundColor: '#2e7d32'
                                    }
                                }}
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
                                sx={{ 
                                    px: 4, 
                                    py: 1.5,
                                    fontSize: '1rem',
                                    backgroundColor: COLORS.error,
                                    '&:hover': {
                                        backgroundColor: '#d32f2f'
                                    }
                                }}
                                isDarkMode={isDarkMode}
                            >
                                Từ chối
                            </ActionButton>
                        </Stack>
                    </DashboardCard>

                    {/* Reject Reason Dialog */}
                    <Dialog
                        open={openRejectDialog}
                        onClose={handleCloseRejectDialog}
                        PaperProps={{
                            style: {
                                borderRadius: '16px',
                                padding: '8px',
                                maxWidth: '500px',
                                background: isDarkMode ? '#1E1E1E' : COLORS.background.paper,
                                boxShadow: isDarkMode 
                                    ? '0 8px 24px rgba(0, 0, 0, 0.3)' 
                                    : '0 8px 24px rgba(0, 0, 0, 0.12)',
                            }
                        }}
                    >
                        <DialogTitle sx={{
                            fontWeight: 600,
                            color: COLORS.error,
                            textAlign: 'center',
                            pt: 3,
                            fontSize: '1.25rem'
                        }}>
                            Từ chối giáo án
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText sx={{ 
                                mb: 2,
                                color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary,
                                textAlign: 'center'
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
                                        borderRadius: 2,
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
                                        backgroundColor: isDarkMode ? COLORS.hover.primary : COLORS.hover.primary,
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
                                sx={{ 
                                    borderRadius: 2, 
                                    px: 3,
                                    backgroundColor: COLORS.error,
                                    '&:hover': {
                                        backgroundColor: '#d32f2f'
                                    }
                                }}
                            >
                                Xác nhận
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Fade>
        </Container>
    );
};

export default ContentApprovalDetail; 