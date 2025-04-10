import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    List,
    ListItem,
    IconButton,
    TextField,
    Button,
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
    Collapse,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Container,
    Card,
    CardContent,
    Chip,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    ImportContacts as ImportContactsIcon,
    School as SchoolIcon,
    Assignment as AssignmentIcon,
    MenuBook as MenuBookIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// API URLs
const MODULE_API_URL = 'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules';
const LESSON_API_URL = 'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons';

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
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: COLORS.background.secondary,
    border: `1px solid ${theme.palette.grey[300]}`,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
        cursor: 'pointer',
    },
    border: `1px solid ${theme.palette.grey[300]}`,
}));

const StyledButton = styled(Button)({
    borderRadius: 8,
    padding: '8px 16px',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
    },
});

const CurriculumCard = styled(ListItem)({
    backgroundColor: COLORS.background.paper,
    borderRadius: 12,
    marginBottom: 16,
    padding: 20,
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    },
    cursor: 'pointer',
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

const CurriculumFramework = ({ sidebarOpen }) => {
    const [curricula, setCurricula] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [expandedCurriculum, setExpandedCurriculum] = useState(null);
    const [editedCurriculum, setEditedCurriculum] = useState({ name: '', description: '', totalPeriods: '', year: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userGradeNumber, setUserGradeNumber] = useState(null);

    const [modules, setModules] = useState([]);
    const [currentSemester, setCurrentSemester] = useState(1);
    const [modulePage, setModulePage] = useState(1);
    const [moduleTotalPage, setModuleTotalPage] = useState(1);
    const [moduleLoading, setModuleLoading] = useState(false);
    const [moduleError, setModuleError] = useState(null);

    const [selectedModuleId, setSelectedModuleId] = useState(null);
    const [moduleDetails, setModuleDetails] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState(null);
    const [editModuleMode, setEditModuleMode] = useState(false);
    const [editedModule, setEditedModule] = useState({ name: '', book: '', semester: '', totalPeriods: '' });
    const [editLessonMode, setEditLessonMode] = useState(null);
    const [editedLessonName, setEditedLessonName] = useState('');
    const [editedLessonPeriods, setEditedLessonPeriods] = useState('');
    const [openAddLessonDialog, setOpenAddLessonDialog] = useState(false);
    const [newLessonName, setNewLessonName] = useState('');
    const [newLessonPeriods, setNewLessonPeriods] = useState('1');

    const [openAddModuleDialog, setOpenAddModuleDialog] = useState(false);
    const [newModule, setNewModule] = useState({ name: '', book: '', semester: 1, totalPeriods: '' });

    const sidebarWidth = sidebarOpen ? 60 : 240;

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

                setModules(filteredModules);

                const semesterModules = filteredModules.filter((module) => module.semester === currentSemester);
                setModuleTotalPage(Math.ceil(semesterModules.length / 10));
            } else {
                setModuleError('Không thể tải dữ liệu từ API: ' + response.data.message);
            }
        } catch (err) {
            setModuleError('Đã xảy ra lỗi khi tải dữ liệu: ' + err.message);
        } finally {
            setModuleLoading(false);
        }
    }, [currentSemester]);

    const fetchModuleDetails = useCallback(async (moduleId) => {
        setDetailLoading(true);
        setDetailError(null);
        try {
            const accessToken = localStorage.getItem('accessToken');
            const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};

            const response = await axios.get(`${MODULE_API_URL}/${moduleId}/lessons`, config);

            if (response.data.code === 0) {
                const moduleData = response.data.data;
                setModuleDetails(moduleData);
                setLessons(moduleData.lessons || []);
                setEditedModule({
                    name: moduleData.name || '',
                    book: moduleData.book || '',
                    semester: moduleData.semester || '',
                    totalPeriods: moduleData.totalPeriods || '',
                });
            } else {
                setDetailError('Không thể tải dữ liệu từ API: ' + response.data.message);
            }
        } catch (err) {
            setDetailError('Đã xảy ra lỗi khi tải dữ liệu: ' + err.message);
        } finally {
            setDetailLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchCurricula = async () => {
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
        };

        fetchCurricula();
    }, [getUserGradeNumber]);

    useEffect(() => {
        if (userGradeNumber && expandedCurriculum) {
            fetchModules(userGradeNumber);
        }
    }, [userGradeNumber, expandedCurriculum, fetchModules]);

    useEffect(() => {
        if (modules.length > 0) {
            const semesterModules = modules.filter((module) => module.semester === currentSemester);
            setModuleTotalPage(Math.ceil(semesterModules.length / 10));
            setModulePage(1);
        }
    }, [currentSemester, modules]);

    useEffect(() => {
        if (selectedModuleId) {
            fetchModuleDetails(selectedModuleId);
        }
    }, [selectedModuleId, fetchModuleDetails]);

    const handleCardClick = (curriculumId) => {
        setExpandedCurriculum(expandedCurriculum === curriculumId ? null : curriculumId);
    };

    const handleEditClick = (e, curriculum) => {
        e.stopPropagation();
        setEditMode(curriculum.curriculumId);
        setEditedCurriculum({
            name: curriculum.name,
            description: curriculum.description,
            totalPeriods: curriculum.totalPeriods,
            year: curriculum.year
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedCurriculum({ ...editedCurriculum, [name]: value });
    };

    const handleSaveEdit = async () => {
        try {
            const updatedCurriculum = {
                ...curricula.find((c) => c.curriculumId === editMode),
                ...editedCurriculum,
                totalPeriods: parseInt(editedCurriculum.totalPeriods, 10)
            };

            const response = await axios.put(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/curriculums/${editMode}`,
                updatedCurriculum
            );

            if (response.data.code !== 0) {
                throw new Error(response.data.message || 'Lỗi khi cập nhật dữ liệu');
            }

            setCurricula(curricula.map((c) => (c.curriculumId === editMode ? { ...c, ...updatedCurriculum } : c)));
            setEditMode(null);
            alert('Chương trình giảng dạy đã được cập nhật thành công!');
        } catch (error) {
            alert('Không thể cập nhật chương trình giảng dạy. Vui lòng thử lại.');
        }
    };

    const handleCancelEdit = () => setEditMode(null);

    const handleModulePageChange = (event, value) => setModulePage(value);

    const handleSemesterChange = (semester) => setCurrentSemester(semester);

    const handleModuleNameClick = (moduleId) => {
        setSelectedModuleId(selectedModuleId === moduleId ? null : moduleId);
    };

    const handleEditModuleClick = () => setEditModuleMode(true);

    const handleModuleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedModule({ ...editedModule, [name]: value });
    };

    const handleSaveModuleEdit = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};

            const updatedModule = {
                ...moduleDetails,
                name: editedModule.name,
                book: editedModule.book,
                semester: parseInt(editedModule.semester, 10),
                totalPeriods: parseInt(editedModule.totalPeriods, 10),
                gradeNumber: userGradeNumber,
            };

            const response = await axios.put(`${MODULE_API_URL}/${selectedModuleId}`, updatedModule, config);

            if (response.data.code !== 0) {
                throw new Error(response.data.message || 'Lỗi khi cập nhật dữ liệu');
            }

            setModuleDetails(updatedModule);
            setModules(modules.map(m => m.moduleId === selectedModuleId ? updatedModule : m));
            setEditModuleMode(false);
            alert('Cập nhật module thành công!');
        } catch (error) {
            alert('Không thể cập nhật module. Vui lòng thử lại: ' + error.message);
        }
    };

    const handleCancelModuleEdit = () => {
        setEditModuleMode(false);
        setEditedModule({
            name: moduleDetails.name,
            book: moduleDetails.book,
            semester: moduleDetails.semester,
            totalPeriods: moduleDetails.totalPeriods
        });
    };

    const handleDeleteModule = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa module này? Hành động này sẽ xóa tất cả bài học liên quan.')) {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};

                const response = await axios.delete(`${MODULE_API_URL}/${selectedModuleId}`, config);

                if (response.data.code !== 0) {
                    throw new Error(response.data.message || 'Lỗi khi xóa module');
                }

                setModules(modules.filter(m => m.moduleId !== selectedModuleId));
                setSelectedModuleId(null);
                setLessons([]);
                alert('Xóa module thành công!');
            } catch (error) {
                alert('Không thể xóa module. Vui lòng thử lại: ' + error.message);
            }
        }
    };

    const handleEditLessonClick = (lesson) => {
        setEditLessonMode(lesson.lessonId);
        setEditedLessonName(lesson.name);
        setEditedLessonPeriods(lesson.totalPeriods || '');
    };

    const handleLessonInputChange = (e) => setEditedLessonName(e.target.value);
    const handleLessonPeriodsChange = (e) => setEditedLessonPeriods(e.target.value);

    const handleSaveLessonEdit = async (lessonId) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};

            const updatedLesson = {
                lessonId,
                name: editedLessonName,
                moduleId: parseInt(selectedModuleId, 10),
                totalPeriods: parseInt(editedLessonPeriods, 10)
            };

            const response = await axios.put(`${LESSON_API_URL}/${lessonId}`, updatedLesson, config);

            if (response.data.code !== 0) {
                throw new Error(response.data.message || 'Lỗi khi cập nhật bài học');
            }

            setLessons(lessons.map((lesson) => (lesson.lessonId === lessonId ?
                { ...lesson, name: editedLessonName, totalPeriods: parseInt(editedLessonPeriods, 10) } : lesson
            )));
            setEditLessonMode(null);
            alert('Cập nhật bài học thành công!');
        } catch (error) {
            alert('Không thể cập nhật bài học. Vui lòng thử lại.');
        }
    };

    const handleCancelLessonEdit = () => {
        setEditLessonMode(null);
        setEditedLessonName('');
        setEditedLessonPeriods('');
    };

    const handleDeleteLesson = async (lessonId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài học này?')) {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};

                const response = await axios.delete(`${LESSON_API_URL}/${lessonId}`, config);

                if (response.data.code !== 0) {
                    throw new Error(response.data.message || 'Lỗi khi xóa bài học');
                }

                setLessons(lessons.filter((lesson) => lesson.lessonId !== lessonId));
                alert('Xóa bài học thành công!');
            } catch (error) {
                alert('Không thể xóa bài học. Vui lòng thử lại.');
            }
        }
    };

    const handleOpenAddLessonDialog = () => {
        setOpenAddLessonDialog(true);
        setNewLessonName('');
        setNewLessonPeriods('1');
    };

    const handleCloseAddLessonDialog = () => {
        setOpenAddLessonDialog(false);
        setNewLessonName('');
        setNewLessonPeriods('1');
    };

    const handleAddLesson = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};

            const newLesson = {
                name: newLessonName,
                moduleId: parseInt(selectedModuleId, 10),
                totalPeriods: parseInt(newLessonPeriods, 10)
            };

            const response = await axios.post(LESSON_API_URL, newLesson, config);

            if (response.data.code !== 0) {
                throw new Error(response.data.message || 'Lỗi khi thêm bài học');
            }

            const addedLesson = response.data.data;
            setLessons([...lessons, addedLesson]);
            handleCloseAddLessonDialog();
            alert('Thêm bài học thành công!');
        } catch (error) {
            alert('Không thể thêm bài học. Vui lòng thử lại.');
        }
    };

    const handleOpenAddModuleDialog = () => {
        setOpenAddModuleDialog(true);
        setNewModule({
            name: '',
            book: modules[0]?.book || '',
            semester: currentSemester,
            totalPeriods: ''
        });
    };

    const handleCloseAddModuleDialog = () => {
        setOpenAddModuleDialog(false);
        setNewModule({ name: '', book: '', semester: currentSemester, totalPeriods: '' });
    };

    const handleNewModuleInputChange = (e) => {
        const { name, value } = e.target;
        setNewModule({ ...newModule, [name]: value });
    };

    const handleAddModule = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};

            const moduleToAdd = {
                name: newModule.name,
                book: newModule.book,
                semester: parseInt(newModule.semester, 10),
                totalPeriods: parseInt(newModule.totalPeriods, 10),
                gradeNumber: userGradeNumber,
            };

            const response = await axios.post(MODULE_API_URL, moduleToAdd, config);

            if (response.data.code !== 0) {
                throw new Error(response.data.message || 'Lỗi khi thêm module');
            }

            const addedModule = response.data.data;
            setModules([...modules, addedModule]);
            handleCloseAddModuleDialog();
            alert('Thêm module thành công!');
        } catch (error) {
            alert('Không thể thêm module. Vui lòng thử lại: ' + error.message);
        }
    };

    const bookName = modules.length > 0 ? modules[0].book : '';

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
            minHeight: '100vh',
            background: COLORS.background.default,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1100,
            overflowY: 'auto'
        }}>
            <Box sx={{
                py: 6,
                ml: `${sidebarWidth}px`,
                transition: 'margin-left 0.3s ease',
                px: { xs: 3, md: 5 }
            }}>
                <Container maxWidth="lg">
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                        <ImportContactsIcon sx={{ fontSize: 36, color: COLORS.primary, mr: 2 }} />
                        <Box>
                            <Typography variant="h4" sx={{
                                fontWeight: 700,
                                color: COLORS.text.primary,
                                lineHeight: 1.2,
                            }}>
                                Khung chương trình
                            </Typography>
                            <Typography variant="subtitle1" sx={{
                                color: COLORS.text.secondary,
                                mt: 0.5,
                            }}>
                                {userGradeNumber ? `Quản lý chương trình giảng dạy Khối ${userGradeNumber}` : 'Vui lòng đăng nhập để xem chương trình giảng dạy'}
                            </Typography>
                        </Box>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
                    )}

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
                                    <CurriculumCard onClick={() => handleCardClick(curriculum.curriculumId)}>
                                        {editMode === curriculum.curriculumId ? (
                                            <Box sx={{ width: '100%' }}>
                                                <TextField
                                                    label="Tên chương trình"
                                                    name="name"
                                                    value={editedCurriculum.name}
                                                    onChange={handleInputChange}
                                                    fullWidth
                                                    sx={{ mb: 2 }}
                                                />
                                                <TextField
                                                    label="Mô tả"
                                                    name="description"
                                                    value={editedCurriculum.description}
                                                    onChange={handleInputChange}
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    sx={{ mb: 2 }}
                                                />
                                                <TextField
                                                    label="Tổng số tiết cả năm"
                                                    name="totalPeriods"
                                                    value={editedCurriculum.totalPeriods}
                                                    onChange={handleInputChange}
                                                    type="number"
                                                    fullWidth
                                                    sx={{ mb: 2 }}
                                                />
                                                <TextField
                                                    label="Năm học"
                                                    name="year"
                                                    value={editedCurriculum.year}
                                                    onChange={handleInputChange}
                                                    fullWidth
                                                    sx={{ mb: 3 }}
                                                />
                                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                                    <StyledButton
                                                        onClick={handleSaveEdit}
                                                        variant="contained"
                                                        color="primary"
                                                    >
                                                        Lưu thay đổi
                                                    </StyledButton>
                                                    <StyledButton
                                                        onClick={handleCancelEdit}
                                                        variant="outlined"
                                                        color="secondary"
                                                    >
                                                        Hủy
                                                    </StyledButton>
                                                </Box>
                                            </Box>
                                        ) : (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                <Box>
                                                    <Typography sx={{ fontWeight: 600, fontSize: '1.25rem', mb: 1.5, color: COLORS.text.primary }}>
                                                        {curriculum.name} ({curriculum.year})
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: COLORS.text.secondary, mb: 1, lineHeight: 1.6 }}>
                                                        {curriculum.description}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: COLORS.text.secondary, lineHeight: 1.6 }}>
                                                        Tổng số tiết cả năm: {curriculum.totalPeriods}
                                                    </Typography>
                                                </Box>
                                                <IconButton
                                                    onClick={(e) => { e.stopPropagation(); handleEditClick(e, curriculum); }}
                                                    sx={{
                                                        bgcolor: 'rgba(6, 169, 174, 0.08)',
                                                        '&:hover': { bgcolor: 'rgba(6, 169, 174, 0.15)' },
                                                        borderRadius: '8px',
                                                        p: 1.5
                                                    }}
                                                >
                                                    <EditIcon sx={{ color: COLORS.primary }} />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </CurriculumCard>

                                    <Collapse in={expandedCurriculum === curriculum.curriculumId}>
                                        {userGradeNumber && (
                                            <Box sx={{ ml: 4, mb: 4 }}>
                                                {bookName && (
                                                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <MenuBookIcon sx={{ color: COLORS.secondary, mr: 1 }} />
                                                        <Typography variant="h6" sx={{
                                                            fontWeight: 600,
                                                            color: COLORS.text.primary
                                                        }}>
                                                            Sách giáo khoa: {bookName}
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
                                                        color="primary"
                                                        onClick={() => handleSemesterChange(1)}
                                                        sx={{
                                                            bgcolor: currentSemester === 1 ? COLORS.primary : 'transparent',
                                                            '&:hover': {
                                                                bgcolor: currentSemester === 1 ? COLORS.primary : 'rgba(6, 169, 174, 0.08)',
                                                            }
                                                        }}
                                                    >
                                                        Học kỳ 1
                                                    </StyledButton>
                                                    <StyledButton
                                                        variant={currentSemester === 2 ? "contained" : "outlined"}
                                                        color="primary"
                                                        onClick={() => handleSemesterChange(2)}
                                                        sx={{
                                                            bgcolor: currentSemester === 2 ? COLORS.primary : 'transparent',
                                                            '&:hover': {
                                                                bgcolor: currentSemester === 2 ? COLORS.primary : 'rgba(6, 169, 174, 0.08)',
                                                            }
                                                        }}
                                                    >
                                                        Học kỳ 2
                                                    </StyledButton>
                                                </Box>

                                                <DashboardCard sx={{ mb: 4 }}>
                                                    <CardHeader bgcolor={COLORS.primary}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <AssignmentIcon sx={{ mr: 1 }} />
                                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                                Danh sách các chủ đề/bài học - Học kỳ {currentSemester}
                                                            </Typography>
                                                        </Box>
                                                        <StyledButton
                                                            variant="contained"
                                                            startIcon={<AddIcon />}
                                                            onClick={handleOpenAddModuleDialog}
                                                            sx={{
                                                                bgcolor: 'rgba(255, 255, 255, 0.15)',
                                                                '&:hover': {
                                                                    bgcolor: 'rgba(255, 255, 255, 0.25)'
                                                                }
                                                            }}
                                                        >
                                                            Thêm Module
                                                        </StyledButton>
                                                    </CardHeader>

                                                    <CardContent sx={{ p: 0 }}>
                                                        {moduleLoading ? (
                                                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                                                                <CircularProgress size={40} sx={{ color: COLORS.primary }} />
                                                            </Box>
                                                        ) : moduleError ? (
                                                            <Box sx={{ p: 3 }}>
                                                                <Alert severity="error">{moduleError}</Alert>
                                                            </Box>
                                                        ) : modules.length > 0 ? (
                                                            <>
                                                                <TableContainer sx={{ boxShadow: 'none' }}>
                                                                    <Table sx={{ minWidth: 650 }} aria-label="module table">
                                                                        <TableHead>
                                                                            <TableRow>
                                                                                <StyledTableCell align="center" width="10%">STT</StyledTableCell>
                                                                                <StyledTableCell align="left" width="70%">Tên chủ đề</StyledTableCell>
                                                                                <StyledTableCell align="center" width="20%">Tổng số tiết</StyledTableCell>
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {modules
                                                                                .filter((module) => module.semester === currentSemester)
                                                                                .slice((modulePage - 1) * 10, modulePage * 10)
                                                                                .map((module, index) => (
                                                                                    <React.Fragment key={module.moduleId}>
                                                                                        <StyledTableRow
                                                                                            sx={{
                                                                                                bgcolor: selectedModuleId === module.moduleId ? 'rgba(6, 169, 174, 0.08)' : 'inherit'
                                                                                            }}
                                                                                        >
                                                                                            <TableCell align="center">{(modulePage - 1) * 10 + index + 1}</TableCell>
                                                                                            <TableCell
                                                                                                align="left"
                                                                                                onClick={() => handleModuleNameClick(module.moduleId)}
                                                                                                sx={{
                                                                                                    fontWeight: selectedModuleId === module.moduleId ? 600 : 400,
                                                                                                    color: selectedModuleId === module.moduleId ? COLORS.primary : COLORS.text.primary,
                                                                                                    display: 'flex',
                                                                                                    alignItems: 'center'
                                                                                                }}
                                                                                            >
                                                                                                {module.name}
                                                                                                {selectedModuleId === module.moduleId ?
                                                                                                    <ExpandLessIcon sx={{ ml: 1 }} /> :
                                                                                                    <ExpandMoreIcon sx={{ ml: 1 }} />
                                                                                                }
                                                                                            </TableCell>
                                                                                            <TableCell align="center">
                                                                                                <InfoChip
                                                                                                    icon={<SchoolIcon />}
                                                                                                    label={`${module.totalPeriods} tiết`}
                                                                                                    size="small"
                                                                                                />
                                                                                            </TableCell>
                                                                                        </StyledTableRow>
                                                                                        <TableRow>
                                                                                            <TableCell colSpan={3} sx={{ p: 0, border: 'none' }}>
                                                                                                <Collapse in={selectedModuleId === module.moduleId}>
                                                                                                    <Box sx={{
                                                                                                        p: 3,
                                                                                                        bgcolor: 'rgba(0, 0, 0, 0.02)',
                                                                                                        borderRadius: '0 0 8px 8px',
                                                                                                        mx: 2,
                                                                                                        mb: 2,
                                                                                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                                                                                                    }}>
                                                                                                        {detailLoading ? (
                                                                                                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                                                                                                <CircularProgress size={30} sx={{ color: COLORS.primary }} />
                                                                                                            </Box>
                                                                                                        ) : detailError ? (
                                                                                                            <Alert severity="error">{detailError}</Alert>
                                                                                                        ) : moduleDetails ? (
                                                                                                            <>
                                                                                                                {editModuleMode ? (
                                                                                                                    <Box sx={{
                                                                                                                        p: 3,
                                                                                                                        bgcolor: COLORS.background.paper,
                                                                                                                        borderRadius: 2,
                                                                                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                                                                                                    }}>
                                                                                                                        <Typography variant="h6" sx={{ mb: 2, color: COLORS.primary }}>
                                                                                                                            Chỉnh sửa module
                                                                                                                        </Typography>
                                                                                                                        <TextField
                                                                                                                            label="Tên chủ đề"
                                                                                                                            name="name"
                                                                                                                            value={editedModule.name}
                                                                                                                            onChange={handleModuleInputChange}
                                                                                                                            fullWidth
                                                                                                                            sx={{ mb: 2 }}
                                                                                                                        />
                                                                                                                        <TextField
                                                                                                                            label="Tên sách"
                                                                                                                            name="book"
                                                                                                                            value={editedModule.book}
                                                                                                                            onChange={handleModuleInputChange}
                                                                                                                            fullWidth
                                                                                                                            sx={{ mb: 2 }}
                                                                                                                        />
                                                                                                                        <TextField
                                                                                                                            label="Học kỳ"
                                                                                                                            name="semester"
                                                                                                                            type="number"
                                                                                                                            value={editedModule.semester}
                                                                                                                            onChange={handleModuleInputChange}
                                                                                                                            fullWidth
                                                                                                                            sx={{ mb: 2 }}
                                                                                                                        />
                                                                                                                        <TextField
                                                                                                                            label="Số tiết"
                                                                                                                            name="totalPeriods"
                                                                                                                            type="number"
                                                                                                                            value={editedModule.totalPeriods}
                                                                                                                            onChange={handleModuleInputChange}
                                                                                                                            fullWidth
                                                                                                                            sx={{ mb: 3 }}
                                                                                                                        />
                                                                                                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                                                                                                            <StyledButton
                                                                                                                                variant="contained"
                                                                                                                                color="primary"
                                                                                                                                onClick={handleSaveModuleEdit}
                                                                                                                            >
                                                                                                                                Lưu thay đổi
                                                                                                                            </StyledButton>
                                                                                                                            <StyledButton
                                                                                                                                variant="outlined"
                                                                                                                                color="secondary"
                                                                                                                                onClick={handleCancelModuleEdit}
                                                                                                                            >
                                                                                                                                Hủy
                                                                                                                            </StyledButton>
                                                                                                                        </Box>
                                                                                                                    </Box>
                                                                                                                ) : (
                                                                                                                    <Box sx={{
                                                                                                                        display: 'flex',
                                                                                                                        justifyContent: 'space-between',
                                                                                                                        alignItems: 'center',
                                                                                                                        pb: 2,
                                                                                                                        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                                                                                                                        mb: 3
                                                                                                                    }}>
                                                                                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                                                            <Typography variant="h6" sx={{ color: COLORS.text.primary }}>
                                                                                                                                {moduleDetails.name}
                                                                                                                            </Typography>
                                                                                                                        </Box>
                                                                                                                        <Box>
                                                                                                                            <IconButton
                                                                                                                                onClick={handleEditModuleClick}
                                                                                                                                sx={{
                                                                                                                                    color: COLORS.primary,
                                                                                                                                    bgcolor: 'rgba(6, 169, 174, 0.08)',
                                                                                                                                    mr: 1,
                                                                                                                                    '&:hover': { bgcolor: 'rgba(6, 169, 174, 0.15)' }
                                                                                                                                }}
                                                                                                                            >
                                                                                                                                <EditIcon />
                                                                                                                            </IconButton>
                                                                                                                            <IconButton
                                                                                                                                onClick={handleDeleteModule}
                                                                                                                                sx={{
                                                                                                                                    color: COLORS.error,
                                                                                                                                    bgcolor: 'rgba(255, 72, 66, 0.08)',
                                                                                                                                    '&:hover': { bgcolor: 'rgba(255, 72, 66, 0.15)' }
                                                                                                                                }}
                                                                                                                            >
                                                                                                                                <DeleteIcon />
                                                                                                                            </IconButton>
                                                                                                                        </Box>
                                                                                                                    </Box>
                                                                                                                )}

                                                                                                                <Box>
                                                                                                                    <Box sx={{
                                                                                                                        display: 'flex',
                                                                                                                        justifyContent: 'space-between',
                                                                                                                        alignItems: 'center',
                                                                                                                        mb: 2
                                                                                                                    }}>
                                                                                                                        <Typography
                                                                                                                            variant="h6"
                                                                                                                            sx={{
                                                                                                                                display: 'flex',
                                                                                                                                alignItems: 'center',
                                                                                                                                color: COLORS.text.primary
                                                                                                                            }}
                                                                                                                        >
                                                                                                                            <AssignmentIcon sx={{ mr: 1, fontSize: 20, color: COLORS.secondary }} />
                                                                                                                            Danh sách bài học
                                                                                                                        </Typography>
                                                                                                                        <StyledButton
                                                                                                                            variant="contained"
                                                                                                                            color="primary"
                                                                                                                            startIcon={<AddIcon />}
                                                                                                                            onClick={handleOpenAddLessonDialog}
                                                                                                                        >
                                                                                                                            Thêm bài học
                                                                                                                        </StyledButton>
                                                                                                                    </Box>

                                                                                                                    <TableContainer
                                                                                                                        component={Paper}
                                                                                                                        sx={{
                                                                                                                            borderRadius: 2,
                                                                                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        <Table>
                                                                                                                            <TableHead>
                                                                                                                                <TableRow>
                                                                                                                                    <StyledTableCell align="center" width="5%">STT</StyledTableCell>
                                                                                                                                    <StyledTableCell align="left" width="55%">Tên bài học</StyledTableCell>
                                                                                                                                    <StyledTableCell align="center" width="20%">Số tiết</StyledTableCell>
                                                                                                                                    <StyledTableCell align="center" width="20%">Hành động</StyledTableCell>
                                                                                                                                </TableRow>
                                                                                                                            </TableHead>
                                                                                                                            <TableBody>
                                                                                                                                {lessons.length > 0 ? (
                                                                                                                                    lessons.map((lesson, index) => (
                                                                                                                                        <StyledTableRow key={lesson.lessonId}>
                                                                                                                                            <TableCell align="center">{index + 1}</TableCell>
                                                                                                                                            <TableCell align="left">
                                                                                                                                                {editLessonMode === lesson.lessonId ? (
                                                                                                                                                    <TextField
                                                                                                                                                        value={editedLessonName}
                                                                                                                                                        onChange={handleLessonInputChange}
                                                                                                                                                        fullWidth
                                                                                                                                                        variant="outlined"
                                                                                                                                                        size="small"
                                                                                                                                                    />
                                                                                                                                                ) : (
                                                                                                                                                    lesson.name
                                                                                                                                                )}
                                                                                                                                            </TableCell>
                                                                                                                                            <TableCell align="center">
                                                                                                                                                {editLessonMode === lesson.lessonId ? (
                                                                                                                                                    <TextField
                                                                                                                                                        value={editedLessonPeriods}
                                                                                                                                                        onChange={handleLessonPeriodsChange}
                                                                                                                                                        type="number"
                                                                                                                                                        variant="outlined"
                                                                                                                                                        size="small"
                                                                                                                                                        sx={{ width: '80px' }}
                                                                                                                                                    />
                                                                                                                                                ) : (
                                                                                                                                                    <InfoChip
                                                                                                                                                        icon={<SchoolIcon />}
                                                                                                                                                        label={`${lesson.totalPeriods || 1} tiết`}
                                                                                                                                                        size="small"
                                                                                                                                                    />
                                                                                                                                                )}
                                                                                                                                            </TableCell>
                                                                                                                                            <TableCell align="center">
                                                                                                                                                {editLessonMode === lesson.lessonId ? (
                                                                                                                                                    <>
                                                                                                                                                        <IconButton
                                                                                                                                                            onClick={() => handleSaveLessonEdit(lesson.lessonId)}
                                                                                                                                                            sx={{
                                                                                                                                                                color: COLORS.success,
                                                                                                                                                                bgcolor: 'rgba(0, 171, 85, 0.08)',
                                                                                                                                                                mr: 1,
                                                                                                                                                                '&:hover': { bgcolor: 'rgba(0, 171, 85, 0.15)' }
                                                                                                                                                            }}
                                                                                                                                                        >
                                                                                                                                                            <EditIcon />
                                                                                                                                                        </IconButton>
                                                                                                                                                        <IconButton
                                                                                                                                                            onClick={handleCancelLessonEdit}
                                                                                                                                                            sx={{
                                                                                                                                                                color: COLORS.error,
                                                                                                                                                                bgcolor: 'rgba(255, 72, 66, 0.08)',
                                                                                                                                                                '&:hover': { bgcolor: 'rgba(255, 72, 66, 0.15)' }
                                                                                                                                                            }}
                                                                                                                                                        >
                                                                                                                                                            <DeleteIcon />
                                                                                                                                                        </IconButton>
                                                                                                                                                    </>
                                                                                                                                                ) : (
                                                                                                                                                    <>
                                                                                                                                                        <IconButton
                                                                                                                                                            onClick={() => handleEditLessonClick(lesson)}
                                                                                                                                                            sx={{
                                                                                                                                                                color: COLORS.primary,
                                                                                                                                                                bgcolor: 'rgba(6, 169, 174, 0.08)',
                                                                                                                                                                mr: 1,
                                                                                                                                                                '&:hover': { bgcolor: 'rgba(6, 169, 174, 0.15)' }
                                                                                                                                                            }}
                                                                                                                                                        >
                                                                                                                                                            <EditIcon />
                                                                                                                                                        </IconButton>
                                                                                                                                                        <IconButton
                                                                                                                                                            onClick={() => handleDeleteLesson(lesson.lessonId)}
                                                                                                                                                            sx={{
                                                                                                                                                                color: COLORS.error,
                                                                                                                                                                bgcolor: 'rgba(255, 72, 66, 0.08)',
                                                                                                                                                                '&:hover': { bgcolor: 'rgba(255, 72, 66, 0.15)' }
                                                                                                                                                            }}
                                                                                                                                                        >
                                                                                                                                                            <DeleteIcon />
                                                                                                                                                        </IconButton>
                                                                                                                                                    </>
                                                                                                                                                )}
                                                                                                                                            </TableCell>
                                                                                                                                        </StyledTableRow>
                                                                                                                                    ))
                                                                                                                                ) : (
                                                                                                                                    <TableRow>
                                                                                                                                        <TableCell colSpan={4} align="center" sx={{ py: 3, color: COLORS.text.secondary }}>
                                                                                                                                            Không có bài học nào.
                                                                                                                                        </TableCell>
                                                                                                                                    </TableRow>
                                                                                                                                )}
                                                                                                                            </TableBody>
                                                                                                                        </Table>
                                                                                                                    </TableContainer>
                                                                                                                </Box>
                                                                                                            </>
                                                                                                        ) : (
                                                                                                            <Typography sx={{ textAlign: 'center', color: COLORS.text.secondary }}>
                                                                                                                Không tìm thấy thông tin module.
                                                                                                            </Typography>
                                                                                                        )}
                                                                                                    </Box>
                                                                                                </Collapse>
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    </React.Fragment>
                                                                                ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </TableContainer>

                                                                {moduleTotalPage > 1 && (
                                                                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                                                        <Pagination
                                                                            count={moduleTotalPage}
                                                                            page={modulePage}
                                                                            onChange={handleModulePageChange}
                                                                            color="primary"
                                                                            size="large"
                                                                            showFirstButton
                                                                            showLastButton
                                                                            sx={{
                                                                                '& .MuiPaginationItem-root': {
                                                                                    color: COLORS.text.primary,
                                                                                },
                                                                                '& .Mui-selected': {
                                                                                    backgroundColor: COLORS.primary,
                                                                                    color: '#fff',
                                                                                    '&:hover': {
                                                                                        backgroundColor: COLORS.primary,
                                                                                    }
                                                                                }
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                                                <Typography sx={{ color: COLORS.text.secondary, mb: 2 }}>
                                                                    Không có module nào cho học kỳ {currentSemester}.
                                                                </Typography>
                                                                <StyledButton
                                                                    variant="contained"
                                                                    color="primary"
                                                                    startIcon={<AddIcon />}
                                                                    onClick={handleOpenAddModuleDialog}
                                                                >
                                                                    Thêm Module đầu tiên
                                                                </StyledButton>
                                                            </Box>
                                                        )}
                                                    </CardContent>
                                                </DashboardCard>
                                            </Box>
                                        )}
                                    </Collapse>
                                </Box>
                            ))}
                        </List>
                    )}

                    {/* Add Lesson Dialog */}
                    <Dialog
                        open={openAddLessonDialog}
                        onClose={handleCloseAddLessonDialog}
                        PaperProps={{
                            sx: { borderRadius: 2, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }
                        }}
                    >
                        <DialogTitle sx={{ bgcolor: COLORS.primary, color: '#fff', display: 'flex', alignItems: 'center' }}>
                            <AddIcon sx={{ mr: 1 }} />
                            Thêm bài học mới
                        </DialogTitle>
                        <DialogContent sx={{ pt: 3, pb: 2, px: 3, minWidth: 400 }}>
                            <TextField
                                label="Tên bài học"
                                value={newLessonName}
                                onChange={(e) => setNewLessonName(e.target.value)}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Số tiết"
                                type="number"
                                value={newLessonPeriods}
                                onChange={(e) => setNewLessonPeriods(e.target.value)}
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <StyledButton onClick={handleCloseAddLessonDialog} color="inherit">Hủy</StyledButton>
                            <StyledButton
                                onClick={handleAddLesson}
                                variant="contained"
                                color="primary"
                                disabled={!newLessonName.trim()}
                            >
                                Thêm
                            </StyledButton>
                        </DialogActions>
                    </Dialog>

                    {/* Add Module Dialog */}
                    <Dialog
                        open={openAddModuleDialog}
                        onClose={handleCloseAddModuleDialog}
                        PaperProps={{
                            sx: { borderRadius: 2, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }
                        }}
                    >
                        <DialogTitle sx={{ bgcolor: COLORS.primary, color: '#fff', display: 'flex', alignItems: 'center' }}>
                            <AddIcon sx={{ mr: 1 }} />
                            Thêm Module mới
                        </DialogTitle>
                        <DialogContent sx={{ pt: 3, pb: 2, px: 3, minWidth: 400 }}>
                            <TextField
                                label="Tên chủ đề"
                                name="name"
                                value={newModule.name}
                                onChange={handleNewModuleInputChange}
                                fullWidth
                                sx={{ mb: 2, mt: 1 }}
                            />
                            <TextField
                                label="Tên sách"
                                name="book"
                                value={newModule.book}
                                onChange={handleNewModuleInputChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Học kỳ"
                                name="semester"
                                type="number"
                                value={newModule.semester}
                                onChange={handleNewModuleInputChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Tổng số tiết"
                                name="totalPeriods"
                                type="number"
                                value={newModule.totalPeriods}
                                onChange={handleNewModuleInputChange}
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <StyledButton onClick={handleCloseAddModuleDialog} color="inherit">Hủy</StyledButton>
                            <StyledButton
                                onClick={handleAddModule}
                                variant="contained"
                                color="primary"
                                disabled={!newModule.name.trim() || !newModule.book.trim()}
                            >
                                Thêm
                            </StyledButton>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
        </Box>
    );
};

export default CurriculumFramework;