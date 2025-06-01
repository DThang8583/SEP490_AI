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
  Fab,
  Fade,
  Zoom
} from '@mui/material';
import { 
  ArrowBack, 
  CheckCircle, 
  Assignment, 
  School as SchoolIcon, 
  Event as EventIcon, 
  Description, 
  Download,
  Build,
  Upload,
  Add as AddIcon,
  Create as CreateIcon,
  Verified
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { styled, keyframes } from '@mui/material/styles';

// Import docx and file-saver
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
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 0 8px rgba(76, 175, 80, 0);
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

const glow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 5px rgba(76, 175, 80, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 15px rgba(76, 175, 80, 0.6));
  }
`;

// Styled Components
const MainContainer = styled(Box)(({ theme, isDarkMode }) => ({
  minHeight: 'calc(100vh - 64px)',
  background: isDarkMode
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    : 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 50%, #4CAF50 100%)',
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
      ? 'radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(156, 39, 176, 0.1) 0%, transparent 50%)'
      : 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
}));

const BackButton = styled(Button)(({ theme, isDarkMode }) => ({
  marginBottom: '24px',
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
    : '1px solid rgba(76, 175, 80, 0.2)',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.1)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.15)',
  },
}));

const HeaderCard = styled(Paper)(({ theme, isDarkMode }) => ({
  padding: '32px',
  marginBottom: '24px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(76, 175, 80, 0.2)',
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
    background: 'linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.1), transparent)',
    animation: `${shimmer} 3s ease-in-out infinite`,
  },
}));

const DetailCard = styled(Paper)(({ theme, isDarkMode }) => ({
  padding: '32px',
  marginBottom: '24px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(76, 175, 80, 0.2)',
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
    background: 'linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.1), transparent)',
    animation: `${shimmer} 3s ease-in-out infinite`,
  },
}));

const TitleSection = styled(Box)(({ theme }) => ({
  marginBottom: '32px',
  animation: `${slideInUp} 0.8s ease-out`,
}));

const MainTitle = styled(Typography)(({ theme, isDarkMode }) => ({
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 800,
  fontSize: '2.5rem',
  background: isDarkMode
    ? 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)'
    : 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '8px',
  letterSpacing: '0.5px',
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem',
  },
}));

const StatusChip = styled(Chip)(({ theme, isDarkMode }) => ({
  background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
  color: '#fff',
  fontWeight: 700,
  fontSize: '1rem',
  padding: '8px 16px',
  height: 'auto',
  borderRadius: '16px',
  boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  animation: `${pulse} 2s ease-in-out infinite`,
  '& .MuiChip-icon': {
    color: '#fff',
    marginLeft: '8px',
    animation: `${glow} 2s ease-in-out infinite`,
  },
}));

const ActionButton = styled(Button)(({ theme, isDarkMode }) => ({
  padding: '12px 24px',
  borderRadius: '12px',
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 700,
  fontSize: '1rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.15)',
  },
  '&:disabled': {
    opacity: 0.7,
  },
}));

const PrimaryActionButton = styled(ActionButton)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
  color: '#fff',
  boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
  '&:hover': {
    boxShadow: '0 12px 35px rgba(76, 175, 80, 0.4)',
  },
}));

const SecondaryActionButton = styled(ActionButton)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
  color: '#fff',
  boxShadow: '0 8px 25px rgba(255, 152, 0, 0.3)',
  '&:hover': {
    boxShadow: '0 12px 35px rgba(255, 152, 0, 0.4)',
  },
}));

const InfoGrid = styled(Grid)(({ theme }) => ({
  marginBottom: '32px',
  '& .MuiGrid-item': {
    animation: `${slideInUp} 0.8s ease-out`,
  },
}));

const InfoCard = styled(Box)(({ theme, isDarkMode }) => ({
  padding: '20px',
  borderRadius: '16px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
    : 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(76, 175, 80, 0.2)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
  },
}));

const SectionDivider = styled(Divider)(({ theme, isDarkMode }) => ({
  margin: '32px 0',
  borderStyle: 'dashed',
  borderColor: isDarkMode
    ? 'rgba(255, 255, 255, 0.2)'
    : 'rgba(76, 175, 80, 0.3)',
  borderWidth: '2px',
}));

const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: '32px',
  animation: `${slideInUp} 0.8s ease-out`,
}));

const SectionHeader = styled(Stack)(({ theme }) => ({
  marginBottom: '16px',
  alignItems: 'center',
  direction: 'row',
  spacing: 1,
}));

const SectionTitle = styled(Typography)(({ theme, isDarkMode }) => ({
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 700,
  fontSize: '1.5rem',
  color: isDarkMode ? '#fff' : '#4CAF50',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}));

const SectionContent = styled(Box)(({ theme }) => ({
  paddingLeft: '56px',
  '& p': {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    fontSize: '1rem',
    lineHeight: 1.7,
    marginBottom: '8px',
  },
}));

const QualitySection = styled(Box)(({ theme, isDarkMode }) => ({
  marginTop: '24px',
  paddingLeft: '16px',
  borderLeft: `4px solid ${isDarkMode ? '#66BB6A' : '#4CAF50'}`,
  marginLeft: '-20px',
  paddingTop: '8px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.02) 100%)',
  borderRadius: '0 12px 12px 0',
  padding: '16px',
}));

const QualityChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
  color: '#fff',
  fontWeight: 600,
  marginBottom: '12px',
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  '& .MuiChip-icon': {
    color: '#fff',
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px',
  animation: `${float} 2s ease-in-out infinite`,
}));

const FloatingBubble = styled(Box)(({ theme, size, top, left, delay, isDarkMode }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  background: isDarkMode
    ? `rgba(76, 175, 80, ${Math.random() * 0.1 + 0.05})`
    : `rgba(76, 175, 80, ${Math.random() * 0.08 + 0.02})`,
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
  str = str.normalize('NFD').replace(/[0-\u036f]/g, '');
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
  try {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return 'Invalid Date';
  }
};

const ApprovedLessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const { isDarkMode, theme } = useTheme();

  const [lessonDetail, setLessonDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

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

      // API endpoint for fetching approved lesson details
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
            new Paragraph({ text: `Ngày gửi: ${(lessonDetail.createdAt)}`, style: "SubtleReference" }),
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
            new Paragraph({ text: "a) Hoạt động Khởi động", heading: HeadingLevel.HEADING_2 }),
            ...formatContent(lessonDetail.startUp),
            new Paragraph({ text: "b) Hoạt động Hình thành Kiến thức", heading: HeadingLevel.HEADING_2 }),
            ...formatContent(lessonDetail.knowledge),
            new Paragraph({ text: "c) Hoạt động Luyện tập", heading: HeadingLevel.HEADING_2 }),
            ...formatContent(lessonDetail.practice),
            new Paragraph({ text: "d) Hoạt động Vận dụng", heading: HeadingLevel.HEADING_2 }),
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
                  color: '#4CAF50',
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

    return (
        <SectionContainer> 
           <SectionHeader>
             {icon} 
             <SectionTitle isDarkMode={isDarkMode}>
               {title}
             </SectionTitle>
           </SectionHeader>
          <Divider sx={{ mb: 2, borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.2)' }} /> 
          <SectionContent>
             {formatDisplayContent(mainContent)}
             {qualityContent && (
                <QualitySection isDarkMode={isDarkMode}>
                    <QualityChip 
                        icon={<CheckCircle fontSize="small"/>} 
                        label="Phẩm chất" 
                        size="small"
                    />
                     {formatDisplayContent(qualityContent)}
                </QualitySection>
             )}
          </SectionContent>
        </SectionContainer>
      );
  }

  const renderSkeletonDetails = () => (
    <LoadingContainer>
      <CircularProgress size={60} sx={{ color: '#4CAF50' }} />
    </LoadingContainer>
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
          <BackButton
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            isDarkMode={isDarkMode}
          >
            Quay lại danh sách
          </BackButton>
        </Fade>

        <Zoom in timeout={1000}>
          <HeaderCard elevation={0} isDarkMode={isDarkMode}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              justifyContent="space-between" 
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={3}
            >
              <Stack direction="row" alignItems="center" spacing={2} mb={{ xs: 2, sm: 0 }}> 
                <Verified sx={{ color: '#4CAF50', fontSize: '2.5rem' }} />
                <Box>
                  <MainTitle isDarkMode={isDarkMode}>
                    Chi Tiết Giáo án Đã Chấp Nhận
                  </MainTitle>
                  <StatusChip
                    icon={<CheckCircle />}
                    label="Đã chấp nhận"
                    isDarkMode={isDarkMode}
                  />
                </Box>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Tooltip title="Xuất ra file Word (.docx)">
                  <span>
                    <PrimaryActionButton 
                      startIcon={isExporting ? <CircularProgress size={20} color="inherit"/> : <Download />}
                      onClick={handleExportToWord}
                      disabled={!lessonDetail || isExporting}
                    >
                      {isExporting ? 'Đang xuất...' : 'Xuất ra Word'}
                    </PrimaryActionButton>
                  </span>
                </Tooltip>
                <Tooltip title="Đăng Giáo án">
                  <span>
                    <SecondaryActionButton 
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/Đăng-Giáo-án', { state: { lessonData: lessonDetail } })}
                    >
                      Đăng Giáo án
                    </SecondaryActionButton>
                  </span>
                </Tooltip>
              </Stack>
            </Stack>
          </HeaderCard>
        </Zoom>

        <Zoom in timeout={1200}>
          <DetailCard elevation={0} isDarkMode={isDarkMode}>
            {loading ? (
              renderSkeletonDetails()
            ) : error ? (
              <Alert severity="error" sx={{ my: 2, borderRadius: '12px', fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif' }}>
                {`Lỗi tải chi tiết: ${error}`}
              </Alert>
            ) : lessonDetail ? (
              <Box>
                <TitleSection>
                  <Stack 
                    direction={{ xs: 'column', md: 'row' }} 
                    alignItems={{ xs: 'flex-start', md: 'center' }} 
                    spacing={2} 
                    mb={3}
                  > 
                    <Box flexGrow={1}>
                      <MainTitle isDarkMode={isDarkMode}>
                        <Verified sx={{ fontSize: '2rem', verticalAlign: 'middle', mr: 1, color: '#4CAF50' }} />
                        {lessonDetail.lesson || 'Chi Tiết Giáo án Đã Chấp Nhận'}
                      </MainTitle>
                      <StatusChip
                        icon={<CheckCircle />}
                        label="Đã chấp nhận"
                        isDarkMode={isDarkMode}
                      />
                    </Box>
                  </Stack>
                  
                  <InfoGrid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <InfoCard isDarkMode={isDarkMode}>
                        <Typography variant="body2" sx={{ 
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                          fontWeight: 600,
                          mb: 1
                        }}>
                          Chủ đề:
                        </Typography>
                        <Typography variant="h6" sx={{ 
                          color: isDarkMode ? '#fff' : '#4CAF50',
                          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                          fontWeight: 700
                        }}>
                          {lessonDetail.module || 'N/A'}
                        </Typography>
                      </InfoCard>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <InfoCard isDarkMode={isDarkMode}>
                        <Typography variant="body2" sx={{ 
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                          fontWeight: 600,
                          mb: 1
                        }}>
                          Ngày gửi:
                        </Typography>
                        <Typography variant="h6" sx={{ 
                          color: isDarkMode ? '#fff' : '#4CAF50',
                          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                          fontWeight: 700
                        }}>
                          {formatDate(lessonDetail.createdAt)}
                        </Typography>
                      </InfoCard>
                    </Grid>
                  </InfoGrid>
                </TitleSection>
                
                <SectionDivider isDarkMode={isDarkMode} />

                {renderDetailSection("Mục tiêu", lessonDetail.goal, <Assignment sx={{ color: '#4CAF50', fontSize: '1.8rem' }} />)}
                {renderDetailSection("Giáo viên chuẩn bị", lessonDetail.schoolSupply, <Build sx={{ color: '#4CAF50', fontSize: '1.8rem' }} />)} 
                {renderDetailSection("Hoạt động Khởi động", lessonDetail.startUp, <Typography sx={{fontWeight: 'bold', color: '#4CAF50', fontSize: '1.8rem'}}>1.</Typography>)}
                {renderDetailSection("Hoạt động Hình thành Kiến thức", lessonDetail.knowledge, <Typography sx={{fontWeight: 'bold', color: '#4CAF50', fontSize: '1.8rem'}}>2.</Typography>)}
                {renderDetailSection("Hoạt động Luyện tập", lessonDetail.practice, <Typography sx={{fontWeight: 'bold', color: '#4CAF50', fontSize: '1.8rem'}}>3.</Typography>)}
                {renderDetailSection("Hoạt động Vận dụng", lessonDetail.apply, <Typography sx={{fontWeight: 'bold', color: '#4CAF50', fontSize: '1.8rem'}}>4.</Typography>)}
              </Box>
            ) : (
               <Alert severity="warning" sx={{ borderRadius: '12px', fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif' }}>
                 Không tìm thấy chi tiết giáo án.
               </Alert>
            )}
          </DetailCard>
        </Zoom>
      </StyledContainer>
    </MainContainer>
  );
};

export default ApprovedLessonDetail; 