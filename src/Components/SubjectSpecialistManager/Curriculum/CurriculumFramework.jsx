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

    // Thêm state cho lesson edit với các trường mới
    const [editedLesson, setEditedLesson] = useState({
        name: '',
        totalPeriods: '',
        lessonTypeId: '',
        noteId: '',
        weekId: '',
        moduleId: ''
    });

    // State cho các dropdown options
    const [lessonTypes, setLessonTypes] = useState([]);
    const [notes, setNotes] = useState([]);
    const [weeks, setWeeks] = useState([]);
    const [optionsLoading, setOptionsLoading] = useState(false);

    // Cập nhật thêm state cho lesson edit dialog
    const [openEditLessonDialog, setOpenEditLessonDialog] = useState(false);

    // Thêm state cho delete lesson
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [lessonToDelete, setLessonToDelete] = useState(null);

    // Thêm state mới cho dialog edit module
    const [openEditModuleDialog, setOpenEditModuleDialog] = useState(false);

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

    const handleEditModuleClick = (module, curriculumId) => {
        setSelectedModuleId(module.moduleId);
        setEditModuleMode(true);
        setEditedModule({
            name: module.name,
            semester: module.semester,
            totalPeriods: module.totalPeriods,
            bookId: 1, // Mặc định bookId = 1
            curriculumId: curriculumId, // curriculumId được truyền vào
            gradeId: userGradeId // gradeId giống edit curriculum
        });
        setModuleDetails(module);
        setOpenEditModuleDialog(true); // Thêm state mới cho dialog
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
                name: editedModule.name,
                semester: parseInt(editedModule.semester, 10),
                totalPeriods: parseInt(editedModule.totalPeriods, 10),
                bookId: 1, // Mặc định bookId = 1
                curriculumId: editedModule.curriculumId,
                gradeId: userGradeId
            };

            const response = await axios.put(`${MODULE_API_URL}/${selectedModuleId}`, updatedModule, config);

            if (response.data.code !== 0 && response.data.code !== 22) {
                throw new Error(response.data.message || 'Lỗi khi cập nhật dữ liệu');
            }

            // Fetch lại toàn bộ dữ liệu modules sau khi cập nhật
            await fetchModules(userGradeNumber);
            setEditModuleMode(false);
            setOpenEditModuleDialog(false);
            alert('Cập nhật module thành công!');
        } catch (error) {
            alert('Không thể cập nhật module. Vui lòng thử lại: ' + error.message);
        }
    };

    const handleCancelModuleEdit = () => {
        setOpenEditModuleDialog(false);
        setEditModuleMode(false);
        setEditedModule({
            name: '',
            semester: 1,
            totalPeriods: '',
            bookId: 1,
            curriculumId: '',
            gradeId: userGradeId
        });
    };

    const handleCloseEditModuleDialog = () => {
        setOpenEditModuleDialog(false);
        setEditModuleMode(false);
        setEditedModule({
            name: '',
            semester: 1,
            totalPeriods: '',
            bookId: 1,
            curriculumId: '',
            gradeId: userGradeId
        });
    };

    const handleDeleteModule = async (moduleId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa module này? Hành động này sẽ xóa tất cả bài học liên quan.')) {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};

                console.log('Starting delete module request for moduleId:', moduleId);
                console.log('Config:', config);

                const response = await axios.delete(`${MODULE_API_URL}/${moduleId}`, config);

                console.log('Delete module response:', response);
                console.log('Response status:', response.status);
                console.log('Response data:', response.data);
                console.log('Response data code:', response.data.code);

                if (response.data.code !== 0 && response.data.code !== 22) {
                    console.error('API returned error code:', response.data.code);
                    console.error('API error message:', response.data.message);
                    throw new Error(response.data.message || 'Lỗi khi xóa module');
                }

                console.log('Delete module successful, fetching updated modules...');
                // Fetch lại toàn bộ dữ liệu modules sau khi xóa
                await fetchModules(userGradeNumber);
                if (selectedModuleId === moduleId) {
                    setSelectedModuleId(null);
                    setLessons([]);
                }
                console.log('Module deleted successfully!');
                alert('Xóa module thành công!');
            } catch (error) {
                console.error('Error deleting module:', error);
                console.error('Error details:', {
                    message: error.message,
                    response: error.response,
                    request: error.request,
                    stack: error.stack
                });

                if (error.response) {
                    console.error('Error response status:', error.response.status);
                    console.error('Error response data:', error.response.data);
                    console.error('Error response headers:', error.response.headers);
                }

                alert('Không thể xóa module. Vui lòng thử lại.');
            }
        }
    };

    const handleEditLessonClick = async (lesson) => {
        try {
            // Đảm bảo các options đã được load
            if (lessonTypes.length === 0 || notes.length === 0 || weeks.length === 0) {
                setOptionsLoading(true);
                await Promise.all([
                    fetchLessonTypes(),
                    fetchNotes(),
                    fetchWeeks()
                ]);
                setOptionsLoading(false);
            }

            // Tìm module mà lesson này thuộc về từ dữ liệu modules hiện tại
            const parentModule = modules.find(module =>
                module.lessons && module.lessons.some(l => l.lessonId === lesson.lessonId)
            );

            // Fetch chi tiết lesson từ API để có đầy đủ thông tin
            const accessToken = localStorage.getItem('accessToken');
            const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};

            const response = await axios.get(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons/${lesson.lessonId}/info`,
                config
            );

            if (response.data.code === 0) {
                const lessonData = response.data.data;
                console.log('Lesson data from API:', lessonData); // Debug log
                console.log('Parent Module:', parentModule); // Debug log

                // Map dữ liệu để lấy ID từ text/name
                let lessonTypeId = '';
                let noteId = '';
                let weekId = '';

                // Xử lý lessonTypeId
                if (lessonData.lessonTypeId) {
                    lessonTypeId = String(lessonData.lessonTypeId);
                } else if (lessonData.lessonType && lessonTypes.length > 0) {
                    const foundLessonType = lessonTypes.find(type =>
                        type.lessonTypeName === lessonData.lessonType
                    );
                    if (foundLessonType) {
                        lessonTypeId = String(foundLessonType.lessonTypeId);
                    }
                }

                // Xử lý noteId
                if (lessonData.noteId) {
                    noteId = String(lessonData.noteId);
                } else if (lessonData.note && notes.length > 0) {
                    const foundNote = notes.find(note =>
                        note.description === lessonData.note
                    );
                    if (foundNote) {
                        noteId = String(foundNote.noteId);
                    }
                }

                // Xử lý weekId
                if (lessonData.weekId) {
                    weekId = String(lessonData.weekId);
                } else if (lessonData.week && weeks.length > 0) {
                    const foundWeek = weeks.find(week =>
                        week.weekNumber === lessonData.week
                    );
                    if (foundWeek) {
                        weekId = String(foundWeek.weekId);
                    }
                }

                // Lấy moduleId từ parent module hoặc từ API response
                const moduleIdForLesson = parentModule
                    ? String(parentModule.moduleId)
                    : String(lessonData.moduleId || selectedModuleId || '');

                console.log('Final moduleId for edit:', moduleIdForLesson); // Debug log

                setEditLessonMode(lesson.lessonId);
                setEditedLesson({
                    name: lessonData.name || lesson.name,
                    totalPeriods: String(lessonData.totalPeriods || lesson.totalPeriods || '1'),
                    lessonTypeId: lessonTypeId,
                    noteId: noteId,
                    weekId: weekId,
                    moduleId: moduleIdForLesson
                });
                setOpenEditLessonDialog(true);
            } else {
                // Fallback nếu không lấy được chi tiết
                const moduleIdForLesson = parentModule
                    ? String(parentModule.moduleId)
                    : String(selectedModuleId || '');

                setEditLessonMode(lesson.lessonId);
                setEditedLesson({
                    name: lesson.name,
                    totalPeriods: String(lesson.totalPeriods || '1'),
                    lessonTypeId: '',
                    noteId: '',
                    weekId: '',
                    moduleId: moduleIdForLesson
                });
                setOpenEditLessonDialog(true);
            }
        } catch (error) {
            console.error('Error fetching lesson details for edit:', error);

            // Tìm module mà lesson này thuộc về trong trường hợp lỗi
            const parentModule = modules.find(module =>
                module.lessons && module.lessons.some(l => l.lessonId === lesson.lessonId)
            );

            const moduleIdForLesson = parentModule
                ? String(parentModule.moduleId)
                : String(selectedModuleId || '');

            // Fallback nếu có lỗi
            setEditLessonMode(lesson.lessonId);
            setEditedLesson({
                name: lesson.name,
                totalPeriods: String(lesson.totalPeriods || '1'),
                lessonTypeId: '',
                noteId: '',
                weekId: '',
                moduleId: moduleIdForLesson
            });
            setOpenEditLessonDialog(true);
        }
    };

    const handleEditedLessonInputChange = (e) => {
        const { name, value } = e.target;
        setEditedLesson(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCloseEditLessonDialog = () => {
        setOpenEditLessonDialog(false);
        setEditLessonMode(null);
        setEditedLesson({
            name: '',
            totalPeriods: '',
            lessonTypeId: '',
            noteId: '',
            weekId: '',
            moduleId: ''
        });
    };

    const handleSaveLessonEdit = async (lessonId) => {
        if (!editedLesson.name.trim() || !editedLesson.totalPeriods || isNaN(Number(editedLesson.totalPeriods)) || Number(editedLesson.totalPeriods) < 1) {
            alert('Vui lòng nhập đầy đủ thông tin và số tiết phải lớn hơn 0');
            return;
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};

            const updatedLesson = {
                name: editedLesson.name.trim(),
                moduleId: Number(editedLesson.moduleId || selectedModuleId),
                totalPeriods: Number(editedLesson.totalPeriods),
                lessonTypeId: editedLesson.lessonTypeId ? Number(editedLesson.lessonTypeId) : undefined,
                noteId: editedLesson.noteId ? Number(editedLesson.noteId) : undefined,
                weekId: editedLesson.weekId ? Number(editedLesson.weekId) : undefined,
            };

            // Loại bỏ các field undefined
            Object.keys(updatedLesson).forEach(key =>
                updatedLesson[key] === undefined && delete updatedLesson[key]
            );

            const response = await axios.put(`${LESSON_API_URL}/${lessonId}`, updatedLesson, config);

            if (response.data.code !== 0 && response.data.code !== 22) {
                throw new Error(response.data.message || 'Lỗi khi cập nhật bài học');
            }

            // Fetch lại toàn bộ dữ liệu modules sau khi cập nhật bài học
            await fetchModules(userGradeNumber);

            // Nếu đang xem chi tiết module, fetch lại module details
            if (selectedModuleId) {
                await fetchModuleDetails(selectedModuleId);
            }

            // Clear lesson details cache để force reload khi expand
            setLessonDetails(prev => {
                const updated = { ...prev };
                delete updated[lessonId];
                return updated;
            });

            // Reset expanded lesson nếu lesson đang được expand
            if (expandedLessonId === lessonId) {
                setExpandedLessonId(null);
            }

            // Đóng dialog và reset state
            handleCloseEditLessonDialog();

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

    const handleDeleteLesson = (lesson, moduleId) => {
        handleOpenDeleteDialog(lesson, moduleId);
    };

    const handleOpenDeleteDialog = (lesson, moduleId) => {
        setLessonToDelete({ ...lesson, moduleId });
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setLessonToDelete(null);
    };

    const handleConfirmDeleteLesson = async () => {
        if (!lessonToDelete) return;

        setDeleteLoading(true);
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                alert('Vui lòng đăng nhập để thực hiện thao tác này.');
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            };

            console.log(`Deleting lesson with ID: ${lessonToDelete.lessonId}`); // Debug log

            const response = await axios.delete(`${LESSON_API_URL}/${lessonToDelete.lessonId}`, config);

            console.log('Delete response:', response.data); // Debug log

            if (response.data.code !== 0 && response.data.code !== 22) {
                throw new Error(response.data.message || 'Lỗi khi xóa bài học');
            }

            // Fetch lại toàn bộ dữ liệu modules sau khi xóa bài học
            await fetchModules(userGradeNumber);

            // Đóng dialog
            handleCloseDeleteDialog();

            // Hiển thị thông báo thành công
            alert('Xóa bài học thành công!');

        } catch (error) {
            console.error('Error deleting lesson:', error);

            let errorMessage = 'Không thể xóa bài học. Vui lòng thử lại.';

            if (error.response) {
                // Server responded with error status
                const { status, data } = error.response;
                if (status === 401) {
                    errorMessage = 'Bạn không có quyền thực hiện thao tác này.';
                } else if (status === 404) {
                    errorMessage = 'Bài học không tồn tại hoặc đã bị xóa.';
                } else if (status === 403) {
                    errorMessage = 'Bạn không có quyền xóa bài học này.';
                } else if (data && data.message) {
                    errorMessage = `Lỗi: ${data.message}`;
                }
            } else if (error.request) {
                // Network error
                errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.';
            }

            alert(errorMessage);
        } finally {
            setDeleteLoading(false);
        }
    };

    // Cập nhật state cho new lesson với đầy đủ các trường
    const [newLesson, setNewLesson] = useState({
        name: '',
        description: '',
        totalPeriods: '1',
        lessonTypeId: '',
        noteId: '',
        weekId: '',
        moduleId: ''
    });

    const handleOpenAddLessonDialog = async () => {
        try {
            // Đảm bảo các options đã được load
            if (lessonTypes.length === 0 || notes.length === 0 || weeks.length === 0) {
                setOptionsLoading(true);
                await Promise.all([
                    fetchLessonTypes(),
                    fetchNotes(),
                    fetchWeeks()
                ]);
                setOptionsLoading(false);
            }

            setOpenAddLessonDialog(true);
            setNewLesson({
                name: '',
                description: '',
                totalPeriods: '1',
                lessonTypeId: '',
                noteId: '',
                weekId: '',
                moduleId: String(selectedModuleId)
            });
        } catch (error) {
            console.error('Error loading options for add lesson:', error);
            setOpenAddLessonDialog(true);
            setNewLesson({
                name: '',
                description: '',
                totalPeriods: '1',
                lessonTypeId: '',
                noteId: '',
                weekId: '',
                moduleId: String(selectedModuleId)
            });
        }
    };

    const handleCloseAddLessonDialog = () => {
        setOpenAddLessonDialog(false);
        setNewLesson({
            name: '',
            description: '',
            totalPeriods: '1',
            lessonTypeId: '',
            noteId: '',
            weekId: '',
            moduleId: ''
        });
    };

    const handleNewLessonInputChange = (e) => {
        const { name, value } = e.target;
        setNewLesson(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddLesson = async () => {
        if (!newLesson.name.trim() || !newLesson.totalPeriods || !newLesson.moduleId || !newLesson.lessonTypeId || !newLesson.noteId || !newLesson.weekId) {
            alert('Vui lòng nhập đầy đủ thông tin bắt buộc (Tên bài học, Số tiết, Module, Loại bài học, Ghi chú, Tuần)');
            return;
        }

        if (isNaN(Number(newLesson.totalPeriods)) || Number(newLesson.totalPeriods) < 1) {
            alert('Số tiết phải là số nguyên lớn hơn 0');
            return;
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};

            const lessonData = {
                name: newLesson.name.trim(),
                description: newLesson.description.trim(),
                totalPeriods: Number(newLesson.totalPeriods),
                moduleId: Number(newLesson.moduleId),
                lessonTypeId: Number(newLesson.lessonTypeId),
                noteId: Number(newLesson.noteId),
                weekId: Number(newLesson.weekId),
            };

            console.log('Sending lesson data:', lessonData); // Debug log

            const response = await axios.post(LESSON_API_URL, lessonData, config);

            console.log('Full API response:', response.data); // Debug log để xem response đầy đủ

            // Cải thiện logic xử lý response
            const { data } = response;
            const isSuccess = (
                data.code === 0 ||
                data.code === 22 ||
                data.message === "Created successfully!" ||
                response.status === 200 ||
                response.status === 201
            );

            if (!isSuccess) {
                throw new Error(data.message || 'Lỗi khi thêm bài học');
            }

            // Fetch lại toàn bộ dữ liệu modules sau khi thêm bài học
            await fetchModules(userGradeNumber);
            handleCloseAddLessonDialog();
            alert('Thêm bài học thành công!');

        } catch (error) {
            console.error('Error adding lesson:', error);

            // Kiểm tra xem có phải là success response bị nhầm lẫn không
            if (error.message && error.message.includes("Created successfully")) {
                // Đây thực ra là success, không phải error
                await fetchModules(userGradeNumber);
                handleCloseAddLessonDialog();
                alert('Thêm bài học thành công!');
                return;
            }

            // Xử lý error thực sự
            if (error.response && error.response.data && error.response.data.message) {
                alert('Lỗi: ' + error.response.data.message);
            } else {
                alert('Không thể thêm bài học. Vui lòng thử lại.');
            }
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

            if (response.data.code !== 0 && response.data.code !== 22) {
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

    // Fetch lesson types từ API
    const fetchLessonTypes = useCallback(async () => {
        try {
            const response = await axios.get('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-types');
            if (response.data.code === 0) {
                setLessonTypes(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching lesson types:', error);
        }
    }, []);

    // Fetch notes từ API
    const fetchNotes = useCallback(async () => {
        try {
            const response = await axios.get('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/notes');
            if (response.data.code === 0) {
                setNotes(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    }, []);

    // Fetch weeks từ API
    const fetchWeeks = useCallback(async () => {
        try {
            const response = await axios.get('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/weeks');
            if (response.data.code === 0) {
                setWeeks(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching weeks:', error);
        }
    }, []);

    // Fetch tất cả options khi component mount
    useEffect(() => {
        const fetchAllOptions = async () => {
            setOptionsLoading(true);
            await Promise.all([
                fetchLessonTypes(),
                fetchNotes(),
                fetchWeeks()
            ]);
            setOptionsLoading(false);
        };
        fetchAllOptions();
    }, [fetchLessonTypes, fetchNotes, fetchWeeks]);

    // Thêm function để fetch lesson details
    const fetchLessonDetails = useCallback(async (lessonId) => {
        if (lessonDetails[lessonId]) {
            return;
        }

        setLessonDetailLoading(true);
        setLessonDetailError(null);
        try {
            const accessToken = localStorage.getItem('accessToken');
            const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};

            const response = await axios.get(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons/${lessonId}/info`,
                config
            );

            if (response.data.code === 0) {
                setLessonDetails(prev => ({
                    ...prev,
                    [lessonId]: response.data.data
                }));
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
        if (expandedLessonId === lessonId) {
            setExpandedLessonId(null);
        } else {
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
                                                                                                            onClick={(e) => {
                                                                                                                e.stopPropagation();
                                                                                                                handleEditModuleClick(module, curriculum.curriculumId);
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
                                                                                                                handleDeleteModule(module.moduleId);
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
                                                                                                                                <>
                                                                                                                                    <InfoIcon sx={{ mr: 1, color: COLORS.primary, fontSize: 18 }} />
                                                                                                                                    {lesson.name}
                                                                                                                                </>
                                                                                                                            </TableCell>
                                                                                                                            <TableCell align="center">
                                                                                                                                {editLessonMode === lesson.lessonId ? (
                                                                                                                                    <TextField
                                                                                                                                        value={editedLessonPeriods}
                                                                                                                                        onChange={handleEditedLessonInputChange}
                                                                                                                                        type="number"
                                                                                                                                        variant="outlined"
                                                                                                                                        size="small"
                                                                                                                                        sx={{ width: '80px' }}
                                                                                                                                        inputProps={{ min: 1 }}
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
                                                                                                                                                handleDeleteLesson(lesson, module.moduleId);
                                                                                                                                            }}
                                                                                                                                            sx={{
                                                                                                                                                color: COLORS.error,
                                                                                                                                                bgcolor: 'rgba(255, 72, 66, 0.08)',
                                                                                                                                                '&:hover': {
                                                                                                                                                    bgcolor: 'rgba(255, 72, 66, 0.15)',
                                                                                                                                                    transform: 'scale(1.05)'
                                                                                                                                                },
                                                                                                                                                transition: 'all 0.2s ease'
                                                                                                                                            }}
                                                                                                                                            disabled={deleteLoading}
                                                                                                                                        >
                                                                                                                                            {deleteLoading && lessonToDelete?.lessonId === lesson.lessonId ? (
                                                                                                                                                <CircularProgress size={20} sx={{ color: COLORS.error }} />
                                                                                                                                            ) : (
                                                                                                                                                <DeleteIcon />
                                                                                                                                            )}
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
                                                                                                                                                handleDeleteLesson(lesson, module.moduleId);
                                                                                                                                            }}
                                                                                                                                            sx={{
                                                                                                                                                color: COLORS.error,
                                                                                                                                                bgcolor: 'rgba(255, 72, 66, 0.08)',
                                                                                                                                                '&:hover': {
                                                                                                                                                    bgcolor: 'rgba(255, 72, 66, 0.15)',
                                                                                                                                                    transform: 'scale(1.05)'
                                                                                                                                                },
                                                                                                                                                transition: 'all 0.2s ease'
                                                                                                                                            }}
                                                                                                                                            disabled={deleteLoading}
                                                                                                                                        >
                                                                                                                                            {deleteLoading && lessonToDelete?.lessonId === lesson.lessonId ? (
                                                                                                                                                <CircularProgress size={20} sx={{ color: COLORS.error }} />
                                                                                                                                            ) : (
                                                                                                                                                <DeleteIcon />
                                                                                                                                            )}
                                                                                                                                        </IconButton>
                                                                                                                                    </Box>
                                                                                                                                )}
                                                                                                                            </TableCell>
                                                                                                                        </StyledTableRow>

                                                                                                                        {/* Lesson Details Row */}
                                                                                                                        <TableRow>
                                                                                                                            <TableCell colSpan={4} sx={{ p: 0, border: 'none' }}>
                                                                                                                                <Collapse in={expandedLessonId === lesson.lessonId} timeout="auto" unmountOnExit>
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
                                                                                                                                                                    Tuần
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

                    {/* Add Lesson Dialog - Improved UI/UX */}
                    <Dialog
                        open={openAddLessonDialog}
                        onClose={handleCloseAddLessonDialog}
                        maxWidth="md"
                        fullWidth
                        PaperProps={{
                            sx: {
                                borderRadius: 4,
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                overflow: 'hidden'
                            }
                        }}
                    >
                        {/* Enhanced Dialog Header */}
                        <DialogTitle sx={{
                            background: `linear-gradient(135deg, ${COLORS.primary} 0%, #0891b2 100%)`,
                            color: '#fff',
                            p: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)'
                            }
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 48,
                                height: 48,
                                borderRadius: '12px',
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <AddIcon sx={{ fontSize: 28, color: '#fff' }} />
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={{
                                    fontWeight: 700,
                                    fontSize: '1.5rem',
                                    mb: 0.5,
                                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                }}>
                                    Thêm Bài Học Mới
                                </Typography>
                                <Typography variant="body2" sx={{
                                    opacity: 0.9,
                                    fontSize: '0.875rem'
                                }}>
                                    Tạo bài học mới cho chương trình giảng dạy
                                </Typography>
                            </Box>
                        </DialogTitle>

                        <DialogContent sx={{ p: 4, bgcolor: '#fff' }}>
                            <Stack spacing={4} sx={{ mt: 1 }}>
                                {/* Basic Information Section */}
                                <Box>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 3,
                                        pb: 2,
                                        borderBottom: `2px solid ${COLORS.primary}20`
                                    }}>
                                        <InfoIcon sx={{
                                            color: COLORS.primary,
                                            mr: 1.5,
                                            fontSize: 24
                                        }} />
                                        <Typography variant="h6" sx={{
                                            color: COLORS.text.primary,
                                            fontWeight: 600,
                                            fontSize: '1.1rem'
                                        }}>
                                            Thông tin cơ bản
                                        </Typography>
                                    </Box>

                                    <Stack spacing={3}>
                                        <Box sx={{ position: 'relative' }}>
                                            <TextField
                                                label="Tên bài học"
                                                name="name"
                                                value={newLesson.name}
                                                onChange={handleNewLessonInputChange}
                                                fullWidth
                                                required
                                                variant="outlined"
                                                placeholder="Nhập tên bài học..."
                                                InputProps={{
                                                    startAdornment: (
                                                        <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                                                            <AssignmentIcon sx={{ color: COLORS.primary, fontSize: 20 }} />
                                                        </Box>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: `0 4px 12px ${COLORS.primary}20`
                                                        },
                                                        '&.Mui-focused': {
                                                            boxShadow: `0 4px 20px ${COLORS.primary}30`
                                                        }
                                                    }
                                                }}
                                                helperText={
                                                    newLesson.name.trim() ?
                                                        "✓ Tên bài học hợp lệ" :
                                                        "Vui lòng nhập tên bài học"
                                                }
                                                FormHelperTextProps={{
                                                    sx: {
                                                        color: newLesson.name.trim() ? COLORS.success : COLORS.text.secondary,
                                                        fontWeight: 500
                                                    }
                                                }}
                                            />
                                        </Box>

                                        <TextField
                                            label="Mô tả bài học"
                                            name="description"
                                            value={newLesson.description}
                                            onChange={handleNewLessonInputChange}
                                            fullWidth
                                            multiline
                                            rows={3}
                                            variant="outlined"
                                            placeholder="Nhập mô tả cho bài học (tùy chọn)..."
                                            InputProps={{
                                                startAdornment: (
                                                    <Box sx={{ mr: 1, display: 'flex', alignItems: 'flex-start', mt: 1 }}>
                                                        <NotesIcon sx={{ color: COLORS.primary, fontSize: 20 }} />
                                                    </Box>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        boxShadow: `0 4px 12px ${COLORS.primary}20`
                                                    },
                                                    '&.Mui-focused': {
                                                        boxShadow: `0 4px 20px ${COLORS.primary}30`
                                                    }
                                                }
                                            }}
                                        />

                                        <TextField
                                            select
                                            label="Module"
                                            name="moduleId"
                                            value={newLesson.moduleId}
                                            onChange={handleNewLessonInputChange}
                                            fullWidth
                                            required
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        boxShadow: `0 4px 12px ${COLORS.primary}20`
                                                    },
                                                    '&.Mui-focused': {
                                                        boxShadow: `0 4px 20px ${COLORS.primary}30`
                                                    }
                                                }
                                            }}
                                        >
                                            {modules.map((module) => (
                                                <MenuItem key={module.moduleId} value={String(module.moduleId)}>
                                                    {module.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Stack>
                                </Box>

                                {/* Schedule & Classification Section */}
                                <Box>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 3,
                                        pb: 2,
                                        borderBottom: `2px solid ${COLORS.secondary}20`
                                    }}>
                                        <AccessTimeIcon sx={{
                                            color: COLORS.secondary,
                                            mr: 1.5,
                                            fontSize: 24
                                        }} />
                                        <Typography variant="h6" sx={{
                                            color: COLORS.text.primary,
                                            fontWeight: 600,
                                            fontSize: '1.1rem'
                                        }}>
                                            Phân loại & Thời gian
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                select
                                                label="Số tiết"
                                                name="totalPeriods"
                                                value={newLesson.totalPeriods}
                                                onChange={handleNewLessonInputChange}
                                                fullWidth
                                                required
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: `0 4px 12px ${COLORS.secondary}20`
                                                        },
                                                        '&.Mui-focused': {
                                                            boxShadow: `0 4px 20px ${COLORS.secondary}30`
                                                        }
                                                    }
                                                }}
                                            >
                                                <MenuItem value="1">1 tiết</MenuItem>
                                                <MenuItem value="2">2 tiết</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                select
                                                label="Loại bài học"
                                                name="lessonTypeId"
                                                value={newLesson.lessonTypeId}
                                                onChange={handleNewLessonInputChange}
                                                fullWidth
                                                required
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: `0 4px 12px ${COLORS.secondary}20`
                                                        },
                                                        '&.Mui-focused': {
                                                            boxShadow: `0 4px 20px ${COLORS.secondary}30`
                                                        }
                                                    }
                                                }}
                                            >
                                                {lessonTypes.map((type) => (
                                                    <MenuItem key={type.lessonTypeId} value={type.lessonTypeId}>
                                                        {type.lessonTypeName}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Additional Details Section */}
                                <Box>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 3,
                                        pb: 2,
                                        borderBottom: `2px solid ${COLORS.warning}20`
                                    }}>
                                        <DateRangeIcon sx={{
                                            color: COLORS.warning,
                                            mr: 1.5,
                                            fontSize: 24
                                        }} />
                                        <Typography variant="h6" sx={{
                                            color: COLORS.text.primary,
                                            fontWeight: 600,
                                            fontSize: '1.1rem'
                                        }}>
                                            Chi tiết bổ sung
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                select
                                                label="Ghi chú"
                                                name="noteId"
                                                value={newLesson.noteId}
                                                onChange={handleNewLessonInputChange}
                                                fullWidth
                                                required
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: `0 4px 12px ${COLORS.warning}20`
                                                        },
                                                        '&.Mui-focused': {
                                                            boxShadow: `0 4px 20px ${COLORS.warning}30`
                                                        }
                                                    }
                                                }}
                                            >
                                                {notes.map((note) => (
                                                    <MenuItem key={note.noteId} value={note.noteId}>
                                                        {note.description}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                select
                                                label="Tuần học"
                                                name="weekId"
                                                value={newLesson.weekId}
                                                onChange={handleNewLessonInputChange}
                                                fullWidth
                                                required
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: `0 4px 12px ${COLORS.warning}20`
                                                        },
                                                        '&.Mui-focused': {
                                                            boxShadow: `0 4px 20px ${COLORS.warning}30`
                                                        }
                                                    }
                                                }}
                                            >
                                                {weeks.map((week) => (
                                                    <MenuItem key={week.weekId} value={week.weekId}>
                                                        Tuần {week.weekNumber}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Loading State */}
                                {optionsLoading && (
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        p: 4,
                                        bgcolor: `${COLORS.primary}08`,
                                        borderRadius: 3,
                                        border: `2px dashed ${COLORS.primary}30`,
                                        backdropFilter: 'blur(10px)'
                                    }}>
                                        <CircularProgress
                                            size={28}
                                            sx={{
                                                color: COLORS.primary,
                                                mr: 2
                                            }}
                                        />
                                        <Typography sx={{
                                            color: COLORS.text.primary,
                                            fontWeight: 500,
                                            fontSize: '1rem'
                                        }}>
                                            Đang tải dữ liệu dropdown...
                                        </Typography>
                                    </Box>
                                )}

                                {/* Form Validation Summary */}
                                {(newLesson.name.trim() && newLesson.moduleId && newLesson.lessonTypeId && newLesson.noteId && newLesson.weekId) && (
                                    <Box sx={{
                                        p: 3,
                                        bgcolor: `${COLORS.success}08`,
                                        borderRadius: 2,
                                        border: `1px solid ${COLORS.success}30`,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <CheckIcon sx={{ color: COLORS.success, mr: 2, fontSize: 24 }} />
                                        <Typography sx={{
                                            color: COLORS.success,
                                            fontWeight: 600
                                        }}>
                                            Tất cả thông tin đã được điền đầy đủ. Sẵn sàng tạo bài học!
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </DialogContent>

                        {/* Enhanced Dialog Actions */}
                        <DialogActions sx={{
                            p: 4,
                            gap: 2,
                            bgcolor: 'rgba(6, 169, 174, 0.02)',
                            borderTop: '1px solid rgba(0, 0, 0, 0.08)'
                        }}>
                            <StyledButton
                                onClick={handleCloseAddLessonDialog}
                                variant="outlined"
                                color="secondary"
                                sx={{
                                    minWidth: 120,
                                    height: 48,
                                    borderRadius: 3,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderWidth: 2,
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                                    }
                                }}
                                startIcon={<CloseIcon />}
                            >
                                Hủy bỏ
                            </StyledButton>
                            <StyledButton
                                onClick={handleAddLesson}
                                variant="contained"
                                color="primary"
                                disabled={
                                    !newLesson.name.trim() ||
                                    !newLesson.totalPeriods ||
                                    !newLesson.moduleId ||
                                    !newLesson.lessonTypeId ||
                                    !newLesson.noteId ||
                                    !newLesson.weekId ||
                                    isNaN(Number(newLesson.totalPeriods)) ||
                                    Number(newLesson.totalPeriods) < 1 ||
                                    optionsLoading
                                }
                                sx={{
                                    minWidth: 160,
                                    height: 48,
                                    borderRadius: 3,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    background: `linear-gradient(135deg, ${COLORS.primary} 0%, #0891b2 100%)`,
                                    boxShadow: `0 8px 20px ${COLORS.primary}40`,
                                    '&:hover': {
                                        background: `linear-gradient(135deg, ${COLORS.primary} 0%, #0891b2 100%)`,
                                        transform: 'translateY(-3px)',
                                        boxShadow: `0 12px 28px ${COLORS.primary}50`
                                    },
                                    '&:disabled': {
                                        background: 'rgba(0, 0, 0, 0.12)',
                                        color: 'rgba(0, 0, 0, 0.26)',
                                        boxShadow: 'none'
                                    }
                                }}
                                startIcon={<AddIcon sx={{ fontSize: 20 }} />}
                            >
                                Tạo bài học
                            </StyledButton>
                        </DialogActions>
                    </Dialog>

                    {/* Edit Lesson Dialog - THÊM PHẦN NÀY */}
                    <Dialog
                        open={openEditLessonDialog}
                        onClose={handleCloseEditLessonDialog}
                        maxWidth="md"
                        fullWidth
                        PaperProps={{
                            sx: {
                                borderRadius: 4,
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                overflow: 'hidden'
                            }
                        }}
                    >
                        {/* Enhanced Dialog Header */}
                        <DialogTitle sx={{
                            background: `linear-gradient(135deg, ${COLORS.primary} 0%, #0891b2 100%)`,
                            color: '#fff',
                            p: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)'
                            }
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 48,
                                height: 48,
                                borderRadius: '12px',
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <EditIcon sx={{ fontSize: 28, color: '#fff' }} />
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={{
                                    fontWeight: 700,
                                    fontSize: '1.5rem',
                                    mb: 0.5,
                                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                }}>
                                    Chỉnh Sửa Bài Học
                                </Typography>
                                <Typography variant="body2" sx={{
                                    opacity: 0.9,
                                    fontSize: '0.875rem'
                                }}>
                                    Cập nhật thông tin bài học
                                </Typography>
                            </Box>
                        </DialogTitle>

                        <DialogContent sx={{ p: 4, bgcolor: '#fff' }}>
                            <Stack spacing={4} sx={{ mt: 1 }}>
                                {/* Basic Information Section */}
                                <Box>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 3,
                                        pb: 2,
                                        borderBottom: `2px solid ${COLORS.primary}20`
                                    }}>
                                        <InfoIcon sx={{
                                            color: COLORS.primary,
                                            mr: 1.5,
                                            fontSize: 24
                                        }} />
                                        <Typography variant="h6" sx={{
                                            color: COLORS.text.primary,
                                            fontWeight: 600,
                                            fontSize: '1.1rem'
                                        }}>
                                            Thông tin cơ bản
                                        </Typography>
                                    </Box>

                                    <Stack spacing={3}>
                                        <Box sx={{ position: 'relative' }}>
                                            <TextField
                                                label="Tên bài học"
                                                name="name"
                                                value={editedLesson.name}
                                                onChange={handleEditedLessonInputChange}
                                                fullWidth
                                                required
                                                variant="outlined"
                                                placeholder="Nhập tên bài học..."
                                                InputProps={{
                                                    startAdornment: (
                                                        <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                                                            <AssignmentIcon sx={{ color: COLORS.primary, fontSize: 20 }} />
                                                        </Box>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: `0 4px 12px ${COLORS.primary}20`
                                                        },
                                                        '&.Mui-focused': {
                                                            boxShadow: `0 4px 20px ${COLORS.primary}30`
                                                        }
                                                    }
                                                }}
                                                helperText={
                                                    editedLesson.name.trim() ?
                                                        "Tên bài học hợp lệ" :
                                                        "Vui lòng nhập tên bài học"
                                                }
                                                FormHelperTextProps={{
                                                    sx: {
                                                        color: editedLesson.name.trim() ? COLORS.success : COLORS.text.secondary,
                                                        fontWeight: 500
                                                    }
                                                }}
                                            />
                                        </Box>

                                        <TextField
                                            select
                                            label="Module"
                                            name="moduleId"
                                            value={editedLesson.moduleId}
                                            onChange={handleEditedLessonInputChange}
                                            fullWidth
                                            required
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        boxShadow: `0 4px 12px ${COLORS.primary}20`
                                                    },
                                                    '&.Mui-focused': {
                                                        boxShadow: `0 4px 20px ${COLORS.primary}30`
                                                    }
                                                }
                                            }}
                                        >
                                            {modules.map((module) => (
                                                <MenuItem key={module.moduleId} value={String(module.moduleId)}>
                                                    {module.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Stack>
                                </Box>

                                {/* Schedule & Classification Section */}
                                <Box>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 3,
                                        pb: 2,
                                        borderBottom: `2px solid ${COLORS.secondary}20`
                                    }}>
                                        <AccessTimeIcon sx={{
                                            color: COLORS.secondary,
                                            mr: 1.5,
                                            fontSize: 24
                                        }} />
                                        <Typography variant="h6" sx={{
                                            color: COLORS.text.primary,
                                            fontWeight: 600,
                                            fontSize: '1.1rem'
                                        }}>
                                            Phân loại & Thời gian
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                select
                                                label="Số tiết"
                                                name="totalPeriods"
                                                value={editedLesson.totalPeriods}
                                                onChange={handleEditedLessonInputChange}
                                                fullWidth
                                                required
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: `0 4px 12px ${COLORS.secondary}20`
                                                        },
                                                        '&.Mui-focused': {
                                                            boxShadow: `0 4px 20px ${COLORS.secondary}30`
                                                        }
                                                    }
                                                }}
                                            >
                                                <MenuItem value="1">1 tiết</MenuItem>
                                                <MenuItem value="2">2 tiết</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                select
                                                label="Loại bài học"
                                                name="lessonTypeId"
                                                value={editedLesson.lessonTypeId}
                                                onChange={handleEditedLessonInputChange}
                                                fullWidth
                                                required
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: `0 4px 12px ${COLORS.secondary}20`
                                                        },
                                                        '&.Mui-focused': {
                                                            boxShadow: `0 4px 20px ${COLORS.secondary}30`
                                                        }
                                                    }
                                                }}
                                            >
                                                {lessonTypes.map((type) => (
                                                    <MenuItem key={type.lessonTypeId} value={String(type.lessonTypeId)}>
                                                        {type.lessonTypeName}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Additional Details Section */}
                                <Box>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 3,
                                        pb: 2,
                                        borderBottom: `2px solid ${COLORS.warning}20`
                                    }}>
                                        <DateRangeIcon sx={{
                                            color: COLORS.warning,
                                            mr: 1.5,
                                            fontSize: 24
                                        }} />
                                        <Typography variant="h6" sx={{
                                            color: COLORS.text.primary,
                                            fontWeight: 600,
                                            fontSize: '1.1rem'
                                        }}>
                                            Chi tiết bổ sung
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                select
                                                label="Ghi chú"
                                                name="noteId"
                                                value={editedLesson.noteId}
                                                onChange={handleEditedLessonInputChange}
                                                fullWidth
                                                required
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: `0 4px 12px ${COLORS.warning}20`
                                                        },
                                                        '&.Mui-focused': {
                                                            boxShadow: `0 4px 20px ${COLORS.warning}30`
                                                        }
                                                    }
                                                }}
                                            >
                                                {notes.map((note) => (
                                                    <MenuItem key={note.noteId} value={String(note.noteId)}>
                                                        {note.description}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                select
                                                label="Tuần học"
                                                name="weekId"
                                                value={editedLesson.weekId}
                                                onChange={handleEditedLessonInputChange}
                                                fullWidth
                                                required
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: `0 4px 12px ${COLORS.warning}20`
                                                        },
                                                        '&.Mui-focused': {
                                                            boxShadow: `0 4px 20px ${COLORS.warning}30`
                                                        }
                                                    }
                                                }}
                                            >
                                                {weeks.map((week) => (
                                                    <MenuItem key={week.weekId} value={String(week.weekId)}>
                                                        Tuần {week.weekNumber}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Loading State */}
                                {optionsLoading && (
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        p: 4,
                                        bgcolor: `${COLORS.primary}08`,
                                        borderRadius: 3,
                                        border: `2px dashed ${COLORS.primary}30`,
                                        backdropFilter: 'blur(10px)'
                                    }}>
                                        <CircularProgress
                                            size={28}
                                            sx={{
                                                color: COLORS.primary,
                                                mr: 2
                                            }}
                                        />
                                        <Typography sx={{
                                            color: COLORS.text.primary,
                                            fontWeight: 500,
                                            fontSize: '1rem'
                                        }}>
                                            Đang tải dữ liệu dropdown...
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </DialogContent>

                        {/* Enhanced Dialog Actions */}
                        <DialogActions sx={{
                            p: 4,
                            gap: 2,
                            bgcolor: 'rgba(6, 169, 174, 0.02)',
                            borderTop: '1px solid rgba(0, 0, 0, 0.08)'
                        }}>
                            <StyledButton
                                onClick={handleCloseEditLessonDialog}
                                variant="outlined"
                                color="secondary"
                                sx={{
                                    minWidth: 120,
                                    height: 48,
                                    borderRadius: 3,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderWidth: 2,
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                                    }
                                }}
                                startIcon={<CloseIcon />}
                            >
                                Hủy bỏ
                            </StyledButton>
                            <StyledButton
                                onClick={() => handleSaveLessonEdit(editLessonMode)}
                                variant="contained"
                                color="primary"
                                disabled={
                                    !editedLesson.name.trim() ||
                                    !editedLesson.totalPeriods ||
                                    !editedLesson.moduleId ||
                                    !editedLesson.lessonTypeId ||
                                    !editedLesson.noteId ||
                                    !editedLesson.weekId ||
                                    isNaN(Number(editedLesson.totalPeriods)) ||
                                    Number(editedLesson.totalPeriods) < 1 ||
                                    optionsLoading
                                }
                                sx={{
                                    minWidth: 160,
                                    height: 48,
                                    borderRadius: 3,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    background: `linear-gradient(135deg, ${COLORS.primary} 0%, #0891b2 100%)`,
                                    boxShadow: `0 8px 20px ${COLORS.primary}40`,
                                    '&:hover': {
                                        background: `linear-gradient(135deg, ${COLORS.primary} 0%, #0891b2 100%)`,
                                        transform: 'translateY(-3px)',
                                        boxShadow: `0 12px 28px ${COLORS.primary}50`
                                    },
                                    '&:disabled': {
                                        background: 'rgba(0, 0, 0, 0.12)',
                                        color: 'rgba(0, 0, 0, 0.26)',
                                        boxShadow: 'none'
                                    }
                                }}
                                startIcon={<CheckIcon sx={{ fontSize: 20 }} />}
                            >
                                Cập nhật
                            </StyledButton>
                        </DialogActions>
                    </Dialog>

                    {/* Delete Confirmation Dialog */}
                    <Dialog
                        open={openDeleteDialog}
                        onClose={handleCloseDeleteDialog}
                        maxWidth="sm"
                        fullWidth
                        PaperProps={{
                            sx: {
                                borderRadius: 3,
                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
                            }
                        }}
                    >
                        <DialogTitle sx={{
                            display: 'flex',
                            alignItems: 'center',
                            pb: 2,
                            borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: COLORS.error,
                                mr: 2
                            }}>
                                <DeleteIcon sx={{ fontSize: 28 }} />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Xác nhận xóa bài học
                            </Typography>
                        </DialogTitle>

                        <DialogContent sx={{ pt: 3 }}>
                            {lessonToDelete && (
                                <Box>
                                    <Alert severity="warning" sx={{ mb: 3 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            Hành động này không thể hoàn tác!
                                        </Typography>
                                    </Alert>

                                    <Typography variant="body1" sx={{ mb: 2, color: COLORS.text.primary }}>
                                        Bạn có chắc chắn muốn xóa bài học sau?
                                    </Typography>

                                    <Box sx={{
                                        p: 3,
                                        bgcolor: 'rgba(255, 72, 66, 0.05)',
                                        borderRadius: 2,
                                        border: '1px solid rgba(255, 72, 66, 0.2)',
                                        textAlign: 'center'
                                    }}>
                                        <Typography variant="h6" sx={{
                                            fontWeight: 600,
                                            color: COLORS.text.primary,
                                            mb: 1
                                        }}>
                                            "{lessonToDelete.name}"
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </DialogContent>

                        <DialogActions sx={{ p: 3, gap: 2 }}>
                            <StyledButton
                                onClick={handleCloseDeleteDialog}
                                variant="outlined"
                                color="secondary"
                                disabled={deleteLoading}
                            >
                                Hủy bỏ
                            </StyledButton>

                            <StyledButton
                                onClick={handleConfirmDeleteLesson}
                                variant="contained"
                                disabled={deleteLoading}
                                sx={{
                                    bgcolor: COLORS.error,
                                    '&:hover': {
                                        bgcolor: COLORS.error,
                                        opacity: 0.9
                                    }
                                }}
                                startIcon={deleteLoading ? (
                                    <CircularProgress size={16} sx={{ color: '#fff' }} />
                                ) : (
                                    <DeleteIcon />
                                )}
                            >
                                {deleteLoading ? 'Đang xóa...' : 'Xóa bài học'}
                            </StyledButton>
                        </DialogActions>
                    </Dialog>

                    {/* Edit Module Dialog */}
                    <Dialog
                        open={openEditModuleDialog}
                        onClose={handleCloseEditModuleDialog}
                        maxWidth="sm"
                        fullWidth
                        PaperProps={{
                            sx: {
                                borderRadius: 3,
                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
                            }
                        }}
                    >
                        <DialogTitle sx={{
                            display: 'flex',
                            alignItems: 'center',
                            pb: 2,
                            borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: COLORS.primary,
                                mr: 2
                            }}>
                                <EditIcon sx={{ fontSize: 28 }} />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Chỉnh sửa Module
                            </Typography>
                        </DialogTitle>

                        <DialogContent sx={{ pt: 3 }}>
                            <Stack spacing={3}>
                                <TextField
                                    label="Tên module"
                                    name="name"
                                    value={editedModule.name}
                                    onChange={handleModuleInputChange}
                                    fullWidth
                                    required
                                    variant="outlined"
                                />
                                <TextField
                                    select
                                    label="Học kỳ"
                                    name="semester"
                                    value={editedModule.semester}
                                    onChange={handleModuleInputChange}
                                    fullWidth
                                    required
                                    variant="outlined"
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
                                    variant="outlined"
                                />
                            </Stack>
                        </DialogContent>

                        <DialogActions sx={{ p: 3, gap: 2 }}>
                            <StyledButton
                                onClick={handleCloseEditModuleDialog}
                                variant="outlined"
                                color="secondary"
                            >
                                Hủy bỏ
                            </StyledButton>
                            <StyledButton
                                onClick={handleSaveModuleEdit}
                                variant="contained"
                                color="primary"
                                disabled={
                                    !editedModule.name.trim() ||
                                    !editedModule.totalPeriods ||
                                    isNaN(Number(editedModule.totalPeriods)) ||
                                    Number(editedModule.totalPeriods) < 1
                                }
                            >
                                Cập nhật
                            </StyledButton>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
        </Box>
    );
};

export default CurriculumFramework;