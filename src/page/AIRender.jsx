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

  // Helper to extract duration from a title line like "(5 phút)"
  const extractDuration = (titleLine) => {
    const durationMatch = titleLine.match(/(([0-9\s]+? phút))/i); // Capture content inside parentheses like "5 phút"
    return durationMatch && durationMatch[1] ? durationMatch[1].trim() : '';
  };
  
  // Define regex patterns for main sections
  const goalRegex = /1\.\s*Mục tiêu:\s*([\s\S]*?)(?=\n\s*2\.\s*Giáo viên chuẩn bị:|$)/i;
  const supplyRegex = /2\.\s*Giáo viên chuẩn bị:\s*([\s\S]*?)(?=\n\s*3\.\s*Tiến trình Giáo án:|$)/i;

  // Regex patterns to find each activity block. Capture Group 1 = Title line, Capture Group 2 = Content after "Cách tiến hành:"
  const activity1BlockRegex = /3\.\s*Tiến trình Giáo án:[\s\S]*?(a\)\s*Hoạt động 1:[^\n]*?)[\s\S]*?Cách tiến hành:[\s\S]*?([\s\S]*?)(?=\s*b\)\s*Hoạt động 2:|$)/i; 
  const activity2BlockRegex = /(b\)\s*Hoạt động 2:[^\n]*?)[\s\S]*?Cách tiến hành:[\s\S]*?([\s\S]*?)(?=\s*c\)\s*Hoạt động 3:|$)/i;
  const activity3BlockRegex = /(c\)\s*Hoạt động 3:[^\n]*?)[\s\S]*?Cách tiến hành:[\s\S]*?([\s\S]*?)(?=\s*d\)\s*Hoạt động 4:|$)/i;
  const activity4BlockRegex = /(d\)\s*Hoạt động 4:[^\n]*?)[\s\S]*?Cách tiến hành:[\s\S]*?([\s\S]*?)(?=\s*(?:Lưu ý:|$|\n\n))/i;

  // For debugging
  console.log("Original text:", text);
  
  sections.goal = extractContent(goalRegex);
  sections.schoolSupply = extractContent(supplyRegex);
  
  // Parse activities and their durations
  const match1 = text.match(activity1BlockRegex);
  if (match1) {
    sections.startUp = match1[2] ? match1[2].trim() : ''; // match1[2] is the content after "Cách tiến hành:"
  }

  const match2 = text.match(activity2BlockRegex);
  if (match2) {
    sections.knowledge = match2[2] ? match2[2].trim() : ''; // match2[2] is the content
  }

  const match3 = text.match(activity3BlockRegex);
  if (match3) {
    sections.practice = match3[2] ? match3[2].trim() : ''; // match3[2] is the content
  }

  const match4 = text.match(activity4BlockRegex);
  if (match4) {
    sections.apply = match4[2] ? match4[2].trim() : ''; // match4[2] is the content
  }
  
  // Log the parsed sections for debugging
  console.log("Parsed sections:", sections);

  // Basic check if extraction failed significantly
  if (!sections.goal || !sections.schoolSupply || !sections.startUp || !sections.knowledge || !sections.practice || !sections.apply ) {
      console.warn("Parsing might have failed or is incomplete. Check AI output format against expected structure.", sections);
      // Fallback or error handling might be needed here
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
    setSnackbar({ open: false, message: '', severity: 'info' }); // Clear previous snackbar

    try {
      const parsedData = parseContent(content);

      // Basic validation if parsing failed
      if (!parsedData.goal && !parsedData.schoolSupply && !parsedData.startUp) {
           throw new Error("Không thể phân tích nội dung Giáo án. Vui lòng kiểm tra định dạng.");
      }

      const apiBody = {
        goal: parsedData.goal,
        schoolSupply: parsedData.schoolSupply,
        startUp: parsedData.startUp,
        knowledge: parsedData.knowledge,
        practice: parsedData.practice,
        apply: parsedData.apply,
        userId: parseInt(userId, 10), // Ensure userId is a number
        promptId: parseInt(promptId, 10), // Ensure promptId is a number
        duration: "35", // This is likely the total duration, not individual
      };

      console.log("Sending to API for draft:", JSON.stringify(apiBody, null, 2)); // More detailed log

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
    setSnackbar({ open: false, message: '', severity: 'info' }); // Clear previous snackbar

    try {
      const parsedData = parseContent(content);

      // Basic validation if parsing failed
      if (!parsedData.goal && !parsedData.schoolSupply && !parsedData.startUp) {
           throw new Error("Không thể phân tích nội dung Giáo án. Vui lòng kiểm tra định dạng.");
      }

      const apiBody = {
        goal: parsedData.goal,
        schoolSupply: parsedData.schoolSupply,
        startUp: parsedData.startUp,
        knowledge: parsedData.knowledge,
        practice: parsedData.practice,
        apply: parsedData.apply,
        userId: parseInt(userId, 10), // Ensure userId is a number
        promptId: parseInt(promptId, 10), // Ensure promptId is a number
        duration: "35", // This is likely the total duration, not individual
      };

      console.log("Sending to API for manager:", JSON.stringify(apiBody, null, 2)); // More detailed log

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
