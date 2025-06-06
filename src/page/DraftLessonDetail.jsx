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
  TextField,
  Fade,
  Zoom
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
import { styled, keyframes } from '@mui/material/styles';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopType, TabStopPosition } from 'docx';
import { saveAs } from 'file-saver';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(158, 158, 158, 0.4);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 0 8px rgba(158, 158, 158, 0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Styled Components
const MainContainer = styled(Box)(({ theme, isDarkMode }) => ({
  minHeight: 'calc(100vh - 64px)',
  background: isDarkMode
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    : 'linear-gradient(135deg, #9E9E9E 0%, #BDBDBD 50%, #9E9E9E 100%)',
  position: 'relative',
  overflow: 'hidden',
  paddingTop: '32px',
  paddingBottom: '32px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isDarkMode
      ? 'radial-gradient(circle at 20% 80%, rgba(158, 158, 158, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(156, 39, 176, 0.1) 0%, transparent 50%)'
      : 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
}));

const FloatingBubble = styled(Box)(({ theme, size, top, left, delay, isDarkMode }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  background: isDarkMode
    ? `rgba(158, 158, 158, ${Math.random() * 0.1 + 0.05})`
    : `rgba(158, 158, 158, ${Math.random() * 0.08 + 0.02})`,
  top: top,
  left: left,
  animation: `${float} ${Math.random() * 8 + 8}s ease-in-out infinite`,
  animationDelay: delay,
  zIndex: 1,
  pointerEvents: 'none',
}));

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

    if (!userInfo?.id) {
      setSnackbar({ open: true, message: 'Không tìm thấy thông tin người dùng.', severity: 'error' });
      return;
    }

    setIsSendingToPending(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      // Clean the data by removing leading colons and extra whitespace
      const cleanText = (text) => {
        if (!text) return '';
        return text.replace(/^:\s*/, '').trim();
      };

      // Prepare the data object
      const apiBody = {
        startUp: cleanText(lessonDetail.startUp),
        knowLedge: cleanText(lessonDetail.knowledge),
        goal: cleanText(lessonDetail.goal),
        schoolSupply: cleanText(lessonDetail.schoolSupply),
        practice: cleanText(lessonDetail.practice),
        apply: cleanText(lessonDetail.apply),
        userId: parseInt(userInfo.id, 10),
        lessonId: parseInt(lessonId, 10)
      };

      // Log the data before sending
      console.log('Sending data:', JSON.stringify(apiBody, null, 2));

      const response = await axios({
        method: 'put',
        url: `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans/${lessonId}/pending`,
        data: apiBody,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
      });

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
      console.error("Error details:", err.response?.data);
      
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
          message: `Lỗi: ${err.response?.data?.message || err.message || 'Không thể gửi Giáo án cho người quản lý chuyên môn.'}`, 
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
    if (!text) return <Typography component="span" sx={{ fontStyle: 'italic', color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>N/A</Typography>;
    return text.split('\n').map((line, index) => 
      line.startsWith('-') || line.startsWith('*') ? 
        <Typography key={index} component="p" sx={{ 
          mb: 0.5, 
          pl: 2, 
          position: 'relative', 
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
          '&::before': { 
            content: '"•"', 
            position: 'absolute', 
            left: 0, 
            color: '#9E9E9E',
            fontWeight: 'bold'
          } 
        }}>{line.substring(1).trim()}</Typography> : 
        <Typography key={index} component="p" sx={{ 
          mb: 1,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
        }}>{line}</Typography>
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
      <Box mb={4} sx={{ animation: `${slideInUp} 0.8s ease-out` }}> 
           <Stack direction="row" alignItems="center" spacing={1} mb={1}>
             {icon} 
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              fontSize: '1.5rem',
              color: isDarkMode ? '#fff' : '#9E9E9E',
              fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
            }}
          >
               {title}
             </Typography>
           </Stack>
        <Divider sx={{ mb: 2, borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(158, 158, 158, 0.2)' }} /> 
        <Box sx={{ pl: 4.5 }}>
             {formatDisplayContent(mainContent)}
             {qualityContent && (
            <Box 
              sx={{
                marginTop: '24px',
                paddingLeft: '16px',
                borderLeft: `4px solid ${isDarkMode ? '#BDBDBD' : '#9E9E9E'}`,
                marginLeft: '-20px',
                paddingTop: '8px',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(158, 158, 158, 0.1) 0%, rgba(158, 158, 158, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(158, 158, 158, 0.05) 0%, rgba(158, 158, 158, 0.02) 100%)',
                borderRadius: '0 12px 12px 0',
                padding: '16px',
              }}
            >
                    <Chip 
                        icon={<CheckCircle fontSize="small"/>} 
                        label="Phẩm chất" 
                        size="small"
                sx={{
                  background: 'linear-gradient(135deg, #9E9E9E 0%, #BDBDBD 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  marginBottom: '12px',
                  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                  '& .MuiChip-icon': {
                    color: '#fff',
                  },
                }}
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
      <Box mb={4} sx={{ animation: `${slideInUp} 0.8s ease-out` }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          {icon}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              fontSize: '1.5rem',
              color: isDarkMode ? '#fff' : '#9E9E9E',
              fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
            }}
          >
            {title}
          </Typography>
        </Stack>
        <Divider sx={{ mb: 2, borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(158, 158, 158, 0.2)' }} />
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
                  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(158, 158, 158, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(158, 158, 158, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#9E9E9E',
                  },
                },
                '& .MuiInputBase-input': {
                  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                },
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
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        animation: `${float} 2s ease-in-out infinite`,
      }}
    >
      <CircularProgress size={60} sx={{ color: '#9E9E9E' }} />
    </Box>
  );

  return (
    <MainContainer isDarkMode={isDarkMode}>
      {/* Floating Bubbles */}
      {[...Array(8)].map((_, index) => (
        <FloatingBubble
          key={index}
          size={Math.random() * 80 + 40}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          delay={`${Math.random() * 5}s`}
          isDarkMode={isDarkMode}
        />
      ))}

      <StyledContainer maxWidth="lg">
        <Fade in timeout={800}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 3,
            color: isDarkMode ? '#ffffff' : '#2D3436',
              fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
              fontWeight: 600,
              borderRadius: '12px',
              padding: '12px 24px',
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(158, 158, 158, 0.2)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(158, 158, 158, 0.1)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          Quay lại danh sách
        </Button>
        </Fade>

        <Zoom in timeout={1000}>
          <Paper
            elevation={0}
            sx={{
              padding: '32px',
              marginBottom: '24px',
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: isDarkMode
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(158, 158, 158, 0.2)',
              boxShadow: isDarkMode
                ? '0 20px 40px rgba(0, 0, 0, 0.3)'
                : '0 20px 40px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              animation: `${fadeIn} 0.8s ease-out`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(158, 158, 158, 0.1), transparent)',
                animation: `${shimmer} 3s ease-in-out infinite`,
              },
            }}
          >
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={3}
        >
              <Stack direction="row" alignItems="center" spacing={2} mb={{ xs: 2, sm: 0 }}>
                <Edit sx={{ color: '#9E9E9E', fontSize: '2.5rem' }} />
                <Box>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                      fontWeight: 800,
                      fontSize: '2.5rem',
                      background: isDarkMode
                        ? 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)'
                        : 'linear-gradient(135deg, #9E9E9E 0%, #757575 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      marginBottom: '8px',
                      letterSpacing: '0.5px',
                    }}
                  >
              Chi Tiết Giáo án Nháp
            </Typography>
                  <Chip
                    icon={<Edit />}
                    label="Nháp"
                    sx={{
                      background: 'linear-gradient(135deg, #9E9E9E 0%, #BDBDBD 100%)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1rem',
                      padding: '8px 16px',
                      height: 'auto',
                      borderRadius: '16px',
                      boxShadow: '0 8px 25px rgba(158, 158, 158, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                      animation: `${pulse} 2s ease-in-out infinite`,
                    }}
                  />
                </Box>
          </Stack>
          <Tooltip title="Xuất ra file Word (.docx)">
            <span>
              <Button 
                variant="contained"
                startIcon={isExporting ? <CircularProgress size={20} color="inherit"/> : <Download />}
                onClick={handleExportToWord}
                disabled={!lessonDetail || isExporting}
                    sx={{
                      background: 'linear-gradient(135deg, #9E9E9E 0%, #BDBDBD 100%)',
                      color: '#fff',
                      fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                      fontWeight: 700,
                      fontSize: '1rem',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      boxShadow: '0 8px 25px rgba(158, 158, 158, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 35px rgba(158, 158, 158, 0.4)',
                      },
                    }}
              >
                {isExporting ? 'Đang xuất...' : 'Xuất ra Word'}
              </Button>
            </span>
          </Tooltip>
        </Stack>
          </Paper>
        </Zoom>

        <Zoom in timeout={1200}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, 
              borderRadius: '20px',
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              border: isDarkMode
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(158, 158, 158, 0.2)',
              boxShadow: isDarkMode
                ? '0 20px 40px rgba(0, 0, 0, 0.3)'
                : '0 20px 40px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              animation: `${fadeIn} 0.8s ease-out`,
          }}
        >
          {loading ? (
            renderSkeletonDetails()
          ) : error ? (
              <Alert severity="error" sx={{ my: 2, borderRadius: '12px', fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif' }}>
                {`Lỗi tải chi tiết: ${error}`}
              </Alert>
          ) : lessonDetail ? (
            <Box p={1}>
              <Stack 
                direction={{ xs: 'column', md: 'row' }} 
                alignItems={{ xs: 'flex-start', md: 'center' }} 
                spacing={1.5} 
                mb={4}
              > 
                <Box flexGrow={1}>
                    <Typography 
                      variant="h4" 
                      component="h1" 
                      sx={{ 
                        fontWeight: 700,
                        fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                        color: isDarkMode ? '#fff' : '#9E9E9E',
                      }}
                    >
                      <Edit sx={{ color: '#9E9E9E', fontSize: '1.8rem', verticalAlign: 'middle', mr: 1 }} />
                    {lessonDetail.lesson || 'Chi Tiết Giáo án Nháp'}
                  </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        pl: 4.5,
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(158, 158, 158, 0.8)',
                        fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                      }}
                    >
                      Trạng thái: Nháp
                    </Typography>
                </Box>
              </Stack>
              
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        padding: '20px',
                        borderRadius: '16px',
                        background: isDarkMode
                          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
                          : 'linear-gradient(135deg, rgba(158, 158, 158, 0.1) 0%, rgba(158, 158, 158, 0.05) 100%)',
                        border: isDarkMode
                          ? '1px solid rgba(255, 255, 255, 0.1)'
                          : '1px solid rgba(158, 158, 158, 0.2)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                          fontWeight: 600,
                          mb: 1
                        }}
                      >
                        Chủ đề:
                      </Typography>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: isDarkMode ? '#fff' : '#9E9E9E',
                          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                          fontWeight: 700
                        }}
                      >
                        {lessonDetail.module || 'N/A'}
                      </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        padding: '20px',
                        borderRadius: '16px',
                        background: isDarkMode
                          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
                          : 'linear-gradient(135deg, rgba(158, 158, 158, 0.1) 0%, rgba(158, 158, 158, 0.05) 100%)',
                        border: isDarkMode
                          ? '1px solid rgba(255, 255, 255, 0.1)'
                          : '1px solid rgba(158, 158, 158, 0.2)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                          fontWeight: 600,
                          mb: 1
                        }}
                      >
                        Ngày gửi:
                      </Typography>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: isDarkMode ? '#fff' : '#9E9E9E',
                          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                          fontWeight: 700
                        }}
                      >
                        {formatDate(lessonDetail.createdAt)}
                      </Typography>
                    </Box>
                </Grid>
              </Grid>
              
                <Divider 
                  sx={{ 
                    my: 4, 
                    borderStyle: 'dashed',
                    borderColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(158, 158, 158, 0.3)',
                    borderWidth: '2px',
                  }} 
                />

              <Stack direction="row" spacing={2} mb={3}>
                {!isEditing ? (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                      sx={{ 
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #9E9E9E 0%, #BDBDBD 100%)',
                        fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                        fontWeight: 600,
                      }}
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
                        sx={{ 
                          borderRadius: '8px',
                          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                          fontWeight: 600,
                        }}
                    >
                      Lưu
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                        sx={{ 
                          borderRadius: '8px',
                          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                          fontWeight: 600,
                        }}
                    >
                      Hủy
                    </Button>
                  </>
                )}
              </Stack>

              {isEditing ? (
                <>
                    {renderEditableSection("Mục tiêu", "goal", <Assignment sx={{ color: '#9E9E9E', fontSize: '1.8rem' }} />)}
                    {renderEditableSection("Giáo viên chuẩn bị", "schoolSupply", <Build sx={{ color: '#9E9E9E', fontSize: '1.8rem' }} />)}
                    {renderEditableSection("Hoạt động Khởi động(5 phút)", "startUp", <Typography sx={{fontWeight: 'bold', color: '#9E9E9E', fontSize: '1.8rem'}}>1.</Typography>)}
                    {renderEditableSection("Hoạt động Hình thành Kiến thức(12 phút)", "knowledge", <Typography sx={{fontWeight: 'bold', color: '#9E9E9E', fontSize: '1.8rem'}}>2.</Typography>)}
                    {renderEditableSection("Hoạt động Luyện tập(15 phút)", "practice", <Typography sx={{fontWeight: 'bold', color: '#9E9E9E', fontSize: '1.8rem'}}>3.</Typography>)}
                    {renderEditableSection("Hoạt động Vận dụng(3 phút)", "apply", <Typography sx={{fontWeight: 'bold', color: '#9E9E9E', fontSize: '1.8rem'}}>4.</Typography>)}
                </>
              ) : (
                <>
                    {renderDetailSection("Mục tiêu", lessonDetail.goal, <Assignment sx={{ color: '#9E9E9E', fontSize: '1.8rem' }} />)}
                    {renderDetailSection("Giáo viên chuẩn bị", lessonDetail.schoolSupply, <Build sx={{ color: '#9E9E9E', fontSize: '1.8rem' }} />)}
                    {renderDetailSection("Hoạt động Khởi động(5 phút)", lessonDetail.startUp, <Typography sx={{fontWeight: 'bold', color: '#9E9E9E', fontSize: '1.8rem'}}>1.</Typography>)}
                    {renderDetailSection("Hoạt động Hình thành Kiến thức(12 phút)", lessonDetail.knowledge, <Typography sx={{fontWeight: 'bold', color: '#9E9E9E', fontSize: '1.8rem'}}>2.</Typography>)}
                    {renderDetailSection("Hoạt động Luyện tập(15 phút)", lessonDetail.practice, <Typography sx={{fontWeight: 'bold', color: '#9E9E9E', fontSize: '1.8rem'}}>3.</Typography>)}
                    {renderDetailSection("Hoạt động Vận dụng(3 phút)", lessonDetail.apply, <Typography sx={{fontWeight: 'bold', color: '#9E9E9E', fontSize: '1.8rem'}}>4.</Typography>)}
                </>
              )}
              
              {lessonDetail.disapprovedReason && (
                <Box mb={4}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <Cancel color="error" />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          color: 'error.main',
                          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                        }}
                      >
                      Lý do từ chối
                    </Typography>
                  </Stack>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ pl: 4.5 }}>
                      <Typography sx={{ fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif' }}>
                        {lessonDetail.disapprovedReason}
                      </Typography>
                  </Box>
                </Box>
              )}
              
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
                        boxShadow: 3,
                        fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                        fontWeight: 700,
                    }}
                  >
                    {isSendingToPending ? 'Đang xử lý...' : 'Gửi cho người quản lý chuyên môn'}
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          ) : (
               <Alert severity="warning" sx={{ borderRadius: '12px', fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif' }}>
                 Không tìm thấy chi tiết Giáo án.
               </Alert>
          )}
        </Paper>
        </Zoom>
      </StyledContainer>

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
    </MainContainer>
  );
};

export default DraftLessonDetail; 