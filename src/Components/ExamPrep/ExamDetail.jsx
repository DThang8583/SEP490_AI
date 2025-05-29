import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Paper,
  Chip,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Quiz as QuizIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';

const ExamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useCustomTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/quizzes/${id}`);
        console.log("API Quiz Detail response:", response.data);
        
        if (response.data && response.data.code === 0 && response.data.data) {
          setQuizData(response.data.data);
          console.log("Chi tiết bài kiểm tra:", response.data.data);
        } else {
          setError('Không thể tải thông tin bài kiểm tra');
        }
      } catch (err) {
        console.error('Lỗi khi tải thông tin bài kiểm tra:', err);
        setError('Lỗi khi tải thông tin bài kiểm tra');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuizDetail();
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        py: 4,
        minHeight: 'calc(100vh - 64px)',
        background: isDarkMode
          ? 'linear-gradient(135deg, rgb(18, 18, 18) 0%, rgb(30, 30, 30) 100%)'
          : 'linear-gradient(135deg, rgb(245, 247, 250) 0%, rgb(255, 255, 255) 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Quay lại danh sách
        </Button>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : !quizData ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            Không tìm thấy thông tin bài kiểm tra
          </Alert>
        ) : (
          <>
            <Card
              sx={{
                mb: 4,
                borderRadius: '16px',
                backgroundColor: isDarkMode ? 'rgba(40, 40, 40, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(0,0,0,0.05)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <QuizIcon color="primary" />
                  <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
                    {quizData.quizName}
                  </Typography>
                </Stack>
                
                <Divider sx={{ mb: 2 }} />
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" color="text.secondary">
                      ID: {quizData.quizId}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" color="text.secondary">
                      Số câu hỏi: {quizData.quizQuestions?.length || 0}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {quizData.quizQuestions && quizData.quizQuestions.length > 0 ? (
              <>
                {quizData.quizQuestions.map((question, index) => (
                  <Card
                    key={question.questionId}
                    sx={{
                      mb: 3,
                      borderRadius: '16px',
                      backgroundColor: isDarkMode ? 'rgba(40, 40, 40, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(12px)',
                      border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                      boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(0,0,0,0.05)',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Câu {index + 1}: {question.questionName}
                      </Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        {question.quizAnswers.map((answer) => (
                          <Box
                            key={answer.answerId}
                            sx={{
                              p: 2,
                              mb: 1,
                              borderRadius: 1,
                              backgroundColor: answer.isCorrect
                                ? 'rgba(76, 175, 80, 0.1)'
                                : 'transparent',
                              border: `1px solid ${answer.isCorrect ? 'rgba(76, 175, 80, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            {answer.isCorrect ? (
                              <CheckCircleIcon color="success" />
                            ) : (
                              <CancelIcon color="error" />
                            )}
                            <Typography variant="body1">
                              {answer.answer}
                            </Typography>
                            {answer.isCorrect && (
                              <Chip
                                label="Đáp án đúng"
                                color="success"
                                size="small"
                                sx={{ ml: 'auto' }}
                              />
                            )}
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <Alert severity="info" sx={{ mb: 3 }}>
                Không có câu hỏi nào trong bài kiểm tra này
              </Alert>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default ExamDetail; 