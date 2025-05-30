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
  const sections = {
    goal: '',
    schoolSupply: '',
    startUp: '',
    knowledge: '',
    practice: '',
    apply: '',
  };

  // Normalize line breaks and remove potential leading/trailing spaces
  const text = generatedText.replace(/\r\n/g, '\n').trim();

  // Helper to extract content based on a regex with a capturing group
  const extractContent = (regex) => {
    const match = text.match(regex);
    return match && match[1] ? match[1].trim() : '';
  };

  // Define regex patterns for main sections
  const goalRegex = /I\.\s*Yêu cầu cần đạt:\s*([\s\S]*?)(?=\n\s*II\.\s*Đồ dùng dạy học:|$)/i;
  const supplyRegex = /II\.\s*Đồ dùng dạy học:\s*([\s\S]*?)(?=\n\s*III\.\s*Các hoạt động dạy học chủ yếu:|$)/i;

  // Regex patterns for activity sections
  const startUpRegex = /A\.\s*Hoạt động MỞ ĐẦU\s*\(([^)]+)\):\s*([\s\S]*?)(?=\n\s*B\.\s*Hoạt động HÌNH THÀNH KIẾN THỨC:|$)/i;
  const knowledgeRegex = /B\.\s*Hoạt động HÌNH THÀNH KIẾN THỨC\s*\(([^)]+)\):\s*([\s\S]*?)(?=\n\s*C\.\s*Hoạt động LUYỆN TẬP, THỰC HÀNH:|$)/i;
  const practiceRegex = /C\.\s*Hoạt động LUYỆN TẬP, THỰC HÀNH\s*\(([^)]+)\):\s*([\s\S]*?)(?=\n\s*D\.\s*Hoạt động VẬN DỤNG, TRẢI NGHIỆM:|$)/i;
  const applyRegex = /D\.\s*Hoạt động VẬN DỤNG, TRẢI NGHIỆM\s*\(([^)]+)\):\s*([\s\S]*?)(?=\n\s*(?:Ghi chú:|$))/i;

  // Extract main sections
  sections.goal = extractContent(goalRegex);
  sections.schoolSupply = extractContent(supplyRegex);

  // Extract activity sections with their content
  const startUpMatch = text.match(startUpRegex);
  if (startUpMatch) {
    sections.startUp = startUpMatch[2] ? startUpMatch[2].trim() : '';
  }

  const knowledgeMatch = text.match(knowledgeRegex);
  if (knowledgeMatch) {
    sections.knowledge = knowledgeMatch[2] ? knowledgeMatch[2].trim() : '';
  }

  const practiceMatch = text.match(practiceRegex);
  if (practiceMatch) {
    sections.practice = practiceMatch[2] ? practiceMatch[2].trim() : '';
  }

  const applyMatch = text.match(applyRegex);
  if (applyMatch) {
    sections.apply = applyMatch[2] ? applyMatch[2].trim() : '';
  }

  // Log the parsed sections for debugging
  console.log("Parsed sections:", sections);

  // Basic validation
  if (!sections.goal || !sections.schoolSupply || !sections.startUp || !sections.knowledge || !sections.practice || !sections.apply) {
    console.warn("Parsing might have failed or is incomplete. Check AI output format against expected structure.", sections);
  }

  return sections;
};

const AIRender = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  // Get promptId from location state
  const { content: initialContent, promptId } = location.state || {}; 
  console.log("promptId from location state:", promptId); // Log promptId here
  const [content, setContent] = useState(initialContent || "");
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(initialContent || "");
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSending, setIsSending] = useState(false); // Loading state for API call
  const [userId, setUserId] = useState(null); // State for userId

  // Get userId from localStorage on component mount
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      try {
        const userInfo = JSON.parse(storedUserInfo);
        setUserId(userInfo.id); // Extract id
        console.log("userId from localStorage:", userInfo.id); // Log userId here
      } catch (e) {
        console.error("Failed to parse userInfo from localStorage", e);
        // Handle error, maybe show a message or redirect
      }
    } else {
       console.error("User info not found in localStorage.");
       // Handle missing user info, maybe redirect to login
       setSnackbar({ open: true, message: 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.', severity: 'error' });
       // navigate('/login'); // Optional: redirect to login
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Redirect if no content is passed, potentially add check for promptId too
  useEffect(() => {
    if (!initialContent) {
        navigate("/CreateLesson");
    }
  }, [initialContent, navigate]); // Dependencies added

  if (!initialContent) {
    // Return null or a loading indicator while redirecting
    return null;
  }

  const handleSaveDraft = async () => {
    if (!userId) {
       setSnackbar({ open: true, message: 'Không thể lưu: Thiếu thông tin người dùng.', severity: 'error' });
       return;
    }
    if (!promptId) {
       setSnackbar({ open: true, message: 'Không thể lưu: Thiếu thông tin prompt.', severity: 'error' });
       return;
    }

    setIsSending(true);
    setSnackbar({ open: false, message: '', severity: 'info' });

    try {
      const parsedData = parseContent(content);

      // Basic validation if parsing failed
      if (!parsedData.goal && !parsedData.schoolSupply && !parsedData.startUp) {
           throw new Error("Không thể phân tích nội dung Giáo án. Vui lòng kiểm tra định dạng.");
      }

      const apiBody = {
        startUp: parsedData.startUp,
        knowLedge: parsedData.knowledge,
        goal: parsedData.goal,
        schoolSupply: parsedData.schoolSupply,
        practice: parsedData.practice,
        apply: parsedData.apply,
        userId: parseInt(userId, 10),
        duration:0,
        promptId: parseInt(promptId, 10)
      };

      console.log("Sending to API for draft:", JSON.stringify(apiBody, null, 2));

      // Get token for authenticated request
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error("Yêu cầu xác thực thất bại. Vui lòng đăng nhập lại.");
      }

      const response = await axios.post(
        'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans',
        apiBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000 // Increased timeout to 30 seconds
        }
      );
      console.log("Response for draft:", response.data); // Log the response for debugging
      if (response.data && (response.data.code === 0 || /success|created/i.test(response.data.message || ''))) {
          setSnackbar({
            open: true,
            message: response.data.message || 'Bản nháp đã được lưu thành công! 📝', // Use API message if available
            severity: 'success'
          });
      } else {
          throw new Error(response.data.message || "Lưu bản nháp thất bại (phản hồi không mong đợi). ");
      }

    } catch (error) {
      console.error("Error saving draft:", error);
      setSnackbar({
        open: true,
        message: `Lỗi khi lưu bản nháp: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setIsSending(false);
    }

    navigate(-1);
  };

  const handleSendToManager = async () => {
    if (!userId) {
       setSnackbar({ open: true, message: 'Không thể gửi: Thiếu thông tin người dùng.', severity: 'error' });
       return;
    }
    if (!promptId) {
       setSnackbar({ open: true, message: 'Không thể gửi: Thiếu thông tin prompt.', severity: 'error' });
       return;
    }

    setIsSending(true);
    setSnackbar({ open: false, message: '', severity: 'info' });

    try {
      const parsedData = parseContent(content);

      // Basic validation if parsing failed
      if (!parsedData.goal && !parsedData.schoolSupply && !parsedData.startUp) {
           throw new Error("Không thể phân tích nội dung Giáo án. Vui lòng kiểm tra định dạng.");
      }

      const apiBody = {
        startUp: parsedData.startUp,
        knowLedge: parsedData.knowledge,
        goal: parsedData.goal,
        schoolSupply: parsedData.schoolSupply,
        practice: parsedData.practice,
        apply: parsedData.apply,
        userId: parseInt(userId, 10),
        promptId: parseInt(promptId, 10)
      };

      console.log("Sending to API for manager:", JSON.stringify(apiBody, null, 2));

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
          timeout: 30000 // Increased timeout to 30 seconds
        }
      );
      console.log("Response:", response.data); // Log the response for debugging
      // Check if the request was successful (Axios usually throws for 4xx/5xx)
      // And check if the message indicates success, making the code check less strict
      if (response.data && (response.data.code === 0 || /success|created/i.test(response.data.message || ''))) {
          setSnackbar({
            open: true,
            message: response.data.message || 'Giáo án đã được gửi thành công! ✅', // Use API message if available
            severity: 'success'
          });
      } else {
          // If it reached here but didn't match success criteria
          throw new Error(response.data.message || "Gửi Giáo án thất bại (phản hồi không mong đợi).");
      }

    } catch (error) {
      console.error("Error sending lesson:", error);
      setSnackbar({
        open: true,
        message: `Lỗi khi gửi Giáo án: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setIsSending(false);
    }

    navigate(-1);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    setSnackbar({
      open: true,
      message: 'Đã sao chép nội dung vào clipboard! 📋',
      severity: 'success'
    });
  };

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
          onClick={() => navigate("/CreateLesson")}
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
                    whiteSpace: 'pre-line',
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
              disabled={isSending || !userId || !promptId} // Disable if sending or missing data
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
