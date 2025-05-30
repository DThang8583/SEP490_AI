import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    List,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Stack,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Divider,
    Button,
    TextField,
    Collapse,
    List as MuiList,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar,
} from '@mui/material';
import {
    Assignment as AssignmentIcon,
    School as SchoolIcon,
    MenuBook as MenuBookIcon,
    CalendarMonth as CalendarIcon,
    Timer as TimerIcon,
    Comment as CommentIcon,
    Send as SendIcon,
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

// API URLs
const MODULE_API_URL = 'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules';

// Styled components
const DashboardCard = styled(Card)({
    borderRadius: 16,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    height: '100%',
    background: (theme) => theme.palette.background.paper,
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
    },
});

const CardHeader = styled(Box)(({ theme, bgcolor }) => ({
    padding: '20px',
    background: bgcolor || '#06A9AE',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: theme.palette.background.secondary || theme.palette.action.hover,
    border: `1px solid ${theme.palette.grey[300]}`,
    padding: '16px',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    border: `1px solid ${theme.palette.grey[300]}`,
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const CurriculumCard = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: 16,
    marginBottom: 24,
    padding: 24,
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
    },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#06A9AE',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#05969A',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#06A9AE',
    },
}));

// Thêm styled component cho button
const StyledButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    borderRadius: '8px',
    padding: '8px 20px',
    fontSize: '0.95rem',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    '&.MuiButton-contained': {
        backgroundColor: '#06A9AE',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#05969A',
        }
    },
    '&.MuiButton-outlined': {
        borderColor: '#06A9AE',
        color: '#06A9AE',
        '&:hover': {
            backgroundColor: 'rgba(6, 169, 174, 0.08)',
            borderColor: '#05969A',
        }
    }
}));

// Thêm styled component cho InfoChip
const InfoChip = styled(Chip)(({ theme }) => ({
    margin: '4px 4px 4px 0',
    borderRadius: 12,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(6, 169, 174, 0.2)' : 'rgba(6, 169, 174, 0.08)',
    color: '#06A9AE',
    '.MuiChip-icon': {
        color: '#06A9AE',
    }
}));

const CurriculumAnalysis = ({ sidebarOpen }) => {
    const [curricula, setCurricula] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userGradeNumber, setUserGradeNumber] = useState(null);

    const [modules, setModules] = useState([]);
    const [currentSemester, setCurrentSemester] = useState(1);
    const [modulePage, setModulePage] = useState(1);
    const [moduleTotalPage, setModuleTotalPage] = useState(1);
    const [moduleLoading, setModuleLoading] = useState(false);
    const [moduleError, setModuleError] = useState(null);

    const [selectedBook, setSelectedBook] = useState('');
    const [availableBooks, setAvailableBooks] = useState([]);

    // Comment related states
    const [expandedComments, setExpandedComments] = useState({});
    const [comments, setComments] = useState({});
    const [newComments, setNewComments] = useState({});
    const [commentLoading, setCommentLoading] = useState({});
    const [commentSubmitting, setCommentSubmitting] = useState({});
    const [commentErrors, setCommentErrors] = useState({});

    const theme = useTheme();

    // Helper function to get valid token and handle auth errors
    const getAuthConfig = () => {
        const accessToken = localStorage.getItem('accessToken');
        const userInfo = localStorage.getItem('userInfo');

        if (!accessToken || !userInfo) {
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }

        // Validate token format
        try {
            const tokenParts = accessToken.split('.');
            if (tokenParts.length !== 3) {
                throw new Error('Token không hợp lệ');
            }
        } catch (e) {
            throw new Error('Token không hợp lệ. Vui lòng đăng nhập lại.');
        }

        return {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };
    };

    // Handle auth errors and redirect to login
    const handleAuthError = (error, curriculumId = null) => {
        console.error('Authentication error:', error);

        const errorMessage = error.response?.status === 401
            ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
            : `Đã xảy ra lỗi: ${error.message}`;

        if (curriculumId) {
            setCommentErrors(prev => ({
                ...prev,
                [curriculumId]: errorMessage
            }));
        }

        // If 401 error, clear localStorage and redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userInfo');
            // You might want to redirect to login page here
            // window.location.href = '/login';
        }
    };

    const getUserGradeNumber = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!accessToken || !userInfo || !userInfo.id) {
                throw new Error('Vui lòng đăng nhập để xem khung chương trình.');
            }

            const response = await axios.get(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users/${userInfo.id}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            const userData = response.data.data;
            const gradeMatch = userData.grade.match(/\d+/);
            const gradeNumber = gradeMatch ? parseInt(gradeMatch[0], 10) : null;

            if (!gradeNumber) {
                throw new Error('Không thể xác định khối từ thông tin người dùng.');
            }

            return gradeNumber;
        } catch (err) {
            console.error('Lỗi khi lấy gradeNumber:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [theme.palette.text.secondary, theme.palette.error.main]);

    const fetchCurricula = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const gradeNumber = await getUserGradeNumber();
            setUserGradeNumber(gradeNumber);

            const response = await axios.get('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/curriculums', { timeout: 10000 });

            if (response.data.code !== 0) {
                throw new Error(response.data.message || 'API trả về lỗi không xác định');
            }

            const fetchedCurricula = response.data.data.items || [];
            const filteredCurricula = fetchedCurricula.filter((curriculum) => {
                const curriculumGradeMatch = curriculum.name.match(/lớp\s*(\d+)/i);
                const curriculumGrade = curriculumGradeMatch ? parseInt(curriculumGradeMatch[1], 10) : null;
                return curriculumGrade === gradeNumber;
            });

            const sortedCurricula = filteredCurricula.sort((a, b) => parseInt(b.year) - parseInt(a.year));

            if (sortedCurricula.length === 0) {
                setError(`Không tìm thấy chương trình nào cho Khối ${gradeNumber}`);
            }

            setCurricula(sortedCurricula);
        } catch (error) {
            setError(
                error.response
                    ? `Lỗi server: ${error.response.status} - ${error.response.data.message || error.message}`
                    : error.request
                        ? 'Không thể kết nối đến server.'
                        : `Lỗi: ${error.message}`
            );
        } finally {
            setLoading(false);
        }
    }, [getUserGradeNumber, theme.palette.text.secondary, theme.palette.error.main]);

    const fetchModules = useCallback(async (gradeNumber) => {
        setModuleLoading(true);
        setModuleError(null);
        try {
            const accessToken = localStorage.getItem('accessToken');
            const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};

            const response = await axios.get(MODULE_API_URL, { ...config, timeout: 15000 });

            if (response.data.code === 0) {
                const allModules = response.data.data.items || [];
                const filteredModules = allModules.filter((module) => module.gradeNumber === gradeNumber);

                // Fetch lessons for each module
                const modulesWithLessons = await Promise.all(
                    filteredModules.map(async (module) => {
                        try {
                            const lessonsResponse = await axios.get(
                                `${MODULE_API_URL}/${module.moduleId}/lessons`,
                                config
                            );
                            if (lessonsResponse.data.code === 0) {
                                return {
                                    ...module,
                                    lessons: lessonsResponse.data.data.lessons || []
                                };
                            }
                            return module;
                        } catch (error) {
                            console.error(`Error fetching lessons for module ${module.moduleId}:`, error);
                            return module;
                        }
                    })
                );

                setModules(modulesWithLessons);
                const semesterModules = modulesWithLessons.filter((module) => module.semester === currentSemester);
                setModuleTotalPage(Math.ceil(semesterModules.length / 10));
            } else {
                setModuleError('Không thể tải dữ liệu từ API: ' + response.data.message);
            }
        } catch (err) {
            console.error('Error fetching modules:', err);
            setModuleError('Đã xảy ra lỗi khi tải dữ liệu: ' + err.message);
        } finally {
            setModuleLoading(false);
        }
    }, [currentSemester]);

    // Updated Comment functions
    const fetchComments = useCallback(async (curriculumId) => {
        setCommentLoading(prev => ({ ...prev, [curriculumId]: true }));
        setCommentErrors(prev => ({ ...prev, [curriculumId]: null }));

        try {
            const config = getAuthConfig();

            console.log('Fetching comments for curriculum:', curriculumId);
            const response = await axios.get(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/curriculums/${curriculumId}/feedbacks`,
                config
            );

            console.log('Comments response:', response.data);

            if (response.data.code === 0) {
                setComments(prev => ({ ...prev, [curriculumId]: response.data.data || [] }));
            } else {
                setCommentErrors(prev => ({
                    ...prev,
                    [curriculumId]: 'Không thể tải danh sách comment: ' + response.data.message
                }));
            }
        } catch (err) {
            handleAuthError(err, curriculumId);
        } finally {
            setCommentLoading(prev => ({ ...prev, [curriculumId]: false }));
        }
    }, []);

    const submitComment = async (curriculumId) => {
        const commentText = newComments[curriculumId]?.trim();
        if (!commentText) {
            setCommentErrors(prev => ({
                ...prev,
                [curriculumId]: 'Vui lòng nhập nội dung comment'
            }));
            return;
        }

        setCommentSubmitting(prev => ({ ...prev, [curriculumId]: true }));
        setCommentErrors(prev => ({ ...prev, [curriculumId]: null }));

        try {
            const config = getAuthConfig();

            console.log('Submitting comment:', {
                curriculumId,
                body: commentText,
                headers: config.headers
            });

            const response = await axios.post(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/curriculums/${curriculumId}/feedbacks`,
                { body: commentText },
                config
            );

            console.log('Submit comment response:', response.data);

            if (response.data.code === 0) {
                setNewComments(prev => ({ ...prev, [curriculumId]: '' }));
                await fetchComments(curriculumId);

                // Show success message
                setCommentErrors(prev => ({
                    ...prev,
                    [curriculumId]: null
                }));
            } else {
                setCommentErrors(prev => ({
                    ...prev,
                    [curriculumId]: 'Không thể gửi comment: ' + response.data.message
                }));
            }
        } catch (err) {
            console.error('Submit comment error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                headers: err.response?.headers
            });
            handleAuthError(err, curriculumId);
        } finally {
            setCommentSubmitting(prev => ({ ...prev, [curriculumId]: false }));
        }
    };

    // Updated toggleComments with better error handling
    const toggleComments = (curriculumId) => {
        const isCurrentlyExpanded = expandedComments[curriculumId];

        setExpandedComments(prev => ({
            ...prev,
            [curriculumId]: !isCurrentlyExpanded
        }));

        // Fetch comments when expanding for the first time
        if (!isCurrentlyExpanded && !comments[curriculumId]) {
            try {
                fetchComments(curriculumId);
            } catch (error) {
                handleAuthError(error, curriculumId);
            }
        }
    };

    const handleCommentChange = (curriculumId, value) => {
        setNewComments(prev => ({ ...prev, [curriculumId]: value }));
        // Clear error when user starts typing
        if (commentErrors[curriculumId]) {
            setCommentErrors(prev => ({ ...prev, [curriculumId]: null }));
        }
    };

    useEffect(() => {
        fetchCurricula();
    }, [fetchCurricula]);

    useEffect(() => {
        if (userGradeNumber) {
            fetchModules(userGradeNumber);
        }
    }, [userGradeNumber, fetchModules]);

    useEffect(() => {
        if (modules.length > 0) {
            const semesterModules = modules.filter((module) => module.semester === currentSemester);
            setModuleTotalPage(Math.ceil(semesterModules.length / 10));
            setModulePage(1);
        }
    }, [currentSemester, modules]);

    useEffect(() => {
        if (modules.length > 0) {
            const books = [...new Set(modules.map(module => module.book))];
            setAvailableBooks(books);
            if (books.length > 0 && !selectedBook) {
                setSelectedBook(books[0]);
            }
        }
    }, [modules]);

    if (loading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                background: theme.palette.background.default,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1100,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={50} sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                        Đang tải dữ liệu chương trình...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{
            width: 'calc(100% - 78px)',
            minHeight: '100vh',
            background: theme.palette.background.default,
            position: 'fixed',
            top: 0,
            left: '78px',
            right: 0,
            bottom: 0,
            overflow: 'auto',
            zIndex: 1100,
            padding: '32px',
        }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                }}>
                    <SchoolIcon sx={{ color: '#06A9AE', fontSize: 32 }} />
                    Phân tích chương trình
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary, ml: 5 }}>
                    Xem và phân tích chi tiết chương trình giảng dạy
                </Typography>
            </Box>

            {error ? (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                </Alert>
            ) : (
                <Stack spacing={3}>
                    {!error && curricula.length === 0 && !loading ? (
                        <DashboardCard>
                            <CardContent sx={{ py: 4, textAlign: 'center' }}>
                                <Typography sx={{ color: theme.palette.text.secondary }}>
                                    Không có chương trình giảng dạy nào cho Khối {userGradeNumber}.
                                </Typography>
                            </CardContent>
                        </DashboardCard>
                    ) : (
                        <List sx={{ bgcolor: 'transparent', p: 0 }}>
                            {curricula.map((curriculum) => (
                                <Box key={curriculum.curriculumId}>
                                    <CurriculumCard>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
                                            <Box>
                                                <Typography sx={{
                                                    fontWeight: 700,
                                                    fontSize: '1.5rem',
                                                    mb: 2,
                                                    color: theme.palette.text.primary,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}>
                                                    {curriculum.name}
                                                    <InfoChip
                                                        icon={<CalendarIcon />}
                                                        label={curriculum.year}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: theme.palette.background.secondary,
                                                            color: theme.palette.text.primary
                                                        }}
                                                    />
                                                </Typography>
                                                <Typography variant="body1" sx={{
                                                    color: theme.palette.text.secondary,
                                                    mb: 2,
                                                    lineHeight: 1.6
                                                }}>
                                                    {curriculum.description}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                    <Chip
                                                        icon={<TimerIcon />}
                                                        label={`Tổng số tiết: ${curriculum.totalPeriods}`}
                                                        sx={{
                                                            bgcolor: theme.palette.background.secondary,
                                                            color: '#06A9AE',
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                            <StyledButton
                                                variant="outlined"
                                                startIcon={<CommentIcon />}
                                                endIcon={expandedComments[curriculum.curriculumId] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                onClick={() => toggleComments(curriculum.curriculumId)}
                                                sx={{
                                                    borderColor: '#06A9AE',
                                                    color: '#06A9AE',
                                                    '&:hover': {
                                                        borderColor: '#05969A',
                                                        backgroundColor: 'rgba(6, 169, 174, 0.08)',
                                                    }
                                                }}
                                            >
                                                {expandedComments[curriculum.curriculumId] ? 'Đóng Comment' : 'Comment'}
                                            </StyledButton>
                                        </Box>

                                        {/* Comment Dropdown Section */}
                                        <Collapse in={expandedComments[curriculum.curriculumId]} timeout="auto" unmountOnExit>
                                            <Box sx={{ mt: 3, pt: 3, borderTop: `2px solid ${theme.palette.background.secondary}` }}>
                                                {/* Comment Form */}
                                                <DashboardCard sx={{ mb: 3 }}>
                                                    <CardHeader bgcolor={'#06A9AE'}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <SendIcon sx={{ mr: 1 }} />
                                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                                Ghi nhận xét
                                                            </Typography>
                                                        </Box>
                                                    </CardHeader>
                                                    <CardContent sx={{ p: 3 }}>
                                                        <TextField
                                                            fullWidth
                                                            multiline
                                                            rows={4}
                                                            placeholder="Nhập nhận xét của bạn về chương trình..."
                                                            value={newComments[curriculum.curriculumId] || ''}
                                                            onChange={(e) => handleCommentChange(curriculum.curriculumId, e.target.value)}
                                                            variant="outlined"
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    borderRadius: 2,
                                                                    '&:hover fieldset': {
                                                                        borderColor: '#06A9AE',
                                                                    },
                                                                    '&.Mui-focused fieldset': {
                                                                        borderColor: '#06A9AE',
                                                                    },
                                                                }
                                                            }}
                                                        />
                                                        {commentErrors[curriculum.curriculumId] && (
                                                            <Alert
                                                                severity={commentErrors[curriculum.curriculumId].includes('thành công') ? 'success' : 'error'}
                                                                sx={{ mt: 2, borderRadius: 2 }}
                                                            >
                                                                {commentErrors[curriculum.curriculumId]}
                                                            </Alert>
                                                        )}
                                                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                                            <StyledButton
                                                                variant="contained"
                                                                startIcon={<SendIcon />}
                                                                onClick={() => submitComment(curriculum.curriculumId)}
                                                                disabled={commentSubmitting[curriculum.curriculumId] || !newComments[curriculum.curriculumId]?.trim()}
                                                                sx={(theme) => ({
                                                                    bgcolor: '#06A9AE',
                                                                    color: '#fff',
                                                                    '&:hover': {
                                                                        bgcolor: '#05969A',
                                                                        opacity: 0.9
                                                                    }
                                                                })}
                                                            >
                                                                {commentSubmitting[curriculum.curriculumId] ? 'Đang gửi...' : 'Gửi nhận xét'}
                                                            </StyledButton>
                                                        </Box>
                                                    </CardContent>
                                                </DashboardCard>

                                                {/* Comments List */}
                                                <DashboardCard>
                                                    <CardHeader bgcolor={'#06A9AE'}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <CommentIcon sx={{ mr: 1 }} />
                                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                                Danh sách nhận xét
                                                            </Typography>
                                                        </Box>
                                                    </CardHeader>
                                                    <CardContent sx={{ p: 3 }}>
                                                        {commentLoading[curriculum.curriculumId] ? (
                                                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                                                <CircularProgress size={30} sx={{ color: '#06A9AE' }} />
                                                            </Box>
                                                        ) : (comments[curriculum.curriculumId] || []).length === 0 ? (
                                                            <Box sx={{
                                                                textAlign: 'center',
                                                                p: 3,
                                                                bgcolor: theme.palette.background.secondary,
                                                                borderRadius: 2
                                                            }}>
                                                                <Typography sx={{ color: theme.palette.text.secondary }}>
                                                                    Chưa có nhận xét nào cho chương trình này
                                                                </Typography>
                                                            </Box>
                                                        ) : (
                                                            <MuiList sx={{ bgcolor: 'transparent' }}>
                                                                {(comments[curriculum.curriculumId] || []).map((comment, index) => (
                                                                    <ListItem
                                                                        key={comment.curriculumFeedbackId || index}
                                                                        sx={{
                                                                            bgcolor: index % 2 === 0 ? theme.palette.background.secondary : 'transparent',
                                                                            borderRadius: 2,
                                                                            mb: 1,
                                                                            border: `1px solid ${theme.palette.background.secondary}`,
                                                                            alignItems: 'flex-start'
                                                                        }}
                                                                    >
                                                                        <ListItemIcon sx={{ mt: 1 }}>
                                                                            {comment.imgURL ? (
                                                                                <Avatar
                                                                                    src={comment.imgURL}
                                                                                    sx={{
                                                                                        width: 40,
                                                                                        height: 40,
                                                                                        border: (theme) => `2px solid ${theme.palette.primary.main}`
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <Avatar sx={{
                                                                                    bgcolor: '#06A9AE',
                                                                                    width: 40,
                                                                                    height: 40
                                                                                }}>
                                                                                    <PersonIcon />
                                                                                </Avatar>
                                                                            )}
                                                                        </ListItemIcon>
                                                                        <ListItemText
                                                                            primary={
                                                                                <Box>
                                                                                    <Typography variant="body1" sx={{
                                                                                        color: theme.palette.text.primary,
                                                                                        lineHeight: 1.6,
                                                                                        mb: 1
                                                                                    }}>
                                                                                        {comment.body}
                                                                                    </Typography>
                                                                                    {comment.user && (
                                                                                        <Typography variant="caption" sx={{
                                                                                            color: '#637381',
                                                                                            fontWeight: 600,
                                                                                            display: 'block',
                                                                                            mb: 0.5
                                                                                        }}>
                                                                                            {comment.user}
                                                                                        </Typography>
                                                                                    )}
                                                                                    {comment.timeStamp && (
                                                                                        <Typography variant="caption" sx={{
                                                                                            color: '#637381',
                                                                                        }}>
                                                                                            {comment.timeStamp}
                                                                                        </Typography>
                                                                                    )}
                                                                                </Box>
                                                                            }
                                                                        />
                                                                    </ListItem>
                                                                ))}
                                                            </MuiList>
                                                        )}
                                                    </CardContent>
                                                </DashboardCard>
                                            </Box>
                                        </Collapse>

                                        <Divider sx={{ my: 3 }} />

                                        <Box sx={{ mt: 4 }}>
                                            <DashboardCard>
                                                <CardHeader bgcolor={'#06A9AE'}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <AssignmentIcon sx={{ mr: 1 }} />
                                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                            Danh sách các chủ đề/bài học
                                                        </Typography>
                                                    </Box>
                                                </CardHeader>
                                                <CardContent sx={{ p: 3 }}>
                                                    {selectedBook && (
                                                        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <MenuBookIcon sx={{ color: '#06A9AE', mr: 1 }} />
                                                            <Typography variant="h6" sx={{
                                                                fontWeight: 600,
                                                                color: theme.palette.text.primary
                                                            }}>
                                                                Sách giáo khoa: {selectedBook}
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        mb: 3,
                                                        gap: 2
                                                    }}>
                                                        <StyledButton
                                                            variant={currentSemester === 1 ? "contained" : "outlined"}
                                                            onClick={() => setCurrentSemester(1)}
                                                            sx={{
                                                                bgcolor: currentSemester === 1 ? '#06A9AE' : theme.palette.background.paper,
                                                                color: currentSemester === 1 ? '#fff' : theme.palette.text.primary,
                                                                borderColor: '#06A9AE',
                                                                '&:hover': {
                                                                    bgcolor: currentSemester === 1 ? '#05969A' : theme.palette.background.secondary,
                                                                    borderColor: '#05969A'
                                                                }
                                                            }}
                                                        >
                                                            Học kỳ 1
                                                        </StyledButton>
                                                        <StyledButton
                                                            variant={currentSemester === 2 ? "contained" : "outlined"}
                                                            onClick={() => setCurrentSemester(2)}
                                                            sx={{
                                                                bgcolor: currentSemester === 2 ? '#06A9AE' : theme.palette.background.paper,
                                                                color: currentSemester === 2 ? '#fff' : theme.palette.text.primary,
                                                                borderColor: '#06A9AE',
                                                                '&:hover': {
                                                                    bgcolor: currentSemester === 2 ? '#05969A' : theme.palette.background.secondary,
                                                                    borderColor: '#05969A'
                                                                }
                                                            }}
                                                        >
                                                            Học kỳ 2
                                                        </StyledButton>
                                                    </Box>

                                                    {moduleLoading ? (
                                                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                                            <CircularProgress size={40} sx={{ color: '#06A9AE' }} />
                                                        </Box>
                                                    ) : moduleError ? (
                                                        <Alert severity="error" sx={{ m: 2, borderRadius: 2 }}>
                                                            {moduleError}
                                                        </Alert>
                                                    ) : (
                                                        <>
                                                            <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 'none', borderRadius: 2 }}>
                                                                <Table>
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <StyledTableCell align="center" width="10%">STT</StyledTableCell>
                                                                            <StyledTableCell align="left" width="70%">Tên chủ đề/bài học</StyledTableCell>
                                                                            <StyledTableCell align="center" width="20%">Số tiết</StyledTableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {modules
                                                                            .filter((module) =>
                                                                                module.semester === currentSemester &&
                                                                                module.book === selectedBook
                                                                            )
                                                                            .slice((modulePage - 1) * 10, modulePage * 10)
                                                                            .map((module, index) => (
                                                                                <React.Fragment key={module.moduleId}>
                                                                                    <StyledTableRow>
                                                                                        <TableCell align="center">{(modulePage - 1) * 10 + index + 1}</TableCell>
                                                                                        <TableCell align="left">
                                                                                            <Box sx={{
                                                                                                display: 'flex',
                                                                                                alignItems: 'center',
                                                                                                bgcolor: 'rgba(6, 169, 174, 0.04)',
                                                                                                p: 1,
                                                                                                borderRadius: 1
                                                                                            }}>
                                                                                                <AssignmentIcon sx={{
                                                                                                    color: '#06A9AE',
                                                                                                    mr: 1,
                                                                                                    fontSize: 20
                                                                                                }} />
                                                                                                <Typography variant="body1" sx={{
                                                                                                    fontWeight: 700,
                                                                                                    color: theme.palette.text.primary,
                                                                                                    fontSize: '1.1rem'
                                                                                                }}>
                                                                                                    {module.name}
                                                                                                </Typography>
                                                                                            </Box>
                                                                                        </TableCell>
                                                                                        <TableCell align="center">
                                                                                            <InfoChip
                                                                                                icon={<TimerIcon />}
                                                                                                label={`${module.totalPeriods} tiết`}
                                                                                                size="small"
                                                                                            />
                                                                                        </TableCell>
                                                                                    </StyledTableRow>
                                                                                    {module.lessons && module.lessons.map((lesson, lessonIndex) => (
                                                                                        <StyledTableRow key={lesson.lessonId}>
                                                                                            <TableCell align="center">
                                                                                                {(modulePage - 1) * 10 + index + 1}.{lessonIndex + 1}
                                                                                            </TableCell>
                                                                                            <TableCell align="left" sx={{ pl: 6 }}>
                                                                                                <Typography variant="body2" sx={{
                                                                                                    color: theme.palette.text.secondary,
                                                                                                    display: 'flex',
                                                                                                    alignItems: 'center'
                                                                                                }}>
                                                                                                    <MenuBookIcon sx={{
                                                                                                        fontSize: 16,
                                                                                                        mr: 1,
                                                                                                        color: '#06A9AE',
                                                                                                        opacity: 0.7
                                                                                                    }} />
                                                                                                    {lesson.name}
                                                                                                </Typography>
                                                                                            </TableCell>
                                                                                            <TableCell align="center">
                                                                                                <InfoChip
                                                                                                    icon={<TimerIcon />}
                                                                                                    label={`${lesson.totalPeriods} tiết`}
                                                                                                    size="small"
                                                                                                />
                                                                                            </TableCell>
                                                                                        </StyledTableRow>
                                                                                    ))}
                                                                                </React.Fragment>
                                                                            ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                            {moduleTotalPage > 1 && (
                                                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                                                    <Pagination
                                                                        count={moduleTotalPage}
                                                                        page={modulePage}
                                                                        onChange={(e, value) => setModulePage(value)}
                                                                        color="primary"
                                                                        size="large"
                                                                        sx={{
                                                                            '& .MuiPaginationItem-root': {
                                                                                borderRadius: 1,
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
                                    </CurriculumCard>
                                </Box>
                            ))}
                        </List>
                    )}
                </Stack>
            )}
        </Box>
    );
};

export default CurriculumAnalysis;
