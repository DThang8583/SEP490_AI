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
} from '@mui/material';
import {
    Assignment as AssignmentIcon,
    School as SchoolIcon,
    MenuBook as MenuBookIcon,
    CalendarMonth as CalendarIcon,
    Timer as TimerIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// API URLs
const MODULE_API_URL = 'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules';

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
        secondary: 'rgba(6, 169, 174, 0.02)',
    },
    text: {
        primary: '#212B36',
        secondary: '#637381',
    },
};

// Styled components
const DashboardCard = styled(Card)({
    borderRadius: 16,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    height: '100%',
    background: COLORS.background.paper,
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
    },
});

const CardHeader = styled(Box)(({ bgcolor }) => ({
    padding: '20px',
    background: bgcolor || COLORS.primary,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: COLORS.background.secondary,
    border: `1px solid ${theme.palette.grey[300]}`,
    padding: '16px',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    border: `1px solid ${theme.palette.grey[300]}`,
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: 'rgba(6, 169, 174, 0.04)',
    },
}));

const CurriculumCard = styled(Box)({
    backgroundColor: COLORS.background.paper,
    borderRadius: 16,
    marginBottom: 24,
    padding: 24,
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
    },
});

const StyledSelect = styled(Select)({
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(6, 169, 174, 0.2)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: COLORS.primary,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: COLORS.primary,
    },
});

// Thêm styled component cho button
const StyledButton = styled(Button)({
    textTransform: 'none',
    borderRadius: '8px',
    padding: '8px 20px',
    fontSize: '0.95rem',
    fontWeight: 600,
    transition: 'all 0.2s ease',
});

// Thêm styled component cho InfoChip
const InfoChip = styled(Chip)({
    margin: '4px 4px 4px 0',
    borderRadius: 12,
    backgroundColor: 'rgba(6, 169, 174, 0.08)',
    color: COLORS.primary,
    '.MuiChip-icon': {
        color: COLORS.primary,
    }
});

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
        }
    }, []);

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
    }, [getUserGradeNumber]);

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
                background: COLORS.background.default,
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
                    <CircularProgress size={50} sx={{ color: COLORS.primary }} />
                    <Typography variant="body1" sx={{ color: COLORS.text.secondary }}>
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
            background: COLORS.background.default,
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
                    color: COLORS.text.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                }}>
                    <SchoolIcon sx={{ color: COLORS.primary, fontSize: 32 }} />
                    Phân tích chương trình
                </Typography>
                <Typography variant="body1" sx={{ color: COLORS.text.secondary, ml: 5 }}>
                    Xem và phân tích chi tiết chương trình giảng dạy
                </Typography>
            </Box>

            {error ? (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                </Alert>
            ) : (
                <Stack spacing={3}>
                    {!error && curricula.length === 0 ? (
                        <DashboardCard>
                            <CardContent sx={{ py: 4, textAlign: 'center' }}>
                                <Typography sx={{ color: COLORS.text.secondary }}>
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
                                                    color: COLORS.text.primary,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}>
                                                    {curriculum.name}
                                                    <InfoChip
                                                        icon={<CalendarIcon />}
                                                        label={curriculum.year}
                                                        size="small"
                                                    />
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: COLORS.text.secondary, mb: 2, lineHeight: 1.6 }}>
                                                    {curriculum.description}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                    <Chip
                                                        icon={<TimerIcon />}
                                                        label={`Tổng số tiết: ${curriculum.totalPeriods}`}
                                                        sx={{
                                                            bgcolor: 'rgba(6, 169, 174, 0.08)',
                                                            color: COLORS.primary,
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ my: 3 }} />

                                        <Box sx={{ mt: 4 }}>
                                            <DashboardCard>
                                                <CardHeader bgcolor={COLORS.primary}>
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
                                                            <MenuBookIcon sx={{ color: COLORS.secondary, mr: 1 }} />
                                                            <Typography variant="h6" sx={{
                                                                fontWeight: 600,
                                                                color: COLORS.text.primary
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
                                                                bgcolor: currentSemester === 1 ? COLORS.primary : 'transparent',
                                                                color: currentSemester === 1 ? '#fff' : COLORS.primary,
                                                                borderColor: COLORS.primary,
                                                                '&:hover': {
                                                                    bgcolor: currentSemester === 1 ? COLORS.primary : 'rgba(6, 169, 174, 0.08)',
                                                                    borderColor: COLORS.primary
                                                                }
                                                            }}
                                                        >
                                                            Học kỳ 1
                                                        </StyledButton>
                                                        <StyledButton
                                                            variant={currentSemester === 2 ? "contained" : "outlined"}
                                                            onClick={() => setCurrentSemester(2)}
                                                            sx={{
                                                                bgcolor: currentSemester === 2 ? COLORS.primary : 'transparent',
                                                                color: currentSemester === 2 ? '#fff' : COLORS.primary,
                                                                borderColor: COLORS.primary,
                                                                '&:hover': {
                                                                    bgcolor: currentSemester === 2 ? COLORS.primary : 'rgba(6, 169, 174, 0.08)',
                                                                    borderColor: COLORS.primary
                                                                }
                                                            }}
                                                        >
                                                            Học kỳ 2
                                                        </StyledButton>
                                                    </Box>

                                                    {moduleLoading ? (
                                                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                                            <CircularProgress size={40} sx={{ color: COLORS.primary }} />
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
                                                                                                    color: COLORS.primary,
                                                                                                    mr: 1,
                                                                                                    fontSize: 20
                                                                                                }} />
                                                                                                <Typography variant="body1" sx={{
                                                                                                    fontWeight: 700,
                                                                                                    color: COLORS.text.primary,
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
                                                                                                    color: COLORS.text.secondary,
                                                                                                    display: 'flex',
                                                                                                    alignItems: 'center'
                                                                                                }}>
                                                                                                    <MenuBookIcon sx={{
                                                                                                        fontSize: 16,
                                                                                                        mr: 1,
                                                                                                        color: COLORS.secondary,
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
