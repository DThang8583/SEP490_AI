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
import { useTheme } from '../../../context/ThemeContext';
import LessonDetailView from './LessonDetailView';

// API URL
const TEACHER_LESSONS_API_URL = 'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans';

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
    hover: {
        primary: 'rgba(6, 169, 174, 0.08)',
        secondary: 'rgba(25, 118, 210, 0.08)',
    }
};

// Styled components
const DashboardCard = styled(Card)(({ theme, isDarkMode }) => ({
    borderRadius: 12,
    boxShadow: isDarkMode 
        ? '0 8px 24px rgba(0, 0, 0, 0.2)' 
        : '0 8px 24px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    height: '100%',
    background: isDarkMode ? '#1E1E1E' : COLORS.background.paper,
}));

const CardHeader = styled(Box)(({ theme, bgcolor, isDarkMode }) => ({
    padding: '16px',
    background: isDarkMode ? '#2D3436' : (bgcolor || COLORS.primary),
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
}));

const StyledListItem = styled(ListItem)(({ isapproved, isDarkMode }) => ({
    backgroundColor: isDarkMode ? '#1E1E1E' : COLORS.background.paper,
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    boxShadow: isDarkMode 
        ? '0 3px 6px rgba(0,0,0,0.2)' 
        : '0 3px 6px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: isDarkMode 
            ? '0 6px 12px rgba(0,0,0,0.3)' 
            : '0 6px 12px rgba(0,0,0,0.12)',
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

const FilterButton = styled(Button)(({ active, isReject, isDarkMode }) => ({
    borderRadius: 16,
    padding: '12px 24px',
    textTransform: 'none',
    backgroundColor: active 
        ? (isReject ? COLORS.error : COLORS.primary) 
        : isDarkMode 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(255, 255, 255, 0.8)',
    color: active 
        ? '#fff' 
        : isDarkMode 
            ? '#fff' 
            : isReject 
                ? COLORS.error 
                : COLORS.text.primary,
    fontWeight: 600,
    fontSize: '1.1rem',
    boxShadow: active ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
    '&:hover': {
        backgroundColor: active 
            ? (isReject ? COLORS.error : COLORS.primary) 
            : isDarkMode 
                ? 'rgba(255, 255, 255, 0.1)' 
                : (isReject ? 'rgba(255, 72, 66, 0.1)' : 'rgba(255, 255, 255, 0.9)'),
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

const InfoChip = styled(Chip)(({ theme }) => ({
    margin: '4px 4px 4px 0',
    borderRadius: 12,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.2)' : 'rgba(25, 118, 210, 0.08)',
    color: theme.palette.mode === 'dark' ? COLORS.background.paper : COLORS.secondary,
    '.MuiChip-icon': {
        color: COLORS.secondary,
    }
}));

const SearchTextField = styled(TextField)(({ isDarkMode }) => ({
    marginBottom: 16,
    '& .MuiOutlinedInput-root': {
        borderRadius: 16,
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
        transition: 'all 0.3s ease',
        '&:hover': {
            boxShadow: isDarkMode 
                ? '0 4px 12px rgba(0, 0, 0, 0.2)' 
                : '0 4px 12px rgba(0, 0, 0, 0.08)',
        },
        '&.Mui-focused': {
            boxShadow: isDarkMode 
                ? '0 4px 12px rgba(0, 0, 0, 0.2)' 
                : '0 4px 12px rgba(0, 0, 0, 0.08)',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: isDarkMode ? COLORS.primary : COLORS.primary,
        },
    },
    '& .MuiInputBase-input': {
        color: isDarkMode ? '#fff' : COLORS.text.primary,
    },
}));

const DetailSection = styled(Box)(({ isDarkMode }) => ({
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: isDarkMode 
        ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
        : '0 2px 8px rgba(0, 0, 0, 0.04)',
    borderLeft: `4px solid ${COLORS.primary}`,
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

// Lesson item component
const LessonItem = ({ lesson, handleViewDetail, isDarkMode }) => {
    const isApproved = lesson.status === 'Approved';

    return (
        <StyledListItem
            isapproved={isApproved.toString()}
            onClick={handleViewDetail}
            isDarkMode={isDarkMode}
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
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {lesson.title}
                    </Typography>
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
    const { isDarkMode } = useTheme();
    const [lessons, setLessons] = useState([]);
    const [userGradeNumber, setUserGradeNumber] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('Approved');
    const [searchTerm, setSearchTerm] = useState('');
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

            const response = await axios.get(`${TEACHER_LESSONS_API_URL.replace('lesson-plans', 'users')}/${userInfo.id}`, {
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
                        id: item.lessonPlanId,
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

    // Handler cho việc chọn giáo án để xem chi tiết
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
                    background: isDarkMode 
                        ? 'linear-gradient(135deg, #1E1E1E 0%, #2D3436 100%)'
                        : 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 3
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={50} sx={{ color: COLORS.primary }} />
                    <Typography variant="body1" sx={{ color: isDarkMode ? '#fff' : COLORS.text.primary }}>
                        Đang tải thông tin...
                    </Typography>
                </Box>
            </Box>
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
            overflowY: 'auto',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1100,
        }}>
            {/* Nếu đang xem chi tiết thì hiển thị component chi tiết */}
            {selectedLessonId ? (
                <LessonDetailView
                    lessonId={selectedLessonId}
                    onBack={handleBackToList}
                    isDarkMode={isDarkMode}
                />
            ) : (
                /* Ngược lại hiển thị danh sách giáo án */
                <Box sx={{ py: 4, px: 3 }}>
                    <Fade in timeout={500}>
                        <Box>
                            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                                <AssignmentIcon sx={{ 
                                    fontSize: 36, 
                                    color: COLORS.primary, 
                                    mr: 2 
                                }} />
                                <Box>
                                    <Typography 
                                        variant="h4" 
                                        sx={{ 
                                            fontWeight: 700, 
                                            color: isDarkMode ? '#fff' : COLORS.text.primary,
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        Giáo án đã xem xét
                                    </Typography>
                                    <Typography 
                                        variant="subtitle1" 
                                        sx={{ 
                                            color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary, 
                                            mt: 0.5 
                                        }}
                                    >
                                        Quản lý giáo án khối {userGradeNumber || '?'}
                                    </Typography>
                                </Box>
                            </Box>

                            {error && (
                                <Alert
                                    severity="error"
                                    sx={{
                                        mb: 4,
                                        borderLeft: `4px solid ${COLORS.error}`,
                                        borderRadius: 2,
                                        bgcolor: isDarkMode ? 'rgba(255, 72, 66, 0.15)' : 'rgba(255, 72, 66, 0.08)',
                                    }}
                                >
                                    {error}
                                </Alert>
                            )}

                            <DashboardCard isDarkMode={isDarkMode}>
                                <CardHeader isDarkMode={isDarkMode}>
                                    <Box display="flex" alignItems="center">
                                        <FilterListIcon sx={{ mr: 1 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Danh sách giáo án - Khối {userGradeNumber}
                                        </Typography>
                                    </Box>
                                </CardHeader>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                        <FilterButton
                                            active={filterStatus === 'Approved'}
                                            onClick={() => setFilterStatus('Approved')}
                                            startIcon={<CheckIcon />}
                                            isReject={false}
                                            isDarkMode={isDarkMode}
                                        >
                                            Đã duyệt
                                        </FilterButton>
                                        <FilterButton
                                            active={filterStatus === 'Rejected'}
                                            onClick={() => setFilterStatus('Rejected')}
                                            startIcon={<CloseIcon />}
                                            isReject={true}
                                            isDarkMode={isDarkMode}
                                        >
                                            Đã từ chối
                                        </FilterButton>
                                    </Box>

                                    <SearchTextField
                                        fullWidth
                                        placeholder="Tìm kiếm theo tên giáo án..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        isDarkMode={isDarkMode}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon sx={{ 
                                                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary 
                                                    }} />
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
                                                            color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary,
                                                            '&:hover': {
                                                                color: isDarkMode ? '#fff' : COLORS.text.primary,
                                                            }
                                                        }}
                                                    >
                                                        <ClearIcon fontSize="small" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <Divider sx={{ 
                                        mb: 3,
                                        bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' 
                                    }} />

                                    {lessons.length === 0 ? (
                                        <Box
                                            sx={{
                                                p: 4,
                                                textAlign: 'center',
                                                backgroundColor: isDarkMode 
                                                    ? 'rgba(255, 255, 255, 0.05)' 
                                                    : 'rgba(255, 255, 255, 0.5)',
                                                borderRadius: 2,
                                                borderStyle: 'dashed',
                                                borderWidth: 1,
                                                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#ddd'
                                            }}
                                        >
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary 
                                                }}
                                            >
                                                {searchTerm
                                                    ? `Không tìm thấy giáo án nào với từ khóa "${searchTerm}"`
                                                    : `Không có giáo án nào ${filterStatus === 'Approved' ? 'đã duyệt' : 'đã từ chối'} cho khối ${userGradeNumber}.`}
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
                                                        isDarkMode={isDarkMode}
                                                    />
                                                ))}
                                            </List>

                                            {lessons.length > 0 && (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                                    <Pagination
                                                        count={totalPages}
                                                        page={page}
                                                        onChange={handlePageChange}
                                                        shape="rounded"
                                                        sx={{
                                                            '& .MuiPaginationItem-root': {
                                                                fontWeight: 600,
                                                                color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary,
                                                            },
                                                            '& .Mui-selected': {
                                                                backgroundColor: `${isDarkMode ? COLORS.primary : COLORS.primary} !important`,
                                                                color: '#fff !important',
                                                                '&:hover': {
                                                                    backgroundColor: `${isDarkMode ? COLORS.primary : COLORS.primary} !important`,
                                                                },
                                                            },
                                                            '& .MuiPaginationItem-page:hover': {
                                                                backgroundColor: isDarkMode 
                                                                    ? COLORS.hover.primary 
                                                                    : COLORS.hover.primary,
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
                </Box>
            )}
        </Container>
    );
};

export default LessonReview;