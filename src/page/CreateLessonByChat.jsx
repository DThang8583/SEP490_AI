import React, { useState, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import mammoth from 'mammoth';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Send,
  ArrowBack,
  AutoAwesome,
  Psychology,
  School,
  Lightbulb,
  AttachFile,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const API_KEY = "AIzaSyDSf6v2-ynUdw6IS7Ac_2cSOJN7-g12c7k";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const CreateLessonByChat = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setFileName(file.name);
    }
  };

  const readFileContent = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
            // Xử lý file Word
            const result = await mammoth.extractRawText({ arrayBuffer });
            resolve(result.value);
          } else if (file.name.endsWith('.pdf')) {
            // TODO: Xử lý file PDF
            reject(new Error('File PDF chưa được hỗ trợ'));
          } else {
            // Xử lý file text
            resolve(e.target.result);
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Lỗi đọc file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !uploadedFile) return;

    setIsLoading(true);
    setError('');

    // Add user message to chat
    setChatHistory(prev => [...prev, { 
      type: 'user', 
      content: message + (uploadedFile ? `\n[File đính kèm: ${fileName}]` : '')
    }]);
    setMessage('');
    setUploadedFile(null);
    setFileName('');

    try {
      let prompt = message;
      if (uploadedFile) {
        try {
          const fileContent = await readFileContent(uploadedFile);
          prompt = `${message}\n\nNội dung file ${fileName}:\n${fileContent}`;
          
          const result = await model.generateContent(prompt);
          let text = result.response.text();
          text = text.replace(/##/g, "").replace(/\**\*/g, "");
          
          const formattedText = text.split('\n').map((line, index) => {
            if (/^\d+\./.test(line)) {
              return (
                <React.Fragment key={index}>
                  <Typography
                    component="div"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                      color: isDarkMode ? '#ffffff' : '#2D3436',
                    }}
                  >
                    {line}
                  </Typography>
                </React.Fragment>
              );
            }
            else if (/^[A-Z]/.test(line)) {
              return (
                <React.Fragment key={index}>
                  <Typography
                    component="div"
                    sx={{
                      mt: 2,
                      mb: 1,
                      fontWeight: 600,
                      color: isDarkMode ? '#ffffff' : '#2D3436',
                    }}
                  >
                    {line}
                  </Typography>
                </React.Fragment>
              );
            }
            return (
              <React.Fragment key={index}>
                <Typography
                  component="div"
                  sx={{
                    mb: 1,
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                  }}
                >
                  {line}
                </Typography>
              </React.Fragment>
            );
          });
          
          setChatHistory(prev => [...prev, {
            type: 'ai',
            content: formattedText
          }]);
        } catch (err) {
          console.error("File Error:", err);
          setError('Có lỗi xảy ra khi đọc file. Vui lòng thử lại.');
        }
      } else {
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        text = text.replace(/##/g, "").replace(/\**\*/g, "");
        
        const formattedText = text.split('\n').map((line, index) => {
          if (/^\d+\./.test(line)) {
            return (
              <React.Fragment key={index}>
                <Typography
                  component="div"
                  sx={{
                    mb: 1,
                    fontWeight: 500,
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                  }}
                >
                  {line}
                </Typography>
              </React.Fragment>
            );
          }
          else if (/^[A-Z]/.test(line)) {
            return (
              <React.Fragment key={index}>
                <Typography
                  component="div"
                  sx={{
                    mt: 2,
                    mb: 1,
                    fontWeight: 600,
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                  }}
                >
                  {line}
                </Typography>
              </React.Fragment>
            );
          }
          return (
            <React.Fragment key={index}>
              <Typography
                component="div"
                sx={{
                  mb: 1,
                  color: isDarkMode ? '#ffffff' : '#2D3436',
                }}
              >
                {line}
              </Typography>
            </React.Fragment>
          );
        });
        
        setChatHistory(prev => [...prev, {
          type: 'ai',
          content: formattedText
        }]);
      }
    } catch (err) {
      console.error("API Error:", err);
      setError('Có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
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
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/ChoiceChatorClick')}
            sx={{
              color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
              mb: 2,
              '&:hover': {
                backgroundColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.02)',
              },
            }}
          >
            Quay lại
          </Button>
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
            Tạo bài giảng với AI
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
              maxWidth: '600px',
            }}
          >
            Mô tả yêu cầu của bạn và để AI giúp bạn tạo bài giảng phù hợp
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '600px',
                overflowY: 'auto',
                backgroundColor: isDarkMode
                  ? 'rgba(30, 30, 30, 0.8)'
                  : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: '24px',
              }}
            >
              {chatHistory.map((chat, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: chat.type === 'user' ? 'row-reverse' : 'row',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '80%',
                      backgroundColor: chat.type === 'user'
                        ? '#FF6B6B'
                        : isDarkMode
                          ? 'rgba(255, 255, 255, 0.1)'
                          : 'rgba(0, 0, 0, 0.05)',
                      p: 2,
                      borderRadius: '16px',
                      ml: chat.type === 'user' ? 2 : 0,
                      mr: chat.type === 'user' ? 0 : 2,
                    }}
                  >
                    {chat.type === 'user' ? (
                      <Typography
                        sx={{
                          color: '#ffffff',
                        }}
                      >
                        {chat.content}
                      </Typography>
                    ) : (
                      <Box sx={{ color: isDarkMode ? '#ffffff' : '#2D3436' }}>
                        {chat.content}
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}
              {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '600px',
                backgroundColor: isDarkMode
                  ? 'rgba(30, 30, 30, 0.8)'
                  : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: '24px',
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: isDarkMode ? '#ffffff' : '#2D3436',
                  mb: 3,
                }}
              >
                Gợi ý yêu cầu
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Chip
                  icon={<School />}
                  label="Toán lớp 1: Phép cộng trừ trong phạm vi 10"
                  onClick={() => setMessage('Tạo bài giảng về phép cộng trừ trong phạm vi 10 cho học sinh lớp 1')}
                  sx={{
                    backgroundColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                    '&:hover': {
                      backgroundColor: isDarkMode
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'rgba(0, 0, 0, 0.08)',
                    },
                  }}
                />
                <Chip
                  icon={<School />}
                  label="Toán lớp 2: Bảng nhân 2, 3, 4, 5"
                  onClick={() => setMessage('Tạo bài giảng về bảng nhân 2, 3, 4, 5 cho học sinh lớp 2')}
                  sx={{
                    backgroundColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                    '&:hover': {
                      backgroundColor: isDarkMode
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'rgba(0, 0, 0, 0.08)',
                    },
                  }}
                />
                <Chip
                  icon={<School />}
                  label="Toán lớp 3: Phép chia và dư"
                  onClick={() => setMessage('Tạo bài giảng về phép chia và dư cho học sinh lớp 3')}
                  sx={{
                    backgroundColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                    '&:hover': {
                      backgroundColor: isDarkMode
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'rgba(0, 0, 0, 0.08)',
                    },
                  }}
                />
                <Chip
                  icon={<School />}
                  label="Toán lớp 4: Phân số và phép tính"
                  onClick={() => setMessage('Tạo bài giảng về phân số và các phép tính với phân số cho học sinh lớp 4')}
                  sx={{
                    backgroundColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                    '&:hover': {
                      backgroundColor: isDarkMode
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'rgba(0, 0, 0, 0.08)',
                    },
                  }}
                />
                <Chip
                  icon={<School />}
                  label="Toán lớp 5: Số thập phân"
                  onClick={() => setMessage('Tạo bài giảng về số thập phân và các phép tính cho học sinh lớp 5')}
                  sx={{
                    backgroundColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                    '&:hover': {
                      backgroundColor: isDarkMode
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'rgba(0, 0, 0, 0.08)',
                    },
                  }}
                />
                <Chip
                  icon={<Lightbulb />}
                  label="Bài toán có lời giải từ lớp 1-5"
                  onClick={() => setMessage('Tạo các bài toán có lời giải phù hợp với từng khối lớp từ 1 đến 5')}
                  sx={{
                    backgroundColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                    '&:hover': {
                      backgroundColor: isDarkMode
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'rgba(0, 0, 0, 0.08)',
                    },
                  }}
                />
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                    mb: 2,
                  }}
                >
                  Hoặc nhập yêu cầu của bạn vào ô chat bên cạnh
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AutoAwesome sx={{ color: '#FF6B6B' }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                    }}
                  >
                    AI sẽ giúp bạn tạo bài giảng phù hợp
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 3,
            display: 'flex',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <TextField
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập yêu cầu của bạn..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.02)',
                '&:hover': {
                  backgroundColor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
                },
              },
              '& .MuiInputLabel-root': {
                color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
              },
              '& .MuiOutlinedInput-input': {
                color: isDarkMode ? '#ffffff' : '#2D3436',
              },
            }}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            accept=".txt,.doc,.docx,.pdf"
          />
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            sx={{
              backgroundColor: isDarkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.05)',
              color: isDarkMode ? '#ffffff' : '#2D3436',
              '&:hover': {
                backgroundColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.15)'
                  : 'rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            <AttachFile />
          </IconButton>
          {fileName && (
            <Chip
              label={fileName}
              onDelete={() => {
                setUploadedFile(null);
                setFileName('');
              }}
              sx={{
                backgroundColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.05)',
                color: isDarkMode ? '#ffffff' : '#2D3436',
                '& .MuiChip-deleteIcon': {
                  color: isDarkMode ? '#ffffff' : '#2D3436',
                  '&:hover': {
                    color: '#FF6B6B',
                  },
                },
              }}
            />
          )}
          <IconButton
            type="submit"
            disabled={isLoading || (!message.trim() && !uploadedFile)}
            sx={{
              backgroundColor: '#FF6B6B',
              color: '#ffffff',
              width: '48px',
              height: '48px',
              padding: '12px',
              '&:hover': {
                backgroundColor: '#FF5252',
              },
              '&.Mui-disabled': {
                backgroundColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.05)',
                color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
              },
            }}
          >
            <Send sx={{ fontSize: '24px' }} />
          </IconButton>
        </Box>
      </Container>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert
          onClose={() => setError('')}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateLessonByChat;
