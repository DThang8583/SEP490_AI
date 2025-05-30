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
} from '@mui/material';
import {
    Search as SearchIcon,
    School as SchoolIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTheme } from '../../../context/ThemeContext';
import ContentApprovalDetail from './ContentApprovalDetail';

const TEACHER_LESSONS_API = 'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans';
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
            borderColor: isDarkMode ? '#06A9AE' : '#06A9AE',
        },
    },
    '& .MuiInputBase-input': {
        color: isDarkMode ? '#fff' : '#212B36',
    },
}));

const StatusChip = styled(Chip)(({ status }) => ({
    backgroundColor: STATUS_COLORS[status]?.bgColor,
    color: STATUS_COLORS[status]?.color,
    fontWeight: 600,
    borderRadius: 16,
    padding: '0 8px',
}));

const ContentApproval = () => {
    const { isDarkMode } = useTheme();
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
                    background: isDarkMode 
                        ? 'linear-gradient(135deg, #1E1E1E 0%, #2D3436 100%)'
                        : COLORS.background.default,
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
                    <Typography variant="body1" sx={{ color: isDarkMode ? '#fff' : COLORS.text.secondary }}>
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
                background: isDarkMode 
                    ? 'linear-gradient(135deg, #1E1E1E 0%, #2D3436 100%)'
                    : COLORS.background.default,
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
                <ContentApprovalDetail
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
                                boxShadow: isDarkMode 
                                    ? '0 8px 24px rgba(0, 0, 0, 0.2)' 
                                    : '0 8px 24px rgba(0, 0, 0, 0.08)',
                                background: isDarkMode ? '#1E1E1E' : COLORS.background.paper
                            }}
                        >
                            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                                <SchoolIcon sx={{ 
                                    fontSize: 36, 
                                    color: COLORS.primary, 
                                    mr: 2 
                                }} />
                                <Box>
                                    <Typography
                                        variant="h5"
                                        component="h2"
                                        sx={{
                                            fontWeight: 700,
                                            color: isDarkMode ? '#fff' : COLORS.text.primary
                                        }}
                                    >
                                        Duyệt nội dung
                                    </Typography>
                                    {userGrade && (
                                        <Typography 
                                            variant="subtitle1" 
                                            sx={{ 
                                                color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary, 
                                                mt: 0.5 
                                            }}
                                        >
                                            Quản lý nội dung khối {userGrade}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>

                            {error && (
                                <Alert
                                    severity="error"
                                    sx={{ 
                                        mb: 3, 
                                        borderLeft: `4px solid ${COLORS.error}`, 
                                        borderRadius: 2,
                                        bgcolor: isDarkMode ? 'rgba(255, 72, 66, 0.15)' : 'rgba(255, 72, 66, 0.08)'
                                    }}
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
                                    isDarkMode={isDarkMode}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ 
                                                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary 
                                                }} />
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
                                        backgroundColor: isDarkMode 
                                            ? 'rgba(255, 255, 255, 0.05)' 
                                            : 'rgba(255, 255, 255, 0.5)',
                                        borderRadius: 2,
                                        borderStyle: 'dashed',
                                        borderWidth: 1,
                                        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#ddd',
                                        mb: 3
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
                                            : `Không có giáo án nào cần duyệt cho khối ${userGrade}.`}
                                    </Typography>
                                </Box>
                            ) : (
                                <TableContainer
                                    sx={{
                                        borderRadius: 2,
                                        mb: 3,
                                        overflowX: 'auto',
                                        boxShadow: isDarkMode 
                                            ? '0 2px 10px rgba(0, 0, 0, 0.2)' 
                                            : '0 2px 10px rgba(0, 0, 0, 0.05)'
                                    }}
                                >
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ 
                                                backgroundColor: isDarkMode 
                                                    ? 'rgba(255,255,255,0.05)' 
                                                    : COLORS.background.secondary 
                                            }}>
                                                <TableCell sx={{ 
                                                    fontWeight: 600, 
                                                    color: isDarkMode ? '#fff' : COLORS.text.primary 
                                                }}>
                                                    Giáo viên
                                                </TableCell>
                                                <TableCell sx={{ 
                                                    fontWeight: 600, 
                                                    color: isDarkMode ? '#fff' : COLORS.text.primary 
                                                }}>
                                                    Bài
                                                </TableCell>
                                                <TableCell sx={{ 
                                                    fontWeight: 600, 
                                                    color: isDarkMode ? '#fff' : COLORS.text.primary 
                                                }}>
                                                    Chủ đề
                                                </TableCell>
                                                <TableCell sx={{ 
                                                    fontWeight: 600, 
                                                    color: isDarkMode ? '#fff' : COLORS.text.primary 
                                                }}>
                                                    Trạng thái
                                                </TableCell>
                                                <TableCell sx={{ 
                                                    fontWeight: 600, 
                                                    color: isDarkMode ? '#fff' : COLORS.text.primary 
                                                }}>
                                                    Ngày tạo
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {getPaginatedLessons().map((lesson) => (
                                                <TableRow
                                                    key={lesson.lessonPlanId}
                                                    hover
                                                    sx={{
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            backgroundColor: isDarkMode 
                                                                ? 'rgba(255,255,255,0.05)' 
                                                                : 'rgba(0, 0, 0, 0.01)'
                                                        }
                                                    }}
                                                    onClick={() => handleLessonSelect(lesson.lessonPlanId)}
                                                >
                                                    <TableCell sx={{ 
                                                        color: isDarkMode ? '#fff' : 'inherit' 
                                                    }}>
                                                        {lesson.fullname}
                                                    </TableCell>
                                                    <TableCell sx={{ 
                                                        color: isDarkMode ? '#fff' : 'inherit' 
                                                    }}>
                                                        {lesson.lesson}
                                                    </TableCell>
                                                    <TableCell sx={{ 
                                                        color: isDarkMode ? '#fff' : 'inherit' 
                                                    }}>
                                                        {lesson.module}
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusChip
                                                            label={STATUS_COLORS[lesson.status]?.label || lesson.status}
                                                            status={lesson.status}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ 
                                                        color: isDarkMode ? '#fff' : 'inherit' 
                                                    }}>
                                                        {lesson.createdAt}
                                                    </TableCell>
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
                                        shape="rounded"
                                        sx={{
                                            '& .MuiPaginationItem-root': {
                                                fontWeight: 600,
                                                color: isDarkMode ? 'rgba(255,255,255,0.7)' : COLORS.text.secondary,
                                            },
                                            '& .Mui-selected': {
                                                backgroundColor: `${COLORS.primary} !important`,
                                                color: '#fff !important',
                                                '&:hover': {
                                                    backgroundColor: `${COLORS.primary} !important`,
                                                },
                                            },
                                            '& .MuiPaginationItem-page:hover': {
                                                backgroundColor: isDarkMode 
                                                    ? 'rgba(6, 169, 174, 0.2)' 
                                                    : `${COLORS.primary}20`,
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

