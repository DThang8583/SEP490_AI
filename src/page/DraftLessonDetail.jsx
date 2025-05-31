import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  CircularProgress, 
  Alert, 
  Paper,
  Button,
  Divider,
  Grid,
  Stack,
  Skeleton,
  IconButton,
  Tooltip,
  Chip,
  Snackbar,
  TextField
} from '@mui/material';
import { 
  ArrowBack, 
  Edit, 
  Assignment, 
  School as SchoolIcon, 
  Event as EventIcon, 
  Description, 
  Download,
  CheckCircle,
  Build,
  AccessTime,
  Cancel,
  Close as CloseIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopType, TabStopPosition } from 'docx';
import { saveAs } from 'file-saver';

// Helper function to create a URL/filename-friendly slug
const slugify = (str) => {
  if (!str) return '';
  str = str.toString().toLowerCase().trim();

  // Convert Vietnamese characters to non-diacritic equivalents
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');

  // Replace spaces with underscores and remove remaining invalid characters
  return str
    .replace(/\s+/g, '_') // Replace spaces with _
    .replace(/[^\w-]+/g, '') // Remove all non-word chars except underscore
    .replace(/--+/g, '_') // Replace multiple underscores with single _
    .replace(/^-+/, '') // Trim underscore from start of text
    .replace(/-+$/, ''); // Trim underscore from end of text
};

// Reusing the formatDate function (or import if shared)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return dateString;
};

const DraftLessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const { isDarkMode, theme } = useTheme();

  const [lessonDetail, setLessonDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [isSendingToPending, setIsSendingToPending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    startUp: '',
    knowledge: '',
    goal: '',
    schoolSupply: '',
    practice: '',
    apply: ''
  });

  const fetchLessonDetail = useCallback(async () => {
    if (!lessonId) {
      setError("Lesson ID not found in URL.");
      setLoading(false);
      return;
    }
    if (!userInfo?.id) {
      setError("User not logged in or user ID not found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      // API endpoint for fetching draft lesson details
      const response = await axios.get(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans/${lessonId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          timeout: 15000
        }
      );
        
      if (response.data && response.data.code === 0) {
         // Assuming the details are in response.data.data
         setLessonDetail(response.data.data || null); 
      } else {
        throw new Error(response.data.message || "Failed to fetch lesson details.");
      }
    } catch (err) {
      console.error("Error fetching lesson detail:", err);
      setError(err.message || "An error occurred while fetching lesson details.");
      setLessonDetail(null); 
    } finally {
      setLoading(false);
    }
  }, [lessonId, userInfo?.id]);

  useEffect(() => {
    fetchLessonDetail();
  }, [fetchLessonDetail]);

  // Function to generate and download Word document
  const handleExportToWord = async () => {
    if (!lessonDetail) {
      setSnackbar({ open: true, message: 'Không có dữ liệu Giáo án để xuất.', severity: 'warning' });
      return;
    }

    setIsExporting(true);
    setSnackbar({ open: false, message: '', severity: 'info' });

    try {
      // Helper to split goal into main and phamchat
      const splitGoalAndQuality = (goalText) => {
          const qualityHeader = "c) Phẩm chất:";
          const index = goalText?.toLowerCase().indexOf(qualityHeader.toLowerCase());
          if (index !== -1) {
              return {
                  mainGoal: goalText.substring(0, index).trim(),
                  quality: goalText.substring(index + qualityHeader.length).trim()
              };
          }
          return { mainGoal: goalText || '', quality: '' }; // Return full goal if header not found
      };
      
      const { mainGoal, quality } = splitGoalAndQuality(lessonDetail.goal);
      
      const formatContent = (text) => {
        if (!text) return [new Paragraph("")];
        return text.split('\n').map(line => {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
            return new Paragraph({ text: trimmedLine.substring(1).trim(), bullet: { level: 0 } });
          } else if (trimmedLine) {
            return new Paragraph(trimmedLine);
          }
          return null;
        }).filter(p => p !== null);
      };

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({ text: lessonDetail.lesson || 'Giáo án', heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
            new Paragraph({ text: `Chủ đề: ${lessonDetail.module || 'N/A'}`, heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: `Ngày gửi: ${formatDate(lessonDetail.createdAt)}`, style: "SubtleReference" }),
            new Paragraph({ text: "", spacing: { after: 200 } }),

            new Paragraph({ text: "1. Mục tiêu", heading: HeadingLevel.HEADING_1 }),
            ...formatContent(mainGoal), // Use main goal content
            ...(quality ? [
                new Paragraph({ text: "Phẩm chất:", heading: HeadingLevel.HEADING_3 }), // Add Phẩm chất as sub-heading
                ...formatContent(quality) // Use quality content
            ] : []), // Only add if quality content exists
            new Paragraph({ text: "", spacing: { after: 200 } }),

            // Corrected numbering and title
            new Paragraph({ text: "2. Giáo viên chuẩn bị", heading: HeadingLevel.HEADING_1 }), 
            ...formatContent(lessonDetail.schoolSupply),
            new Paragraph({ text: "", spacing: { after: 200 } }),

            // Corrected numbering
            new Paragraph({ text: "3. Tiến trình Giáo án", heading: HeadingLevel.HEADING_1 }), 
            new Paragraph({ text: "a) Hoạt động Khởi động(5 phút)", heading: HeadingLevel.HEADING_2 }),
            ...formatContent(lessonDetail.startUp),
            new Paragraph({ text: "b) Hoạt động Hình thành Kiến thức(12 phút)", heading: HeadingLevel.HEADING_2 }),
            ...formatContent(lessonDetail.knowledge),
            new Paragraph({ text: "c) Hoạt động Luyện tập(15 phút)", heading: HeadingLevel.HEADING_2 }),
            ...formatContent(lessonDetail.practice),
            new Paragraph({ text: "d) Hoạt động Vận dụng(3 phút)", heading: HeadingLevel.HEADING_2 }),
            ...formatContent(lessonDetail.apply),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      // Use slugify for a cleaner filename
      const cleanLessonTitle = slugify(lessonDetail.lesson || 'BaiGiang');
      const fileName = `BaiGiang_${cleanLessonTitle || lessonId}.docx`;
      saveAs(blob, fileName);

      setSnackbar({ open: true, message: 'Xuất file Word thành công!', severity: 'success' });

    } catch (err) {
      console.error("Error exporting to Word:", err);
      setSnackbar({ open: true, message: 'Lỗi khi xuất file Word.', severity: 'error' });
    } finally {
      setIsExporting(false);
    }
  };

  // Function to send lesson to subject manager
  const handleSendToPending = async () => {
    if (!lessonId) {
      setSnackbar({ open: true, message: 'Không tìm thấy ID Giáo án.', severity: 'error' });
      return;
    }

    setIsSendingToPending(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await axios.post(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans/${lessonId}/pending`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      // Check for success conditions
      if (response.data && (response.data.code === 0 || response.data.message === "Updated successfully!" || response.data.message === "Updated successfully")) {
        setSnackbar({ 
          open: true, 
          message: 'Đã gửi Giáo án cho người quản lý chuyên môn thành công!', 
          severity: 'success' 
        });
        
        // Navigate back to pending lessons page after a short delay
        setTimeout(() => {
          navigate('/giao-an-cho-duyet');
        }, 1500);
      } else {
        throw new Error(response.data.message || "Failed to send lesson to pending status.");
      }
    } catch (err) {
      console.error("Error sending lesson to pending:", err);
      
      // Check if the error message is actually a success message
      if (err.message === "Updated successfully!" || err.message === "Updated successfully") {
        setSnackbar({ 
          open: true, 
          message: 'Đã gửi Giáo án cho người quản lý chuyên môn thành công!', 
          severity: 'success' 
        });
        
        // Navigate back to pending lessons page after a short delay
        setTimeout(() => {
          navigate('/giao-an-cho-duyet');
        }, 1500);
      } else {
        setSnackbar({ 
          open: true, 
          message: `Lỗi: ${err.message || 'Không thể gửi Giáo án cho người quản lý chuyên môn.'}`, 
          severity: 'error' 
        });
      }
    } finally {
      setIsSendingToPending(false);
    }
  };

  const handleEdit = () => {
    setEditedData({
      startUp: lessonDetail.startUp || '',
      knowledge: lessonDetail.knowledge || '',
      goal: lessonDetail.goal || '',
      schoolSupply: lessonDetail.schoolSupply || '',
      practice: lessonDetail.practice || '',
      apply: lessonDetail.apply || ''
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await axios.put(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans/${lessonId}`,
        editedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && (response.data.code === 0 || response.data.message === "Updated successfully!")) {
        setSnackbar({
          open: true,
          message: 'Cập nhật Giáo án thành công!',
          severity: 'success'
        });
        setIsEditing(false);
        fetchLessonDetail(); // Refresh the data
      } else {
        throw new Error(response.data?.message || "Failed to update lesson.");
      }
    } catch (err) {
      console.error("Error updating lesson:", err);
      setSnackbar({
        open: true,
        message: `Lỗi: ${err.message || 'Không thể cập nhật Giáo án.'}`,
        severity: 'error'
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({
      startUp: '',
      knowledge: '',
      goal: '',
      schoolSupply: '',
      practice: '',
      apply: ''
    });
  };

  const formatDisplayContent = (text) => {
    if (!text) return <Typography component="span" sx={{ fontStyle: 'italic' }}>N/A</Typography>;
    return text.split('\n').map((line, index) => 
      line.startsWith('-') || line.startsWith('*') ? 
        <Typography key={index} component="p" sx={{ mb: 0.5, pl: 2, position: 'relative', '&::before': { content: '"•"', position: 'absolute', left: 0, color: 'text.primary' } }}>{line.substring(1).trim()}</Typography> : 
        <Typography key={index} component="p" sx={{ mb: 1 }}>{line}</Typography>
    );
  };

  const renderDetailSection = (title, content, icon) => {
    let mainContent = content || '';
    let qualityContent = '';

    if (title === "Mục tiêu" && content) {
        const qualityHeader = "c) Phẩm chất:";
        const index = content.toLowerCase().indexOf(qualityHeader.toLowerCase());
        if (index !== -1) {
            mainContent = content.substring(0, index).trim();
            qualityContent = content.substring(index + qualityHeader.length).trim();
        }
    }

    return (
        <Box mb={4}> 
           <Stack direction="row" alignItems="center" spacing={1} mb={1}>
             {icon} 
             <Typography variant="h6" sx={{ fontWeight: 600, color: isDarkMode ? 'primary.light' : 'primary.dark' }}>
               {title}
             </Typography>
           </Stack>
          <Divider sx={{ mb: 2 }} /> 
          <Box sx={{ pl: 4.5 }}> {/* Indent content */}
             {formatDisplayContent(mainContent)}
             {qualityContent && (
                <Box mt={2} pl={2} borderLeft={theme?.palette ? `3px solid ${theme.palette.secondary.main}` : '3px solid grey'} ml={-2.5} pt={0.5} > {/* Highlight Quality section */} 
                    <Chip 
                        icon={<CheckCircle fontSize="small"/>} 
                        label="Phẩm chất" 
                        color="secondary"
                        size="small"
                        sx={{ mb: 1.5, fontWeight: 500 }}
                    />
                     {formatDisplayContent(qualityContent)}
                </Box>
             )}
          </Box>
        </Box>
      );
  }

  const renderEditableSection = (title, field, icon) => {
    return (
      <Box mb={4}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          {icon}
          <Typography variant="h6" sx={{ fontWeight: 600, color: isDarkMode ? 'primary.light' : 'primary.dark' }}>
            {title}
          </Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ pl: 4.5 }}>
          {isEditing ? (
            <TextField
              fullWidth
              multiline
              rows={4}
              value={editedData[field]}
              onChange={(e) => setEditedData({ ...editedData, [field]: e.target.value })}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                }
              }}
            />
          ) : (
            formatDisplayContent(lessonDetail[field])
          )}
        </Box>
      </Box>
    );
  };

  const renderSkeletonDetails = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ 
        py: 4, 
        minHeight: 'calc(100vh - 64px)',
        background: isDarkMode
          ? 'linear-gradient(135deg, rgb(18, 18, 18) 0%, rgb(30, 30, 30) 100%)'
          : 'linear-gradient(135deg, rgb(245, 247, 250) 0%, rgb(255, 255, 255) 100%)',
     }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 3,
            color: isDarkMode ? '#ffffff' : '#2D3436',
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          Quay lại danh sách
        </Button>

        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          mb={3}
          sx={{ px: { xs: 2, sm: 3, md: 0 } }} 
        >
          <Stack direction="row" alignItems="center" spacing={1.5} mb={{ xs: 2, sm: 0 }}> 
            <Edit sx={{ color: 'info.main', fontSize: '2.2rem' }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Chi Tiết Giáo án Nháp
            </Typography>
          </Stack>
          <Tooltip title="Xuất ra file Word (.docx)">
            <span>
              <Button 
                variant="contained"
                color="primary"
                startIcon={isExporting ? <CircularProgress size={20} color="inherit"/> : <Download />}
                onClick={handleExportToWord}
                disabled={!lessonDetail || isExporting}
              >
                {isExporting ? 'Đang xuất...' : 'Xuất ra Word'}
              </Button>
            </span>
          </Tooltip>
        </Stack>

        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, 
            borderRadius: '16px',
            backgroundColor: isDarkMode ? 'rgba(40, 40, 40, 0.85)' : 'rgba(255, 255, 255, 0.85)', 
            backdropFilter: 'blur(12px)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
            boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(0,0,0,0.05)',
          }}
        >
          {loading ? (
            renderSkeletonDetails()
          ) : error ? (
            <Alert severity="error" sx={{ my: 2 }}>{`Lỗi tải chi tiết: ${error}`}</Alert>
          ) : lessonDetail ? (
            <Box p={1}>
              <Stack 
                direction={{ xs: 'column', md: 'row' }} 
                alignItems={{ xs: 'flex-start', md: 'center' }} 
                spacing={1.5} 
                mb={4}
              > 
                <Box flexGrow={1}>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                    <Edit sx={{ color: 'info.main', fontSize: '1.8rem', verticalAlign: 'middle', mr: 1 }} />
                    {lessonDetail.lesson || 'Chi Tiết Giáo án Nháp'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ pl: 4.5 }}>Trạng thái: Nháp</Typography>
                </Box>
              </Stack>
              
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6}>
                   <Typography variant="body2" color="text.secondary">Chủ đề:</Typography>
                   <Typography variant="h6">{lessonDetail.module || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                   <Typography variant="body2" color="text.secondary">Ngày gửi:</Typography>
                   <Typography variant="h6">{formatDate(lessonDetail.createdAt)}</Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 4, borderStyle: 'dashed' }} />

              <Stack direction="row" spacing={2} mb={3}>
                {!isEditing ? (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                    sx={{ borderRadius: '8px' }}
                  >
                    Chỉnh sửa
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={handleSave}
                      sx={{ borderRadius: '8px' }}
                    >
                      Lưu
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      sx={{ borderRadius: '8px' }}
                    >
                      Hủy
                    </Button>
                  </>
                )}
              </Stack>

              {isEditing ? (
                <>
                  {renderEditableSection("Mục tiêu", "goal", <Assignment color="primary" />)}
                  {renderEditableSection("Giáo viên chuẩn bị", "schoolSupply", <Build color="action"/>)}
                  {renderEditableSection("Hoạt động Khởi động(5 phút)", "startUp", <Typography sx={{fontWeight: 'bold', color: 'info.main'}}>1.</Typography>)}
                  {renderEditableSection("Hoạt động Hình thành Kiến thức(12 phút)", "knowledge", <Typography sx={{fontWeight: 'bold', color: 'info.main'}}>2.</Typography>)}
                  {renderEditableSection("Hoạt động Luyện tập(15 phút)", "practice", <Typography sx={{fontWeight: 'bold', color: 'info.main'}}>3.</Typography>)}
                  {renderEditableSection("Hoạt động Vận dụng(3 phút)", "apply", <Typography sx={{fontWeight: 'bold', color: 'info.main'}}>4.</Typography>)}
                </>
              ) : (
                <>
                  {renderDetailSection("Mục tiêu", lessonDetail.goal, <Assignment color="primary" />)}
                  {renderDetailSection("Giáo viên chuẩn bị", lessonDetail.schoolSupply, <Build color="action"/>)}
                  {renderDetailSection("Hoạt động Khởi động(5 phút)", lessonDetail.startUp, <Typography sx={{fontWeight: 'bold', color: 'info.main'}}>1.</Typography>)}
                  {renderDetailSection("Hoạt động Hình thành Kiến thức(12 phút)", lessonDetail.knowledge, <Typography sx={{fontWeight: 'bold', color: 'info.main'}}>2.</Typography>)}
                  {renderDetailSection("Hoạt động Luyện tập(15 phút)", lessonDetail.practice, <Typography sx={{fontWeight: 'bold', color: 'info.main'}}>3.</Typography>)}
                  {renderDetailSection("Hoạt động Vận dụng(3 phút)", lessonDetail.apply, <Typography sx={{fontWeight: 'bold', color: 'info.main'}}>4.</Typography>)}
                </>
              )}
              
              {lessonDetail.disapprovedReason && (
                <Box mb={4}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <Cancel color="error" />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                      Lý do từ chối
                    </Typography>
                  </Stack>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ pl: 4.5 }}>
                    <Typography>{lessonDetail.disapprovedReason}</Typography>
                  </Box>
                </Box>
              )}
              
              {/* Add the "Gửi cho người quản lý chuyên môn" button at the bottom */}
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Tooltip title="Gửi cho người quản lý chuyên môn">
                  <Button 
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={isSendingToPending ? <CircularProgress size={20} color="inherit"/> : <SendIcon />}
                    onClick={handleSendToPending}
                    disabled={isSendingToPending}
                    sx={{ 
                      minWidth: '300px',
                      py: 1.5,
                      boxShadow: 3
                    }}
                  >
                    {isSendingToPending ? 'Đang xử lý...' : 'Gửi cho người quản lý chuyên môn'}
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          ) : (
             <Alert severity="warning">Không tìm thấy chi tiết Giáo án.</Alert>
          )}
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DraftLessonDetail; 