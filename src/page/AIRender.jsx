import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

const AIRender = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const initialContent = location.state?.content || "";
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(initialContent);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  if (!initialContent) {
    navigate("/CreateLesson");
    return null;
  }

  const handleSaveDraft = () => {
    setDraft(content);
    setSnackbar({
      open: true,
      message: 'Đã lưu bản nháp thành công! 📝',
      severity: 'success'
    });
  };

  const handleSendToManager = () => {
    setSnackbar({
      open: true,
      message: 'Bài giảng đã được gửi cho người quản lý chuyên môn! 📩',
      severity: 'success'
    });
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
              Bài Giảng Được Tạo
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
              }}
            >
              Xem và chỉnh sửa nội dung bài giảng
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
              startIcon={<Send />}
              onClick={handleSendToManager}
              sx={{
                backgroundColor: '#F44336',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#D32F2F',
                },
              }}
            >
              Gửi cho Người quản lý chuyên môn
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
            '& .MuiAlert-icon': {
              color: snackbar.severity === 'success' ? '#4CAF50' : '#F44336',
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AIRender;
