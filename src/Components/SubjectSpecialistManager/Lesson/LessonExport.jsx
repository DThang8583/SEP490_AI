// src/Components/SubjectSpecialistManager/Lesson/LessonExport.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    Button,
    Container,
    Grid,
    Divider,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Pagination,
    PaginationItem,
    Chip,
    Fade,
    TextField,
    IconButton,
    InputAdornment
} from '@mui/material';
import jsPDF from 'jspdf';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import {
    NavigateNext as NavigateNextIcon,
    NavigateBefore as NavigateBeforeIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Schedule as ScheduleIcon,
    Bookmark as BookmarkIcon,
    Assignment as AssignmentIcon,
    Search as SearchIcon,
    Clear as ClearIcon
} from '@mui/icons-material';

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
}));

const StyledListItem = styled(ListItem)({
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
    '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '4px',
        height: '100%',
        backgroundColor: COLORS.success,
        opacity: 0.7,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
});

const ExportButton = styled(Button)({
    borderRadius: 8,
    padding: '8px 16px',
    textTransform: 'none',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    '&.MuiButton-contained': {
        backgroundColor: COLORS.primary,
        color: '#fff',
        '&:hover': {
            backgroundColor: '#058e93',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(6, 169, 174, 0.25)',
        },
    },
    '&.MuiButton-outlined': {
        color: COLORS.primary,
        borderColor: COLORS.primary,
        '&:hover': {
            borderColor: COLORS.primary,
            backgroundColor: 'rgba(6, 169, 174, 0.08)',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(6, 169, 174, 0.15)',
        },
    },
});

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

const LESSON_PLANS_API = 'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans';

const LessonExport = ({ sidebarOpen }) => {
    const [approvedLessons, setApprovedLessons] = useState([]);
    const [userGradeNumber, setUserGradeNumber] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination states
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    const sidebarWidth = sidebarOpen ? 60 : 240;

    const getUserGradeNumber = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!accessToken || !userInfo || !userInfo.id) {
                throw new Error('Vui lòng đăng nhập.');
            }
            const response = await axios.get(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users/${userInfo.id}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            const userData = response.data?.data;
            if (!userData || !userData.grade) {
                throw new Error('Không tìm thấy thông tin khối.');
            }
            const gradeMatch = userData.grade.match(/\d+/);
            const gradeNumber = gradeMatch ? parseInt(gradeMatch[0], 10) : null;
            if (!gradeNumber) {
                throw new Error('Không thể xác định khối.');
            }
            return gradeNumber;
        } catch (err) {
            console.error('Lỗi khi lấy gradeNumber:', err);
            throw new Error(`Lỗi khi lấy gradeNumber: ${err.message}`);
        }
    }, []);

    useEffect(() => {
        const fetchLessons = async () => {
            setLoading(true);
            setError(null);
            setApprovedLessons([]);
            try {
                const gradeNumber = await getUserGradeNumber();
                setUserGradeNumber(gradeNumber);

                if (gradeNumber) {
                    const response = await axios.get(LESSON_PLANS_API, {
                        params: {
                            Status: 3,
                            Grade: gradeNumber,
                            Page: page,
                            PageSize: itemsPerPage
                        },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    });

                    if (response.data.code === 0) {
                        const lessons = response.data.data?.items || [];
                        const formattedLessons = lessons.map(item => ({
                            lessonId: item.lessonPlanId,
                            name: item.lesson,
                            user: item.fullname,
                            module: item.module,
                            gradeNumber: item.grade,
                            status: item.status,
                            createdAt: item.createdAt,
                            description: item.description || ''
                        }));
                        setApprovedLessons(formattedLessons);
                    } else {
                        throw new Error("Lỗi khi tải dữ liệu giáo án");
                    }
                }
            } catch (err) {
                console.error('Error fetching lessons:', err);
                setError(err.message || 'Lỗi tải danh sách giáo án.');
            } finally {
                setLoading(false);
            }
        };
        fetchLessons();
    }, [getUserGradeNumber, page, itemsPerPage]);

    // Handle page change
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

    // Filtered and paginated lessons
    const paginatedLessons = useMemo(() => {
        // First filter by the user's grade number
        const gradeFiltered = approvedLessons.filter(lesson =>
            (lesson.gradeNumber === userGradeNumber) ||
            (!lesson.gradeNumber && userGradeNumber) // fallback if lesson doesn't specify grade
        );

        // Then filter by search term (case insensitive)
        const searchFiltered = searchTerm
            ? gradeFiltered.filter(lesson =>
                lesson.name?.toLowerCase().includes(searchTerm.toLowerCase()))
            : gradeFiltered;

        // Apply pagination
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return searchFiltered.slice(startIndex, endIndex);
    }, [approvedLessons, page, userGradeNumber, searchTerm]);

    // Calculate total pages based on filtered lessons
    const totalPages = useMemo(() => {
        const gradeFiltered = approvedLessons.filter(lesson =>
            (lesson.gradeNumber === userGradeNumber) ||
            (!lesson.gradeNumber && userGradeNumber)
        );

        const searchFiltered = searchTerm
            ? gradeFiltered.filter(lesson =>
                lesson.name?.toLowerCase().includes(searchTerm.toLowerCase()))
            : gradeFiltered;

        return Math.max(1, Math.ceil(searchFiltered.length / itemsPerPage));
    }, [approvedLessons, userGradeNumber, searchTerm]);

    const exportToPDF = (lesson) => {
        if (lesson.status !== "Approved") {
            console.error('Cannot export non-approved lesson');
            return;
        }
        const doc = new jsPDF();
        doc.text(`Tiêu đề: ${lesson.name || 'N/A'}`, 10, 10);
        doc.text(`Giáo viên: ${lesson.user || 'N/A'}`, 10, 20);
        doc.text(`Khối: ${lesson.gradeNumber || userGradeNumber || 'N/A'}`, 10, 30);
        doc.text(`Module: ${lesson.module || 'N/A'}`, 10, 40);
        doc.text(`Ngày tạo: ${lesson.createdAt || 'N/A'}`, 10, 50);
        doc.save(`${lesson.name || 'Lesson'}_Grade${lesson.gradeNumber || userGradeNumber || 'NA'}.pdf`);
    };

    const exportToWord = (lesson) => {
        if (lesson.status !== "Approved") {
            console.error('Cannot export non-approved lesson');
            return;
        }
        const content = `
        <h1>${lesson.name || 'N/A'}</h1>
        <p><strong>Giáo viên:</strong> ${lesson.user || 'N/A'}</p>
        <p><strong>Khối:</strong> ${lesson.gradeNumber || userGradeNumber || 'N/A'}</p>
        <p><strong>Module:</strong> ${lesson.module || 'N/A'}</p>
        <p><strong>Ngày tạo:</strong> ${lesson.createdAt || 'N/A'}</p>
        `;
        const blob = new Blob([content], { type: 'application/msword' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${lesson.name || 'Lesson'}_Grade${lesson.gradeNumber || userGradeNumber || 'NA'}.doc`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: COLORS.background.default,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1100,
                overflowY: 'auto',
            }}
        >
            <Box
                sx={{
                    py: 4,
                    ml: { xs: 0, sm: `${sidebarWidth}px` },
                    transition: 'margin-left 0.3s ease',
                }}
            >
                <Container maxWidth="lg">
                    <Fade in={true} timeout={500}>
                        <Box>
                            <DashboardCard>
                                <CardHeader bgcolor={COLORS.primary}>
                                    <Box display="flex" alignItems="center">
                                        <AssignmentIcon sx={{ mr: 1 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Xuất Giáo Án
                                        </Typography>
                                    </Box>
                                </CardHeader>
                                <CardContent sx={{ p: 3 }}>
                                    {loading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                            <CircularProgress sx={{ color: COLORS.primary }} />
                                        </Box>
                                    ) : error ? (
                                        <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
                                    ) : (
                                        <>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    p: 2,
                                                    fontWeight: 700,
                                                    color: COLORS.text.primary,
                                                }}
                                            >
                                                Giáo án đã duyệt {userGradeNumber ? `- Khối ${userGradeNumber}` : ''}
                                            </Typography>

                                            {/* Search Bar */}
                                            <SearchTextField
                                                fullWidth
                                                placeholder="Tìm kiếm theo tên giáo án..."
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

                                            {approvedLessons.length === 0 ? (
                                                <Box
                                                    sx={{
                                                        p: 4,
                                                        textAlign: 'center',
                                                        backgroundColor: COLORS.background.secondary,
                                                        borderRadius: 2,
                                                    }}
                                                >
                                                    <Typography variant="body1" color={COLORS.text.secondary}>
                                                        Không có giáo án nào đã duyệt cho Khối {userGradeNumber || 'của bạn'}.
                                                    </Typography>
                                                </Box>
                                            ) : paginatedLessons.length === 0 ? (
                                                <Box
                                                    sx={{
                                                        p: 4,
                                                        textAlign: 'center',
                                                        backgroundColor: COLORS.background.secondary,
                                                        borderRadius: 2,
                                                    }}
                                                >
                                                    <Typography variant="body1" color={COLORS.text.secondary}>
                                                        Không tìm thấy giáo án nào phù hợp với từ khóa "{searchTerm}".
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <>
                                                    <List sx={{ p: 0 }}>
                                                        {paginatedLessons.map((lesson) => (
                                                            <StyledListItem key={lesson.lessonId || lesson.id}>
                                                                <Grid container alignItems="center" spacing={2}>
                                                                    <Grid item xs={12} md={7} lg={8}>
                                                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                                            {lesson.name || 'Untitled Lesson'}
                                                                        </Typography>
                                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                                            {lesson.user && (
                                                                                <InfoChip
                                                                                    size="small"
                                                                                    icon={<PersonIcon />}
                                                                                    label={lesson.user}
                                                                                />
                                                                            )}
                                                                            <InfoChip
                                                                                size="small"
                                                                                icon={<SchoolIcon />}
                                                                                label={`Khối ${lesson.gradeNumber || userGradeNumber}`}
                                                                            />
                                                                            {lesson.module && (
                                                                                <InfoChip
                                                                                    size="small"
                                                                                    icon={<BookmarkIcon />}
                                                                                    label={lesson.module}
                                                                                />
                                                                            )}
                                                                            {lesson.createdAt && (
                                                                                <InfoChip
                                                                                    size="small"
                                                                                    icon={<ScheduleIcon />}
                                                                                    label={`Ngày tạo: ${(lesson.createdAt)}`}
                                                                                />
                                                                            )}
                                                                        </Box>
                                                                    </Grid>
                                                                    <Grid item xs={12} md={5} lg={4}>
                                                                        <Box sx={{
                                                                            display: 'flex',
                                                                            justifyContent: { xs: 'flex-start', md: 'flex-end' },
                                                                            flexWrap: 'wrap',
                                                                            gap: 1,
                                                                            mt: { xs: 2, md: 0 },
                                                                        }}>
                                                                            <ExportButton
                                                                                variant="contained"
                                                                                startIcon={<PictureAsPdfIcon />}
                                                                                onClick={() => exportToPDF(lesson)}
                                                                                size="small"
                                                                            >
                                                                                PDF
                                                                            </ExportButton>
                                                                            <ExportButton
                                                                                variant="outlined"
                                                                                startIcon={<DescriptionIcon />}
                                                                                onClick={() => exportToWord(lesson)}
                                                                                size="small"
                                                                            >
                                                                                Word
                                                                            </ExportButton>
                                                                        </Box>
                                                                    </Grid>
                                                                </Grid>
                                                            </StyledListItem>
                                                        ))}
                                                    </List>

                                                    {/* Pagination */}
                                                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                                                        <Pagination
                                                            count={totalPages}
                                                            page={page}
                                                            onChange={handlePageChange}
                                                            renderItem={(item) => (
                                                                <PaginationItem
                                                                    slots={{
                                                                        previous: NavigateBeforeIcon,
                                                                        next: NavigateNextIcon
                                                                    }}
                                                                    {...item}
                                                                    sx={{
                                                                        margin: '0 4px',
                                                                        borderRadius: '4px',
                                                                        '&.MuiPaginationItem-root': {
                                                                            color: COLORS.text.secondary,
                                                                        },
                                                                        '&.Mui-selected': {
                                                                            backgroundColor: COLORS.primary,
                                                                            color: '#fff',
                                                                            '&:hover': {
                                                                                backgroundColor: COLORS.primary,
                                                                            },
                                                                        },
                                                                        '&:hover': {
                                                                            backgroundColor: 'rgba(6, 169, 174, 0.08)',
                                                                        },
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                    </Box>
                                                </>
                                            )}
                                        </>
                                    )}
                                </CardContent>
                            </DashboardCard>
                        </Box>
                    </Fade>
                </Container>
            </Box>
        </Box>
    );
};

export default LessonExport;