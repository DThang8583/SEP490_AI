import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    List,
    IconButton,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    Paper,
    Pagination,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Container,
    Card,
    CardContent,
    Chip,
    MenuItem,
    Stack,
    Grid,
    Collapse,
    TableRow,
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
    Check as CheckIcon,
    Close as CloseIcon,
    Info as InfoIcon,
    AccessTime as AccessTimeIcon,
    Class as ClassIcon,
    DateRange as DateRangeIcon,
    Notes as NotesIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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
        secondary: 'rgba(6, 169, 174, 0.02)',
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
    '&.MuiButton-contained': {
        backgroundColor: COLORS.primary,
        color: '#fff',
        '&:hover': {
            backgroundColor: COLORS.primary,
        }
    },
    '&.MuiButton-outlined': {
        borderColor: COLORS.primary,
        color: COLORS.primary,
        '&:hover': {
            backgroundColor: 'rgba(6, 169, 174, 0.08)',
            borderColor: COLORS.primary
        }
    }
});

const CurriculumCard = styled(Box)({
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
    backgroundColor: 'rgba(6, 169, 174, 0.08)',
    color: COLORS.primary,
    '.MuiChip-icon': {
        color: COLORS.primary,
    }
});

const CurriculumFramework = ({ sidebarOpen }) => {
    const [curricula, setCurricula] = useState([]);
    const [editMode, setEditMode] = useState(null);
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

    // Giữ lại selectedModuleId để sử dụng cho edit module và add lesson
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

    // Thêm state cho lesson details
    const [expandedLessonId, setExpandedLessonId] = useState(null);
    const [lessonDetails, setLessonDetails] = useState({});
    const [lessonDetailLoading, setLessonDetailLoading] = useState(false);
    const [lessonDetailError, setLessonDetailError] = useState(null);

    const [openAddModuleDialog, setOpenAddModuleDialog] = useState(false);
    const [newModule, setNewModule] = useState({ name: '', book: '', semester: 1, totalPeriods: '' });

    const [schoolYears, setSchoolYears] = useState([]);
    const [grades, setGrades] = useState([]);
    const [userGradeId, setUserGradeId] = useState(null);

    const [editingCurriculum, setEditingCurriculum] = useState(null);

    const [curriculumReloadKey, setCurriculumReloadKey] = useState(0);

    const sidebarWidth = sidebarOpen ? 60 : 240;
    const navigate = useNavigate();

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
            setCurriculumReloadKey(prev => prev + 1);
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

    useEffect(() => {
        fetchCurricula();
    }, [fetchCurricula]);

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
        if (selectedModuleId) {
            fetchModuleDetails(selectedModuleId);
        }
    }, [selectedModuleId, fetchModuleDetails]);

    useEffect(() => {
        if (
            editMode &&
            editedCurriculum.year &&
            (!editedCurriculum.schoolYearId || editedCurriculum.schoolYearId === "")
            && schoolYears.length > 0
        ) {
            const found = schoolYears.find(y => y.year === editedCurriculum.year);
            if (found) {
                setEditedCurriculum(curr => ({
                    ...curr,
                    schoolYearId: found.schoolYearId
                }));
            }
        }
        // eslint-disable-next-line
    }, [schoolYears, editMode]);

    const handleEditClick = (e, curriculum) => {
        e.stopPropagation();
        fetchSchoolYears();
        setEditMode(curriculum.curriculumId);
        setEditedCurriculum({
            name: "Toán lớp",
            description: curriculum.description,
            totalPeriods: String(curriculum.totalPeriods ?? ''),
            year: curriculum.year,
            schoolYearId: curriculum.schoolYearId ?? "",
            gradeId: userGradeId
        });
        setEditingCurriculum(curriculum);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "totalPeriods") {
            let cleaned = value.replace(/\D/g, "");
            if (!cleaned || Number(cleaned) < 1) cleaned = "1";
            setEditedCurriculum(curr => ({ ...curr, [name]: cleaned }));
        } else if (name === "schoolYearId") {
            const selectedYear = schoolYears.find(y => String(y.schoolYearId) === String(value));
            setEditedCurriculum(curr => ({
                ...curr,
                schoolYearId: value,
                year: selectedYear ? selectedYear.year : ""
            }));
        } else {
            setEditedCurriculum(curr => ({ ...curr, [name]: value }));
        }
    };

    const handleSaveEdit = async () => {
        if (
            !editedCurriculum.description.trim() ||
            !String(editedCurriculum.totalPeriods).trim() ||
            isNaN(Number(editedCurriculum.totalPeriods)) ||
            Number(editedCurriculum.totalPeriods) <= 1 ||
            !editedCurriculum.schoolYearId
        ) {
            alert('Vui lòng nhập đầy đủ thông tin và Tổng số tiết phải lớn hơn 1.');
            return;
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                alert('Vui lòng đăng nhập để thực hiện thao tác này.');
                return;
            }

            const updatedCurriculum = {
                curriculumId: editMode,
                name: "Toán lớp",
                description: editedCurriculum.description,
                totalPeriods: parseInt(editedCurriculum.totalPeriods, 10),
                schoolYearId: parseInt(editedCurriculum.schoolYearId, 10),
                gradeId: userGradeId
            };

            const response = await axios.put(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/curriculums/${editMode}`,
                updatedCurriculum,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.code === 0 || response.data.code === 22) {
                // Đóng form edit ngay lập tức
                setEditMode(null);
                setEditingCurriculum(null);

                // Reload curriculum ngay lập tức
                await fetchCurricula();

                // Tăng giá trị curriculumReloadKey để kích hoạt re-render
                setCurriculumReloadKey(prev => prev + 1);

                // Hiển thị thông báo sau khi đã reload xong
                alert('Chương trình giảng dạy đã được cập nhật thành công!');
            } else {
                alert(response.data.message || 'Lỗi khi cập nhật dữ liệu');
            }
        } catch (error) {
            console.error('Error updating curriculum:', error);
            if (error.response) {
                alert(`Lỗi: ${error.response.data?.message || 'Không thể cập nhật chương trình giảng dạy. Vui lòng thử lại.'}`);
            } else {
                alert('Không thể cập nhật chương trình giảng dạy. Vui lòng thử lại.');
            }
        }
    };

    const handleCancelEdit = () => {
        setEditMode(null);
        setEditingCurriculum(null);
    };

    const handleModulePageChange = (event, value) => setModulePage(value);

    const handleSemesterChange = (semester) => setCurrentSemester(semester);

    const handleEditModuleClick = (module) => {
        setSelectedModuleId(module.moduleId);
        setEditModuleMode(true);
        setEditedModule({
            name: module.name,
            book: module.book,
            semester: module.semester,
            totalPeriods: module.totalPeriods
        });
        setModuleDetails(module);
    };

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

            // Fetch lại toàn bộ dữ liệu modules sau khi cập nhật
            await fetchModules(userGradeNumber);
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

    const handleDeleteModule = async (moduleId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa module này? Hành động này sẽ xóa tất cả bài học liên quan.')) {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};

                const response = await axios.delete(`${MODULE_API_URL}/${moduleId}`, config);

                if (response.data.code !== 0) {
                    throw new Error(response.data.message || 'Lỗi khi xóa module');
                }

                // Fetch lại toàn bộ dữ liệu modules sau khi xóa
                await fetchModules(userGradeNumber);
                if (selectedModuleId === moduleId) {
                    setSelectedModuleId(null);
                    setLessons([]);
                }
                alert('Xóa module thành công!');
            } catch (error) {
                console.error('Error deleting module:', error);
                alert('Không thể xóa module. Vui lòng thử lại.');
            }
        }
    };

    const handleEditLessonClick = (lesson) => {
        setEditLessonMode(lesson.lessonId);
        setEditedLessonName(lesson.name);
        setEditedLessonPeriods(lesson.totalPeriods || '1');

        // Validate input
        if (!lesson.name || !lesson.totalPeriods) {
            alert('Thông tin bài học không hợp lệ');
            return;
        }
    };

    const handleLessonInputChange = (e) => setEditedLessonName(e.target.value);
    const handleLessonPeriodsChange = (e) => setEditedLessonPeriods(e.target.value);

    const handleSaveLessonEdit = async (lessonId) => {
        if (!editedLessonName.trim() || !editedLessonPeriods || isNaN(Number(editedLessonPeriods)) || Number(editedLessonPeriods) < 1) {
            alert('Vui lòng nhập đầy đủ thông tin và số tiết phải lớn hơn 0');
            return;
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};

            const updatedLesson = {
                name: editedLessonName.trim(),
                moduleId: Number(selectedModuleId),
                totalPeriods: Number(editedLessonPeriods)
            };

            const response = await axios.put(`${LESSON_API_URL}/${lessonId}`, updatedLesson, config);

            if (response.data.code !== 0) {
                throw new Error(response.data.message || 'Lỗi khi cập nhật bài học');
            }

            // Fetch lại toàn bộ dữ liệu modules sau khi cập nhật bài học
            await fetchModules(userGradeNumber);
            setEditLessonMode(null);
            alert('Cập nhật bài học thành công!');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert('Lỗi: ' + error.response.data.message);
            } else {
                alert('Không thể cập nhật bài học. Vui lòng thử lại.');
            }
            console.error('Error updating lesson:', error);
        }
    };

    const handleCancelLessonEdit = () => {
        setEditLessonMode(null);
        setEditedLessonName('');
        setEditedLessonPeriods('');
    };

    const handleDeleteLesson = async (lessonId, moduleId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài học này?')) {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};

                const response = await axios.delete(`${LESSON_API_URL}/${lessonId}`, config);

                if (response.data.code !== 0) {
                    throw new Error(response.data.message || 'Lỗi khi xóa bài học');
                }

                // Fetch lại toàn bộ dữ liệu modules sau khi xóa bài học
                await fetchModules(userGradeNumber);
                alert('Xóa bài học thành công!');
            } catch (error) {
                console.error('Error deleting lesson:', error);
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

            // Fetch lại toàn bộ dữ liệu modules sau khi thêm bài học
            await fetchModules(userGradeNumber);
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

            // Fetch lại toàn bộ dữ liệu modules sau khi thêm
            await fetchModules(userGradeNumber);
            handleCloseAddModuleDialog();
            alert('Thêm module thành công!');
        } catch (error) {
            alert('Không thể thêm module. Vui lòng thử lại: ' + error.message);
        }
    };

    const handleViewCurriculumDetail = (curriculumId) => {
        if (curriculumId) {
            navigate(`/manager/curriculum-detail/${curriculumId}`);
        } else {
            alert("Vui lòng chọn một chương trình trước khi xem chi tiết");
        }
    };

    const bookName = modules.length > 0 ? modules[0].book : '';

    const fetchSchoolYears = useCallback(async () => {
        try {
            const response = await axios.get('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/school-years');
            if (response.data.code === 0) {
                setSchoolYears(response.data.data);
            }
        } catch (error) {
            setSchoolYears([]);
        }
    }, []);

    const fetchGrades = useCallback(async () => {
        try {
            const response = await axios.get('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades');
            if (response.data.code === 0) {
                setGrades(response.data.data);
            }
        } catch (error) {
            setGrades([]);
        }
    }, []);

    useEffect(() => {
        fetchGrades();
    }, [fetchGrades]);

    useEffect(() => {
        if (grades.length > 0 && userGradeNumber) {
            const found = grades.find(g => g.gradeNumber === userGradeNumber);
            if (found) setUserGradeId(found.gradeId);
        }
    }, [grades, userGradeNumber]);

    // Thêm function để fetch lesson details
    const fetchLessonDetails = useCallback(async (lessonId) => {
        console.log('fetchLessonDetails called with:', lessonId);
        console.log('Current lessonDetails:', lessonDetails);

        if (lessonDetails[lessonId]) {
            console.log('Lesson details already exist for:', lessonId);
            return;
        }

        setLessonDetailLoading(true);
        setLessonDetailError(null);
        try {
            const accessToken = localStorage.getItem('accessToken');
            const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};

            console.log('Calling API for lesson:', lessonId);
            const response = await axios.get(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons/${lessonId}/info`,
                config
            );

            console.log('API response:', response.data);

            if (response.data.code === 0) {
                setLessonDetails(prev => ({
                    ...prev,
                    [lessonId]: response.data.data
                }));
                console.log('Lesson details saved for:', lessonId, response.data.data);
            } else {
                setLessonDetailError('Không thể tải thông tin chi tiết bài học: ' + response.data.message);
            }
        } catch (err) {
            console.error('Error fetching lesson details:', err);
            setLessonDetailError('Đã xảy ra lỗi khi tải thông tin chi tiết bài học: ' + err.message);
        } finally {
            setLessonDetailLoading(false);
        }
    }, [lessonDetails]);

    // Thêm function để handle click vào lesson
    const handleLessonClick = async (lessonId) => {
        console.log('handleLessonClick called with:', lessonId);
        console.log('Current expandedLessonId:', expandedLessonId);

        if (expandedLessonId === lessonId) {
            console.log('Collapsing lesson:', lessonId);
            setExpandedLessonId(null);
        } else {
            console.log('Expanding lesson:', lessonId);
            setExpandedLessonId(lessonId);
            await fetchLessonDetails(lessonId);
        }
    };

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
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                        <List key={curriculumReloadKey} sx={{ bgcolor: 'transparent', p: 0 }}>
                            {curricula.map((curriculum) => (
                                <Box key={curriculum.curriculumId}>
                                    <CurriculumCard>
                                        {String(editMode) === String(curriculum.curriculumId) ? (
                                            <Box>
                                                <Stack spacing={2}>
                                                    <TextField
                                                        label="Mô tả"
                                                        name="description"
                                                        value={editedCurriculum.description}
                                                        onChange={handleInputChange}
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        variant="outlined"
                                                    />
                                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                                        <TextField
                                                            label="Tổng số tiết cả năm"
                                                            name="totalPeriods"
                                                            value={editedCurriculum.totalPeriods ?? ''}
                                                            onChange={handleInputChange}
                                                            fullWidth
                                                            type="text"
                                                            inputProps={{
                                                                min: 1,
                                                                inputMode: "numeric",
                                                                pattern: "[0-9]*"
                                                            }}
                                                            helperText="Chỉ nhập số nguyên lớn hơn 1"
                                                            variant="outlined"
                                                        />
                                                        <TextField
                                                            select
                                                            label="Năm học"
                                                            name="schoolYearId"
                                                            value={editedCurriculum.schoolYearId ?? ""}
                                                            onChange={handleInputChange}
                                                            fullWidth
                                                            required
                                                            variant="outlined"
                                                        >
                                                            {schoolYears.map((year) => (
                                                                <MenuItem key={year.schoolYearId} value={year.schoolYearId}>
                                                                    {year.year}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </Stack>
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                                        <StyledButton
                                                            onClick={handleSaveEdit}
                                                            variant="contained"
                                                            color="primary"
                                                            startIcon={<CheckIcon />}
                                                            disabled={
                                                                !editedCurriculum.name.trim() ||
                                                                !editedCurriculum.description.trim() ||
                                                                !String(editedCurriculum.totalPeriods).trim() ||
                                                                isNaN(Number(editedCurriculum.totalPeriods)) ||
                                                                Number(editedCurriculum.totalPeriods) <= 1 ||
                                                                !editedCurriculum.schoolYearId
                                                            }
                                                        >
                                                            Lưu thay đổi
                                                        </StyledButton>
                                                        <StyledButton
                                                            onClick={handleCancelEdit}
                                                            variant="outlined"
                                                            color="secondary"
                                                            startIcon={<CloseIcon />}
                                                        >
                                                            Hủy
                                                        </StyledButton>
                                                    </Box>
                                                </Stack>
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
                                                <Box sx={{ display: 'flex', gap: 1 }}>
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
                                            </Box>
                                        )}
                                    </CurriculumCard>

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
                                                    onClick={() => handleSemesterChange(1)}
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
                                                    onClick={() => handleSemesterChange(2)}
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

                                            <DashboardCard sx={{ mb: 4 }}>
                                                <CardHeader bgcolor={COLORS.primary}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <AssignmentIcon sx={{ mr: 1 }} />
                                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                            Danh sách các chủ đề/bài học - Học kỳ {currentSemester}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                        <Button
                                                            variant="outlined"
                                                            onClick={() => handleViewCurriculumDetail(curriculum.curriculumId)}
                                                            sx={{
                                                                bgcolor: '#fff',
                                                                color: COLORS.primary,
                                                                fontWeight: 600,
                                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                                                '&:hover': {
                                                                    bgcolor: '#fff',
                                                                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)',
                                                                    transform: 'translateY(-2px)'
                                                                },
                                                                transition: 'all 0.2s ease',
                                                                textTransform: 'none',
                                                                borderRadius: '8px',
                                                                padding: '8px 20px',
                                                                fontSize: '0.95rem',
                                                                border: `2px solid ${COLORS.primary}`,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px'
                                                            }}
                                                        >
                                                            <MenuBookIcon sx={{ fontSize: 24, color: COLORS.primary }} />
                                                            Xem nội dung cần đạt
                                                        </Button>
                                                        <StyledButton
                                                            onClick={handleOpenAddModuleDialog}
                                                            sx={{
                                                                bgcolor: '#fff',
                                                                color: COLORS.primary,
                                                                fontWeight: 600,
                                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                                                '&:hover': {
                                                                    bgcolor: '#fff',
                                                                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)',
                                                                    transform: 'translateY(-2px)'
                                                                },
                                                                transition: 'all 0.2s ease',
                                                                textTransform: 'none',
                                                                borderRadius: '8px',
                                                                padding: '8px 20px',
                                                                fontSize: '0.95rem',
                                                                border: `2px solid ${COLORS.primary}`,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px'
                                                            }}
                                                        >
                                                            <AddIcon sx={{ fontSize: 24, color: COLORS.primary }} />
                                                            Thêm Module
                                                        </StyledButton>
                                                    </Box>
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
                                                                                    <StyledTableRow>
                                                                                        <TableCell align="center">{(modulePage - 1) * 10 + index + 1}</TableCell>
                                                                                        <TableCell
                                                                                            align="left"
                                                                                            sx={{
                                                                                                fontWeight: 600,
                                                                                                color: COLORS.text.primary,
                                                                                                display: 'flex',
                                                                                                alignItems: 'center',
                                                                                            }}
                                                                                        >
                                                                                            {module.name}
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
                                                                                        <TableCell colSpan={4} sx={{ p: 0, border: 'none' }}>
                                                                                            <Box sx={{
                                                                                                m: 2,
                                                                                                p: 3,
                                                                                                bgcolor: 'rgba(6, 169, 174, 0.02)',
                                                                                                borderRadius: 2,
                                                                                                border: '1px solid rgba(6, 169, 174, 0.1)'
                                                                                            }}>
                                                                                                <Box sx={{
                                                                                                    display: 'flex',
                                                                                                    justifyContent: 'space-between',
                                                                                                    alignItems: 'center',
                                                                                                    pb: 2,
                                                                                                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                                                                                                    mb: 3
                                                                                                }}>
                                                                                                    <Typography variant="h6" sx={{ color: COLORS.text.primary }}>
                                                                                                        {module.name}
                                                                                                    </Typography>
                                                                                                    <Box>
                                                                                                        <IconButton
                                                                                                            onClick={() => handleEditModuleClick(module)}
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
                                                                                                            onClick={() => handleDeleteModule(module.moduleId)}
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
                                                                                                        onClick={() => {
                                                                                                            setSelectedModuleId(module.moduleId);
                                                                                                            handleOpenAddLessonDialog();
                                                                                                        }}
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
                                                                                                            {module.lessons && module.lessons.length > 0 ? (
                                                                                                                module.lessons.map((lesson, lessonIndex) => (
                                                                                                                    <React.Fragment key={lesson.lessonId}>
                                                                                                                        <StyledTableRow>
                                                                                                                            <TableCell align="center">{lessonIndex + 1}</TableCell>
                                                                                                                            <TableCell
                                                                                                                                align="left"
                                                                                                                                sx={{
                                                                                                                                    cursor: 'pointer',
                                                                                                                                    display: 'flex',
                                                                                                                                    alignItems: 'center',
                                                                                                                                    '&:hover': {
                                                                                                                                        backgroundColor: 'rgba(6, 169, 174, 0.05)'
                                                                                                                                    }
                                                                                                                                }}
                                                                                                                                onClick={(e) => {
                                                                                                                                    if (editLessonMode !== lesson.lessonId) {
                                                                                                                                        handleLessonClick(lesson.lessonId);
                                                                                                                                    }
                                                                                                                                }}
                                                                                                                            >
                                                                                                                                {editLessonMode === lesson.lessonId ? (
                                                                                                                                    <TextField
                                                                                                                                        value={editedLessonName}
                                                                                                                                        onChange={handleLessonInputChange}
                                                                                                                                        fullWidth
                                                                                                                                        variant="outlined"
                                                                                                                                        size="small"
                                                                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                                                                    />
                                                                                                                                ) : (
                                                                                                                                    <>
                                                                                                                                        <InfoIcon sx={{ mr: 1, color: COLORS.primary, fontSize: 18 }} />
                                                                                                                                        {lesson.name}
                                                                                                                                    </>
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
                                                                                                                                        onClick={(e) => e.stopPropagation()}
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
                                                                                                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                                                                                                        <IconButton
                                                                                                                                            onClick={(e) => {
                                                                                                                                                e.stopPropagation();
                                                                                                                                                handleSaveLessonEdit(lesson.lessonId);
                                                                                                                                            }}
                                                                                                                                            sx={{
                                                                                                                                                color: COLORS.success,
                                                                                                                                                bgcolor: 'rgba(0, 171, 85, 0.08)',
                                                                                                                                                '&:hover': { bgcolor: 'rgba(0, 171, 85, 0.15)' }
                                                                                                                                            }}
                                                                                                                                        >
                                                                                                                                            <CheckIcon />
                                                                                                                                        </IconButton>
                                                                                                                                        <IconButton
                                                                                                                                            onClick={(e) => {
                                                                                                                                                e.stopPropagation();
                                                                                                                                                handleCancelLessonEdit();
                                                                                                                                            }}
                                                                                                                                            sx={{
                                                                                                                                                color: COLORS.error,
                                                                                                                                                bgcolor: 'rgba(255, 72, 66, 0.08)',
                                                                                                                                                '&:hover': { bgcolor: 'rgba(255, 72, 66, 0.15)' }
                                                                                                                                            }}
                                                                                                                                        >
                                                                                                                                            <CloseIcon />
                                                                                                                                        </IconButton>
                                                                                                                                    </Box>
                                                                                                                                ) : (
                                                                                                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                                                                                                        <IconButton
                                                                                                                                            onClick={(e) => {
                                                                                                                                                e.stopPropagation();
                                                                                                                                                handleEditLessonClick(lesson);
                                                                                                                                            }}
                                                                                                                                            sx={{
                                                                                                                                                color: COLORS.primary,
                                                                                                                                                bgcolor: 'rgba(6, 169, 174, 0.08)',
                                                                                                                                                '&:hover': { bgcolor: 'rgba(6, 169, 174, 0.15)' }
                                                                                                                                            }}
                                                                                                                                        >
                                                                                                                                            <EditIcon />
                                                                                                                                        </IconButton>
                                                                                                                                        <IconButton
                                                                                                                                            onClick={(e) => {
                                                                                                                                                e.stopPropagation();
                                                                                                                                                handleDeleteLesson(lesson.lessonId, module.moduleId);
                                                                                                                                            }}
                                                                                                                                            sx={{
                                                                                                                                                color: COLORS.error,
                                                                                                                                                bgcolor: 'rgba(255, 72, 66, 0.08)',
                                                                                                                                                '&:hover': { bgcolor: 'rgba(255, 72, 66, 0.15)' }
                                                                                                                                            }}
                                                                                                                                        >
                                                                                                                                            <DeleteIcon />
                                                                                                                                        </IconButton>
                                                                                                                                    </Box>
                                                                                                                                )}
                                                                                                                            </TableCell>
                                                                                                                        </StyledTableRow>

                                                                                                                        {/* Lesson Details Row */}
                                                                                                                        <TableRow>
                                                                                                                            <TableCell colSpan={4} sx={{ p: 0, border: 'none' }}>
                                                                                                                                <Collapse in={expandedLessonId === lesson.lessonId} timeout="auto" unmountOnExit>
                                                                                                                                    {console.log('Rendering collapse for lesson:', lesson.lessonId, 'expandedLessonId:', expandedLessonId, 'should show:', expandedLessonId === lesson.lessonId)}

                                                                                                                                    <Box sx={{
                                                                                                                                        m: 2,
                                                                                                                                        p: 0,
                                                                                                                                        bgcolor: '#fff',
                                                                                                                                        borderRadius: 2,
                                                                                                                                        border: '1px solid rgba(0, 0, 0, 0.1)',
                                                                                                                                        overflow: 'hidden'
                                                                                                                                    }}>
                                                                                                                                        {lessonDetailLoading ? (
                                                                                                                                            <Box sx={{
                                                                                                                                                display: 'flex',
                                                                                                                                                justifyContent: 'center',
                                                                                                                                                alignItems: 'center',
                                                                                                                                                p: 3
                                                                                                                                            }}>
                                                                                                                                                <CircularProgress size={24} sx={{ color: COLORS.primary }} />
                                                                                                                                                <Typography sx={{ ml: 2, color: COLORS.text.secondary }}>
                                                                                                                                                    Đang tải thông tin...
                                                                                                                                                </Typography>
                                                                                                                                            </Box>
                                                                                                                                        ) : lessonDetailError ? (
                                                                                                                                            <Box sx={{ p: 2 }}>
                                                                                                                                                <Alert severity="error">
                                                                                                                                                    {lessonDetailError}
                                                                                                                                                </Alert>
                                                                                                                                            </Box>
                                                                                                                                        ) : lessonDetails[lesson.lessonId] ? (
                                                                                                                                            <>
                                                                                                                                                {/* Header */}
                                                                                                                                                <Box sx={{
                                                                                                                                                    p: 2.5,
                                                                                                                                                    bgcolor: 'rgba(25, 118, 210, 0.04)',
                                                                                                                                                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
                                                                                                                                                }}>
                                                                                                                                                    <Typography variant="h6" sx={{
                                                                                                                                                        color: COLORS.text.primary,
                                                                                                                                                        fontWeight: 600,
                                                                                                                                                        fontSize: '1rem'
                                                                                                                                                    }}>
                                                                                                                                                        Thông tin chi tiết bài học
                                                                                                                                                    </Typography>
                                                                                                                                                </Box>

                                                                                                                                                {/* Content */}
                                                                                                                                                <Box sx={{ p: 2.5 }}>
                                                                                                                                                    <Grid container spacing={2}>
                                                                                                                                                        {/* Tên bài học */}
                                                                                                                                                        <Grid item xs={12} md={6}>
                                                                                                                                                            <Box sx={{
                                                                                                                                                                p: 2,
                                                                                                                                                                border: '1px solid rgba(0, 0, 0, 0.08)',
                                                                                                                                                                borderRadius: 1,
                                                                                                                                                                bgcolor: 'rgba(25, 118, 210, 0.02)'
                                                                                                                                                            }}>
                                                                                                                                                                <Typography variant="caption" sx={{
                                                                                                                                                                    color: COLORS.text.secondary,
                                                                                                                                                                    fontWeight: 600,
                                                                                                                                                                    textTransform: 'uppercase',
                                                                                                                                                                    fontSize: '0.7rem',
                                                                                                                                                                    letterSpacing: 0.5
                                                                                                                                                                }}>
                                                                                                                                                                    Tên bài học
                                                                                                                                                                </Typography>
                                                                                                                                                                <Typography variant="body1" sx={{
                                                                                                                                                                    color: COLORS.text.primary,
                                                                                                                                                                    fontWeight: 500,
                                                                                                                                                                    mt: 0.5
                                                                                                                                                                }}>
                                                                                                                                                                    {lessonDetails[lesson.lessonId].name}
                                                                                                                                                                </Typography>
                                                                                                                                                            </Box>
                                                                                                                                                        </Grid>

                                                                                                                                                        {/* Số tiết */}
                                                                                                                                                        <Grid item xs={12} md={6}>
                                                                                                                                                            <Box sx={{
                                                                                                                                                                p: 2,
                                                                                                                                                                border: '1px solid rgba(0, 0, 0, 0.08)',
                                                                                                                                                                borderRadius: 1,
                                                                                                                                                                bgcolor: 'rgba(6, 169, 174, 0.02)'
                                                                                                                                                            }}>
                                                                                                                                                                <Typography variant="caption" sx={{
                                                                                                                                                                    color: COLORS.text.secondary,
                                                                                                                                                                    fontWeight: 600,
                                                                                                                                                                    textTransform: 'uppercase',
                                                                                                                                                                    fontSize: '0.7rem',
                                                                                                                                                                    letterSpacing: 0.5
                                                                                                                                                                }}>
                                                                                                                                                                    Số tiết
                                                                                                                                                                </Typography>
                                                                                                                                                                <Typography variant="body1" sx={{
                                                                                                                                                                    color: COLORS.text.primary,
                                                                                                                                                                    fontWeight: 500,
                                                                                                                                                                    mt: 0.5
                                                                                                                                                                }}>
                                                                                                                                                                    {lessonDetails[lesson.lessonId].totalPeriods} tiết
                                                                                                                                                                </Typography>
                                                                                                                                                            </Box>
                                                                                                                                                        </Grid>

                                                                                                                                                        {/* Loại bài học */}
                                                                                                                                                        <Grid item xs={12} md={6}>
                                                                                                                                                            <Box sx={{
                                                                                                                                                                p: 2,
                                                                                                                                                                border: '1px solid rgba(0, 0, 0, 0.08)',
                                                                                                                                                                borderRadius: 1,
                                                                                                                                                                bgcolor: 'rgba(255, 171, 0, 0.02)'
                                                                                                                                                            }}>
                                                                                                                                                                <Typography variant="caption" sx={{
                                                                                                                                                                    color: COLORS.text.secondary,
                                                                                                                                                                    fontWeight: 600,
                                                                                                                                                                    textTransform: 'uppercase',
                                                                                                                                                                    fontSize: '0.7rem',
                                                                                                                                                                    letterSpacing: 0.5
                                                                                                                                                                }}>
                                                                                                                                                                    Loại bài học
                                                                                                                                                                </Typography>
                                                                                                                                                                <Typography variant="body1" sx={{
                                                                                                                                                                    color: COLORS.text.primary,
                                                                                                                                                                    fontWeight: 500,
                                                                                                                                                                    mt: 0.5
                                                                                                                                                                }}>
                                                                                                                                                                    {lessonDetails[lesson.lessonId].lessonType}
                                                                                                                                                                </Typography>
                                                                                                                                                            </Box>
                                                                                                                                                        </Grid>

                                                                                                                                                        {/* Tuần học */}
                                                                                                                                                        <Grid item xs={12} md={6}>
                                                                                                                                                            <Box sx={{
                                                                                                                                                                p: 2,
                                                                                                                                                                border: '1px solid rgba(0, 0, 0, 0.08)',
                                                                                                                                                                borderRadius: 1,
                                                                                                                                                                bgcolor: 'rgba(0, 171, 85, 0.02)'
                                                                                                                                                            }}>
                                                                                                                                                                <Typography variant="caption" sx={{
                                                                                                                                                                    color: COLORS.text.secondary,
                                                                                                                                                                    fontWeight: 600,
                                                                                                                                                                    textTransform: 'uppercase',
                                                                                                                                                                    fontSize: '0.7rem',
                                                                                                                                                                    letterSpacing: 0.5
                                                                                                                                                                }}>
                                                                                                                                                                    Tuần học
                                                                                                                                                                </Typography>
                                                                                                                                                                <Typography variant="body1" sx={{
                                                                                                                                                                    color: COLORS.text.primary,
                                                                                                                                                                    fontWeight: 500,
                                                                                                                                                                    mt: 0.5
                                                                                                                                                                }}>
                                                                                                                                                                    Tuần {lessonDetails[lesson.lessonId].week}
                                                                                                                                                                </Typography>
                                                                                                                                                            </Box>
                                                                                                                                                        </Grid>

                                                                                                                                                        {/* Mô tả */}
                                                                                                                                                        <Grid item xs={12}>
                                                                                                                                                            <Box sx={{
                                                                                                                                                                p: 2,
                                                                                                                                                                border: '1px solid rgba(0, 0, 0, 0.08)',
                                                                                                                                                                borderRadius: 1,
                                                                                                                                                                bgcolor: 'rgba(0, 0, 0, 0.01)'
                                                                                                                                                            }}>
                                                                                                                                                                <Typography variant="caption" sx={{
                                                                                                                                                                    color: COLORS.text.secondary,
                                                                                                                                                                    fontWeight: 600,
                                                                                                                                                                    textTransform: 'uppercase',
                                                                                                                                                                    fontSize: '0.7rem',
                                                                                                                                                                    letterSpacing: 0.5
                                                                                                                                                                }}>
                                                                                                                                                                    Mô tả
                                                                                                                                                                </Typography>
                                                                                                                                                                <Typography variant="body2" sx={{
                                                                                                                                                                    color: COLORS.text.primary,
                                                                                                                                                                    lineHeight: 1.6,
                                                                                                                                                                    mt: 0.5
                                                                                                                                                                }}>
                                                                                                                                                                    {lessonDetails[lesson.lessonId].description || 'Chưa có mô tả'}
                                                                                                                                                                </Typography>
                                                                                                                                                            </Box>
                                                                                                                                                        </Grid>

                                                                                                                                                        {/* Ghi chú (nếu có) */}
                                                                                                                                                        {lessonDetails[lesson.lessonId].note && (
                                                                                                                                                            <Grid item xs={12}>
                                                                                                                                                                <Box sx={{
                                                                                                                                                                    p: 2,
                                                                                                                                                                    border: '1px solid rgba(255, 171, 0, 0.2)',
                                                                                                                                                                    borderRadius: 1,
                                                                                                                                                                    bgcolor: 'rgba(255, 171, 0, 0.05)'
                                                                                                                                                                }}>
                                                                                                                                                                    <Typography variant="caption" sx={{
                                                                                                                                                                        color: COLORS.text.secondary,
                                                                                                                                                                        fontWeight: 600,
                                                                                                                                                                        textTransform: 'uppercase',
                                                                                                                                                                        fontSize: '0.7rem',
                                                                                                                                                                        letterSpacing: 0.5
                                                                                                                                                                    }}>
                                                                                                                                                                        Ghi chú
                                                                                                                                                                    </Typography>
                                                                                                                                                                    <Typography variant="body2" sx={{
                                                                                                                                                                        color: COLORS.text.primary,
                                                                                                                                                                        lineHeight: 1.6,
                                                                                                                                                                        mt: 0.5,
                                                                                                                                                                        fontStyle: 'italic'
                                                                                                                                                                    }}>
                                                                                                                                                                        {lessonDetails[lesson.lessonId].note}
                                                                                                                                                                    </Typography>
                                                                                                                                                                </Box>
                                                                                                                                                            </Grid>
                                                                                                                                                        )}
                                                                                                                                                    </Grid>
                                                                                                                                                </Box>
                                                                                                                                            </>
                                                                                                                                        ) : (
                                                                                                                                            <Box sx={{
                                                                                                                                                textAlign: 'center',
                                                                                                                                                p: 3,
                                                                                                                                                color: COLORS.text.secondary
                                                                                                                                            }}>
                                                                                                                                                <Typography>
                                                                                                                                                    Nhấp vào tên bài học để xem thông tin chi tiết
                                                                                                                                                </Typography>
                                                                                                                                            </Box>
                                                                                                                                        )}
                                                                                                                                    </Box>
                                                                                                                                </Collapse>
                                                                                                                            </TableCell>
                                                                                                                        </TableRow>
                                                                                                                    </React.Fragment>
                                                                                                                ))
                                                                                                            ) : (
                                                                                                                <TableRow>
                                                                                                                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                                                                                                        <Typography sx={{ color: COLORS.text.secondary }}>
                                                                                                                            Chưa có bài học nào trong module này
                                                                                                                        </Typography>
                                                                                                                    </TableCell>
                                                                                                                </TableRow>
                                                                                                            )}
                                                                                                        </TableBody>
                                                                                                    </Table>
                                                                                                </TableContainer>
                                                                                            </Box>
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                </React.Fragment>
                                                                            ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <Box sx={{ p: 3, textAlign: 'center' }}>
                                                            <Typography sx={{ color: COLORS.text.secondary }}>
                                                                Không có module nào cho học kỳ {currentSemester}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </CardContent>
                                            </DashboardCard>
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </List>
                    )}

                    {/* Add Module Dialog */}
                    <Dialog open={openAddModuleDialog} onClose={handleCloseAddModuleDialog} maxWidth="sm" fullWidth>
                        <DialogTitle>Thêm Module Mới</DialogTitle>
                        <DialogContent>
                            <Stack spacing={2} sx={{ mt: 1 }}>
                                <TextField
                                    label="Tên module"
                                    name="name"
                                    value={newModule.name}
                                    onChange={handleNewModuleInputChange}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Sách"
                                    name="book"
                                    value={newModule.book}
                                    onChange={handleNewModuleInputChange}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    select
                                    label="Học kỳ"
                                    name="semester"
                                    value={newModule.semester}
                                    onChange={handleNewModuleInputChange}
                                    fullWidth
                                    required
                                >
                                    <MenuItem value={1}>Học kỳ 1</MenuItem>
                                    <MenuItem value={2}>Học kỳ 2</MenuItem>
                                </TextField>
                                <TextField
                                    label="Tổng số tiết"
                                    name="totalPeriods"
                                    type="number"
                                    value={newModule.totalPeriods}
                                    onChange={handleNewModuleInputChange}
                                    fullWidth
                                    required
                                    inputProps={{ min: 1 }}
                                />
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseAddModuleDialog}>Hủy</Button>
                            <Button
                                onClick={handleAddModule}
                                variant="contained"
                                disabled={
                                    !newModule.name.trim() ||
                                    !newModule.book.trim() ||
                                    !newModule.totalPeriods ||
                                    isNaN(Number(newModule.totalPeriods)) ||
                                    Number(newModule.totalPeriods) < 1
                                }
                            >
                                Thêm
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Add Lesson Dialog */}
                    <Dialog open={openAddLessonDialog} onClose={handleCloseAddLessonDialog} maxWidth="sm" fullWidth>
                        <DialogTitle>Thêm Bài Học Mới</DialogTitle>
                        <DialogContent>
                            <Stack spacing={2} sx={{ mt: 1 }}>
                                <TextField
                                    label="Tên bài học"
                                    value={newLessonName}
                                    onChange={(e) => setNewLessonName(e.target.value)}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Số tiết"
                                    type="number"
                                    value={newLessonPeriods}
                                    onChange={(e) => setNewLessonPeriods(e.target.value)}
                                    fullWidth
                                    required
                                    inputProps={{ min: 1 }}
                                />
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseAddLessonDialog}>Hủy</Button>
                            <Button
                                onClick={handleAddLesson}
                                variant="contained"
                                disabled={
                                    !newLessonName.trim() ||
                                    !newLessonPeriods ||
                                    isNaN(Number(newLessonPeriods)) ||
                                    Number(newLessonPeriods) < 1
                                }
                            >
                                Thêm
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Module Edit Dialog */}
                    {editModuleMode && selectedModuleId && (
                        <Dialog open={editModuleMode} onClose={handleCancelModuleEdit} maxWidth="sm" fullWidth>
                            <DialogTitle>Chỉnh sửa Module</DialogTitle>
                            <DialogContent>
                                <Stack spacing={2} sx={{ mt: 1 }}>
                                    <TextField
                                        label="Tên module"
                                        name="name"
                                        value={editedModule.name}
                                        onChange={handleModuleInputChange}
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Sách"
                                        name="book"
                                        value={editedModule.book}
                                        onChange={handleModuleInputChange}
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        select
                                        label="Học kỳ"
                                        name="semester"
                                        value={editedModule.semester}
                                        onChange={handleModuleInputChange}
                                        fullWidth
                                        required
                                    >
                                        <MenuItem value={1}>Học kỳ 1</MenuItem>
                                        <MenuItem value={2}>Học kỳ 2</MenuItem>
                                    </TextField>
                                    <TextField
                                        label="Tổng số tiết"
                                        name="totalPeriods"
                                        type="number"
                                        value={editedModule.totalPeriods}
                                        onChange={handleModuleInputChange}
                                        fullWidth
                                        required
                                        inputProps={{ min: 1 }}
                                    />
                                </Stack>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCancelModuleEdit}>Hủy</Button>
                                <Button
                                    onClick={handleSaveModuleEdit}
                                    variant="contained"
                                    disabled={
                                        !editedModule.name.trim() ||
                                        !editedModule.book.trim() ||
                                        !editedModule.totalPeriods ||
                                        isNaN(Number(editedModule.totalPeriods)) ||
                                        Number(editedModule.totalPeriods) < 1
                                    }
                                >
                                    Cập nhật
                                </Button>
                            </DialogActions>
                        </Dialog>
                    )}
                </Container>
            </Box>
        </Box>
    );
};

export default CurriculumFramework;