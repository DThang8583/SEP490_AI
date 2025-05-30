import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    ListItem,
    ListItemText,
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
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import LessonDetails from './LessonDetails';

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

const CurriculumCard = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
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
}));

const InfoChip = styled(Chip)(({ theme }) => ({
    margin: '4px 4px 4px 0',
    borderRadius: 12,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(6, 169, 174, 0.2)' : 'rgba(6, 169, 174, 0.08)',
    color: theme.palette.mode === 'dark' ? COLORS.background.paper : COLORS.primary,
    '.MuiChip-icon': {
        color: COLORS.primary,
    }
}));

const CurriculumFramework = () => {
    const theme = useTheme();
    const [curricula, setCurricula] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userGradeNumber, setUserGradeNumber] = useState(null);
    const [currentSemester, setCurrentSemester] = useState(1);
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [moduleDetails, setModuleDetails] = useState(null);
    const [openModuleDialog, setOpenModuleDialog] = useState(false);
    const navigate = useNavigate();

    // State to manage selected semester
    const [selectedSemester, setSelectedSemester] = useState(1);
    
    // State to manage expanded module rows
    const [expandedModuleId, setExpandedModuleId] = useState(null);

    // State for editing module details
    const [isEditingModule, setIsEditingModule] = useState(false);
    const [editableModuleData, setEditableModuleData] = useState(null);

    // State for new module data
    const [newModuleData, setNewModuleData] = useState(null);

    // State for controlling the add module dialog
    const [openAddModuleDialog, setOpenAddModuleDialog] = useState(false);

    // State for controlling delete confirmation dialog
    const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
    const [moduleToDelete, setModuleToDelete] = useState(null);

    // Filter modules by selected semester
    const modulesBySemester = useMemo(() => {
        return modules.filter(module => module.semester === selectedSemester);
    }, [modules, selectedSemester]);

    const fetchModuleDetails = useCallback(async (moduleId) => {
        try {
            const response = await axios.get(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules/${moduleId}`
            );
            
            if (response.data.code === 0) {
                console.log('Module Details:', response.data.data);
                setModuleDetails(response.data.data);
                // setOpenModuleDialog(true); // Comment out or remove this line as we will use collapse for lessons
            }
        } catch (error) {
            console.error('Error fetching module details:', error);
        }
    }, []);

    // Function to fetch lessons for a module
    const fetchLessons = useCallback(async (moduleId) => {
        try {
            const response = await axios.get(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules/${moduleId}/lessons`
            );

            if (response.data.code === 0 && response.data.data.lessons) {
                console.log(`Lessons for module ${moduleId}:`, response.data.data.lessons);
                // We need to update the modules state to include lessons for this module
                setModules(prevModules => 
                    prevModules.map(module =>
                        module.moduleId === moduleId
                            ? { ...module, lessons: response.data.data.lessons } // Add lessons to the module object
                            : module
                    )
                );
            } else if (response.data.code !== 0) {
                 console.error(`Error fetching lessons for module ${moduleId}:`, response.data.message);
            }
        } catch (error) {
            console.error(`Error fetching lessons for module ${moduleId}:`, error);
        }
    }, []);

    const handleViewDetailsIconClick = useCallback(async (moduleId) => {
        try {
             const response = await axios.get(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules/${moduleId}`
            );
            
            if (response.data.code === 0) {
                console.log('Module Details from icon click:', response.data.data);
                setSelectedModule(response.data.data); // Set selected module details
                setModuleDetails(response.data.data);
                setOpenModuleDialog(true); // Open the details dialog
                 setIsEditingModule(false); // Ensure view mode when opening
                 setEditableModuleData(null); // Clear editable data
            } else {
                console.error(`Error fetching module details from icon click:`, response.data.message);
                alert(`Lỗi khi lấy chi tiết module: ${response.data.message}`);
            }
        } catch (error) {
            console.error(`Error fetching module details from icon click:`, error);
             alert(`Đã xảy ra lỗi khi lấy chi tiết module.`);
        }
    }, [setOpenModuleDialog]); // Added setOpenModuleDialog to dependencies

    const handleModuleClick = (module) => {
        // Toggle expanded state - row click now only handles expansion
        if (expandedModuleId === module.moduleId) {
            setExpandedModuleId(null); // Collapse the currently expanded row
        } else {
            setExpandedModuleId(module.moduleId); // Expand this row
            // Fetch lessons if not already fetched for this module
            if (!module.lessons) {
                 fetchLessons(module.moduleId);
            }
        }
        // Removed fetching details here, as it's now handled by icon click
        // fetchModuleDetails(module.moduleId);
    };

    const handleCloseModuleDialog = () => {
        setOpenModuleDialog(false);
        setModuleDetails(null);
        setSelectedModule(null); // Clear selected module
         setIsEditingModule(false); // Reset to view mode
         setEditableModuleData(null); // Clear editable data
    };

    const handleEditClick = () => {
        setIsEditingModule(true);
        setEditableModuleData(moduleDetails); // Initialize editable data with current details
    };

    const handleCancelClick = () => {
        setIsEditingModule(false);
        setEditableModuleData(null); // Discard changes
    };

    const handleSaveClick = async () => {
        if (editableModuleData && editableModuleData.moduleId) {

            const correspondingCurriculum = curricula.find(curr => 
                 curr.name.includes(editableModuleData.curriculum)
            );

            if (!correspondingCurriculum) {
                console.error('Could not find corresponding curriculum for module.', editableModuleData);
                alert('Không tìm thấy chương trình tương ứng để cập nhật. Vui lòng kiểm tra dữ liệu module và danh sách chương trình.');
                return; // Stop the save process if curriculum not found
            }

            // Construct the data to send to the API according to the correct structure
            const dataToUpdate = {
                name: editableModuleData.name,
                desciption: editableModuleData.desciption || '', // Ensure description is not null
                semester: parseInt(editableModuleData.semester, 10), // Ensure integer type
                totalPeriods: parseInt(editableModuleData.totalPeriods, 10), // Ensure integer type
                curriculumId: parseInt(correspondingCurriculum.curriculumId, 10), // Use the found curriculumId and ensure integer type
                gradeId: parseInt(editableModuleData.gradeNumber, 10), // Ensure integer type
                bookId: 1 // bookId is always 1
            };

            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await axios.put(
                    `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules/${editableModuleData.moduleId}`,
                    dataToUpdate,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );

                console.log('API Response Code:', response.data.code);

                if (response.data.code === 0 || response.data.code === 22) {
                    console.log(`Module ${editableModuleData.moduleId} updated successfully:`, response.data.data);
                    // Update the modules state
                     setModules(prevModules => 
                         prevModules.map(module =>
                             module.moduleId === editableModuleData.moduleId
                                 ? { ...module, ...dataToUpdate, book: 'Cánh Diều' } // Merge updated data and ensure book name is correct
                                 : module
                         )
                     );
                    // Close dialog
                    setOpenModuleDialog(false);
                    // Reset editing state
                    setIsEditingModule(false);
                    setEditableModuleData(null);
                } else {
                    console.error(`Error updating module ${editableModuleData.moduleId}:`, response.data.message);
                    alert(`Cập nhật module thất bại: ${response.data.message}`);
                }
            } catch (error) {
                console.error(`Error updating module ${editableModuleData.moduleId}:`, error);
                alert(`Đã xảy ra lỗi khi cập nhật module.`);
            }
        } else {
            console.error('No module data to save.');
            alert('Không có dữ liệu module để lưu.');
        }
    };

    const fetchModules = useCallback(async (gradeNumber) => {
        try {
            const response = await axios.get(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades/${gradeNumber}/modules`
            );
            
            if (response.data.code === 0 && response.data.data.modules) {
                const fetchedModuleList = response.data.data.items || response.data.data.modules || []; // Ensure we get the list correctly

                // Fetch details for each module to get semester information
                const modulesWithDetails = await Promise.all(fetchedModuleList.map(async (module) => {
                    try {
                         const detailResponse = await axios.get(
                            `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules/${module.moduleId}`
                        );
                        if (detailResponse.data.code === 0) {
                            return detailResponse.data.data;
                        } else {
                            console.error(`Failed to fetch details for module ${module.moduleId}:`, detailResponse.data.message);
                            return null; // Return null for modules that failed to fetch details
                        }
                    } catch (detailError) {
                        console.error(`Error fetching details for module ${module.moduleId}:`, detailError);
                        return null; // Return null for modules that caused an error
                    }
                }));

                // Filter out null entries and sort by moduleId
                const validModules = modulesWithDetails.filter(module => module !== null);
                const sortedModules = validModules.sort((a, b) => a.moduleId - b.moduleId);

                console.log('Modules sorted by moduleId and including semester:', sortedModules.map(module => ({
                    moduleId: module.moduleId,
                    name: module.name,
                    semester: module.semester,
                    totalPeriods: module.totalPeriods
                })));
                
                setModules(sortedModules);
            } else if (response.data.code !== 0) {
                 console.error('Error fetching module list:', response.data.message);
                 setModules([]); // Set modules to empty array on error
            }

        } catch (error) {
            console.error('Error fetching modules list:', error);
             setModules([]); // Set modules to empty array on error
        }
    }, []);

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

            console.log('Grade Number from getUserGradeNumber:', gradeNumber);

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
            console.log('Grade Number before setting state:', gradeNumber);
            setUserGradeNumber(gradeNumber);
            
            // Fetch modules after getting grade number
            if (gradeNumber) {
                await fetchModules(gradeNumber);
            }

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
    }, [getUserGradeNumber, fetchModules]);

    useEffect(() => {
        fetchCurricula();
    }, [fetchCurricula]);

    const handleSemesterChange = (semester) => {
        setSelectedSemester(semester);
    };

    const handleViewCurriculumDetail = (curriculumId) => {
        if (curriculumId) {
            navigate(`/manager/curriculum-detail/${curriculumId}`);
        } else {
            alert("Vui lòng chọn một chương trình trước khi xem chi tiết");
        }
    };

    const handleOpenAddModuleDialog = () => {
        setOpenAddModuleDialog(true);
        // Initialize new module data with default values if needed
        setNewModuleData({
            name: '',
            desciption: '',
            semester: selectedSemester, // Default to currently selected semester
            totalPeriods: 0,
            curriculumId: curricula.length > 0 ? curricula[0].curriculumId : 0, // Default to first curriculum or 0
            gradeId: userGradeNumber || 0, // Default to user's grade or 0
            bookId: 1 // Default bookId
        });
    };

    const handleCloseAddModuleDialog = () => {
        setOpenAddModuleDialog(false);
        setNewModuleData(null); // Clear form data on close
    };

    const handleSaveNewModule = async () => {
        if (newModuleData) {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await axios.post(
                    'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules',
                    newModuleData,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );

                console.log('API Response Code:', response.data.code);

                if (response.data.code === 0 || response.data.code === 21) {
                    console.log(`Module created successfully:`, response.data.data);
                    // Update the modules state
                    setModules(prevModules => [...prevModules, response.data.data]);
                    // Close dialog
                    setOpenAddModuleDialog(false);
                    // Reset new module data
                    setNewModuleData(null);
                } else {
                    console.error(`Error creating module ${newModuleData.moduleId}:`, response.data.message);
                    alert(`Tạo mới module thất bại: ${response.data.message}`);
                }
            } catch (error) {
                console.error(`Error creating module ${newModuleData.moduleId}:`, error);
                alert(`Đã xảy ra lỗi khi tạo mới module.`);
            }
        } else {
            console.error('No module data to save.');
            alert('Không có dữ liệu module để lưu.');
        }
    };

    // Handler for opening delete confirmation dialog
    const handleOpenDeleteConfirmDialog = (module) => {
        setModuleToDelete(module);
        setOpenDeleteConfirmDialog(true);
    };

    // Handler for closing delete confirmation dialog
    const handleCloseDeleteConfirmDialog = () => {
        setModuleToDelete(null);
        setOpenDeleteConfirmDialog(false);
    };

    // Handler for deleting a module
    const handleDeleteModule = async (moduleId) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.delete(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules/${moduleId}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            console.log('Delete API Response Code:', response.data.code);

            if (response.data.code === 0 || response.data.code === 31) {
                console.log(`Module ${moduleId} deleted successfully.`);
                // Update the modules state by removing the deleted module
                setModules(prevModules => prevModules.filter(module => module.moduleId !== moduleId));
                // Close the delete confirmation dialog
                handleCloseDeleteConfirmDialog();
            } else {
                console.error(`Error deleting module ${moduleId}:`, response.data.message);
                alert(`Xóa module thất bại: ${response.data.message}`);
            }
        } catch (error) {
            console.error(`Error deleting module ${moduleId}:`, error);
            alert(`Đã xảy ra lỗi khi xóa module.`);
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
            bgcolor: 'background.default',
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
                px: { xs: 3, md: 5 }
            }}>
                <Container maxWidth="lg">
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ImportContactsIcon sx={{ fontSize: 36, color: COLORS.primary, mr: 2 }} />
                            <Box>
                                <Typography variant="h4" sx={{
                                    fontWeight: 700,
                                    color: theme.palette.text.primary,
                                    lineHeight: 1.2,
                                }}>
                                    Khung chương trình
                                </Typography>
                                <Typography variant="subtitle1" sx={{
                                    color: theme.palette.text.secondary,
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

                    {/* Module and Curriculum Display */}
                    {!error && userGradeNumber && ( // Only show if no error and grade number is available
                        <Box>
                            {/* Existing curricula list code - Keeping this for now as it seems separate from modules */}
                             {curricula.length > 0 ? (
                                <Box sx={{ mt: 4 }}>
                                     <Typography variant="h6" sx={{
                                        mb: 2,
                                        color: theme.palette.text.primary,
                                        fontWeight: 600
                                     }}>
                                        Khung chương trình chi tiết
                                </Typography>
                        <List sx={{ bgcolor: 'transparent', p: 0 }}>
                            {curricula.map((curriculum) => (
                                <Box key={curriculum.curriculumId}>
                                    <CurriculumCard>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <Box>
                                                            <Typography sx={{
                                                                fontWeight: 600,
                                                                fontSize: '1.25rem',
                                                                mb: 1.5,
                                                                color: theme.palette.text.primary
                                                             }}>
                                                    {curriculum.name} ({curriculum.year})
                                                </Typography>
                                                            <Typography variant="body2" sx={{
                                                                color: theme.palette.text.secondary,
                                                                mb: 1,
                                                                lineHeight: 1.6
                                                             }}>
                                                    {curriculum.description}
                                                </Typography>
                                                            <Typography variant="body2" sx={{
                                                                color: theme.palette.text.secondary,
                                                                lineHeight: 1.6
                                                             }}>
                                                    Tổng số tiết cả năm: {curriculum.totalPeriods}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <StyledButton
                                                    variant="outlined"
                                                    onClick={() => handleViewCurriculumDetail(curriculum.curriculumId)}
                                                    sx={{
                                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                                        '&:hover': {
                                                                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
                                                            transform: 'translateY(-2px)'
                                                        },
                                                        transition: 'all 0.2s ease',
                                                                    border: `1px solid ${COLORS.primary}`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}
                                                >
                                                    <MenuBookIcon sx={{ fontSize: 24, color: COLORS.primary }} />
                                                    Xem nội dung cần đạt
                                                </StyledButton>
                                            </Box>
                                        </Box>
                                    </CurriculumCard>
                                </Box>
                            ))}
                        </List>
                                 </Box>
                             ) : ( !error && curricula.length === 0 && // Only show message if no error and no curricula
                                 <DashboardCard>
                                     <CardContent sx={{ py: 4, textAlign: 'center' }}>
                                         <Typography sx={{ color: theme.palette.text.secondary }}>
                                             Không có khung chương trình chi tiết nào cho Khối {userGradeNumber}.
                                         </Typography>
                                     </CardContent>
                                 </DashboardCard>
                             )}

                            {/* Textbook and Semester Selection */}
                            <Box sx={{ mt: 4, mb: 3, textAlign: 'center' }}>
                                <Typography variant="h6" sx={{
                                    color: theme.palette.text.primary,
                                    mb: 2,
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontWeight: 600
                                }}>
                                    <MenuBookIcon sx={{ mr: 1, color: COLORS.primary }} /> Sách giáo khoa: Cánh Diều
                                </Typography>
                                <Box>
                                    <StyledButton
                                        variant={selectedSemester === 1 ? 'contained' : 'outlined'}
                                        onClick={() => handleSemesterChange(1)}
                                        sx={{ mr: 1 }}
                                    >
                                        Học kỳ 1
                                    </StyledButton>
                                    <StyledButton
                                        variant={selectedSemester === 2 ? 'contained' : 'outlined'}
                                        onClick={() => handleSemesterChange(2)}
                                    >
                                        Học kỳ 2
                                    </StyledButton>
                                </Box>
                            </Box>

                            {/* Add Module Button */}
                            <Box sx={{ textAlign: 'right', mb: 2 }}>
                                <StyledButton
                                    variant="contained"
                                    onClick={handleOpenAddModuleDialog}
                                    startIcon={<AddIcon />}
                                >
                                    Thêm Chủ đề
                                </StyledButton>
                            </Box>

                            {/* Display Modules in Table */}
                            {modulesBySemester.length > 0 ? (
                                <TableContainer 
                                    component={Paper} 
                                    sx={{
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
                                        borderRadius: 2, 
                                        overflow: 'hidden',
                                        bgcolor: theme.palette.background.paper,
                                    }}
                                >
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell sx={{
                                                    width: '80px',
                                                    color: theme.palette.text.secondary,
                                                    borderBottomColor: theme.palette.divider
                                                 }}>STT</StyledTableCell>
                                                <StyledTableCell sx={{
                                                    color: theme.palette.text.secondary,
                                                    borderBottomColor: theme.palette.divider
                                                }}>Tên chủ đề</StyledTableCell>
                                                <StyledTableCell sx={{
                                                     width: '120px',
                                                     color: theme.palette.text.secondary,
                                                     borderBottomColor: theme.palette.divider,
                                                     textAlign: 'center'
                                                }}>Thao tác</StyledTableCell>
                                                <StyledTableCell align="right" sx={{
                                                     color: theme.palette.text.secondary,
                                                     borderBottomColor: theme.palette.divider
                                                }}>Số tiết</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {modulesBySemester.map((module, index) => (
                                                <React.Fragment key={module.moduleId}>
                                                    <StyledTableRow 
                                                        onClick={() => handleModuleClick(module)}
                                                        sx={{
                                                            '&:last-child td, &:last-child th': { border: 0 },
                                                            borderBottom: expandedModuleId === module.moduleId ? 'none' : `1px solid ${theme.palette.divider}`,
                                                            '&:hover': {
                                                                backgroundColor: theme.palette.action.hover,
                                                                cursor: 'pointer',
                                                            },
                                                        }}
                                                    >
                                                        <TableCell sx={{
                                                            color: theme.palette.text.primary,
                                                            border: 'none'
                                                        }}>{index + 1}</TableCell>
                                                        <TableCell sx={{
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            gap: 1, 
                                                            color: theme.palette.text.primary,
                                                            border: 'none'
                                                         }}>
                                                            <MenuBookIcon sx={{ mr: 1, color: COLORS.primary, fontSize: 20 }} />
                                                            <Box sx={{ flexGrow: 1 }}>
                                                              {module.name}
                                                            </Box>
                                                         </TableCell>
                                                        <TableCell sx={{
                                                            color: theme.palette.text.primary,
                                                            border: 'none',
                                                            textAlign: 'center'
                                                         }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                                <IconButton 
                                                                    size="small" 
                                                                    onClick={(event) => {
                                                                        event.stopPropagation();
                                                                        handleViewDetailsIconClick(module.moduleId);
                                                                    }}
                                                                    sx={{
                                                                        color: COLORS.primary,
                                                                        '&:hover': {
                                                                            bgcolor: COLORS.hover.primary
                                                                        }
                                                                    }}
                                                                >
                                                                    <VisibilityIcon fontSize="small" />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(event) => {
                                                                        event.stopPropagation();
                                                                        handleOpenDeleteConfirmDialog(module);
                                                                    }}
                                                                    sx={{
                                                                        color: COLORS.error,
                                                                        '&:hover': {
                                                                            bgcolor: 'rgba(255, 72, 66, 0.08)'
                                                                        }
                                                                    }}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                         </TableCell>
                                                        <TableCell align="right" sx={{
                                                             color: theme.palette.text.primary,
                                                              border: 'none'
                                                        }}>
                                                            <InfoChip
                                                                 icon={<AccessTimeIcon fontSize="small" sx={{ color: COLORS.primary }} />}
                                                                 label={`${module.totalPeriods} tiết`}
                                                                 sx={{ 
                                                                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(6, 169, 174, 0.2)' : 'rgba(6, 169, 174, 0.08)',
                                                                    color: theme.palette.text.primary,
                                                                    '.MuiChip-icon': { color: COLORS.primary }
                                                                 }}
                                                            />
                                                        </TableCell>
                                                    </StyledTableRow>
                                                    <TableRow>
                                                        <TableCell sx={{ paddingBottom: 0, paddingTop: 0, border: 'none' }} colSpan={3}>
                                                            <Collapse in={expandedModuleId === module.moduleId} timeout="auto" unmountOnExit>
                                                                <Box sx={{ margin: 1, p: 2, bgcolor: theme.palette.background.secondary, borderRadius: 1 }}>
                                                                    <Typography variant="h6" gutterBottom component="div" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                                                                        Bài học:
                                                                    </Typography>
                                                                    {module.lessons ? (
                                                                        <LessonDetails 
                                                                            lessons={module.lessons} 
                                                                            theme={theme} 
                                                                            colors={COLORS} // Pass COLORS instead of colors
                                                                            moduleId={module.moduleId} // Pass module ID
                                                                            fetchLessons={fetchLessons} // Pass fetchLessons handler
                                                                        />
                                                                    ) : (
                                                                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                                                            <CircularProgress size={20} sx={{ color: COLORS.primary }} />
                                                                        </Box>
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
                            ) : (
                                modulesBySemester.length === 0 && (
                                <Typography sx={{ textAlign: 'center', color: theme.palette.text.secondary, my: 4 }}>
                                    Không tìm thấy module nào cho Học kỳ {selectedSemester}.
                                </Typography>
                                )
                            )}

                        </Box>
                    )}

                    <Dialog 
                        open={openModuleDialog} 
                        onClose={handleCloseModuleDialog}
                        maxWidth="sm"
                        fullWidth
                    >
                        <DialogTitle>
                            <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                                Chi tiết Chủ đề
                            </Typography>
                        </DialogTitle>
                        <DialogContent dividers>
                            {moduleDetails && (
                                <Box sx={{ mt: 2 }}>
                                    {isEditingModule ? (
                                        <Grid container spacing={2}>
                                             <Grid item xs={12}>
                                                <TextField
                                                     fullWidth
                                                    label="Tên chủ đề"
                                                     value={editableModuleData?.name || ''}
                                                     onChange={(e) => setEditableModuleData({ ...editableModuleData, name: e.target.value })}
                                                     variant="outlined"
                                                     sx={{ mb: 2 }}
                                                />
                                            </Grid>
                                             <Grid item xs={12}>
                                                <TextField
                                                     fullWidth
                                                    label="Mô tả"
                                                     value={editableModuleData?.desciption || ''}
                                                     onChange={(e) => setEditableModuleData({ ...editableModuleData, desciption: e.target.value })}
                                                     variant="outlined"
                                                     multiline
                                                     rows={3}
                                                     sx={{ mb: 2 }}
                                                />
                                            </Grid>
                                             <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                     label="Học kỳ"
                                                    type="number"
                                                     value={editableModuleData?.semester || ''}
                                                     onChange={(e) => setEditableModuleData({ ...editableModuleData, semester: e.target.value })}
                                                     variant="outlined"
                                                     inputProps={{ min: 1, max: 2 }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                     label="Tổng số tiết"
                                                    type="number"
                                                     value={editableModuleData?.totalPeriods || ''}
                                                     onChange={(e) => setEditableModuleData({ ...editableModuleData, totalPeriods: e.target.value })}
                                                     variant="outlined"
                                                     inputProps={{ min: 0 }}
                                                />
                                            </Grid>
                                        </Grid>

                                    ) : (
                                        <Box>
                                            <Box sx={{ mb: 3 }}>
                                                <Typography variant="h5" sx={{ 
                                                    fontWeight: 'bold', 
                                                    color: COLORS.primary,
                                                    mb: 1 
                                                }}>
                                                    {moduleDetails.name}
                                                </Typography>
                                                <Typography variant="body1" sx={{ 
                                                    color: theme.palette.text.secondary,
                                                    mb: 2
                                                }}>
                                                    {moduleDetails.desciption}
                                                </Typography>
                                            </Box>

                                            <Grid container spacing={1} sx={{ mb: 3 }}>
                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                        <InfoChip
                                                            icon={<SchoolIcon />}
                                                            label={`Học kỳ: ${moduleDetails.semester}`}
                                                             sx={{ 
                                                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(6, 169, 174, 0.2)' : 'rgba(6, 169, 174, 0.08)',
                                                                color: theme.palette.text.primary,
                                                                '.MuiChip-icon': { color: COLORS.primary }
                                                             }}
                                                        />
                                                        <InfoChip
                                                            icon={<AccessTimeIcon />}
                                                            label={`Số tiết: ${moduleDetails.totalPeriods}`}
                                                             sx={{ 
                                                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(6, 169, 174, 0.2)' : 'rgba(6, 169, 174, 0.08)',
                                                                color: theme.palette.text.primary,
                                                                '.MuiChip-icon': { color: COLORS.primary }
                                                             }}
                                                        />
                                                        <InfoChip
                                                            icon={<MenuBookIcon />}
                                                            label={`Chương trình: ${moduleDetails.curriculum}`}
                                                             sx={{ 
                                                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(6, 169, 174, 0.2)' : 'rgba(6, 169, 174, 0.08)',
                                                                color: theme.palette.text.primary,
                                                                '.MuiChip-icon': { color: COLORS.primary }
                                                             }}
                                                        />
                                                        <InfoChip
                                                            icon={<ClassIcon />}
                                                            label={`Khối: ${moduleDetails.gradeNumber}`}
                                                             sx={{ 
                                                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(6, 169, 174, 0.2)' : 'rgba(6, 169, 174, 0.08)',
                                                                color: theme.palette.text.primary,
                                                                '.MuiChip-icon': { color: COLORS.primary }
                                                             }}
                                                        />
                                                        <InfoChip
                                                            icon={<ImportContactsIcon />}
                                                            label={`Sách: ${moduleDetails.book}`}
                                                             sx={{ 
                                                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(6, 169, 174, 0.2)' : 'rgba(6, 169, 174, 0.08)',
                                                                color: theme.palette.text.primary,
                                                                '.MuiChip-icon': { color: COLORS.primary }
                                                             }}
                                                        />
                                                    </Box>
                                                </Grid>
                                            </Grid>

                                            <Box sx={{ mt: 3, p: 2, bgcolor: theme.palette.background.secondary, borderRadius: 2 }}>
                                                <Typography variant="subtitle2" sx={{ 
                                                    color: theme.palette.text.secondary,
                                                    mb: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}>
                                                    <InfoIcon fontSize="small" />
                                                    Thông tin chi tiết
                                                </Typography>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12} sm={6}> 
                                                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                                            <strong>Mô tả:</strong> {moduleDetails.desciption}
                                                        </Typography>
                                                    </Grid>
                                                     <Grid item xs={12} sm={6}> 
                                                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                                            <strong>Học kỳ:</strong> {moduleDetails.semester}
                                                        </Typography>
                                                    </Grid>
                                                     <Grid item xs={12} sm={6}> 
                                                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                                            <strong>Tổng số tiết:</strong> {moduleDetails.totalPeriods}
                                                        </Typography>
                                                    </Grid>
                                                     <Grid item xs={12} sm={6}> 
                                                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                                            <strong>Chương trình:</strong> {moduleDetails.curriculum}
                                                        </Typography>
                                                    </Grid>
                                                     <Grid item xs={12} sm={6}> 
                                                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                                            <strong>Khối:</strong> {moduleDetails.gradeNumber}
                                                        </Typography>
                                                    </Grid>
                                                     <Grid item xs={12} sm={6}> 
                                                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                                            <strong>Sách:</strong> {moduleDetails.book}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions>
                            {isEditingModule ? (
                                <>
                                    <Button onClick={handleCancelClick} sx={{ color: theme.palette.text.secondary }}>
                                        Hủy
                                    </Button>
                                    <Button onClick={handleSaveClick} variant="contained" sx={{ bgcolor: COLORS.primary, color: '#fff' }}>
                                        Lưu
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button 
                                         onClick={handleEditClick}
                                         sx={{
                                            color: COLORS.primary,
                                            '&:hover': {
                                                 backgroundColor: COLORS.hover.primary
                                             }
                                         }}
                                     >
                                        Chỉnh sửa
                                    </Button>
                                    <Button 
                                        onClick={handleCloseModuleDialog} 
                                        sx={{
                                            color: COLORS.primary,
                                            '&:hover': {
                                                backgroundColor: COLORS.hover.primary
                                            }
                                        }}
                                    >
                                        Đóng
                                    </Button>
                                </>
                            )}
                        </DialogActions>
                    </Dialog>

                    {/* Add Module Dialog */}
                    <Dialog
                        open={openAddModuleDialog}
                        onClose={handleCloseAddModuleDialog}
                        maxWidth="sm"
                        fullWidth
                    >
                        <DialogTitle>
                            <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                                Thêm Chủ đề Mới
                            </Typography>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Box sx={{ mt: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Tên chủ đề"
                                            value={newModuleData?.name || ''}
                                            onChange={(e) => setNewModuleData({ ...newModuleData, name: e.target.value })}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Mô tả"
                                            value={newModuleData?.desciption || ''}
                                            onChange={(e) => setNewModuleData({ ...newModuleData, desciption: e.target.value })}
                                            variant="outlined"
                                            multiline
                                            rows={3}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Học kỳ"
                                            type="number"
                                            value={newModuleData?.semester || ''}
                                            onChange={(e) => setNewModuleData({ ...newModuleData, semester: e.target.value })}
                                            variant="outlined"
                                            inputProps={{ min: 1, max: 2 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Tổng số tiết"
                                            type="number"
                                            value={newModuleData?.totalPeriods || ''}
                                            onChange={(e) => setNewModuleData({ ...newModuleData, totalPeriods: parseInt(e.target.value, 10) || '' })}
                                            variant="outlined"
                                            inputProps={{ min: 0 }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseAddModuleDialog} sx={{ color: theme.palette.text.secondary }}>
                                Hủy
                            </Button>
                            <Button onClick={handleSaveNewModule} variant="contained" sx={{ bgcolor: COLORS.primary, color: '#fff' }}>
                                Lưu chủ đề
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Delete Confirmation Dialog for Module */}
                    <Dialog
                        open={openDeleteConfirmDialog}
                        onClose={handleCloseDeleteConfirmDialog}
                        maxWidth="sm"
                        fullWidth
                    >
                        <DialogTitle>
                            <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                                Xác nhận Xóa Chủ đề
                            </Typography>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Typography sx={{ color: theme.palette.text.secondary }}>
                                Bạn có chắc chắn muốn xóa chủ đề "{moduleToDelete?.name}" không? Hành động này không thể hoàn tác.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDeleteConfirmDialog} sx={{ color: theme.palette.text.secondary }}>
                                Hủy
                            </Button>
                            <Button
                                onClick={async () => {
                                    if (moduleToDelete) {
                                        await handleDeleteModule(moduleToDelete.moduleId);
                                    }
                                }}
                                variant="contained"
                                sx={{ bgcolor: COLORS.error, color: '#fff' }}
                            >
                                Xóa
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
        </Box>
    );
};

export default CurriculumFramework; 