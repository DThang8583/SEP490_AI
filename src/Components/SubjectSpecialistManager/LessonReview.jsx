import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    List,
    ListItem,
    Button,
    Paper,
    IconButton,
    Grid,
    Divider,
    Container,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Fade,
    Pagination,
    Chip,
    TextField,
    InputAdornment,
} from '@mui/material';
import {
    Check as CheckIcon,
    Close as CloseIcon,
    FilterList as FilterListIcon,
    Assignment as AssignmentIcon,
    School as SchoolIcon,
    Bookmark as BookmarkIcon,
    Person as PersonIcon,
    Search as SearchIcon,
    Clear as ClearIcon,
    ArrowBack as ArrowBackIcon,
    Article as ArticleIcon,
    Event as EventIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// API URL
const TEACHER_LESSONS_API_URL = 'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/teacher-lessons';

// Palette colors
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
    status: {
        approved: {
            bg: 'rgba(0, 171, 85, 0.08)',
            text: '#00AB55',
        },
        rejected: {
            bg: 'rgba(255, 72, 66, 0.08)',
            text: '#FF4842',
        },
    },
};

// Styled components
const DashboardCard = styled(Card)({
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    height: '100%',
    background: COLORS.background.paper,
});

const CardHeader = styled(Box)(({ bgcolor }) => ({
    padding: '16px',
    background: bgcolor || COLORS.primary,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
}));

const StyledListItem = styled(ListItem)(({ isapproved }) => ({
    backgroundColor: COLORS.background.paper,
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    boxShadow: '0 3px 6px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 6px 12px rgba(0,0,0,0.12)',
    },
    position: 'relative',
    cursor: 'pointer',
    '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '4px',
        height: '100%',
        backgroundColor: isapproved === 'true' ? COLORS.success : COLORS.error,
        opacity: 0.7,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
}));

const FilterButton = styled(Button)(({ active, isReject }) => ({
    borderRadius: 16,
    padding: '12px 24px',
    textTransform: 'none',
    backgroundColor: active ? (isReject ? COLORS.error : COLORS.primary) : 'rgba(255, 255, 255, 0.8)',
    color: active ? '#fff' : isReject ? COLORS.error : COLORS.text.primary,
    fontWeight: 600,
    fontSize: '1.1rem',
    boxShadow: active ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
    '&:hover': {
        backgroundColor: active ? (isReject ? COLORS.error : COLORS.primary) : (isReject ? 'rgba(255, 72, 66, 0.1)' : 'rgba(255, 255, 255, 0.9)'),
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
}));

const StatusBadge = styled(Chip)(({ status }) => ({
    backgroundColor: status === 'Approved' ? COLORS.status.approved.bg : COLORS.status.rejected.bg,
    color: status === 'Approved' ? COLORS.status.approved.text : COLORS.status.rejected.text,
    fontWeight: 600,
    borderRadius: 16,
    '.MuiChip-icon': {
        color: status === 'Approved' ? COLORS.status.approved.text : COLORS.status.rejected.text,
    }
}));

const InfoChip = styled(Chip)({
    margin: '4px 4px 4px 0',
    borderRadius: 12,
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    color: COLORS.secondary,
    '.MuiChip-icon': {
        color: COLORS.secondary,
    }
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

const DetailSection = styled(Box)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    borderLeft: `4px solid ${COLORS.primary}`,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
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

const DetailContent = styled(Typography)({
    color: COLORS.text.secondary,
    whiteSpace: 'pre-wrap',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    padding: '0 8px'
});

// Lesson Detail View Component
const LessonDetailView = ({ lessonId, onBack }) => {
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
                        p: { xs: 2, md: 4 },
                        borderRadius: 3,
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                        background: COLORS.background.paper,
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
                        background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`
                    }} />

                    {/* Header with back button */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, mt: 1 }}>
                        <Button
                            variant="contained"
                            startIcon={<ArrowBackIcon />}
                            onClick={onBack}
                            sx={{
                                mr: 2,
                                bgcolor: 'white',
                                color: COLORS.primary,
                                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    bgcolor: 'rgba(6, 169, 174, 0.1)',
                                }
                            }}
                        >
                            Quay lại
                        </Button>

                        <Typography variant="h5" sx={{ fontWeight: 700, flex: 1, color: COLORS.text.primary }}>
                            Chi tiết bài giảng
                        </Typography>

                        <StatusBadge
                            label={lessonDetail.status}
                            status={lessonDetail.status}
                            size="medium"
                            icon={lessonDetail.status === 'Approved' ? <CheckIcon /> : <CloseIcon />}
                            sx={{ fontSize: '0.9rem', fontWeight: 700, px: 2, py: 1 }}
                        />
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    {/* Title section */}
                    <Box sx={{
                        mb: 4,
                        p: 3,
                        borderRadius: 2,
                        bgcolor: 'rgba(6, 169, 174, 0.05)',
                        border: '1px solid rgba(6, 169, 174, 0.1)'
                    }}>
                        <Typography variant="h4" sx={{
                            fontWeight: 700,
                            color: COLORS.primary,
                            textAlign: 'center',
                            mb: 2
                        }}>
                            {lessonDetail.lesson || 'Không có tiêu đề'}
                        </Typography>
                    </Box>

                    {/* Basic information section - now using cards instead of chips */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: '#f8f9fa',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <PersonIcon sx={{ color: COLORS.secondary }} />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Giáo viên</Typography>
                                        <Typography variant="body1" fontWeight={600}>{lessonDetail.fullname || 'Không xác định'}</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <BookmarkIcon sx={{ color: COLORS.secondary }} />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Chủ đề</Typography>
                                        <Typography variant="body1" fontWeight={600}>{lessonDetail.module || 'Không xác định'}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: '#f8f9fa',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <SchoolIcon sx={{ color: COLORS.secondary }} />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Khối</Typography>
                                        <Typography variant="body1" fontWeight={600}>{lessonDetail.grade || 'Không xác định'}</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <EventIcon sx={{ color: COLORS.secondary }} />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Ngày tạo</Typography>
                                        <Typography variant="body1" fontWeight={600}>{lessonDetail.createdAt || 'Không xác định'}</Typography>
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
                            bgcolor: 'rgba(255, 72, 66, 0.05)',
                            border: '1px solid rgba(255, 72, 66, 0.2)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2
                        }}>
                            <CloseIcon sx={{ color: COLORS.error, mt: 0.5 }} />
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: COLORS.error, mb: 1 }}>
                                    Lý do từ chối
                                </Typography>
                                <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
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
                        <ArticleIcon sx={{ color: COLORS.primary }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.text.primary }}>
                            Nội dung bài giảng
                        </Typography>
                        <Divider sx={{ flex: 1, ml: 2 }} />
                    </Box>

                    {/* Lesson content sections */}
                    {!lessonDetail.startUp && !lessonDetail.knowledge && !lessonDetail.goal &&
                        !lessonDetail.schoolSupply && !lessonDetail.practice && !lessonDetail.apply &&
                        !lessonDetail.description && (
                            <Box sx={{
                                p: 4,
                                textAlign: 'center',
                                bgcolor: 'rgba(0,0,0,0.02)',
                                borderRadius: 2,
                                border: '1px dashed rgba(0,0,0,0.1)'
                            }}>
                                <Typography color="text.secondary">Không có nội dung chi tiết</Typography>
                            </Box>
                        )}

                    {/* Hiển thị các phần chi tiết của bài giảng */}
                    {lessonDetail.startUp && (
                        <DetailSection>
                            <DetailHeading variant="subtitle1">Khởi động</DetailHeading>
                            <DetailContent>{lessonDetail.startUp}</DetailContent>
                        </DetailSection>
                    )}

                    {lessonDetail.goal && (
                        <DetailSection>
                            <DetailHeading variant="subtitle1">Mục tiêu</DetailHeading>
                            <DetailContent>{lessonDetail.goal}</DetailContent>
                        </DetailSection>
                    )}

                    {lessonDetail.knowledge && (
                        <DetailSection>
                            <DetailHeading variant="subtitle1">Kiến thức</DetailHeading>
                            <DetailContent>{lessonDetail.knowledge}</DetailContent>
                        </DetailSection>
                    )}

                    {lessonDetail.schoolSupply && (
                        <DetailSection>
                            <DetailHeading variant="subtitle1">Đồ dùng học tập</DetailHeading>
                            <DetailContent>{lessonDetail.schoolSupply}</DetailContent>
                        </DetailSection>
                    )}

                    {lessonDetail.practice && (
                        <DetailSection>
                            <DetailHeading variant="subtitle1">Thực hành</DetailHeading>
                            <DetailContent>{lessonDetail.practice}</DetailContent>
                        </DetailSection>
                    )}

                    {lessonDetail.apply && (
                        <DetailSection>
                            <DetailHeading variant="subtitle1">Ứng dụng</DetailHeading>
                            <DetailContent>{lessonDetail.apply}</DetailContent>
                        </DetailSection>
                    )}

                    {lessonDetail.description && (
                        <DetailSection>
                            <DetailHeading variant="subtitle1">Mô tả thêm</DetailHeading>
                            <DetailContent>{lessonDetail.description}</DetailContent>
                        </DetailSection>
                    )}
                </Paper>
            </Box>
        </Fade>
    );
};

// Lesson item component
const LessonItem = ({ lesson, handleViewDetail }) => {
    const isApproved = lesson.status === 'Approved';

    return (
        <StyledListItem
            isapproved={isApproved.toString()}
            onClick={handleViewDetail}
            sx={{
                transition: 'all 0.2s ease',
                '&:active': {
                    transform: 'scale(0.98)',
                    opacity: 0.9,
                },
            }}
        >
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={9}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{lesson.title}</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <InfoChip
                            size="small"
                            icon={<PersonIcon />}
                            label={lesson.teacherName}
                        />
                        <InfoChip
                            size="small"
                            icon={<SchoolIcon />}
                            label={`Khối ${lesson.grade}`}
                        />
                        <InfoChip
                            size="small"
                            icon={<BookmarkIcon />}
                            label={lesson.module}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <StatusBadge
                            status={lesson.status}
                            label={isApproved ? 'Đã duyệt' : 'Đã từ chối'}
                            icon={isApproved ? <CheckIcon /> : <CloseIcon />}
                        />
                    </Box>
                </Grid>
            </Grid>
        </StyledListItem>
    );
};

// Main component
const LessonReview = () => {
    const [lessons, setLessons] = useState([]);
    const [userGradeNumber, setUserGradeNumber] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('Approved');
    const [searchTerm, setSearchTerm] = useState('');
    // State để lưu trữ ID của bài giảng đang xem chi tiết
    const [selectedLessonId, setSelectedLessonId] = useState(null);

    // Pagination states
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    // Add pagination state
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0
    });

    // Fetch user's grade number
    const getUserGradeNumber = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));

            if (!accessToken || !userInfo?.id) {
                throw new Error('Vui lòng đăng nhập để xem bài học.');
            }

            const response = await axios.get(`${TEACHER_LESSONS_API_URL.replace('teacher-lessons', 'users')}/${userInfo.id}`, {
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
            throw new Error(`Lỗi khi lấy thông tin khối: ${err.message}`);
        }
    }, []);

    // Fetch lessons from API
    const fetchLessons = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) throw new Error('Không tìm thấy access token. Vui lòng đăng nhập lại.');

            // Lấy thông tin khối của người dùng
            const gradeNumber = await getUserGradeNumber();
            setUserGradeNumber(gradeNumber);

            const fetchByStatus = async (status) => {
                const statusParam = status === 'Approved' ? 3 : 4;
                // Thêm tham số Grade=gradeNumber vào API request
                const response = await axios.get(`${TEACHER_LESSONS_API_URL}?Status=${statusParam}&Page=${page}&PageSize=${itemsPerPage}&Grade=${gradeNumber}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                if (response.data.code === 0) {
                    const items = response.data.data?.items || [];

                    // Lọc items theo grade của user
                    const filteredItems = items.filter(item => item.grade === gradeNumber);

                    const processedItems = filteredItems.map(item => ({
                        id: item.teacherLessonId,
                        title: item.lesson || 'Không có tiêu đề',
                        teacherName: item.fullname || 'Không xác định',
                        module: item.module || 'Không xác định',
                        grade: item.grade || null,
                        status: item.status,
                        createdAt: item.createdAt,
                        disapprovedReason: item.disapprovedReason || 'Không có lý do'
                    }));

                    // Update pagination info
                    const { currentPage, totalPages, totalRecords } = response.data.data;
                    setPagination({
                        currentPage,
                        totalPages,
                        totalRecords
                    });

                    return processedItems;
                }
                return [];
            };

            const lessons = await fetchByStatus(filterStatus);
            setLessons(lessons);
        } catch (err) {
            setError(`Lỗi khi tải dữ liệu: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [filterStatus, page, itemsPerPage, getUserGradeNumber]);

    useEffect(() => {
        fetchLessons();
    }, [fetchLessons]);

    // Handler cho việc chọn bài giảng để xem chi tiết
    const handleLessonSelect = (lessonId) => {
        setSelectedLessonId(lessonId);
    };

    // Handler để quay lại danh sách từ trang chi tiết
    const handleBackToList = () => {
        setSelectedLessonId(null);
    };

    // Update handle page change to fetch data when page changes
    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(1); // Reset to first page on search
    };

    // Clear search term
    const handleClearSearch = () => {
        setSearchTerm('');
        setPage(1);
    };

    // No need for filteredAndPaginatedLessons since the API handles pagination
    // Update totalPages to use the value from API
    const totalPages = pagination.totalPages;

    // Loading state
    if (loading) {
        return (
            <Box
                sx={{
                    width: '100%',
                    minHeight: '100vh',
                    background: COLORS.background.default,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 3
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
                width: '100%',
                minHeight: '100vh',
                background: COLORS.background.default,
                padding: 3,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1100,
                overflow: 'auto'
            }}
        >
            {/* Nếu đang xem chi tiết thì hiển thị component chi tiết */}
            {selectedLessonId ? (
                <LessonDetailView
                    lessonId={selectedLessonId}
                    onBack={handleBackToList}
                />
            ) : (
                /* Ngược lại hiển thị danh sách bài giảng */
                <Box sx={{ py: 4, px: 3 }}>
                    <Container maxWidth="lg">
                        <Fade in timeout={500}>
                            <Box>
                                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                                    <AssignmentIcon sx={{ fontSize: 36, color: COLORS.primary, mr: 2 }} />
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.text.primary }}>
                                            Bài giảng đã xem xét
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
                                            Quản lý bài giảng khối {userGradeNumber || '?'}
                                        </Typography>
                                    </Box>
                                </Box>

                                {error && (
                                    <Alert
                                        severity="error"
                                        sx={{
                                            mb: 4,
                                            borderLeft: `4px solid ${COLORS.error}`,
                                            borderRadius: 2
                                        }}
                                    >
                                        {error}
                                    </Alert>
                                )}

                                <DashboardCard>
                                    <CardHeader>
                                        <Box display="flex" alignItems="center">
                                            <FilterListIcon sx={{ mr: 1 }} />
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                Danh sách bài giảng - Khối {userGradeNumber}
                                            </Typography>
                                        </Box>
                                    </CardHeader>
                                    <CardContent sx={{ p: 3 }}>
                                        {/* Filter buttons */}
                                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                            <FilterButton
                                                active={filterStatus === 'Approved'}
                                                onClick={() => setFilterStatus('Approved')}
                                                startIcon={<CheckIcon />}
                                                isReject={false}
                                            >
                                                Đã duyệt
                                            </FilterButton>
                                            <FilterButton
                                                active={filterStatus === 'Rejected'}
                                                onClick={() => setFilterStatus('Rejected')}
                                                startIcon={<CloseIcon />}
                                                isReject={true}
                                            >
                                                Đã từ chối
                                            </FilterButton>
                                        </Box>

                                        {/* Search Bar */}
                                        <SearchTextField
                                            fullWidth
                                            placeholder="Tìm kiếm theo tên bài giảng..."
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon sx={{ color: COLORS.text.secondary }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: searchTerm && (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="clear search"
                                                            onClick={handleClearSearch}
                                                            edge="end"
                                                            size="small"
                                                            sx={{
                                                                color: COLORS.text.secondary,
                                                                '&:hover': {
                                                                    color: COLORS.text.primary,
                                                                }
                                                            }}
                                                        >
                                                            <ClearIcon fontSize="small" />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />

                                        <Divider sx={{ mb: 3 }} />

                                        {lessons.length === 0 ? (
                                            <Box
                                                sx={{
                                                    p: 4,
                                                    textAlign: 'center',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                                    borderRadius: 2,
                                                    borderStyle: 'dashed',
                                                    borderWidth: 1,
                                                    borderColor: '#ddd'
                                                }}
                                            >
                                                <Typography variant="body1" color={COLORS.text.secondary}>
                                                    {searchTerm
                                                        ? `Không tìm thấy bài giảng nào với từ khóa "${searchTerm}"`
                                                        : `Không có bài học nào ${filterStatus === 'Approved' ? 'đã duyệt' : 'đã từ chối'} cho khối ${userGradeNumber}.`}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <>
                                                <List sx={{ p: 0 }}>
                                                    {lessons.map((lesson) => (
                                                        <LessonItem
                                                            key={lesson.id}
                                                            lesson={lesson}
                                                            handleViewDetail={() => handleLessonSelect(lesson.id)}
                                                        />
                                                    ))}
                                                </List>

                                                {/* Pagination */}
                                                {lessons.length > 0 && (
                                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Pagination
                                                            count={totalPages}
                                                            page={page}
                                                            onChange={handlePageChange}
                                                            shape="rounded"
                                                            sx={{
                                                                '& .MuiPaginationItem-root': {
                                                                    fontWeight: 600,
                                                                    color: COLORS.text.secondary,
                                                                },
                                                                '& .Mui-selected': {
                                                                    backgroundColor: `${COLORS.primary} !important`,
                                                                    color: '#fff !important',
                                                                    '&:hover': {
                                                                        backgroundColor: `${COLORS.primary} !important`,
                                                                    },
                                                                },
                                                                '& .MuiPaginationItem-page:hover': {
                                                                    backgroundColor: `${COLORS.primary}20`,
                                                                },
                                                            }}
                                                        />
                                                    </Box>
                                                )}
                                            </>
                                        )}
                                    </CardContent>
                                </DashboardCard>
                            </Box>
                        </Fade>
                    </Container>
                </Box>
            )
            }
        </Box >
    );
};

export default LessonReview;