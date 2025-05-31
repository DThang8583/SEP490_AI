import React, { useState, useCallback } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    IconButton,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Collapse,
} from '@mui/material';
import {
    AccessTime as AccessTimeIcon,
    Add as AddIcon,
    Visibility as VisibilityIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Info as InfoIcon,
    MenuBook as MenuBookIcon,
    DateRange as DateRangeIcon,
    Class as ClassIcon,
    ImportContacts as ImportContactsIcon,
    Check as CheckIcon,
    Block as BlockIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Define styled component locally using passed theme and colors
// Note: Ideally, shared styled components or COLORS should be imported from a central place.
// For this task, we redefine it using props.
const InfoChip = styled(Chip)(({ theme, colors }) => ({
    margin: '4px 4px 4px 0',
    borderRadius: 12,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(6, 169, 174, 0.2)' : 'rgba(6, 169, 174, 0.08)',
    color: theme.palette.mode === 'dark' ? colors.background.paper : colors.primary,
    '.MuiChip-icon': {
        color: colors.primary,
    }
}));

// Define StyledButton here, using colors prop
const StyledButton = styled(Button)(({ theme, colors }) => ({
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
        backgroundColor: colors.primary,
        color: '#fff',
        '&:hover': {
            backgroundColor: colors.primary,
        }
    },
    '&.MuiButton-outlined': {
        borderColor: colors.primary,
        color: colors.primary,
        '&:hover': {
            backgroundColor: colors.hover.primary, // Use colors.hover.primary
            borderColor: colors.primary
        }
    }
}));

const LessonDetails = ({ lessons, theme, colors, moduleId, fetchLessons, onModulesRefresh, gradeNumber, onCurriculumRefresh }) => {
    console.log(`LessonDetails component rendered for module ${moduleId}.`); // Simple render log
    const sortedLessons = lessons ? [...lessons].sort((a, b) => a.lessonId - b.lessonId) : [];

    // State for controlling expanded lesson details
    const [expandedLessonId, setExpandedLessonId] = useState(null);

    // Function to get color for lesson type
    const getLessonTypeColor = (lessonType) => {
        const type = lessonType?.toLowerCase() || '';
        if (type.includes('mới') || type.includes('new')) {
            return {
                color: 'primary',
                sx: {
                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                    color: '#1976d2',
                    fontWeight: 600
                }
            };
        } else if (type.includes('luyện tập') || type.includes('practice')) {
            return {
                color: 'info',
                sx: {
                    bgcolor: 'rgba(103, 58, 183, 0.1)',
                    color: '#673ab7',
                    fontWeight: 600
                }
            };
        } else if (type.includes('ôn tập') || type.includes('review')) {
            return {
                color: 'secondary',
                sx: {
                    bgcolor: 'rgba(156, 39, 176, 0.1)',
                    color: '#9c27b0',
                    fontWeight: 600
                }
            };
        } else if (type.includes('thực hành')) {
            return {
                color: 'success',
                sx: {
                    bgcolor: 'rgba(46, 125, 50, 0.1)',
                    color: '#2e7d32',
                    fontWeight: 600
                }
            };
        } else if (type.includes('kiểm tra') || type.includes('test')) {
            return {
                color: 'warning',
                sx: {
                    bgcolor: 'rgba(237, 108, 2, 0.1)',
                    color: '#ed6c02',
                    fontWeight: 600
                }
            };
        } else if (type.includes('tổng kết') || type.includes('summary')) {
            return {
                color: 'info',
                sx: {
                    bgcolor: 'rgba(2, 136, 209, 0.1)',
                    color: '#0288d1',
                    fontWeight: 600
                }
            };
        } else {
            return {
                color: 'default',
                sx: {
                    bgcolor: 'rgba(6, 169, 174, 0.1)',
                    color: colors.primary,
                    fontWeight: 600
                }
            };
        }
    };

    // State for controlling view lesson details dialog
    const [openLessonDetailsDialog, setOpenLessonDetailsDialog] = useState(false);
    const [lessonDetails, setLessonDetails] = useState(null);

    // State for controlling delete lesson confirmation dialog
    const [openDeleteLessonConfirmDialog, setOpenDeleteLessonConfirmDialog] = useState(false);
    const [lessonToDelete, setLessonToDelete] = useState(null);

    // State for controlling edit lesson dialog
    const [openEditLessonDialog, setOpenEditLessonDialog] = useState(false);
    const [editedLessonData, setEditedLessonData] = useState(null);

    // State for fetched data
    const [notes, setNotes] = useState([]);
    const [lessonTypes, setLessonTypes] = useState([]);
    const [notesLoading, setNotesLoading] = useState(true);
    const [lessonTypesLoading, setLessonTypesLoading] = useState(true);
    const [notesError, setNotesError] = useState(null);
    const [lessonTypesError, setLessonTypesError] = useState(null);

    // Fetch notes and lesson types on component mount
    React.useEffect(() => {
        const fetchNotesAndLessonTypes = async () => {
            // Fetch Notes
            try {
                setNotesLoading(true);
                const notesResponse = await axios.get('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/notes');
                if (notesResponse.data.code === 0 && notesResponse.data.data) {
                    setNotes(notesResponse.data.data);
                } else {
                    setNotesError(notesResponse.data.message || 'Lỗi khi tải danh sách ghi chú');
                }
            } catch (error) {
                console.error('Error fetching notes:', error);
                setNotesError('Không thể tải danh sách ghi chú.');
            } finally {
                setNotesLoading(false);
            }

            // Fetch Lesson Types
            try {
                setLessonTypesLoading(true);
                const lessonTypesResponse = await axios.get('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-types');
                if (lessonTypesResponse.data.code === 0 && lessonTypesResponse.data.data) {
                    setLessonTypes(lessonTypesResponse.data.data);
                } else {
                    setLessonTypesError(lessonTypesResponse.data.message || 'Lỗi khi tải danh sách loại bài học');
                }
            } catch (error) {
                console.error('Error fetching lesson types:', error);
                setLessonTypesError('Không thể tải danh sách loại bài học.');
            } finally {
                setLessonTypesLoading(false);
            }
        };

        fetchNotesAndLessonTypes();
    }, []);

    // Handler for opening edit lesson dialog
    const handleOpenEditLessonDialog = async (lessonId) => {
        try {
            const response = await axios.get(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons/${lessonId}`
            );

            if (response.data.code === 0 && response.data.data) {
                console.log('Fetched Lesson Details for Editing:', response.data.data);
                // Populate state with fetched data
                const fetchedLesson = response.data.data;
                // Determine initial noteId based on totalPeriods
                const initialNoteId = fetchedLesson.totalPeriods === 1 ? 1 : fetchedLesson.totalPeriods === 2 ? 2 : ''; // Apply the same logic as onChange
                setEditedLessonData({ ...fetchedLesson, noteId: initialNoteId });
                setOpenEditLessonDialog(true);
            } else {
                console.error(`Error fetching lesson details for editing ${lessonId}:`, response.data.message);
                alert(`Lỗi khi lấy chi tiết bài học để chỉnh sửa: ${response.data.message}`);
            }
        } catch (error) {
            console.error(`Error fetching lesson details for editing ${lessonId}:`, error);
            alert(`Đã xảy ra lỗi khi lấy chi tiết bài học để chỉnh sửa.`);
        }
    };

    // Handler for closing edit lesson dialog
    const handleCloseEditLessonDialog = () => {
        setOpenEditLessonDialog(false);
        setEditedLessonData(null); // Clear form data
    };

    // Handler for lesson row click to toggle expansion
    const handleLessonClick = async (lessonId) => {
        // Toggle expanded state
        if (expandedLessonId === lessonId) {
            setExpandedLessonId(null);
            setLessonDetails(null);
        } else {
            setExpandedLessonId(lessonId);
            // Fetch lesson details
        try {
            const response = await axios.get(
                    `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons/${lessonId}`
            );

            if (response.data.code === 0 && response.data.data) {
                console.log('Lesson Details:', response.data.data);
                setLessonDetails(response.data.data);
            } else {
                console.error(`Error fetching lesson details for ${lessonId}:`, response.data.message);
                alert(`Lỗi khi lấy chi tiết bài học: ${response.data.message}`);
            }
        } catch (error) {
            console.error(`Error fetching lesson details for ${lessonId}:`, error);
            alert(`Đã xảy ra lỗi khi lấy chi tiết bài học.`);
            }
        }
    };

    // Handler for closing view lesson details dialog
    const handleCloseLessonDetailsDialog = () => {
        setLessonDetails(null);
        setOpenLessonDetailsDialog(false);
    };

    // Handler for toggling lesson status
    const handleToggleLessonStatus = async (lesson) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.delete(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons/${lesson.lessonId}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            console.log('Toggle Lesson Status API Response Code:', response.data.code);

            if (response.data.code === 0 || response.data.code === 31) {
                console.log(`Lesson ${lesson.lessonId} status toggled successfully.`);
                // Refresh lessons for the current module
                await fetchLessons(moduleId);
                
                // Refresh all curriculum and modules data using the provided prop
                if (onCurriculumRefresh) {
                    await onCurriculumRefresh();
                    console.log('Curriculum and Modules data refresh triggered from LessonDetails');
                }
            } else {
                console.error(`Error toggling lesson ${lesson.lessonId} status:`, response.data.message);
                alert(`Thay đổi trạng thái bài học thất bại: ${response.data.message}`);
            }
        } catch (error) {
            console.error(`Error toggling lesson ${lesson.lessonId} status:`, error);
            alert(`Đã xảy ra lỗi khi thay đổi trạng thái bài học.`);
        }
    };

    // Handler for opening lesson status toggle confirmation dialog
    const handleOpenToggleStatusDialog = (lesson) => {
        setLessonToDelete(lesson);
        setOpenDeleteLessonConfirmDialog(true);
    };

    // Handler for closing delete lesson confirmation dialog
    const handleCloseDeleteLessonConfirmDialog = () => {
        setLessonToDelete(null);
        setOpenDeleteLessonConfirmDialog(false);
    };

    // Handler for saving edited lesson
    const handleSaveEditedLesson = async () => {
        if (editedLessonData && moduleId) {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await axios.put(
                    `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons/${editedLessonData.lessonId}`,
                    editedLessonData,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );

                console.log('Update Lesson API Response Code:', response.data.code);

                if (response.data.code === 0 || response.data.code === 22) {
                    console.log(`Lesson ${editedLessonData.lessonId} updated successfully.`);
                    
                    // Refetch lessons for the current module to update the list
                    fetchLessons(moduleId); // Use fetchLessons prop
                    
                    // Refresh modules data by calling API directly
                    try {
                        console.log('Refreshing modules data after lesson edit...');
                        const modulesRefreshResponse = await axios.get(
                            `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades/${gradeNumber}/modules`
                        );
                        console.log('Modules refresh API response:', modulesRefreshResponse.data);
                        
                        // Trigger modules refresh callback if available
                        if (onModulesRefresh) {
                            await onModulesRefresh();
                        }
                    } catch (moduleError) {
                        console.error('Error refreshing modules data:', moduleError);
                    }

                    // Refresh curriculum data by calling API directly
                    try {
                        console.log('Refreshing curriculum data after lesson edit...');
                        const curriculumRefreshResponse = await axios.get(
                            'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/curriculums'
                        );
                        console.log('Curriculum refresh API response:', curriculumRefreshResponse.data);
                        
                        // Trigger curriculum refresh callback if available
                        if (onCurriculumRefresh) {
                            await onCurriculumRefresh();
                        }
                    } catch (curriculumError) {
                        console.error('Error refreshing curriculum data:', curriculumError);
                    }
                    
                    // Close dialog
                    handleCloseEditLessonDialog();
                } else {
                    console.error(`Error updating lesson for module ${moduleId}:`, response.data.message);
                    alert(`Cập nhật bài học thất bại: ${response.data.message}`);
                }
            } catch (error) {
                console.error(`Error updating lesson for module ${moduleId}:`, error);
                alert(`Đã xảy ra lỗi khi cập nhật bài học.`);
            }
        } else {
            console.error('No lesson data or module ID to save.');
            alert('Không có dữ liệu bài học hoặc ID chủ đề để lưu.');
        }
    };

    return (
                <Box sx={{
            margin: 0,
            p: 0,
            bgcolor: 'transparent',
            borderRadius: 0,
        }}>
            {sortedLessons.length > 0 ? (
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 'none', minWidth: 800 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', borderBottom: `1px solid ${theme.palette.grey[400]}`, borderRight: `1px solid ${theme.palette.grey[400]}` }}>STT</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', borderBottom: `1px solid ${theme.palette.grey[400]}`, borderRight: `1px solid ${theme.palette.grey[400]}` }}>Tên bài học</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', borderBottom: `1px solid ${theme.palette.grey[400]}`, borderRight: `1px solid ${theme.palette.grey[400]}` }}>Loại bài học</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', borderBottom: `1px solid ${theme.palette.grey[400]}`, borderRight: `1px solid ${theme.palette.grey[400]}`, textAlign: 'center' }}>Số tiết</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', borderBottom: `1px solid ${theme.palette.grey[400]}`, borderRight: `1px solid ${theme.palette.grey[400]}`, textAlign: 'center' }}>Trạng thái</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', borderBottom: `1px solid ${theme.palette.grey[400]}`, textAlign: 'center' }}>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                    {sortedLessons.map((lesson, index) => (
                                <React.Fragment key={lesson.lessonId}>
                                    <TableRow 
                                        onClick={() => handleLessonClick(lesson.lessonId)}
                                        sx={{ 
                                            '&:last-child td': { borderBottom: 0 },
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: theme.palette.action.hover,
                                            },
                                            borderBottom: expandedLessonId === lesson.lessonId ? 'none' : `1px solid ${theme.palette.grey[400]}`,
                                        }}
                                    >
                                        <TableCell sx={{ 
                                            borderRight: `1px solid ${theme.palette.grey[400]}`,
                                            borderBottom: expandedLessonId === lesson.lessonId ? 'none' : `1px solid ${theme.palette.grey[400]}`,
                                        }}>{index + 1}</TableCell>
                                        <TableCell sx={{ 
                                            borderRight: `1px solid ${theme.palette.grey[400]}`,
                                            borderBottom: expandedLessonId === lesson.lessonId ? 'none' : `1px solid ${theme.palette.grey[400]}`,
                                        }}>{lesson.name}</TableCell>
                                        <TableCell sx={{ 
                                            borderRight: `1px solid ${theme.palette.grey[400]}`,
                                            borderBottom: expandedLessonId === lesson.lessonId ? 'none' : `1px solid ${theme.palette.grey[400]}`,
                                        }}>
                                            <Chip
                                                label={lesson.lessonType}
                                                color={getLessonTypeColor(lesson.lessonType).color}
                                                size="small"
                                                sx={getLessonTypeColor(lesson.lessonType).sx}
                                            />
                                        </TableCell>
                                        <TableCell align="center" sx={{ 
                                            borderRight: `1px solid ${theme.palette.grey[400]}`,
                                            borderBottom: expandedLessonId === lesson.lessonId ? 'none' : `1px solid ${theme.palette.grey[400]}`,
                                        }}>
                            <InfoChip
                                icon={<AccessTimeIcon fontSize="small" sx={{ color: colors.primary }} />} 
                                label={`${lesson.totalPeriods} tiết`} 
                                colors={colors}
                                        />
                                    </TableCell>
                                        <TableCell align="center" sx={{ 
                                            borderRight: `1px solid ${theme.palette.grey[400]}`,
                                            borderBottom: expandedLessonId === lesson.lessonId ? 'none' : `1px solid ${theme.palette.grey[400]}`,
                                        }}>
                                        <Chip
                                            label={lesson.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                                            color={lesson.isActive ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </TableCell>
                                        <TableCell align="center" sx={{
                                            borderBottom: expandedLessonId === lesson.lessonId ? 'none' : `1px solid ${theme.palette.grey[400]}`,
                                        }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                 <IconButton
                                     size="small"
                                         onClick={(e) => {
                                             e.stopPropagation();
                                             handleLessonClick(lesson.lessonId);
                                         }}
                                     sx={{
                                         color: colors.primary,
                                         '&:hover': {
                                             bgcolor: colors.hover.primary
                                         }
                                     }}
                                 >
                                     <VisibilityIcon fontSize="small" />
                                 </IconButton>
                                 <IconButton
                                     size="small"
                                         onClick={(e) => {
                                             e.stopPropagation();
                                             handleOpenEditLessonDialog(lesson.lessonId);
                                         }}
                                         sx={{
                                             color: colors.primary,
                                             '&:hover': {
                                                 bgcolor: colors.hover.primary
                                             }
                                         }}
                                     >
                                         <EditIcon fontSize="small" />
                                     </IconButton>
                                     <IconButton
                                         size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenToggleStatusDialog(lesson);
                                                    }}
                                     sx={{
                                                    color: lesson.isActive ? colors.error : colors.success,
                                         '&:hover': {
                                                        bgcolor: lesson.isActive ? 'rgba(255, 72, 66, 0.08)' : 'rgba(0, 171, 85, 0.08)'
                                         }
                                     }}
                                 >
                                                    {lesson.isActive ? <BlockIcon fontSize="small" /> : <CheckIcon fontSize="small" />}
                                 </IconButton>
                             </Box>
                                    </TableCell>
                                </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ paddingBottom: 0, paddingTop: 0, border: 'none' }} colSpan={6}>
                                            <Collapse in={expandedLessonId === lesson.lessonId} timeout="auto" unmountOnExit>
                                                <Box sx={{ 
                                                    margin: 0, 
                                                    p: 3, 
                                                    bgcolor: theme.palette.mode === 'dark' 
                                                        ? 'rgba(45, 45, 45, 0.5)' 
                                                        : 'rgba(6, 169, 174, 0.02)', 
                                                    borderRadius: 0,
                                                    borderTop: `1px solid ${theme.palette.divider}`,
                                                    borderBottom: expandedLessonId === lesson.lessonId && index === sortedLessons.length - 1 
                                                        ? 'none' 
                                                        : `1px solid ${theme.palette.divider}`
                                                }}>
                                                    {lessonDetails && expandedLessonId === lesson.lessonId && (
                                                        <Box sx={{ mt: 2 }}>
                                                            <Box sx={{ mb: 3 }}>
                                                                <Typography variant="h5" sx={{ 
                                                                    fontWeight: 'bold', 
                                                                    color: colors.primary,
                                                                    mb: 1 
                                                                }}>
                                                                    {lessonDetails.name} 
                                                                </Typography>
                                                                <Typography variant="body1" sx={{ 
                                                                    color: theme.palette.text.secondary,
                                                                    mb: 2
                                                                }}>
                                                                    {lessonDetails.description}
                                                                </Typography>
                                                            </Box>

                                                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                                                <Grid item xs={12}>
                                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                                        <InfoChip
                                                                            icon={<AccessTimeIcon />}
                                                                            label={`Số tiết: ${lessonDetails.totalPeriods}`}
                                                                            colors={colors}
                                                                        />
                                                                        {lessonDetails.lessonType && (
                                                                            <InfoChip
                                                                                icon={<MenuBookIcon />} 
                                                                                label={`Loại bài học: ${lessonDetails.lessonType}`}
                                                                                colors={colors}
                                                                            />
                                                                        )}
                                                                        {lessonDetails.gradeNumber && (
                                                                            <InfoChip
                                                                                icon={<ClassIcon />} 
                                                                                label={`Khối: ${lessonDetails.gradeNumber}`}
                                                                                colors={colors}
                                                                            />
                                                                        )}
                                                                         {lessonDetails.module && (
                                                                            <InfoChip
                                                                                icon={<ImportContactsIcon />} 
                                                                                label={`Chủ đề: ${lessonDetails.module}`}
                                                                                colors={colors}
                                                                            />
                                                                        )}
                                                                        {lessonDetails.duration && (
                                                                            <InfoChip
                                                                                icon={<AccessTimeIcon />} 
                                                                                label={`Thời lượng: ${lessonDetails.duration} phút`}
                                                                                colors={colors}
                                                                            />
                                                                        )}
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>

                                                            {/* Năng lực đặc biệt */}
                                                            {lessonDetails.specialAbility && (
                                                                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(25, 118, 210, 0.05)', borderRadius: 2, borderLeft: `4px solid #1976d2` }}>
                                                                    <Typography variant="h6" sx={{ 
                                                                        color: '#1976d2',
                                                                        mb: 2,
                                                                        fontWeight: 600
                                                                    }}>
                                                                        🎯 Năng lực đặc biệt
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ 
                                                                        color: theme.palette.text.primary,
                                                                        lineHeight: 1.6,
                                                                        whiteSpace: 'pre-line'
                                                                    }}>
                                                                        {lessonDetails.specialAbility}
                                                                    </Typography>
                                                                </Box>
                                                            )}

                                                            {/* Năng lực chung */}
                                                            {lessonDetails.generalCapacity && (
                                                                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(156, 39, 176, 0.05)', borderRadius: 2, borderLeft: `4px solid #9c27b0` }}>
                                                                    <Typography variant="h6" sx={{ 
                                                                        color: '#9c27b0',
                                                                        mb: 2,
                                                                        fontWeight: 600
                                                                    }}>
                                                                        🧠 Năng lực chung
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ 
                                                                        color: theme.palette.text.primary,
                                                                        lineHeight: 1.6,
                                                                        whiteSpace: 'pre-line'
                                                                    }}>
                                                                        {lessonDetails.generalCapacity}
                                                                    </Typography>
                                                                </Box>
                                                            )}

                                                            {/* Phẩm chất */}
                                                            {lessonDetails.quality && (
                                                                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(46, 125, 50, 0.05)', borderRadius: 2, borderLeft: `4px solid #2e7d32` }}>
                                                                    <Typography variant="h6" sx={{ 
                                                                        color: '#2e7d32',
                                                                        mb: 2,
                                                                        fontWeight: 600
                                                                    }}>
                                                                        ⭐ Phẩm chất
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ 
                                                                        color: theme.palette.text.primary,
                                                                        lineHeight: 1.6,
                                                                        whiteSpace: 'pre-line'
                                                                    }}>
                                                                        {lessonDetails.quality}
                                                                    </Typography>
                                                                </Box>
                                                            )}

                                                            {/* Đồ dùng dạy học */}
                                                            {lessonDetails.schoolSupply && (
                                                                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(237, 108, 2, 0.05)', borderRadius: 2, borderLeft: `4px solid #ed6c02` }}>
                                                                    <Typography variant="h6" sx={{ 
                                                                        color: '#ed6c02',
                                                                        mb: 2,
                                                                        fontWeight: 600
                                                                    }}>
                                                                        📚 Đồ dùng dạy học
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ 
                                                                        color: theme.palette.text.primary,
                                                                        lineHeight: 1.6
                                                                    }}>
                                                                        {lessonDetails.schoolSupply}
                                                                    </Typography>
                                                                </Box>
                                                            )}

                                                            {/* Các hoạt động dạy học */}
                                                            {(lessonDetails.startUp || lessonDetails.knowLedge || lessonDetails.practice || lessonDetails.apply) && (
                                                                <>
                                                                    <Typography variant="h6" sx={{ 
                                                                        color: theme.palette.text.primary,
                                                                        mt: 4,
                                                                        mb: 2,
                                                                        fontWeight: 600
                                                                    }}>
                                                                        📋 Các hoạt động dạy học
                                                                    </Typography>

                                                                    {/* Khởi động */}
                                                                    {lessonDetails.startUp && (
                                                                        <Box sx={{ mt: 2, p: 3, bgcolor: theme.palette.background.paper, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                                                <Typography variant="h6" sx={{ 
                                                                                    color: colors.primary,
                                                                                    fontWeight: 600,
                                                                                    mr: 2
                                                                                }}>
                                                                                    🚀 Hoạt động Khởi động
                                                                                </Typography>
                                                                                <Chip 
                                                                                    label={`${lessonDetails.startUp.duration} phút`}
                                                                                    size="small"
                                                                                    sx={{ bgcolor: 'rgba(6, 169, 174, 0.1)', color: colors.primary }}
                                                                                />
                                                                            </Box>
                                                                            
                                                                            <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                                                Mục tiêu:
                                                                            </Typography>
                                                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2, lineHeight: 1.6 }}>
                                                                                {lessonDetails.startUp.goal}
                                                                            </Typography>

                                                                            <Grid container spacing={2}>
                                                                                <Grid item xs={12} md={6}>
                                                                                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                                                        Hoạt động của giáo viên:
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ 
                                                                                        color: theme.palette.text.secondary, 
                                                                                        lineHeight: 1.6,
                                                                                        whiteSpace: 'pre-line'
                                                                                    }}>
                                                                                        {lessonDetails.startUp.teacherActivities}
                                                                                    </Typography>
                                                                                </Grid>
                                                                                <Grid item xs={12} md={6}>
                                                                                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                                                        Hoạt động của học sinh:
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ 
                                                                                        color: theme.palette.text.secondary, 
                                                                                        lineHeight: 1.6,
                                                                                        whiteSpace: 'pre-line'
                                                                                    }}>
                                                                                        {lessonDetails.startUp.studentActivities}
                                                                                    </Typography>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Box>
                                                                    )}

                                                                    {/* Hình thành kiến thức */}
                                                                    {lessonDetails.knowLedge && (
                                                                        <Box sx={{ mt: 2, p: 3, bgcolor: theme.palette.background.paper, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                                                <Typography variant="h6" sx={{ 
                                                                                    color: '#1976d2',
                                                                                    fontWeight: 600,
                                                                                    mr: 2
                                                                                }}>
                                                                                    📚 Hoạt động Hình thành kiến thức
                                                                                </Typography>
                                                                                <Chip 
                                                                                    label={`${lessonDetails.knowLedge.duration} phút`}
                                                                                    size="small"
                                                                                    sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)', color: '#1976d2' }}
                                                                                />
                                                                            </Box>
                                                                            
                                                                            <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                                                Mục tiêu:
                                                                            </Typography>
                                                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2, lineHeight: 1.6 }}>
                                                                                {lessonDetails.knowLedge.goal}
                                                                            </Typography>

                                                                            <Grid container spacing={2}>
                                                                                <Grid item xs={12} md={6}>
                                                                                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                                                        Hoạt động của giáo viên:
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ 
                                                                                        color: theme.palette.text.secondary, 
                                                                                        lineHeight: 1.6,
                                                                                        whiteSpace: 'pre-line'
                                                                                    }}>
                                                                                        {lessonDetails.knowLedge.teacherActivities}
                                                                                    </Typography>
                                                                                </Grid>
                                                                                <Grid item xs={12} md={6}>
                                                                                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                                                        Hoạt động của học sinh:
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ 
                                                                                        color: theme.palette.text.secondary, 
                                                                                        lineHeight: 1.6,
                                                                                        whiteSpace: 'pre-line'
                                                                                    }}>
                                                                                        {lessonDetails.knowLedge.studentActivities}
                                                                                    </Typography>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Box>
                                                                    )}

                                                                    {/* Luyện tập */}
                                                                    {lessonDetails.practice && (
                                                                        <Box sx={{ mt: 2, p: 3, bgcolor: theme.palette.background.paper, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                                                <Typography variant="h6" sx={{ 
                                                                                    color: '#9c27b0',
                                                                                    fontWeight: 600,
                                                                                    mr: 2
                                                                                }}>
                                                                                    💪 Hoạt động Luyện tập
                                                                                </Typography>
                                                                                <Chip 
                                                                                    label={`${lessonDetails.practice.duration} phút`}
                                                                                    size="small"
                                                                                    sx={{ bgcolor: 'rgba(156, 39, 176, 0.1)', color: '#9c27b0' }}
                                                                                />
                                                                            </Box>
                                                                            
                                                                            <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                                                Mục tiêu:
                                                                            </Typography>
                                                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2, lineHeight: 1.6 }}>
                                                                                {lessonDetails.practice.goal}
                                                                            </Typography>

                                                                            <Grid container spacing={2}>
                                                                                <Grid item xs={12} md={6}>
                                                                                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                                                        Hoạt động của giáo viên:
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ 
                                                                                        color: theme.palette.text.secondary, 
                                                                                        lineHeight: 1.6,
                                                                                        whiteSpace: 'pre-line'
                                                                                    }}>
                                                                                        {lessonDetails.practice.teacherActivities}
                                                                                    </Typography>
                                                                                </Grid>
                                                                                <Grid item xs={12} md={6}>
                                                                                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                                                        Hoạt động của học sinh:
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ 
                                                                                        color: theme.palette.text.secondary, 
                                                                                        lineHeight: 1.6,
                                                                                        whiteSpace: 'pre-line'
                                                                                    }}>
                                                                                        {lessonDetails.practice.studentActivities}
                                                                                    </Typography>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Box>
                                                                    )}

                                                                    {/* Vận dụng */}
                                                                    {lessonDetails.apply && (
                                                                        <Box sx={{ mt: 2, p: 3, bgcolor: theme.palette.background.paper, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                                                <Typography variant="h6" sx={{ 
                                                                                    color: '#2e7d32',
                                                                                    fontWeight: 600,
                                                                                    mr: 2
                                                                                }}>
                                                                                    🎯 Hoạt động Vận dụng
                                                                                </Typography>
                                                                                <Chip 
                                                                                    label={`${lessonDetails.apply.duration} phút`}
                                                                                    size="small"
                                                                                    sx={{ bgcolor: 'rgba(46, 125, 50, 0.1)', color: '#2e7d32' }}
                                                                                />
                                                                            </Box>
                                                                            
                                                                            <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                                                Mục tiêu:
                                                                            </Typography>
                                                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2, lineHeight: 1.6 }}>
                                                                                {lessonDetails.apply.goal}
                                                                            </Typography>

                                                                            <Grid container spacing={2}>
                                                                                <Grid item xs={12} md={6}>
                                                                                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                                                        Hoạt động của giáo viên:
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ 
                                                                                        color: theme.palette.text.secondary, 
                                                                                        lineHeight: 1.6,
                                                                                        whiteSpace: 'pre-line'
                                                                                    }}>
                                                                                        {lessonDetails.apply.teacherActivities}
                                                                                    </Typography>
                                                                                </Grid>
                                                                                <Grid item xs={12} md={6}>
                                                                                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                                                        Hoạt động của học sinh:
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ 
                                                                                        color: theme.palette.text.secondary, 
                                                                                        lineHeight: 1.6,
                                                                                        whiteSpace: 'pre-line'
                                                                                    }}>
                                                                                        {lessonDetails.apply.studentActivities}
                                                                                    </Typography>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Box>
                                                                    )}
                                                                </>
                                                            )}
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
                <Typography sx={{ textAlign: 'center', color: theme.palette.text.secondary, mt: 2 }}>
                    Không có bài học nào trong chủ đề này.
                     </Typography>
                     )}

             {/* View Lesson Details Dialog */}
             <Dialog
                 open={openLessonDetailsDialog}
                 onClose={handleCloseLessonDetailsDialog}
                 maxWidth="lg"
                 fullWidth
             >
                 <DialogTitle>
                     <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                         Chi tiết Bài học
                     </Typography>
                 </DialogTitle>
                 <DialogContent dividers>
                     {lessonDetails && (
                         <Box sx={{ mt: 2 }}>
                             <Box sx={{ mb: 3 }}>
                                 <Typography variant="h5" sx={{ 
                                     fontWeight: 'bold', 
                                     color: colors.primary,
                                     mb: 1 
                                 }}>
                                     {lessonDetails.name}
                                 </Typography>
                                 <Typography variant="body1" sx={{ 
                                     color: theme.palette.text.secondary,
                                     mb: 2
                                 }}>
                                     {lessonDetails.description}
                                 </Typography>
                             </Box>

                             <Grid container spacing={1} sx={{ mb: 3 }}>
                                 <Grid item xs={12}>
                                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                         <InfoChip
                                             icon={<AccessTimeIcon />}
                                             label={`Số tiết: ${lessonDetails.totalPeriods}`}
                                             colors={colors}
                                         />
                                         {lessonDetails.lessonType && (
                                             <InfoChip
                                                 icon={<MenuBookIcon />} 
                                                 label={`Loại bài học: ${lessonDetails.lessonType}`}
                                                 colors={colors}
                                             />
                                         )}
                                         {lessonDetails.gradeNumber && (
                                             <InfoChip
                                                 icon={<ClassIcon />} 
                                                 label={`Khối: ${lessonDetails.gradeNumber}`}
                                                 colors={colors}
                                             />
                                         )}
                                          {lessonDetails.module && (
                                             <InfoChip
                                                 icon={<ImportContactsIcon />} 
                                                 label={`Chủ đề: ${lessonDetails.module}`}
                                                 colors={colors}
                                             />
                                         )}
                                         {lessonDetails.duration && (
                                             <InfoChip
                                                 icon={<AccessTimeIcon />} 
                                                 label={`Thời lượng: ${lessonDetails.duration} phút`}
                                                 colors={colors}
                                             />
                                         )}
                                     </Box>
                                 </Grid>
                             </Grid>

                             {/* Năng lực đặc biệt */}
                             {lessonDetails.specialAbility && (
                                 <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(25, 118, 210, 0.05)', borderRadius: 2, borderLeft: `4px solid #1976d2` }}>
                                     <Typography variant="h6" sx={{ 
                                         color: '#1976d2',
                                     mb: 2,
                                         fontWeight: 600
                                 }}>
                                         🎯 Năng lực đặc biệt
                                 </Typography>
                                     <Typography variant="body2" sx={{ 
                                         color: theme.palette.text.primary,
                                         lineHeight: 1.6,
                                         whiteSpace: 'pre-line'
                                     }}>
                                         {lessonDetails.specialAbility}
                                     </Typography>
                                 </Box>
                             )}

                             {/* Năng lực chung */}
                             {lessonDetails.generalCapacity && (
                                 <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(156, 39, 176, 0.05)', borderRadius: 2, borderLeft: `4px solid #9c27b0` }}>
                                     <Typography variant="h6" sx={{ 
                                         color: '#9c27b0',
                                         mb: 2,
                                         fontWeight: 600
                                     }}>
                                         🧠 Năng lực chung
                                     </Typography>
                                     <Typography variant="body2" sx={{ 
                                         color: theme.palette.text.primary,
                                         lineHeight: 1.6,
                                         whiteSpace: 'pre-line'
                                     }}>
                                         {lessonDetails.generalCapacity}
                                     </Typography>
                                 </Box>
                             )}

                             {/* Phẩm chất */}
                             {lessonDetails.quality && (
                                 <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(46, 125, 50, 0.05)', borderRadius: 2, borderLeft: `4px solid #2e7d32` }}>
                                     <Typography variant="h6" sx={{ 
                                         color: '#2e7d32',
                                         mb: 2,
                                         fontWeight: 600
                                     }}>
                                         ⭐ Phẩm chất
                                     </Typography>
                                     <Typography variant="body2" sx={{ 
                                         color: theme.palette.text.primary,
                                         lineHeight: 1.6,
                                         whiteSpace: 'pre-line'
                                     }}>
                                         {lessonDetails.quality}
                                     </Typography>
                                 </Box>
                             )}

                             {/* Đồ dùng dạy học */}
                             {lessonDetails.schoolSupply && (
                                 <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(237, 108, 2, 0.05)', borderRadius: 2, borderLeft: `4px solid #ed6c02` }}>
                                     <Typography variant="h6" sx={{ 
                                         color: '#ed6c02',
                                         mb: 2,
                                         fontWeight: 600
                                     }}>
                                         📚 Đồ dùng dạy học
                                     </Typography>
                                     <Typography variant="body2" sx={{ 
                                         color: theme.palette.text.primary,
                                         lineHeight: 1.6
                                     }}>
                                         {lessonDetails.schoolSupply}
                                     </Typography>
                                 </Box>
                             )}

                             {/* Các hoạt động dạy học */}
                             {(lessonDetails.startUp || lessonDetails.knowLedge || lessonDetails.practice || lessonDetails.apply) && (
                                 <>
                                     <Typography variant="h6" sx={{ 
                                         color: theme.palette.text.primary,
                                         mt: 4,
                                         mb: 2,
                                         fontWeight: 600
                                     }}>
                                         📋 Các hoạt động dạy học
                                     </Typography>

                                     {/* Khởi động */}
                                     {lessonDetails.startUp && (
                                         <Box sx={{ mt: 2, p: 3, bgcolor: theme.palette.background.paper, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                                             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                 <Typography variant="h6" sx={{ 
                                                     color: colors.primary,
                                                     fontWeight: 600,
                                                     mr: 2
                                                 }}>
                                                     🚀 Hoạt động Khởi động
                                                 </Typography>
                                                 <Chip 
                                                     label={`${lessonDetails.startUp.duration} phút`}
                                                     size="small"
                                                     sx={{ bgcolor: 'rgba(6, 169, 174, 0.1)', color: colors.primary }}
                                                 />
                                             </Box>
                                             
                                             <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                 Mục tiêu:
                                             </Typography>
                                             <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2, lineHeight: 1.6 }}>
                                                 {lessonDetails.startUp.goal}
                                             </Typography>

                                             <Grid container spacing={2}>
                                                 <Grid item xs={12} md={6}>
                                                     <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                         Hoạt động của giáo viên:
                                                     </Typography>
                                                     <Typography variant="body2" sx={{ 
                                                         color: theme.palette.text.secondary, 
                                                         lineHeight: 1.6,
                                                         whiteSpace: 'pre-line'
                                                     }}>
                                                         {lessonDetails.startUp.teacherActivities}
                                         </Typography>
                                     </Grid>
                                                 <Grid item xs={12} md={6}>
                                                     <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                         Hoạt động của học sinh:
                                                     </Typography>
                                                     <Typography variant="body2" sx={{ 
                                                         color: theme.palette.text.secondary, 
                                                         lineHeight: 1.6,
                                                         whiteSpace: 'pre-line'
                                                     }}>
                                                         {lessonDetails.startUp.studentActivities}
                                         </Typography>
                                     </Grid>
                                             </Grid>
                                         </Box>
                                     )}

                                     {/* Hình thành kiến thức */}
                                     {lessonDetails.knowLedge && (
                                         <Box sx={{ mt: 2, p: 3, bgcolor: theme.palette.background.paper, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                                             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                 <Typography variant="h6" sx={{ 
                                                     color: '#1976d2',
                                                     fontWeight: 600,
                                                     mr: 2
                                                 }}>
                                                     📚 Hoạt động Hình thành kiến thức
                                                 </Typography>
                                                 <Chip 
                                                     label={`${lessonDetails.knowLedge.duration} phút`}
                                                     size="small"
                                                     sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)', color: '#1976d2' }}
                                                 />
                                             </Box>
                                             
                                             <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                 Mục tiêu:
                                             </Typography>
                                             <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2, lineHeight: 1.6 }}>
                                                 {lessonDetails.knowLedge.goal}
                                             </Typography>

                                             <Grid container spacing={2}>
                                                 <Grid item xs={12} md={6}>
                                                     <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                         Hoạt động của giáo viên:
                                                     </Typography>
                                                     <Typography variant="body2" sx={{ 
                                                         color: theme.palette.text.secondary, 
                                                         lineHeight: 1.6,
                                                         whiteSpace: 'pre-line'
                                                     }}>
                                                         {lessonDetails.knowLedge.teacherActivities}
                                         </Typography>
                                     </Grid>
                                                 <Grid item xs={12} md={6}>
                                                     <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                         Hoạt động của học sinh:
                                                     </Typography>
                                                     <Typography variant="body2" sx={{ 
                                                         color: theme.palette.text.secondary, 
                                                         lineHeight: 1.6,
                                                         whiteSpace: 'pre-line'
                                                     }}>
                                                         {lessonDetails.knowLedge.studentActivities}
                                         </Typography>
                                     </Grid>
                                             </Grid>
                                         </Box>
                                     )}

                                     {/* Luyện tập */}
                                     {lessonDetails.practice && (
                                         <Box sx={{ mt: 2, p: 3, bgcolor: theme.palette.background.paper, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                                             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                 <Typography variant="h6" sx={{ 
                                                     color: '#9c27b0',
                                                     fontWeight: 600,
                                                     mr: 2
                                                 }}>
                                                     💪 Hoạt động Luyện tập
                                                 </Typography>
                                                 <Chip 
                                                     label={`${lessonDetails.practice.duration} phút`}
                                                     size="small"
                                                     sx={{ bgcolor: 'rgba(156, 39, 176, 0.1)', color: '#9c27b0' }}
                                                 />
                                             </Box>
                                             
                                             <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                 Mục tiêu:
                                             </Typography>
                                             <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2, lineHeight: 1.6 }}>
                                                 {lessonDetails.practice.goal}
                                             </Typography>

                                             <Grid container spacing={2}>
                                                 <Grid item xs={12} md={6}>
                                                     <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                         Hoạt động của giáo viên:
                                                     </Typography>
                                                     <Typography variant="body2" sx={{ 
                                                         color: theme.palette.text.secondary, 
                                                         lineHeight: 1.6,
                                                         whiteSpace: 'pre-line'
                                                     }}>
                                                         {lessonDetails.practice.teacherActivities}
                                         </Typography>
                                     </Grid>
                                                 <Grid item xs={12} md={6}>
                                                     <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                         Hoạt động của học sinh:
                                                     </Typography>
                                                     <Typography variant="body2" sx={{ 
                                                         color: theme.palette.text.secondary, 
                                                         lineHeight: 1.6,
                                                         whiteSpace: 'pre-line'
                                                     }}>
                                                         {lessonDetails.practice.studentActivities}
                                         </Typography>
                                     </Grid>
                                 </Grid>
                             </Box>
                                     )}

                                     {/* Vận dụng */}
                                     {lessonDetails.apply && (
                                         <Box sx={{ mt: 2, p: 3, bgcolor: theme.palette.background.paper, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                                             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                 <Typography variant="h6" sx={{ 
                                                     color: '#2e7d32',
                                                     fontWeight: 600,
                                                     mr: 2
                                                 }}>
                                                     🎯 Hoạt động Vận dụng
                                                 </Typography>
                                                 <Chip 
                                                     label={`${lessonDetails.apply.duration} phút`}
                                                     size="small"
                                                     sx={{ bgcolor: 'rgba(46, 125, 50, 0.1)', color: '#2e7d32' }}
                                                 />
                                             </Box>
                                             
                                             <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                 Mục tiêu:
                                             </Typography>
                                             <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2, lineHeight: 1.6 }}>
                                                 {lessonDetails.apply.goal}
                                             </Typography>

                                             <Grid container spacing={2}>
                                                 <Grid item xs={12} md={6}>
                                                     <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                         Hoạt động của giáo viên:
                                                     </Typography>
                                                     <Typography variant="body2" sx={{ 
                                                         color: theme.palette.text.secondary, 
                                                         lineHeight: 1.6,
                                                         whiteSpace: 'pre-line'
                                                     }}>
                                                         {lessonDetails.apply.teacherActivities}
                                                     </Typography>
                                                 </Grid>
                                                 <Grid item xs={12} md={6}>
                                                     <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 1 }}>
                                                         Hoạt động của học sinh:
                                                     </Typography>
                                                     <Typography variant="body2" sx={{ 
                                                         color: theme.palette.text.secondary, 
                                                         lineHeight: 1.6,
                                                         whiteSpace: 'pre-line'
                                                     }}>
                                                         {lessonDetails.apply.studentActivities}
                                                     </Typography>
                                                 </Grid>
                                             </Grid>
                                         </Box>
                                     )}
                                 </>
                             )}
                         </Box>
                     )}
                 </DialogContent>
                 <DialogActions>
                     <Button onClick={handleCloseLessonDetailsDialog} sx={{ color: theme.palette.text.secondary }}>
                         Đóng
                     </Button>
                 </DialogActions>
             </Dialog>

             {/* Delete Lesson Confirmation Dialog */}
             <Dialog
                 open={openDeleteLessonConfirmDialog}
                 onClose={handleCloseDeleteLessonConfirmDialog}
                 maxWidth="sm"
                 fullWidth
             >
                 <DialogTitle>
                     <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                        Xác nhận Thay đổi Trạng thái
                     </Typography>
                 </DialogTitle>
                 <DialogContent dividers>
                     <Typography sx={{ color: theme.palette.text.secondary }}>
                        Bạn có chắc chắn muốn {lessonToDelete?.isActive ? 'tắt' : 'bật'} trạng thái hoạt động của bài học "{lessonToDelete?.name}" không?
                     </Typography>
                 </DialogContent>
                 <DialogActions>
                     <Button onClick={handleCloseDeleteLessonConfirmDialog} sx={{ color: theme.palette.text.secondary }}>
                         Hủy
                     </Button>
                     <Button
                         onClick={async () => {
                            if (lessonToDelete) {
                                await handleToggleLessonStatus(lessonToDelete);
                                handleCloseDeleteLessonConfirmDialog();
                             }
                         }}
                         variant="contained"
                        sx={{ 
                            bgcolor: lessonToDelete?.isActive ? colors.error : colors.success,
                            color: '#fff',
                            '&:hover': {
                                bgcolor: lessonToDelete?.isActive ? '#d32f2f' : '#2e7d32'
                            }
                        }}
                    >
                        {lessonToDelete?.isActive ? 'Tắt hoạt động' : 'Bật hoạt động'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Lesson Dialog */}
            <Dialog
                open={openEditLessonDialog}
                onClose={handleCloseEditLessonDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                        Chỉnh sửa Bài học
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Tên bài học"
                                    value={editedLessonData?.name || ''}
                                    onChange={(e) => setEditedLessonData({ ...editedLessonData, name: e.target.value })}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Mô tả"
                                    value={editedLessonData?.description || ''}
                                    onChange={(e) => setEditedLessonData({ ...editedLessonData, description: e.target.value })}
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Tổng số tiết</InputLabel>
                                    <Select
                                        fullWidth
                                        value={editedLessonData?.totalPeriods || ''}
                                        onChange={(e) => {
                                            const selectedPeriods = parseInt(e.target.value, 10);
                                            setEditedLessonData({
                                                ...editedLessonData,
                                                totalPeriods: selectedPeriods,
                                                noteId: selectedPeriods === 1 ? 1 : selectedPeriods === 2 ? 2 : '',
                                            });
                                        }}
                                        label="Tổng số tiết"
                                    >
                                        <MenuItem value={1}>1 tiết</MenuItem>
                                        <MenuItem value={2}>2 tiết</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined" disabled={lessonTypesLoading || !!lessonTypesError}>
                                    <InputLabel>Loại bài học</InputLabel>
                                    <Select
                                        value={editedLessonData?.lessonTypeId || ''}
                                        onChange={(e) => setEditedLessonData({ ...editedLessonData, lessonTypeId: e.target.value })}
                                        label="Loại bài học"
                                    >
                                        {lessonTypesError ? (
                                            <MenuItem value="" disabled>{lessonTypesError}</MenuItem>
                                        ) : lessonTypesLoading ? (
                                            <MenuItem value="" disabled>Đang tải...</MenuItem>
                                        ) : (
                                            lessonTypes.map((type) => (
                                                <MenuItem key={type.lessonTypeId} value={type.lessonTypeId}>
                                                    {type.lessonTypeName}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined" disabled={true}>
                                    <InputLabel>Ghi chú</InputLabel>
                                    <Select
                                        value={editedLessonData?.noteId || ''}
                                        onChange={(e) => setEditedLessonData({ ...editedLessonData, noteId: e.target.value })}
                                        label="Ghi chú"
                                    >
                                        {notesError ? (
                                            <MenuItem value="" disabled>{notesError}</MenuItem>
                                        ) : notesLoading ? (
                                            <MenuItem value="" disabled>Đang tải...</MenuItem>
                                        ) : (
                                            notes.map((note) => (
                                                <MenuItem key={note.noteId} value={note.noteId}>
                                                    {note.description}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditLessonDialog} sx={{ color: theme.palette.text.secondary }}>
                        Hủy
                    </Button>
                    <Button onClick={handleSaveEditedLesson} variant="contained" sx={{ bgcolor: colors.primary, color: '#fff' }}>
                        Lưu bài học
                     </Button>
                 </DialogActions>
             </Dialog>
        </Box>
    );
};

export default LessonDetails; 