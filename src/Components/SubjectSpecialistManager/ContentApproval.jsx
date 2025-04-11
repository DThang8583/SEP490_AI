import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Pagination,
    CircularProgress,
    Chip,
    InputAdornment,
    Button,
    Stack,
    Alert,
    Fade,
    Divider,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import {
    Search as SearchIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    School as SchoolIcon,
    ArrowBack as ArrowBackIcon,
    Article as ArticleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const TEACHER_LESSONS_API = 'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/teacher-lessons';
const USERS_API = 'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users';

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
const ActionButton = styled(Button)({
    borderRadius: 16,
    padding: '6px 16px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.875rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    '&:hover': {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
});

const SearchTextField = styled(TextField)({
    marginBottom: 16,
    '& .MuiOutlinedInput-root': {
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        transition: 'all 0.3s ease',
        '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        },
        '&.Mui-focused': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        },
    },
});

const StatusChip = styled(Chip)(({ status }) => ({
    backgroundColor: STATUS_COLORS[status]?.bgColor,
    color: STATUS_COLORS[status]?.color,
    fontWeight: 600,
    borderRadius: 16,
    padding: '0 8px',
}));

const DetailSection = styled(Box)({
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
});

const DetailHeading = styled(Typography)({
    fontWeight: 600,
    color: COLORS.text.primary,
    marginBottom: 8,
});

const DetailContent = styled(Typography)({
    color: COLORS.text.secondary,
    whiteSpace: 'pre-wrap',
    fontSize: '0.9rem',
});

// Detail View Component
const LessonDetailView = ({ lessonId, onBack, onApprove, onReject }) => {
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
        onReject(lessonDetail.teacherLessonId, rejectReason.trim());
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
                <Typography color="text.secondary">Không tìm thấy thông tin bài giảng</Typography>
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
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                        background: COLORS.background.paper,
                        mb: 3
                    }}
                >
                    {/* Header with back button */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={onBack}
                            sx={{ mr: 2 }}
                        >
                            Quay lại
                        </Button>

                        <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
                            Chi tiết bài giảng
                        </Typography>

                        <StatusChip
                            label={STATUS_COLORS[lessonDetail.status]?.label || lessonDetail.status}
                            status={lessonDetail.status}
                            size="small"
                            sx={{ fontSize: '0.875rem' }}
                        />
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Summary information */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
                        gap: 3,
                        mb: 3,
                        bgcolor: 'rgba(0, 0, 0, 0.02)',
                        p: 2,
                        borderRadius: 2
                    }}>
                        <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>Giáo viên</Typography>
                            <Typography variant="body1" fontWeight={600}>{lessonDetail.fullname}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>Chủ đề</Typography>
                            <Typography variant="body1" fontWeight={600}>{lessonDetail.module}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>Khối</Typography>
                            <Typography variant="body1" fontWeight={600}>{lessonDetail.grade}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>Bài</Typography>
                            <Typography variant="body1" fontWeight={600}>{lessonDetail.lesson}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>Số tiết</Typography>
                            <Typography variant="body1" fontWeight={600}>{lessonDetail.totalPeriods}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>Ngày tạo</Typography>
                            <Typography variant="body1" fontWeight={600}>{lessonDetail.createdAt}</Typography>
                        </Box>
                    </Box>

                    {/* Detail sections */}
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: COLORS.text.primary }}>
                        Nội dung bài giảng
                    </Typography>

                    <DetailSection>
                        <DetailHeading variant="subtitle1">Khởi động</DetailHeading>
                        <DetailContent>{lessonDetail.startUp}</DetailContent>
                    </DetailSection>

                    <DetailSection>
                        <DetailHeading variant="subtitle1">Kiến thức</DetailHeading>
                        <DetailContent>{lessonDetail.knowledge}</DetailContent>
                    </DetailSection>

                    <DetailSection>
                        <DetailHeading variant="subtitle1">Mục tiêu</DetailHeading>
                        <DetailContent>{lessonDetail.goal}</DetailContent>
                    </DetailSection>

                    <DetailSection>
                        <DetailHeading variant="subtitle1">Đồ dùng học tập</DetailHeading>
                        <DetailContent>{lessonDetail.schoolSupply}</DetailContent>
                    </DetailSection>

                    <DetailSection>
                        <DetailHeading variant="subtitle1">Thực hành</DetailHeading>
                        <DetailContent>{lessonDetail.practice}</DetailContent>
                    </DetailSection>

                    <DetailSection>
                        <DetailHeading variant="subtitle1">Ứng dụng</DetailHeading>
                        <DetailContent>{lessonDetail.apply}</DetailContent>
                    </DetailSection>
                </Paper>

                {/* Action buttons at the bottom */}
                <Paper sx={{
                    p: 3,
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    background: COLORS.background.paper,
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Stack direction="row" spacing={2}>
                        <ActionButton
                            variant="contained"
                            color="success"
                            startIcon={<CheckIcon />}
                            onClick={() => onApprove(lessonDetail.teacherLessonId)}
                            disabled={lessonDetail.status === "Approved"}
                            sx={{ px: 4, py: 1 }}
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
                        }
                    }}
                >
                    <DialogTitle sx={{
                        fontWeight: 600,
                        color: COLORS.error,
                        textAlign: 'center',
                        pt: 3
                    }}>
                        Từ chối bài giảng
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ mb: 2 }}>
                            Vui lòng nhập lý do từ chối bài giảng này:
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
                            sx={{ mt: 1 }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
                        <Button
                            onClick={handleCloseRejectDialog}
                            variant="outlined"
                            sx={{ borderRadius: 2, px: 3 }}
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

const ContentApproval = () => {
    // State variables
    const [lessons, setLessons] = useState([]);
    const [filteredLessons, setFilteredLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [userGrade, setUserGrade] = useState(null);
    const [selectedLessonId, setSelectedLessonId] = useState(null);

    // Get user's grade from local storage/user info
    const getUserGrade = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));

            if (!accessToken || !userInfo?.id) {
                throw new Error('Vui lòng đăng nhập để xem nội dung.');
            }

            const response = await axios.get(`${USERS_API}/${userInfo.id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const userData = response.data.data;
            let gradeNumber = userData.grade;

            if (typeof gradeNumber === 'string') {
                const gradeMatch = gradeNumber.match(/\d+/);
                gradeNumber = gradeMatch ? parseInt(gradeMatch[0], 10) : null;
            }

            if (!gradeNumber) {
                throw new Error('Không thể xác định khối từ thông tin người dùng.');
            }

            return gradeNumber;
        } catch (err) {
            console.error('Error getting user grade:', err);
            throw new Error(`Lỗi khi lấy thông tin khối: ${err.message}`);
        }
    }, []);

    // Fetch data function
    const fetchLessons = useCallback(async () => {
        setLoading(true);
        try {
            // First get user's grade
            const grade = await getUserGrade();
            setUserGrade(grade);

            // Then fetch lessons with status=2 (Pending)
            const response = await axios.get(TEACHER_LESSONS_API, {
                params: {
                    searchTerm,
                    status: 2, // Default status is 2 (Pending) - Using hardcoded value instead of state
                    page,
                    pageSize
                }
            });

            const { data } = response.data;

            // Store all lessons
            setLessons(data.items);

            // Filter lessons by user's grade
            const gradeFilteredLessons = data.items.filter(lesson => lesson.grade === grade);
            setFilteredLessons(gradeFilteredLessons);

            // Calculate total pages based on filtered results
            const filteredTotalPages = Math.ceil(gradeFilteredLessons.length / pageSize);
            setTotalPages(filteredTotalPages > 0 ? filteredTotalPages : 1);
        } catch (err) {
            setError('Lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
            console.error('Error fetching lessons:', err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, page, pageSize, getUserGrade]);

    // Fetch data when component mounts or when filter/pagination params change
    useEffect(() => {
        fetchLessons();
    }, [fetchLessons]);

    // Filter lessons when search term changes
    useEffect(() => {
        if (lessons.length > 0 && userGrade) {
            let filtered = lessons.filter(lesson => lesson.grade === userGrade);

            if (searchTerm) {
                filtered = filtered.filter(lesson =>
                    lesson.lesson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lesson.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lesson.fullname.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            setFilteredLessons(filtered);

            // Recalculate total pages
            const filteredTotalPages = Math.ceil(filtered.length / pageSize);
            setTotalPages(filteredTotalPages > 0 ? filteredTotalPages : 1);

            // Reset to page 1 if current page is out of bounds
            if (page > filteredTotalPages) {
                setPage(1);
            }
        }
    }, [searchTerm, lessons, userGrade, pageSize, page]);

    // Handle page change
    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    // Handle lesson selection
    const handleLessonSelect = (lessonId) => {
        setSelectedLessonId(lessonId);
    };

    // Handle back to list
    const handleBackToList = () => {
        setSelectedLessonId(null);
    };

    // Handle approval action
    const handleApprove = async (lessonId) => {
        try {
            // Use the approve endpoint instead of status update
            await axios.put(`${TEACHER_LESSONS_API}/${lessonId}/approve`);
            await fetchLessons();
            if (selectedLessonId) {
                // If we're in detail view, go back to list after approval
                setSelectedLessonId(null);
            }
        } catch (error) {
            console.error('Error approving lesson:', error);
        }
    };

    // Modified handleReject function to send just the string value
    const handleReject = async (lessonId, reason) => {
        try {
            console.log('Rejecting lesson:', lessonId);
            console.log('Reason:', reason);

            // Send reason as a JSON string (without property name)
            const response = await axios.put(
                `${TEACHER_LESSONS_API}/${lessonId}/reject`,
                JSON.stringify(reason), // Convert the string to a JSON string
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            console.log('Rejection response:', response);
            await fetchLessons();
            if (selectedLessonId) {
                // If we're in detail view, go back to list after rejection
                setSelectedLessonId(null);
            }
        } catch (error) {
            console.error('Error rejecting lesson:', error.response?.data || error);
        }
    };

    // Get paginated lessons
    const getPaginatedLessons = () => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredLessons.slice(startIndex, endIndex);
    };

    // Loading state
    if (loading && filteredLessons.length === 0) {
        return (
            <Box
                sx={{
                    width: 'calc(100% - 78px)',  // Account for sidebar width (78px)
                    height: '100vh',
                    background: COLORS.background.default,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'fixed',
                    top: 0,
                    left: '78px',  // Leave space for sidebar (78px)
                    right: 0,
                    bottom: 0,
                    zIndex: 1100
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={50} sx={{ color: COLORS.primary }} />
                    <Typography variant="body1" sx={{ color: COLORS.text.secondary }}>
                        Đang tải thông tin...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: 'calc(100% - 78px)',  // Account for sidebar width (78px)
                height: '100vh',
                background: COLORS.background.default,
                position: 'fixed',
                top: 0,
                left: '78px',  // Leave space for sidebar (78px)
                right: 0,
                bottom: 0,
                overflow: 'auto',
                zIndex: 1100,
                paddingTop: 0,  // Remove top padding to avoid navbar
            }}
        >
            {selectedLessonId ? (
                <LessonDetailView
                    lessonId={selectedLessonId}
                    onBack={handleBackToList}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            ) : (
                <Fade in timeout={500}>
                    <Box sx={{ py: 3, px: { xs: 2, md: 3 } }}>
                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                                background: COLORS.background.paper
                            }}
                        >
                            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                                <SchoolIcon sx={{ fontSize: 36, color: COLORS.primary, mr: 2 }} />
                                <Box>
                                    <Typography
                                        variant="h5"
                                        component="h2"
                                        sx={{
                                            fontWeight: 700,
                                            color: COLORS.text.primary
                                        }}
                                    >
                                        Duyệt nội dung
                                    </Typography>
                                    {userGrade && (
                                        <Typography variant="subtitle1" sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
                                            Quản lý nội dung khối {userGrade}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>

                            {error && (
                                <Alert
                                    severity="error"
                                    sx={{ mb: 3, borderLeft: `4px solid ${COLORS.error}`, borderRadius: 2 }}
                                >
                                    {error}
                                </Alert>
                            )}

                            {/* Search Box */}
                            <Box sx={{ mb: 3 }}>
                                <SearchTextField
                                    fullWidth
                                    placeholder="Tìm kiếm..."
                                    variant="outlined"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: COLORS.text.secondary }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            {/* Data Table */}
                            {filteredLessons.length === 0 && !loading ? (
                                <Box
                                    sx={{
                                        p: 4,
                                        textAlign: 'center',
                                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                        borderRadius: 2,
                                        borderStyle: 'dashed',
                                        borderWidth: 1,
                                        borderColor: '#ddd',
                                        mb: 3
                                    }}
                                >
                                    <Typography variant="body1" color={COLORS.text.secondary}>
                                        {searchTerm
                                            ? `Không tìm thấy bài giảng nào với từ khóa "${searchTerm}"`
                                            : `Không có bài học nào cần duyệt cho khối ${userGrade}.`}
                                    </Typography>
                                </Box>
                            ) : (
                                <TableContainer
                                    sx={{
                                        borderRadius: 2,
                                        mb: 3,
                                        overflowX: 'auto',
                                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
                                    }}
                                >
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: COLORS.background.secondary }}>
                                                <TableCell sx={{ fontWeight: 600, color: COLORS.text.primary }}>Giáo viên</TableCell>
                                                <TableCell sx={{ fontWeight: 600, color: COLORS.text.primary }}>Bài</TableCell>
                                                <TableCell sx={{ fontWeight: 600, color: COLORS.text.primary }}>Chủ đề</TableCell>
                                                <TableCell sx={{ fontWeight: 600, color: COLORS.text.primary }}>Trạng thái</TableCell>
                                                <TableCell sx={{ fontWeight: 600, color: COLORS.text.primary }}>Ngày tạo</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {getPaginatedLessons().map((lesson) => (
                                                <TableRow
                                                    key={lesson.teacherLessonId}
                                                    hover
                                                    sx={{
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.01)'
                                                        }
                                                    }}
                                                    onClick={() => handleLessonSelect(lesson.teacherLessonId)}
                                                >
                                                    <TableCell>{lesson.fullname}</TableCell>
                                                    <TableCell>{lesson.lesson}</TableCell>
                                                    <TableCell>{lesson.module}</TableCell>
                                                    <TableCell>
                                                        <StatusChip
                                                            label={STATUS_COLORS[lesson.status]?.label || lesson.status}
                                                            status={lesson.status}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>{lesson.createdAt}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            {/* Pagination */}
                            {filteredLessons.length > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={handlePageChange}
                                        color="primary"
                                        shape="rounded"
                                        sx={{
                                            '& .MuiPaginationItem-root': {
                                                fontWeight: 600,
                                                color: COLORS.text.secondary,
                                            },
                                            '& .Mui-selected': {
                                                backgroundColor: COLORS.primary,
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: COLORS.primary,
                                                },
                                            },
                                        }}
                                    />
                                </Box>
                            )}
                        </Paper>
                    </Box>
                </Fade>
            )}
        </Box>
    );
};

export default ContentApproval;

