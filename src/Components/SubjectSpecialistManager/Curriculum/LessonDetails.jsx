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

const LessonDetails = ({ lessons, theme, colors, moduleId, fetchLessons }) => {
    // Sort lessons by lessonId in ascending order
    const sortedLessons = lessons ? [...lessons].sort((a, b) => a.lessonId - b.lessonId) : [];

    // State for controlling the add lesson dialog
    const [openAddLessonDialog, setOpenAddLessonDialog] = useState(false);
    const [newLessonData, setNewLessonData] = useState(null);

    // State for controlling view lesson details dialog
    const [openLessonDetailsDialog, setOpenLessonDetailsDialog] = useState(false);
    const [lessonDetails, setLessonDetails] = useState(null);

    // State for controlling delete lesson confirmation dialog
    const [openDeleteLessonConfirmDialog, setOpenDeleteLessonConfirmDialog] = useState(false);
    const [lessonToDelete, setLessonToDelete] = useState(null);

    // State for controlling edit lesson dialog
    const [openEditLessonDialog, setOpenEditLessonDialog] = useState(false);
    const [editedLessonData, setEditedLessonData] = useState(null);

    // Handler for opening add lesson dialog
    const handleOpenAddLessonDialog = () => {
        setOpenAddLessonDialog(true);
        // Initialize new lesson data
        setNewLessonData({
            name: '',
            description: '',
            totalPeriods: 1, // Default to 1 tiết
            lessonTypeId: 1, // Default or get from list
            noteId: 1, // Default or get from list
            weekId: 1, // Default or get from list
            moduleId: moduleId // Use moduleId prop
        });
    };

    // Handler for closing add lesson dialog
    const handleCloseAddLessonDialog = () => {
        setOpenAddLessonDialog(false);
        setNewLessonData(null); // Clear form data
    };

    // Handler for opening edit lesson dialog
    const handleOpenEditLessonDialog = async (lessonId) => {
        try {
            const response = await axios.get(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons/${lessonId}/info`
            );

            if (response.data.code === 0 && response.data.data) {
                console.log('Fetched Lesson Details for Editing:', response.data.data);
                // Populate state with fetched data
                setEditedLessonData({ ...response.data.data });
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

    // Handler for saving new lesson
    const handleSaveNewLesson = async () => {
        if (newLessonData && moduleId) { // Use moduleId prop
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await axios.post(
                    'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons', newLessonData,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );

                console.log('Create Lesson API Response Code:', response.data.code);

                if (response.data.code === 0 || response.data.code === 21) { // Assuming 21 might also indicate success for creation
                    console.log(`Lesson created successfully for module ${moduleId}:`, response.data.data); // Use moduleId prop
                    // Refetch lessons for the current module to update the list
                    fetchLessons(moduleId); // Use fetchLessons prop
                    // Close dialog
                    handleCloseAddLessonDialog();
                } else {
                    console.error(`Error creating lesson for module ${moduleId}:`, response.data.message);
                    alert(`Tạo mới bài học thất bại: ${response.data.message}`);
                }
            } catch (error) {
                console.error(`Error creating lesson for module ${moduleId}:`, error);
                alert(`Đã xảy ra lỗi khi tạo mới bài học.`);
            }
        } else {
            console.error('No lesson data or module ID to save.');
            alert('Không có dữ liệu bài học hoặc ID chủ đề để lưu.');
        }
    };

    // Handler for viewing lesson details
    const handleViewLessonDetails = async (lessonId) => {
        try {
            const response = await axios.get(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons/${lessonId}/info`
            );

            if (response.data.code === 0 && response.data.data) {
                console.log('Lesson Details:', response.data.data);
                setLessonDetails(response.data.data);
                setOpenLessonDetailsDialog(true);
            } else {
                console.error(`Error fetching lesson details for ${lessonId}:`, response.data.message);
                alert(`Lỗi khi lấy chi tiết bài học: ${response.data.message}`);
            }
        } catch (error) {
            console.error(`Error fetching lesson details for ${lessonId}:`, error);
            alert(`Đã xảy ra lỗi khi lấy chi tiết bài học.`);
        }
    };

    // Handler for closing view lesson details dialog
    const handleCloseLessonDetailsDialog = () => {
        setLessonDetails(null);
        setOpenLessonDetailsDialog(false);
    };

    // Handler for opening delete lesson confirmation dialog
    const handleOpenDeleteLessonConfirmDialog = (lesson) => {
        setLessonToDelete(lesson);
        setOpenDeleteLessonConfirmDialog(prev => true);
    };

    // Handler for closing delete lesson confirmation dialog
    const handleCloseDeleteLessonConfirmDialog = () => {
        setLessonToDelete(null);
        setOpenDeleteLessonConfirmDialog(false);
    };

    // Handler for deleting a lesson
    const handleDeleteLesson = async (lessonId) => {
        console.log('Attempting to delete lesson with ID:', lessonId);
        if (!moduleId) { // Ensure moduleId is available
             console.error('Module ID not available for deleting lesson.');
             alert('Không có ID chủ đề để xóa bài học.');
             return;
        }
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.delete(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons/${lessonId}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            console.log('Delete Lesson API Response Code:', response.data.code);

            if (response.data.code === 0 || response.data.code === 31) { // Assuming 31 might indicate success for deletion
                console.log(`Lesson ${lessonId} deleted successfully.`);
                // Refetch lessons for the current module to update the list
                fetchLessons(moduleId); // Use fetchLessons prop
                // Close the delete confirmation dialog
                handleCloseDeleteLessonConfirmDialog();
            } else {
                console.error(`Error deleting lesson ${lessonId}:`, response.data.message);
                alert(`Xóa bài học thất bại: ${response.data.message}`);
            }
        } catch (error) {
            console.error(`Error deleting lesson ${lessonId}:`, error);
            alert(`Đã xảy ra lỗi khi xóa bài học.`);
        }
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

                if (response.data.code === 0 || response.data.code === 21) {
                    console.log(`Lesson ${editedLessonData.lessonId} updated successfully.`);
                    // Refetch lessons for the current module to update the list
                    fetchLessons(moduleId); // Use fetchLessons prop
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
        <Box sx={{ margin: 1, p: 2, bgcolor: theme.palette.background.secondary, borderRadius: 1 }}>
            {sortedLessons.length > 0 && (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 'bold',
                    py: 1,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.text.primary,
                    fontSize: '0.875rem', // Match List Item font size if needed
                }}>
                    {/* STT and Tên bài học */}
                    <Box sx={{
                        flexGrow: 1,
                        marginRight: 1,
                        // Adjust width based on ListItemText properties if necessary
                    }}>
                        STT Tên bài học
                    </Box>
                    {/* Số tiết - match InfoChip layout */}
                    <Box sx={{
                        // Use flex property to control size and shrinking
                        flex: '0 0 auto', // Prevent growing, allow shrinking, base size auto
                        marginRight: 1,
                        textAlign: 'center', // Center text
                    }}>
                        Số tiết
                     </Box>
                     {/* Thao tác - match Action Icons Box layout */}
                      <Box sx={{
                          flexShrink: 0,
                          // Use flex property to control size and shrinking
                          flex: '0 0 auto', // Prevent growing, allow shrinking, base size auto
                          textAlign: 'center', // Center text
                      }}>
                          Thao tác
                      </Box>
                 </Box>
             )}
            {sortedLessons.length > 0 ? (
                <List dense={true}>
                    {sortedLessons.map((lesson, index) => (
                        <ListItem 
                            key={lesson.lessonId} 
                            sx={{ 
                                py: 0.5, 
                                display: 'flex',
                                 alignItems: 'center',
                            }}
                        >
                            <ListItemText 
                                primary={`${index + 1}. ${lesson.name}`} 
                                 primaryTypographyProps={{
                                     color: theme.palette.text.primary,
                                     fontWeight: 500,
                                     overflow: 'hidden',
                                     textOverflow: 'ellipsis',
                                     whiteSpace: 'nowrap',
                                     flexGrow: 1,
                                     marginRight: 1
                                 }} 
                            />
                            <InfoChip
                                icon={<AccessTimeIcon fontSize="small" sx={{ color: colors.primary }} />} 
                                label={`${lesson.totalPeriods} tiết`} 
                                colors={colors}
                                 sx={{
                                     marginRight: 1,
                                     flexShrink: 0
                                 }}
                             />
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                                 <IconButton
                                     size="small"
                                     onClick={() => handleViewLessonDetails(lesson.lessonId)}
                                     sx={{
                                         color: colors.primary,
                                         '&:hover': {
                                             bgcolor: colors.hover.primary
                                         }
                                     }}
                                 >
                                     <VisibilityIcon fontSize="small" />
                                 </IconButton>
                                 {/* Edit Icon Button */}
                                 <IconButton
                                     size="small"
                                     onClick={() => handleOpenEditLessonDialog(lesson.lessonId)}
                                     sx={{
                                         color: colors.primary, // Use colors prop
                                         '&:hover': {
                                             bgcolor: colors.hover.primary // Use colors prop
                                         }
                                     }}
                                 >
                                     <EditIcon fontSize="small" />
                                 </IconButton>
                                 <IconButton
                                     size="small"
                                     onClick={() => handleOpenDeleteLessonConfirmDialog(lesson)}
                                     sx={{
                                         color: colors.error,
                                         '&:hover': {
                                             bgcolor: colors.hover.error
                                         }
                                     }}
                                 >
                                     <DeleteIcon fontSize="small" />
                                 </IconButton>
                             </Box>
                        </ListItem>
                    ))}
                </List>
            ) : (
                 <Typography sx={{ color: theme.palette.text.secondary, mb: 2 }}>Không có bài học nào cho chủ đề này.</Typography>
            )}
             {/* Add Lesson Button for this module */}
             <Box sx={{ textAlign: 'right', mt: 2 }}>
                 <StyledButton
                     variant="outlined"
                     onClick={handleOpenAddLessonDialog} // No need to pass moduleId here, it's in state
                     startIcon={<AddIcon />}
                     size="small"
                     colors={colors}
                 >
                     Thêm bài học
                 </StyledButton>
             </Box>

             {/* Add Lesson Dialog */}
             <Dialog
                 open={openAddLessonDialog}
                 onClose={handleCloseAddLessonDialog}
                 maxWidth="sm"
                 fullWidth
             >
                 <DialogTitle>
                     <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                         Thêm Bài học Mới
                     </Typography>
                 </DialogTitle>
                 <DialogContent dividers>
                     <Box sx={{ mt: 2 }}>
                         <Grid container spacing={2}>
                             <Grid item xs={12}>
                                 <TextField
                                     fullWidth
                                     label="Tên bài học"
                                     value={newLessonData?.name || ''}
                                     onChange={(e) => setNewLessonData({ ...newLessonData, name: e.target.value })}
                                     variant="outlined"
                                 />
                             </Grid>
                             <Grid item xs={12}>
                                 <TextField
                                     fullWidth
                                     label="Mô tả"
                                     value={newLessonData?.description || ''}
                                     onChange={(e) => setNewLessonData({ ...newLessonData, description: e.target.value })}
                                     variant="outlined"
                                     multiline
                                     rows={3}
                                 />
                             </Grid>
                             <Grid item xs={12} sm={6}>
                                 <TextField
                                     fullWidth
                                     label="Tổng số tiết"
                                     type="number"
                                     value={newLessonData?.totalPeriods || ''}
                                     onChange={(e) => setNewLessonData({ ...newLessonData, totalPeriods: parseInt(e.target.value, 10) || '' })}
                                     variant="outlined"
                                     inputProps={{ min: 1 }}
                                 />
                             </Grid>
                             {/* lessonTypeId, noteId, weekId are set as default in handleOpenAddLessonDialog */}
                         </Grid>
                     </Box>
                 </DialogContent>
                 <DialogActions>
                     <Button onClick={handleCloseAddLessonDialog} sx={{ color: theme.palette.text.secondary }}>
                         Hủy
                     </Button>
                     <Button onClick={handleSaveNewLesson} variant="contained" sx={{ bgcolor: colors.primary, color: '#fff' }}>
                         Lưu bài học
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
                     {editedLessonData && (
                         <Box sx={{ mt: 2 }}>
                             <Grid container spacing={2}>
                                 <Grid item xs={12}>
                                     <TextField
                                         fullWidth
                                         label="Tên bài học"
                                         value={editedLessonData.name || ''}
                                         onChange={(e) => setEditedLessonData({ ...editedLessonData, name: e.target.value })}
                                         variant="outlined"
                                     />
                                 </Grid>
                                 <Grid item xs={12}>
                                     <TextField
                                         fullWidth
                                         label="Mô tả"
                                         value={editedLessonData.description || ''}
                                         onChange={(e) => setEditedLessonData({ ...editedLessonData, description: e.target.value })}
                                         variant="outlined"
                                         multiline
                                         rows={3}
                                     />
                                 </Grid>
                                 <Grid item xs={12} sm={6}>
                                     <TextField
                                         fullWidth
                                         label="Tổng số tiết"
                                         type="number"
                                         value={editedLessonData.totalPeriods || ''}
                                         onChange={(e) => setEditedLessonData({ ...editedLessonData, totalPeriods: parseInt(e.target.value, 10) || '' })}
                                         variant="outlined"
                                         inputProps={{ min: 0 }}
                                     />
                                 </Grid>
                                 {/* Add other fields like lesson type, note, week, module here if needed */}
                             </Grid>
                         </Box>
                     )}
                 </DialogContent>
                 <DialogActions>
                     <Button onClick={handleCloseEditLessonDialog} sx={{ color: theme.palette.text.secondary }}>
                         Hủy
                     </Button>
                     <Button onClick={handleSaveEditedLesson} variant="contained" sx={{ bgcolor: colors.primary, color: '#fff' }}>
                         Lưu thay đổi
                     </Button>
                 </DialogActions>
             </Dialog>

             {/* View Lesson Details Dialog */}
             <Dialog
                 open={openLessonDetailsDialog}
                 onClose={handleCloseLessonDetailsDialog}
                 maxWidth="sm"
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
                                         {lessonDetails.week && (
                                             <InfoChip
                                                 icon={<DateRangeIcon />} 
                                                 label={`Tuần: ${lessonDetails.week}`}
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
                                     Thông tin chi tiết khác
                                 </Typography>
                                 <Grid container spacing={1}>
                                     <Grid item xs={12} sm={6}> 
                                         <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                             <strong>Mô tả:</strong> {lessonDetails.description}
                                         </Typography>
                                     </Grid>
                                      <Grid item xs={12} sm={6}> 
                                         <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                             <strong>Tổng số tiết:</strong> {lessonDetails.totalPeriods}
                                         </Typography>
                                     </Grid>
                                      {/* lessonType, note, week, module, gradeNumber details */}
                                      <Grid item xs={12} sm={6}> 
                                         <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                             <strong>Loại bài học:</strong> {lessonDetails.lessonType}
                                         </Typography>
                                     </Grid>
                                      <Grid item xs={12} sm={6}> 
                                         <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                             <strong>Ghi chú:</strong> {lessonDetails.note}
                                         </Typography>
                                     </Grid>
                                     <Grid item xs={12} sm={6}> 
                                         <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                             <strong>Tuần:</strong> {lessonDetails.week}
                                         </Typography>
                                     </Grid>
                                      <Grid item xs={12} sm={6}> 
                                         <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                             <strong>Chủ đề:</strong> {lessonDetails.module}
                                         </Typography>
                                     </Grid>
                                      <Grid item xs={12} sm={6}> 
                                         <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                             <strong>Khối:</strong> {lessonDetails.gradeNumber}
                                         </Typography>
                                     </Grid>
                                 </Grid>
                             </Box>
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
                         Xác nhận Xóa Bài học
                     </Typography>
                 </DialogTitle>
                 <DialogContent dividers>
                     <Typography sx={{ color: theme.palette.text.secondary }}>
                         Bạn có chắc chắn muốn xóa bài học "{lessonToDelete?.name}" không? Hành động này không thể hoàn tác.
                     </Typography>
                 </DialogContent>
                 <DialogActions>
                     <Button onClick={handleCloseDeleteLessonConfirmDialog} sx={{ color: theme.palette.text.secondary }}>
                         Hủy
                     </Button>
                     <Button
                         onClick={async () => {
                             console.log('Delete button clicked in dialog.');
                             if (lessonToDelete) { // Check only lessonToDelete
                                 await handleDeleteLesson(lessonToDelete.lessonId);
                             }
                         }}
                         variant="contained"
                         sx={{ bgcolor: colors.error, color: '#fff' }}
                     >
                         Xóa
                     </Button>
                 </DialogActions>
             </Dialog>
        </Box>
    );
};

export default LessonDetails; 