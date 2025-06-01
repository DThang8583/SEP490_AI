import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { 
  Box, 
  Button, 
  Typography, 
  TextField,
  Paper,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Save,
  SaveAlt,
  Send,
  ContentCopy,
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

// Helper function to parse content (Improved version)
const parseContent = (generatedText) => {
  console.log('=== Starting Content Parsing ===');

  // Log raw input text line by line
  if (generatedText) {
    console.log('--- Raw Input Text ---');
    const lines = generatedText.split('\n');
    lines.forEach((line, index) => {
      console.log(`Line ${index + 1}: ${line}`);
    });
    console.log('----------------------');
  } else {
    console.log('Raw input text is empty or null.');
  }

  const sections = {
    goal: '',
    schoolSupply: '',
    startUp: '',
    knowledge: '',
    practice: '',
    apply: '',
  };

  // Normalize line breaks and remove potential leading/trailing spaces
  let text = generatedText.replace(/\r\n/g, '\n').trim();
  console.log('Normalized text:', text);

  // Helper to extract content based on a regex with a capturing group
  const extractContent = (regex, sectionName) => {
    const match = text.match(regex);
    const content = match && match[1] ? match[1].trim() : '';
    console.log(`${sectionName} extraction:`, {
      regex: regex.toString(),
      found: !!match,
      content: content || 'Not found'
    });
    return content;
  };

  // Updated regex patterns with more flexible matching
  const goalRegex = /(?:Phần\s*I|I\.)\s*Yêu cầu cần đạt:?\s*([\s\S]*?)(?=\s*\n+\s*(?:Phần\s*II|II\.)\s*Đồ dùng dạy học:?|$)/i;
  const supplyRegex = /(?:Phần\s*II|II\.)\s*Đồ dùng dạy học:?\s*([\s\S]*?)(?=\s*\n+\s*(?:Phần\s*III|III\.)\s*Các hoạt động dạy học chủ yếu:?|$)/i;
  const activitiesRegex = /(?:Phần\s*III|III\.)\s*Các hoạt động dạy học chủ yếu:?(?:\s*\([^)]+\))?\s*([\s\S]*?)(?=\s*\n+\s*(?:A\.|A\))\s*Hoạt động MỞ ĐẦU:?|$)/i;

  // Extract main sections
  sections.goal = extractContent(goalRegex, "Goal");
  sections.schoolSupply = extractContent(supplyRegex, "School Supply");

  // Extract combined activities content
  const activitiesContent = extractContent(activitiesRegex, "All Activities");
  console.log('Activities content extracted:', activitiesContent);

  // Now extract each activity from the combined activities content
  const startUpRegex = /(?:A\.|A\))\s*Hoạt động MỞ ĐẦU:?(?:\s*\([^)]+\))?\s*([\s\S]*?)(?=\s*\n+\s*(?:B\.|B\))\s*Hoạt động HÌNH THÀNH KIẾN THỨC:?|$)/i;
  const knowledgeRegex = /(?:B\.|B\))\s*Hoạt động HÌNH THÀNH KIẾN THỨC:?(?:\s*\([^)]+\))?\s*([\s\S]*?)(?=\s*\n+\s*(?:C\.|C\))\s*Hoạt động LUYỆN TẬP, THỰC HÀNH:?|$)/i;
  const practiceRegex = /(?:C\.|C\))\s*Hoạt động LUYỆN TẬP, THỰC HÀNH:?(?:\s*\([^)]+\))?\s*([\s\S]*?)(?=\s*\n+\s*(?:D\.|D\))\s*Hoạt động VẬN DỤNG, TRẢI NGHIỆM:?|$)/i;
  const applyRegex = /(?:D\.|D\))\s*Hoạt động VẬN DỤNG, TRẢI NGHIỆM:?(?:\s*\([^)]+\))?\s*([\s\S]*?)(?=\s*\n+Ghi chú:?|$)/i;

  // Apply regex to the extracted activities content
  sections.startUp = extractContent(startUpRegex, "Start Up");
  sections.knowledge = extractContent(knowledgeRegex, "Knowledge");
  sections.practice = extractContent(practiceRegex, "Practice");
  sections.apply = extractContent(applyRegex, "Apply");

  // Clean up: Remove any section headers that might have been included in the content
  const finalClean = (content) => {
    if (!content) return '';
    return content
      .replace(/^(?:[A-DĐ]\.|[A-DĐ]\))\s*Hoạt động.*?(?:\([^)]+\))?:?/gim, '')
      .replace(/^Mục tiêu:?/gim, '')
      .replace(/^HOẠT ĐỘNG CỦA GIÁO VIÊN:?/gim, '')
      .replace(/^HOẠT ĐỘNG CỦA HỌC SINH:?/gim, '')
      .replace(/^:\s*/gm, '') // Remove leading colon and spaces
      .replace(/^\s*[:\-\*]+\s*/gm, '') // Remove leading colons, dashes, asterisks and spaces
      .trim();
  };

  // Add detailed logging for practice and apply sections
  console.log('=== Practice Section Details ===');
  console.log('Raw Practice Content:', sections.practice);
  console.log('Cleaned Practice Content:', finalClean(sections.practice));

  console.log('=== Apply Section Details ===');
  console.log('Raw Apply Content:', sections.apply);
  console.log('Cleaned Apply Content:', finalClean(sections.apply));

  sections.startUp = finalClean(sections.startUp);
  sections.knowledge = finalClean(sections.knowledge);
  sections.practice = finalClean(sections.practice);
  sections.apply = finalClean(sections.apply);
  sections.goal = sections.goal.trim();
  sections.schoolSupply = sections.schoolSupply.trim();

  console.log('=== Final Parsed Sections ===');
  console.log('Goal:', sections.goal || 'Not found');
  console.log('School Supply:', sections.schoolSupply || 'Not found');
  console.log('Start Up:', sections.startUp || 'Not found');
  console.log('Knowledge:', sections.knowledge || 'Not found');
  console.log('Practice:', sections.practice || 'Not found');
  console.log('Apply:', sections.apply || 'Not found');

  // More detailed validation - check if the main required sections have content
  const missingSections = [];
  if (!sections.goal) missingSections.push("Yêu cầu cần đạt");
  if (!sections.schoolSupply) missingSections.push("Đồ dùng dạy học");
  if (!sections.startUp) missingSections.push("Hoạt động MỞ ĐẦU");
  if (!sections.knowledge) missingSections.push("Hoạt động HÌNH THÀNH KIẾN THỨC");
  if (!sections.practice) missingSections.push("Hoạt động LUYỆN TẬP, THỰC HÀNH");
  if (!sections.apply) missingSections.push("Hoạt động VẬN DỤNG, TRẢI NGHIỆM");

  if (missingSections.length > 0) {
    console.error('=== Missing Sections ===');
    console.error('Missing sections:', missingSections);
    console.error('Raw text:', text);
    throw new Error(`Không thể phân tích các phần sau: ${missingSections.join(", ")}. Vui lòng kiểm tra định dạng giáo án.`);
  }

  return sections;
};

const AIRender = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Add useEffect for initial render logging with parsed content
  useEffect(() => {
    // Parse the content into sections
    const parsedContent = parseContent(location.state?.content || '');
    
    console.log({
      goal: parsedContent.goal,
      schoolSupply: parsedContent.schoolSupply,
      startUp: parsedContent.startUp,
      knowLedge: parsedContent.knowledge,
      practice: parsedContent.practice,
      apply: parsedContent.apply
    });
    
    console.log('====================================');
  }, []); // Empty dependency array ensures this runs only once on mount

  const [content, setContent] = useState(location.state?.content || "");
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(location.state?.content || "");
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSending, setIsSending] = useState(false);
  const [userId, setUserId] = useState(null);
  const [lessonId, setLessonId] = useState(location.state?.lessonId || null);
  const [promptData, setPromptData] = useState(location.state?.promptData || null);
  const [originalContent, setOriginalContent] = useState(location.state?.content || "");

  console.log('Initial States:', {
    content: content ? 'Content exists' : 'No content',
    isEditing,
    draft: draft ? 'Draft exists' : 'No draft',
    snackbar,
    isSending,
    userId,
    lessonId,
    promptData
  });

  // Get userId from localStorage on component mount
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      try {
        const userInfo = JSON.parse(storedUserInfo);
        setUserId(userInfo.id);
      } catch (e) {
      }
    } else {
       setSnackbar({ open: true, message: 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.', severity: 'error' });
    }
  }, []);

  // Redirect if no content is passed
  useEffect(() => {
    console.log('Checking content for redirect');
    if (!location.state?.content) {
        navigate("/tao-giao-an");
    }
  }, [location.state?.content, navigate]);

  // Update lessonId and promptData states
  useEffect(() => {
    if (location.state?.lessonId) {
      setLessonId(location.state.lessonId);
    }
    if (location.state?.promptData) {
      setPromptData(location.state.promptData);
    }
  }, [location.state]);

  const handleSaveDraft = async () => {
    console.log('=== Starting handleSaveDraft ===');
    console.log('Current states:', {
      userId,
      lessonId,
      promptData,
      content: content ? 'Content exists' : 'No content'
    });

    if (!userId) {
      console.error('Missing userId');
      setSnackbar({ open: true, message: 'Không thể lưu: Thiếu thông tin người dùng.', severity: 'error' });
      return;
    }
    if (!lessonId) {
      console.error('Missing lessonId');
      setSnackbar({ open: true, message: 'Không thể lưu: Thiếu thông tin bài học.', severity: 'error' });
      return;
    }

    setIsSending(true);
    setSnackbar({ open: false, message: '', severity: 'info' });

    try {
      // Parse content into sections
      console.log('=== Parsing Content ===');
      const parsedData = parseContent(content);
      console.log('Parsed content sections:', parsedData);

      // Validate required sections
      if (!parsedData.goal || !parsedData.schoolSupply || !parsedData.startUp || 
          !parsedData.knowledge || !parsedData.practice || !parsedData.apply) {
        console.error('=== Validation Error ===');
        console.error('Missing required sections:', {
          goal: !parsedData.goal ? 'Missing' : 'OK',
          schoolSupply: !parsedData.schoolSupply ? 'Missing' : 'OK',
          startUp: !parsedData.startUp ? 'Missing' : 'OK',
          knowledge: !parsedData.knowledge ? 'Missing' : 'OK',
          practice: !parsedData.practice ? 'Missing' : 'OK',
          apply: !parsedData.apply ? 'Missing' : 'OK'
        });
        throw new Error("Không thể phân tích nội dung Giáo án. Vui lòng kiểm tra định dạng.");
      }

      // Check if this is the first save by looking for existing content
      const isFirstSave = !content || content.trim() === '';
      console.log('Is first save:', isFirstSave);

      // Prepare API body with parsed sections
      const apiBody = {
        startUp: parsedData.startUp.trim(),              // A. Hoạt động MỞ ĐẦU
        knowLedge: parsedData.knowledge.trim(),          // B. Hoạt động HÌNH THÀNH KIẾN THỨC
        schoolSupply: parsedData.schoolSupply.trim(),    // Phần II: Đồ dùng dạy học
        practice: parsedData.practice.trim(),            // C. Hoạt động LUYỆN TẬP, THỰC HÀNH
        apply: parsedData.apply.trim(),                  // D. Hoạt động VẬN DỤNG, TRẢI NGHIỆM
        duration: "35",                                  // Thời lượng cố định 35 phút
        userId: parseInt(userId, 10),                    // Chuyển đổi userId thành số
        lessonId: parseInt(lessonId, 10)                 // Chuyển đổi lessonId thành số
      };

      // Only include goal if it's not the first save
      if (!isFirstSave) {
        apiBody.goal = parsedData.goal.trim();           // Phần I: Yêu cầu cần đạt
      }

      console.log('=== API Request ===');
      console.log('Request URL:', 'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans');
      console.log('Request Body:', JSON.stringify(apiBody, null, 2));

      // Get token for authenticated request
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('=== Authentication Error ===');
        console.error('No access token found in localStorage');
        throw new Error("Yêu cầu xác thực thất bại. Vui lòng đăng nhập lại.");
      }

      console.log('=== Sending Request ===');
      const response = await axios.post(
        'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans',
        apiBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000
        }
      );

      console.log('=== API Response ===');
      console.log('Status:', response.status);
      console.log('Response Data:', response.data);

      if (response.data && (response.data.code === 0 || /success|created/i.test(response.data.message || ''))) {
        setSnackbar({
          open: true,
          message: response.data.message || 'Bản nháp đã được lưu thành công! 📝',
          severity: 'success'
        });
      } else {
        console.error('=== API Error Response ===');
        console.error('Unexpected API response:', response.data);
        throw new Error(response.data.message || "Lưu bản nháp thất bại (phản hồi không mong đợi).");
      }

    } catch (error) {
      console.error('=== Error Details ===');
      console.error('Error Type:', error.name);
      console.error('Error Message:', error.message);
      if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
      console.error('Full Error:', error);
      
      setSnackbar({
        open: true,
        message: `Lỗi khi lưu bản nháp: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setIsSending(false);
    }

    // Navigate to the draft lessons page after saving
    navigate('/giao-an-nhap');
  };

  const handleSendToManager = async () => {
    console.log('handleSendToManager called');
    console.log('Current states:', {
      userId,
      lessonId,
      promptData,
      content: content ? 'Content exists' : 'No content'
    });
    if (!userId) {
       setSnackbar({ open: true, message: 'Không thể gửi: Thiếu thông tin người dùng.', severity: 'error' });
       return;
    }
    if (!lessonId) {
       setSnackbar({ open: true, message: 'Không thể gửi: Thiếu thông tin bài học hoặc thời lượng.', severity: 'error' });
       return;
    }

    setIsSending(true);
    setSnackbar({ open: false, message: '', severity: 'info' });

    try {
      // Parse content into sections
      const parsedData = parseContent(content);
      console.log('Parsed content sections:', parsedData);

      // Validate required sections
      if (!parsedData.goal || !parsedData.schoolSupply || !parsedData.startUp || 
          !parsedData.knowledge || !parsedData.practice || !parsedData.apply) {
        throw new Error("Không thể phân tích nội dung Giáo án. Vui lòng kiểm tra định dạng.");
      }

      // Prepare API body with parsed sections
      const apiBody = {
        startUp: parsedData.startUp.trim(),              // A. Hoạt động MỞ ĐẦU
        knowLedge: parsedData.knowledge.trim(),          // B. Hoạt động HÌNH THÀNH KIẾN THỨC
        goal: parsedData.goal.trim(),                    // Phần I: Yêu cầu cần đạt
        schoolSupply: parsedData.schoolSupply.trim(),    // Phần II: Đồ dùng dạy học
        practice: parsedData.practice.trim(),            // C. Hoạt động LUYỆN TẬP, THỰC HÀNH
        apply: parsedData.apply.trim(),                  // D. Hoạt động VẬN DỤNG, TRẢI NGHIỆM
        duration: "35",                                  // Thời lượng cố định 35 phút
        userId: parseInt(userId, 10),                    // Chuyển đổi userId thành số
        lessonId: parseInt(lessonId, 10)                 // Chuyển đổi lessonId thành số
      };

      console.log("API Request Body:", JSON.stringify(apiBody, null, 2));

      // Get token for authenticated request
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error("Yêu cầu xác thực thất bại. Vui lòng đăng nhập lại.");
      }

      const response = await axios.post(
        'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans/pending',
        apiBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000
        }
      );

      console.log("Response:", response.data);
      if (response.data && (response.data.code === 0 || /success|created/i.test(response.data.message || ''))) {
          setSnackbar({
            open: true,
            message: response.data.message || 'Giáo án đã được gửi thành công! ✅',
            severity: 'success'
          });
      } else {
          throw new Error(response.data.message || "Gửi Giáo án thất bại (phản hồi không mong đợi).");
      }

    } catch (error) {
      console.error("Error sending lesson:", error);
      console.error("API Error details:", error);
      setSnackbar({
        open: true,
        message: `Lỗi khi gửi Giáo án: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setIsSending(false);
    }

    navigate('/giao-an-cho-duyet');
  };

  const handleCopyContent = () => {
    console.log('handleCopyContent called');
    navigator.clipboard.writeText(content);
    setSnackbar({
      open: true,
      message: 'Đã sao chép nội dung vào clipboard! 📋',
      severity: 'success'
    });
  };

  const handleCancelEdit = () => {
    setContent(originalContent);
    setIsEditing(false);
    setSnackbar({
      open: true,
      message: 'Đã hủy chỉnh sửa và khôi phục nội dung ban đầu',
      severity: 'info'
    });
  };

  console.log('Rendering AIRender component with states:', {
    isEditing,
    isSending,
    snackbar,
    content: content ? 'Content exists' : 'No content'
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: isDarkMode
          ? 'linear-gradient(135deg, rgb(18, 18, 18) 0%, rgb(30, 30, 30) 100%)'
          : 'linear-gradient(135deg, rgb(248, 249, 250) 0%, rgb(255, 255, 255) 100%)',
        py: 4,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', px: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/tao-giao-an")}
          sx={{
            mb: 3,
            color: isDarkMode ? '#ffffff' : '#2D3436',
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          Quay lại
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '24px',
            background: isDarkMode 
              ? 'rgba(30, 30, 30, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 700,
                color: isDarkMode ? '#ffffff' : '#2D3436',
                mb: 1,
              }}
            >
              Giáo án Được Tạo
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
              }}
            >
              Xem và chỉnh sửa nội dung Giáo án
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            {isEditing ? (
              <TextField
                multiline
                fullWidth
                rows={25}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                    },
                    minHeight: '600px',
                    padding: '16px',
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                    fontSize: '1.1rem',
                    lineHeight: '1.8',
                    padding: '8px',
                  },
                }}
              />
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: '12px',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  minHeight: '600px',
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    fontSize: '1.1rem',
                    lineHeight: '1.8',
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                  }}
                >
                  {content}
                </Typography>
              </Paper>
            )}
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 2,
            flexWrap: 'wrap'
          }}>
            <Tooltip title="Sao chép nội dung">
              <IconButton
                onClick={handleCopyContent}
                sx={{
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  color: isDarkMode ? '#ffffff' : '#2D3436',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
                  },
                }}
              >
                <ContentCopy />
              </IconButton>
            </Tooltip>

            {isEditing ? (
              <>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => setIsEditing(false)}
                sx={{
                  backgroundColor: '#4CAF50',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#388E3C',
                  },
                }}
              >
                Lưu
              </Button>
                <Button
                  variant="contained"
                  onClick={handleCancelEdit}
                  sx={{
                    backgroundColor: '#9E9E9E',
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#757575',
                    },
                  }}
                >
                  Hủy
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
                sx={{
                  backgroundColor: '#2196F3',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#1976D2',
                  },
                }}
              >
                Chỉnh sửa
              </Button>
            )}

            <Button
              variant="contained"
              startIcon={<SaveAlt />}
              onClick={handleSaveDraft}
              sx={{
                backgroundColor: '#FF9800',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#F57C00',
                },
              }}
            >
              Lưu bản nháp
            </Button>

            <Button
              variant="contained"
              startIcon={isSending ? <CircularProgress size={20} color="inherit" /> : <Send />}
              onClick={handleSendToManager}
              disabled={isSending || !userId} // Disable if sending or missing data
              sx={{
                backgroundColor: '#F44336',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#D32F2F',
                },
                 '&.Mui-disabled': {
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                 }
              }}
            >
              {isSending ? 'Đang gửi...' : 'Gửi cho Người quản lý chuyên môn'}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            // Custom icon colors based on severity
            // '& .MuiAlert-icon': {
            //   color: snackbar.severity === 'success' ? '#4CAF50' : (snackbar.severity === 'error' ? '#F44336' : (snackbar.severity === 'warning' ? '#FF9800' : '#2196F3')),
            // },
          }}
          variant="filled" // Use filled variant for better visibility
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AIRender;
